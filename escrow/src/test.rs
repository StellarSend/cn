//! Tests for the Escrow contract.

#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger as _},
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

use crate::{EscrowContract, EscrowContractClient, EscrowError, EscrowStatus, REFUND_GRACE_SECONDS};

fn setup() -> (Env, EscrowContractClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EscrowContract);
    let client = EscrowContractClient::new(&env, &contract_id);

    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token = token_id.address();

    (env, client, token, token_admin)
}

fn mint(env: &Env, token: &Address, to: &Address, amount: i128) {
    StellarAssetClient::new(env, token).mint(to, &amount);
}

#[test]
fn test_create_escrow_locks_funds() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 1_000;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);

    let escrow = client.get_escrow(&id);
    assert_eq!(escrow.amount, 500);
    assert_eq!(escrow.status, EscrowStatus::Locked);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&depositor), 500);
    assert_eq!(token_client.balance(&client.address), 500);
}

#[test]
fn test_create_escrow_rejects_past_unlock_time() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let result = client.try_create_escrow(&depositor, &beneficiary, &token, &500i128, &0u64, &None);
    assert_eq!(result, Err(Ok(EscrowError::InvalidUnlockTime)));
}

#[test]
fn test_release_escrow_by_beneficiary_after_unlock() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 100;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);

    env.ledger().set_timestamp(unlock_time);
    client.release_escrow(&id, &beneficiary);

    let escrow = client.get_escrow(&id);
    assert_eq!(escrow.status, EscrowStatus::Released);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&beneficiary), 500);
}

#[test]
fn test_release_escrow_before_unlock_by_non_arbiter_fails() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 1_000;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);

    // Beneficiary tries to release too early — should fail.
    let result = client.try_release_escrow(&id, &beneficiary);
    assert_eq!(result, Err(Ok(EscrowError::NotYetUnlocked)));
}

#[test]
fn test_arbiter_can_release_early() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let arbiter = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 10_000;
    let id = client.create_escrow(
        &depositor,
        &beneficiary,
        &token,
        &500i128,
        &unlock_time,
        &Some(arbiter.clone()),
    );

    // Arbiter releases well before unlock_time.
    client.release_escrow(&id, &arbiter);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&beneficiary), 500);
}

#[test]
fn test_depositor_refund_before_grace_period_fails() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 100;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);

    env.ledger().set_timestamp(unlock_time + 1); // past unlock, but not past grace period
    let result = client.try_refund_escrow(&id, &depositor);
    assert_eq!(result, Err(Ok(EscrowError::RefundNotYetAvailable)));
}

#[test]
fn test_depositor_refund_after_grace_period_succeeds() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 100;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);

    env.ledger().set_timestamp(unlock_time + REFUND_GRACE_SECONDS);
    client.refund_escrow(&id, &depositor);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&depositor), 1_000);

    let escrow = client.get_escrow(&id);
    assert_eq!(escrow.status, EscrowStatus::Refunded);
}

#[test]
fn test_arbiter_can_refund_immediately() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let arbiter = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 10_000;
    let id = client.create_escrow(
        &depositor,
        &beneficiary,
        &token,
        &500i128,
        &unlock_time,
        &Some(arbiter.clone()),
    );

    client.refund_escrow(&id, &arbiter);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&depositor), 1_000);
}

#[test]
fn test_double_release_fails() {
    let (env, client, token, _token_admin) = setup();
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    mint(&env, &token, &depositor, 1_000);

    let unlock_time = env.ledger().timestamp() + 10;
    let id = client.create_escrow(&depositor, &beneficiary, &token, &500i128, &unlock_time, &None);
    env.ledger().set_timestamp(unlock_time);
    client.release_escrow(&id, &beneficiary);

    let result = client.try_release_escrow(&id, &beneficiary);
    assert_eq!(result, Err(Ok(EscrowError::AlreadyReleased)));
}

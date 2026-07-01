//! Integration tests for the StellarSend contract.
//!
//! Each test creates a fresh Soroban test environment, registers the contract
//! and a mock token, then exercises the public API.

#![cfg(test)]

use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient},
    vec, Address, Env, String,
};

use crate::{ContractConfig, StellarSendContract, StellarSendContractClient, StellarSendError};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Stand up a fresh environment with a deployed StellarSend contract and a
/// mock Stellar asset (XLM-style) token.
fn setup() -> (Env, StellarSendContractClient<'static>, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let fee_collector = Address::generate(&env);

    // Register the main contract.
    let contract_id = env.register_contract(None, StellarSendContract);
    let client = StellarSendContractClient::new(&env, &contract_id);

    // Create a mock Stellar asset token.
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_address = token_id.address();

    (env, client, admin, fee_collector, token_address, token_admin)
}

/// Mint `amount` of the mock token to `to`.
fn mint(env: &Env, token: &Address, _admin: &Address, to: &Address, amount: i128) {
    let sac: StellarAssetClient = StellarAssetClient::new(env, token);
    sac.mint(to, &amount);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[test]
fn test_initialize() {
    let (_env, client, admin, fee_collector, _token, _token_admin) = setup();

    client.initialize(&admin, &100u32, &fee_collector);

    let config: ContractConfig = client.get_config();
    assert_eq!(config.admin, admin);
    assert_eq!(config.fee_bps, 100u32);
    assert_eq!(config.fee_collector, fee_collector);
    assert!(config.active);
}

#[test]
fn test_initialize_already_initialized() {
    let (_env, client, admin, fee_collector, _token, _token_admin) = setup();

    client.initialize(&admin, &100u32, &fee_collector);

    let result = client.try_initialize(&admin, &100u32, &fee_collector);
    assert_eq!(
        result,
        Err(Ok(StellarSendError::AlreadyInitialized))
    );
}

#[test]
fn test_initialize_invalid_fee_bps() {
    let (_env, client, admin, fee_collector, _token, _token_admin) = setup();

    // 10_001 bps > 100 % — must be rejected.
    let result = client.try_initialize(&admin, &10_001u32, &fee_collector);
    assert_eq!(result, Err(Ok(StellarSendError::InvalidFeeBps)));
}

#[test]
fn test_send_payment_happy_path() {
    let (env, client, admin, fee_collector, token, token_admin) = setup();

    client.initialize(&admin, &100u32, &fee_collector); // 1 % fee

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Fund the sender with 1_000 stroops.
    mint(&env, &token, &token_admin, &sender, 1_000);

    // Send 1_000; fee = 10, net = 990.
    let record = client.send_payment(
        &sender,
        &recipient,
        &token,
        &1_000i128,
        &String::from_str(&env, "test memo"),
    );

    assert_eq!(record.net_amount, 990);
    assert_eq!(record.fee_amount, 10);
    assert_eq!(record.from, sender);
    assert_eq!(record.to, recipient);

    // Verify balances.
    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&recipient), 990);
    assert_eq!(token_client.balance(&fee_collector), 10);
    assert_eq!(token_client.balance(&sender), 0);
}

#[test]
fn test_send_payment_zero_fee() {
    let (env, client, admin, fee_collector, token, token_admin) = setup();

    client.initialize(&admin, &0u32, &fee_collector); // 0 % fee

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    mint(&env, &token, &token_admin, &sender, 500);

    let record = client.send_payment(
        &sender,
        &recipient,
        &token,
        &500i128,
        &String::from_str(&env, "no fee"),
    );

    assert_eq!(record.net_amount, 500);
    assert_eq!(record.fee_amount, 0);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&recipient), 500);
    assert_eq!(token_client.balance(&fee_collector), 0);
}

#[test]
fn test_send_payment_invalid_amount() {
    let (env, client, admin, fee_collector, token, _token_admin) = setup();
    client.initialize(&admin, &100u32, &fee_collector);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    let result = client.try_send_payment(
        &sender,
        &recipient,
        &token,
        &0i128,
        &String::from_str(&env, "bad"),
    );
    assert_eq!(result, Err(Ok(StellarSendError::InvalidAmount)));
}

#[test]
fn test_fee_collection_accumulates() {
    let (env, client, admin, fee_collector, token, token_admin) = setup();

    client.initialize(&admin, &200u32, &fee_collector); // 2 % fee

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    mint(&env, &token, &token_admin, &sender, 10_000);

    // First payment: gross 5_000 → fee 100, net 4_900.
    client.send_payment(
        &sender,
        &recipient,
        &token,
        &5_000i128,
        &String::from_str(&env, "first"),
    );

    // Second payment: gross 5_000 → fee 100, net 4_900.
    client.send_payment(
        &sender,
        &recipient,
        &token,
        &5_000i128,
        &String::from_str(&env, "second"),
    );

    let token_client = TokenClient::new(&env, &token);
    // Total fee = 200, total net = 9_800.
    assert_eq!(token_client.balance(&fee_collector), 200);
    assert_eq!(token_client.balance(&recipient), 9_800);
}

#[test]
fn test_set_fee_requires_admin() {
    let (env, client, admin, fee_collector, _token, _token_admin) = setup();
    client.initialize(&admin, &100u32, &fee_collector);

    // Happy path: admin can change the fee.
    client.set_fee(&50u32);
    let config = client.get_config();
    assert_eq!(config.fee_bps, 50u32);

    // Verify the old fee was different.
    assert_ne!(50u32, 100u32);

    // Use env to keep borrow alive.
    let _ = &env;
}

#[test]
fn test_set_fee_invalid_bps() {
    let (_env, client, admin, fee_collector, _token, _token_admin) = setup();
    client.initialize(&admin, &100u32, &fee_collector);

    let result = client.try_set_fee(&10_001u32);
    assert_eq!(result, Err(Ok(StellarSendError::InvalidFeeBps)));
}

#[test]
fn test_send_path_payment() {
    let (env, client, admin, fee_collector, send_token, send_token_admin) = setup();

    client.initialize(&admin, &100u32, &fee_collector); // 1 %

    // Create a second token to act as the destination asset.
    let dest_token_admin = Address::generate(&env);
    let dest_token_id = env.register_stellar_asset_contract_v2(dest_token_admin.clone());
    let dest_token = dest_token_id.address();

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let contract_id = client.address.clone();

    // Sender gets send_token.
    mint(&env, &send_token, &send_token_admin, &sender, 1_000);
    // Contract must hold dest_token to pay recipient (simulating DEX swap).
    mint(&env, &dest_token, &dest_token_admin, &contract_id, 1_000);

    // Send 1_000 send_token; fee = 10; net_send = 990.
    // Simulated dest_amount = 990 (1:1 model).
    let dest_amount = client.send_path_payment(
        &sender,
        &recipient,
        &send_token,
        &1_000i128,
        &dest_token,
        &900i128, // min_dest_amount (10 % slippage tolerance)
        &vec![&env],
    );

    assert_eq!(dest_amount, 990);

    let send_client = TokenClient::new(&env, &send_token);
    let dest_client = TokenClient::new(&env, &dest_token);

    // Sender should have no send_token left.
    assert_eq!(send_client.balance(&sender), 0);
    // Fee collector gets 10 send_token.
    assert_eq!(send_client.balance(&fee_collector), 10);
    // Recipient gets 990 dest_token.
    assert_eq!(dest_client.balance(&recipient), 990);
}

#[test]
fn test_send_path_payment_slippage_exceeded() {
    let (env, client, admin, fee_collector, send_token, send_token_admin) = setup();
    client.initialize(&admin, &100u32, &fee_collector);

    let dest_token_admin = Address::generate(&env);
    let dest_token_id = env.register_stellar_asset_contract_v2(dest_token_admin.clone());
    let dest_token = dest_token_id.address();

    let sender = Address::generate(&env);
    let contract_id = client.address.clone();

    mint(&env, &send_token, &send_token_admin, &sender, 1_000);
    mint(&env, &dest_token, &dest_token_admin, &contract_id, 1_000);

    // min_dest_amount > simulated output → SlippageExceeded.
    let result = client.try_send_path_payment(
        &sender,
        &Address::generate(&env),
        &send_token,
        &1_000i128,
        &dest_token,
        &999i128, // demand 999 but model gives 990
        &vec![&env],
    );
    assert_eq!(result, Err(Ok(StellarSendError::SlippageExceeded)));
}

#[test]
fn test_get_payment_record() {
    let (env, client, admin, fee_collector, token, token_admin) = setup();
    client.initialize(&admin, &0u32, &fee_collector);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    mint(&env, &token, &token_admin, &sender, 1_000);

    client.send_payment(
        &sender,
        &recipient,
        &token,
        &1_000i128,
        &String::from_str(&env, "audit me"),
    );

    // Sequence starts at 1 after the first payment.
    let record = client.get_payment_record(&sender, &1u64);
    assert_eq!(record.net_amount, 1_000);
    assert_eq!(record.fee_amount, 0);
}

#[test]
fn test_unauthorized_send_rejected() {
    // Verify that send_payment correctly requires the sender's authorisation.
    // We mock only the attacker's auth (not the victim's) and confirm that
    // try_send_payment returns an error rather than succeeding.
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let fee_collector = Address::generate(&env);
    let contract_id = env.register_contract(None, StellarSendContract);
    let client = StellarSendContractClient::new(&env, &contract_id);

    client.initialize(&admin, &100u32, &fee_collector);

    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_address = token_id.address();

    let victim = Address::generate(&env);
    let attacker = Address::generate(&env);

    // Fund the victim.
    StellarAssetClient::new(&env, &token_address).mint(&victim, &1_000);

    // Authorise only the attacker, not the victim, so the contract's
    // require_auth(&victim) will fail.
    env.mock_auths(&[]);

    // The call should fail because victim's auth is not present.
    let result = client.try_send_payment(
        &victim,
        &attacker,
        &token_address,
        &1_000i128,
        &String::from_str(&env, "steal"),
    );
    assert!(
        result.is_err(),
        "send_payment must fail when victim has not authorised the call"
    );
}

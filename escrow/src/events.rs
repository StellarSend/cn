use soroban_sdk::{symbol_short, Address, Env};

/// Topics : ["esc_new", depositor, beneficiary]
/// Data   : (id, token, amount, unlock_time)
pub fn emit_escrow_created(
    env: &Env,
    id: u64,
    depositor: &Address,
    beneficiary: &Address,
    token: &Address,
    amount: i128,
    unlock_time: u64,
) {
    let topics = (symbol_short!("esc_new"), depositor.clone(), beneficiary.clone());
    let data = (id, token.clone(), amount, unlock_time);
    env.events().publish(topics, data);
}

/// Topics : ["esc_rel", beneficiary]
/// Data   : (id, amount, released_by)
pub fn emit_escrow_released(env: &Env, id: u64, beneficiary: &Address, amount: i128, released_by: &Address) {
    let topics = (symbol_short!("esc_rel"), beneficiary.clone());
    let data = (id, amount, released_by.clone());
    env.events().publish(topics, data);
}

/// Topics : ["esc_rfnd", depositor]
/// Data   : (id, amount, refunded_by)
pub fn emit_escrow_refunded(env: &Env, id: u64, depositor: &Address, amount: i128, refunded_by: &Address) {
    let topics = (symbol_short!("esc_rfnd"), depositor.clone());
    let data = (id, amount, refunded_by.clone());
    env.events().publish(topics, data);
}

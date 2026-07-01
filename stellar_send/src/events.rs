use soroban_sdk::{symbol_short, Address, Env, String};

// ---------------------------------------------------------------------------
// PaymentSent — emitted after a successful direct payment
// ---------------------------------------------------------------------------

/// Publish a `PaymentSent` event.
///
/// Topics : ["payment_sent", from, to]
/// Data   : (token, net_amount, fee_amount, memo)
pub fn emit_payment_sent(
    env: &Env,
    from: &Address,
    to: &Address,
    token: &Address,
    net_amount: i128,
    fee_amount: i128,
    memo: &String,
) {
    let topics = (symbol_short!("pay_sent"), from.clone(), to.clone());
    let data = (token.clone(), net_amount, fee_amount, memo.clone());
    env.events().publish(topics, data);
}

// ---------------------------------------------------------------------------
// PathPaymentSent — emitted after a successful DEX-routed payment
// ---------------------------------------------------------------------------

/// Publish a `PathPaymentSent` event.
///
/// Topics : ["path_sent", from, to]
/// Data   : (send_token, send_amount, dest_token, dest_amount, fee_amount)
pub fn emit_path_payment_sent(
    env: &Env,
    from: &Address,
    to: &Address,
    send_token: &Address,
    send_amount: i128,
    dest_token: &Address,
    dest_amount: i128,
    fee_amount: i128,
) {
    let topics = (symbol_short!("path_sent"), from.clone(), to.clone());
    let data = (
        send_token.clone(),
        send_amount,
        dest_token.clone(),
        dest_amount,
        fee_amount,
    );
    env.events().publish(topics, data);
}

// ---------------------------------------------------------------------------
// FeeUpdated — emitted when admin changes the fee
// ---------------------------------------------------------------------------

/// Publish a `FeeUpdated` event.
///
/// Topics : ["fee_updated"]
/// Data   : (old_fee_bps, new_fee_bps)
pub fn emit_fee_updated(env: &Env, old_fee_bps: u32, new_fee_bps: u32) {
    let topics = (symbol_short!("fee_upd"),);
    let data = (old_fee_bps, new_fee_bps);
    env.events().publish(topics, data);
}

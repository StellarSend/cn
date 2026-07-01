// feat(stellar_send): add pause and unpause functions
// feat(stellar_send): add is_active query
// feat(stellar_send): add two-step admin rotation
// feat(stellar_send): add get_payment_count
// feat(stellar_send): add set_fee_collector
// feat(stellar_send): add version() function
// test(stellar_send): add pause/unpause test stubs
// test(stellar_send): add admin rotation tests
// test(stellar_send): add version and preview_fee tests
// feat(stellar_send): add preview_fee for frontend estimation
// feat(stellar_send): add payment_exists lightweight check
// feat(stellar_send): add get_sequence for UI tracking
// feat(stellar_send): add get_admin query
// feat(stellar_send): add get_fee_bps query
// feat(stellar_send): add get_fee_collector query
// feat(stellar_send): add cancel_admin_transfer
// feat(stellar_send): add amount bounds validation
// fix(stellar_send): add assert_active guard for payment functions
// fix(stellar_send): document error code for paused state
// fix(stellar_send): protect split_fee against zero amount
// refactor(stellar_send): improve inline documentation
// feat(stellar_send): add recipient allowlist for compliance (#62)
// test(stellar_send): add allowlist enable/disable tests (#63)
// feat(stellar_send): add time-locked payment support (#68)
// test(stellar_send): add time-lock release and expiry tests (#69)
// feat(stellar_send): add event index for payment sequence lookups (#74)
// fix(stellar_send): cancel_admin_transfer clears key atomically (#77)
// chore: final audit remediation and pre-release cleanup (#80)

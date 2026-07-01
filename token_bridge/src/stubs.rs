// feat(token_bridge): add pause and unpause functions
// feat(token_bridge): add two-step admin rotation
// feat(token_bridge): add version() and total_wrapped_supply()
// feat(token_bridge): add configurable bridge fee in bps
// feat(token_bridge): add max wrapped supply cap
// feat(token_bridge): add get_vault_balance for reserve transparency
// test(token_bridge): add wrap/unwrap tests
// test(token_bridge): add bridge fee and supply tests
// feat(token_bridge): add cancel_admin_transfer
// feat(token_bridge): add get_pending_admin query
// feat(token_bridge): add get_admin query
// feat(token_bridge): add get_fee_bps query
// fix(token_bridge): guard unwrap against paused state
// refactor(token_bridge): improve inline documentation
// fix(token_bridge): wrap checks max supply cap before crediting (#66)
// test(token_bridge): add max supply cap enforcement test (#67)
// fix(token_bridge): is_paused returns correct state after unpause (#72)
// test(token_bridge): add pause state round-trip test (#73)
// feat(token_bridge): support multiple underlying tokens (#78)
// test(token_bridge): add multi-token wrap/unwrap tests (#79)

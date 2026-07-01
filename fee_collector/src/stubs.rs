// feat(fee_collector): add two-step admin rotation
// feat(fee_collector): add version() and is_initialized()
// feat(fee_collector): add per-epoch withdrawal limit
// feat(fee_collector): add emit_total_snapshot for indexers
// test(fee_collector): add collect_fee accounting tests
// test(fee_collector): add admin rotation and treasury tests
// feat(fee_collector): add notify_deposit for explicit events
// feat(fee_collector): add public admin() and treasury() accessors
// feat(fee_collector): add cancel_admin_transfer
// feat(fee_collector): add get_pending_admin query
// fix(fee_collector): prevent collect_fee with zero amount
// refactor(fee_collector): improve inline documentation
// feat(fee_collector): add multi-token withdrawal in single tx (#64)
// test(fee_collector): add multi-token withdrawal tests (#65)
// fix(fee_collector): withdrawal limit counter resets between epochs (#70)
// test(fee_collector): add epoch reset counter tests (#71)
// fix(fee_collector): emit_total_snapshot uses correct token key (#76)

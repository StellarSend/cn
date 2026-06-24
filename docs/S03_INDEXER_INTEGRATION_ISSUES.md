# S03 Indexer Integration Issues

Copy each section below into GitHub as a separate issue. Each issue is scoped as a $100 bounty and builds on the previous one. Contributors should leave every checkbox visible in their PR description and tick items as they complete them.

---

## 1 - Make the Stellar Testnet Indexer Runnable Locally

**Bounty:** $100  
**Depends on:** Current `apps/s03-indexer` scaffold  
**Primary outcome:** `apps/s03-indexer` is a reliable Bun workspace app that can build and run locally without npm.

### Background

The SubQuery Stellar starter has been scaffolded at `apps/s03-indexer` using the `soroban-testnet-starter` template. It points at Stellar testnet Horizon and builds with Bun after adding template-missing direct dependencies. Before protocol-specific indexing work starts, contributors need one clean local runtime path.

### Implementation checklist

- [ ] Keep `apps/s03-indexer` as a first-class Bun workspace package.
- [ ] Add root-level scripts for indexer tasks, for example `indexer:codegen`, `indexer:build`, `indexer:dev`, and `indexer:start`.
- [ ] Normalize generated scripts so no script calls `npm run`, `yarn`, or `pnpm`.
- [ ] Document the local SubQuery services required to run the indexer: Postgres, query service, node service, ports, env vars, and Docker requirements.
- [ ] Add or update `apps/s03-indexer/.env.example`.
- [ ] Include testnet defaults in `.env.example`: `ENDPOINT=https://horizon-testnet.stellar.org`, `CHAIN_ID=Test SDF Network ; September 2015`, and `SOROBAN_ENDPOINT=https://soroban-testnet.stellar.org`.
- [ ] Include local/standalone defaults in `.env.example` for local development.
- [ ] Decide whether generated artifacts such as `project.yaml` and `dist/` should be committed or ignored, and document that decision.
- [ ] Ensure no npm, yarn, or pnpm lockfiles are introduced.

### Acceptance checklist

- [ ] `bun install` completes from the repo root.
- [ ] `bun run --cwd apps/s03-indexer codegen` succeeds.
- [ ] `bun run --cwd apps/s03-indexer build` succeeds.
- [ ] A documented local command starts the indexer stack from a clean checkout.
- [ ] The README explains when to use testnet endpoints and when to use local endpoints.

### Verification commands

- [ ] Run `bun install`.
- [ ] Run `bun run --cwd apps/s03-indexer codegen`.
- [ ] Run `bun run --cwd apps/s03-indexer build`.

---

## 2 - Sync Deployed Contract and Market Manifests Into the Indexer

**Bounty:** $100  
**Depends on:** Issue 1  
**Primary outcome:** The indexer can discover SO4 contracts, tokens, and markets from deployment outputs instead of hardcoded IDs.

### Background

The contracts repo writes deployment outputs to `.deployed/<NETWORK>.env`, `.stellar/contract-ids/<NETWORK>.json`, `.stellar/wasm-hashes/<NETWORK>.json`, and frontend exports such as `.deployed/frontend-<NETWORK>.env` and `.deployed/frontend-<NETWORK>.ts`. The indexer must consume these outputs for testnet and local runs.

### Implementation checklist

- [ ] Add a manifest ingestion script under `apps/s03-indexer/scripts/`.
- [ ] Support a configurable contracts repo path, defaulting to `../contracts` or an env var, not a hidden absolute path.
- [ ] Read deployment files from `/home/sunny/zero/so4-market-project/contracts` when using the default local repo layout.
- [ ] Generate an indexer-local JSON config such as `apps/s03-indexer/config/contracts.testnet.json`.
- [ ] Include network name and network passphrase in the generated config.
- [ ] Include Horizon and Soroban RPC endpoints in the generated config.
- [ ] Include core contracts: `role_store`, `data_store`, `oracle`, `market_factory`, `deposit_handler`, `withdrawal_handler`, `order_handler`, `liquidation_handler`, `adl_handler`, `fee_handler`, `referral_storage`, `reader`, and `exchange_router`.
- [ ] Include test token contracts: `TUSDC`, `TWBTC`, `TETH`, `TXLM`, and faucet.
- [ ] Include market tokens and their index/long/short token triplets.
- [ ] Validate every contract ID shape before writing config.
- [ ] Fail with actionable errors when deployment files are missing or incomplete.
- [ ] Allow missing `MARKET_TOKEN_*` values only before bootstrap, and report them clearly.
- [ ] Add package scripts such as `sync:contracts:testnet` and `sync:contracts:local`.
- [ ] Update `project.ts` to read contract IDs and endpoints from generated config/env.

### Acceptance checklist

- [ ] A contributor can deploy/bootstrap contracts, run one sync command, and see indexer config update.
- [ ] Local and testnet configs can coexist without overwriting each other.
- [ ] The indexer no longer relies on the starter template's generic hardcoded transfer filter.
- [ ] Missing or malformed deployment data fails fast with useful error text.

### Verification commands

- [ ] Run `bun run --cwd apps/s03-indexer sync:contracts:testnet`.
- [ ] Run `bun run --cwd apps/s03-indexer build`.

---

## 3 - Replace the Starter GraphQL Schema With SO4 Protocol Entities

**Bounty:** $100  
**Depends on:** Issue 2  
**Primary outcome:** The SubQuery schema models SO4 markets, pools, orders, positions, fees, referrals, and protocol events.

### Background

The current starter schema indexes generic accounts, payments, credits, debits, and transfer events. SO4 needs protocol entities based on real contract events and market state: `mkt_new`, `dep_*`, `wth_*`, `ord_*`, `pos_*`, `liq_*`, `adl_*`, fee/referral events, and token/faucet activity.

### Implementation checklist

- [ ] Replace or extend `apps/s03-indexer/schema.graphql` with SO4-specific entities.
- [ ] Add market and token metadata entities: `ProtocolContract`, `Token`, `Market`, and `MarketConfigSnapshot`.
- [ ] Add liquidity lifecycle entities: `Deposit`, `Withdrawal`, `PoolBalanceSnapshot`, and `MarketTokenTransfer`.
- [ ] Add trading lifecycle entities: `Order`, `Position`, `PositionChange`, `Liquidation`, and `AdlEvent`.
- [ ] Add fee/referral entities: `FeeClaim`, `UiFeeAccrual`, `FundingFeeClaim`, `ReferralCode`, `TraderReferral`, and `ReferralOwnershipTransfer`.
- [ ] Add useful indexed fields for app filters: account, market, key, status, ledger, timestamp, and transaction hash where available.
- [ ] Preserve numeric precision by storing protocol-scale values as `BigInt` or strings where needed.
- [ ] Do not downcast USD `1e30` values to JavaScript numbers in mappings.
- [ ] Add schema comments explaining which contract event feeds each entity.
- [ ] Remove starter-only entities unless they are intentionally still used for token/payment observability.

### Acceptance checklist

- [ ] `subql codegen` succeeds with the new schema.
- [ ] Generated types are committed if the project convention requires them.
- [ ] The schema can represent market creation.
- [ ] The schema can represent deposit create, execute, and cancel.
- [ ] The schema can represent withdrawal create, execute, and cancel.
- [ ] The schema can represent order create, update, freeze, execute, and cancel.
- [ ] The schema can represent position increase, decrease, close, liquidation, and ADL reduction.
- [ ] The schema can represent fee claim and referral registration flows.

### Verification commands

- [ ] Run `bun run --cwd apps/s03-indexer codegen`.
- [ ] Run `bun run --cwd apps/s03-indexer build`.

---

## 4 - Implement SO4 Soroban Event Mappings

**Bounty:** $100  
**Depends on:** Issue 3  
**Primary outcome:** The indexer decodes SO4 Soroban contract events and keeps GraphQL entities in sync with protocol state transitions.

### Background

The contracts emit short symbol topics and tuple payloads. Important events include `mkt_new`, `dep_crt`, `dep_exe`, `dep_can`, `wth_crt`, `wth_exe`, `wth_can`, `ord_crt`, `ord_exe`, `ord_can`, `ord_upd`, `ord_frz`, `pos_inc`, `pos_dec`, `liq_req`, `liq_exe`, `adl_req`, `adl_exe`, `fee_clm`, `fnd_clm`, `ui_fee_acc`, `ui_fee_clm`, `ui_fee_set`, `ref_reg`, `ref_set`, `ref_xfr`, token events, and faucet events.

### Implementation checklist

- [ ] Replace the starter transfer-only `handleEvent` mapping with SO4 event dispatch.
- [ ] Add decoding helpers for symbol topics.
- [ ] Add decoding helpers for Soroban addresses.
- [ ] Add decoding helpers for `BytesN<32>` keys.
- [ ] Add decoding helpers for booleans.
- [ ] Add decoding helpers for signed and unsigned integer `ScVal` values.
- [ ] Add decoding helpers for tuple payloads emitted by SO4 contracts.
- [ ] Restrict handlers to configured SO4 contract IDs and token IDs from Issue 2.
- [ ] Implement `mkt_new` indexing from `market_factory`.
- [ ] Implement deposit lifecycle mappings for `dep_crt`, `dep_exe`, and `dep_can`.
- [ ] Implement withdrawal lifecycle mappings for `wth_crt`, `wth_exe`, and `wth_can`.
- [ ] Implement order lifecycle mappings for `ord_crt`, `ord_exe`, `ord_can`, `ord_upd`, and `ord_frz`.
- [ ] Implement position lifecycle mappings for `pos_inc` and `pos_dec`.
- [ ] Implement liquidation mappings for `liq_req` and `liq_exe`.
- [ ] Implement ADL mappings for `adl_req` and `adl_exe`.
- [ ] Implement fee mappings for `fee_clm`, `fnd_clm`, `ui_fee_acc`, `ui_fee_clm`, and `ui_fee_set`.
- [ ] Implement referral mappings for `ref_reg`, `ref_set`, and `ref_xfr`.
- [ ] Implement token/faucet mappings for transfers, mints, burns, approvals, and claims where useful to the app.
- [ ] Make entity writes idempotent so reprocessing a ledger does not duplicate rows.
- [ ] Store ledger, timestamp, event id, contract id, and transaction hash if SubQuery exposes them.
- [ ] Log and skip unknown events without crashing the indexer.

### Acceptance checklist

- [ ] Mappings build under Bun.
- [ ] Unit tests cover at least one market event.
- [ ] Unit tests cover at least one deposit event.
- [ ] Unit tests cover at least one withdrawal event.
- [ ] Unit tests cover at least one order event.
- [ ] Unit tests cover at least one position event.
- [ ] Unit tests cover at least one liquidation or ADL event.
- [ ] Unit tests cover at least one fee or referral event.
- [ ] Unit tests cover at least one token or faucet event.
- [ ] Unknown or malformed events are handled safely with structured logs.
- [ ] Entity IDs are deterministic and documented.

### Verification commands

- [ ] Run `bun run --cwd apps/s03-indexer codegen`.
- [ ] Run `bun run --cwd apps/s03-indexer build`.
- [ ] Run `bun run --cwd apps/s03-indexer test`.

---

## 5 - Add a Deterministic Local Indexing Scenario

**Bounty:** $100  
**Depends on:** Issue 4  
**Primary outcome:** A local smoke flow proves the contracts, indexer, and GraphQL layer work together.

### Background

The contracts repo already has deploy/bootstrap scripts, test tokens, faucet support, keeper roles, market creation, oracle price submission, and liquidity seeding helpers. The indexer needs a repeatable local flow that exercises the actual protocol rather than only synthetic mapping tests.

### Implementation checklist

- [ ] Add a documented local scenario script, for example `apps/s03-indexer/scripts/local-smoke.ts` or a shell wrapper.
- [ ] Support a configurable contracts repo path.
- [ ] Support a fresh local network path where deploy/bootstrap is run by the script.
- [ ] Support a pre-existing local deployment path discovered from `.deployed/local.env`.
- [ ] Validate that required local services are reachable before running protocol actions.
- [ ] Deploy contracts or validate an existing deployment.
- [ ] Create or validate test tokens.
- [ ] Bootstrap at least one market.
- [ ] Submit initial oracle prices.
- [ ] Create and execute a deposit.
- [ ] Create and execute a market or limit order that opens a position.
- [ ] Decrease or close the position, or trigger one risk path if practical.
- [ ] Optionally register and set a referral code if the deployed contracts support it locally.
- [ ] Query SubQuery GraphQL after the run and assert expected entities exist.
- [ ] Save a JSON smoke report with ledger numbers, transaction hashes, entity counts, and failing step details.

### Acceptance checklist

- [ ] A contributor can run one documented local command and know whether indexing works.
- [ ] The smoke flow does not depend on private keys outside local/test keys.
- [ ] Failures identify the broken layer: contracts deploy, contract action, indexer runtime, GraphQL query, or frontend config.
- [ ] The report includes market, deposit, order, position, and transfer counts.
- [ ] The smoke flow can be rerun without requiring manual database cleanup, or cleanup is documented and scripted.

### Verification commands

- [ ] Run `bun run --cwd apps/s03-indexer build`.
- [ ] Run `bun run --cwd apps/s03-indexer smoke:local`.

---

## 6 - Wire the Frontend Data Layer to SubQuery

**Bounty:** $100  
**Depends on:** Issue 5  
**Primary outcome:** The web app can read indexed SO4 data from SubQuery while keeping live contract reads where they are still needed.

### Background

The web app currently reads positions, orders, market info, pools, and referral stats from contract clients or static placeholders. Examples include `usePositions`, `useOrders`, `useMarketsInfo`, `useOpenInterest`, `usePoolsData`, and referral stats hooks. SubQuery should become the app's historical and aggregate data source.

### Implementation checklist

- [ ] Add `VITE_INDEXER_GRAPHQL_URL`.
- [ ] Add an env/config flag to disable the indexer and use degraded fallback behavior.
- [ ] Add local and testnet indexer endpoint defaults where appropriate.
- [ ] Add startup validation for indexer-related env vars.
- [ ] Add a GraphQL client package or lightweight fetch wrapper compatible with the existing TanStack Query setup.
- [ ] Implement typed query helpers for markets and pool rows.
- [ ] Implement typed query helpers for account positions.
- [ ] Implement typed query helpers for account orders.
- [ ] Implement typed query helpers for deposits and withdrawals by account.
- [ ] Implement typed query helpers for trade history.
- [ ] Implement typed query helpers for referral stats and trader lists.
- [ ] Implement typed query helpers for fee and funding fee history.
- [ ] Update `usePositions` to use SubQuery for history/status while keeping reader/oracle calls for fresh PnL and mark price where needed.
- [ ] Update `useOrders` to use indexed order status including frozen/cancelled/executed states.
- [ ] Update pools data hooks to use indexed market/pool events instead of static-only market lists.
- [ ] Update referral hooks to use indexed referral events and volumes instead of unavailable aggregate contract calls.
- [ ] Add loading, empty, stale-indexer, and indexer-disabled states without breaking existing pages.
- [ ] Ensure query keys include network and account where relevant.

### Acceptance checklist

- [ ] `apps/web` can run locally with the indexer enabled.
- [ ] `apps/web` can run with the indexer disabled and shows clear degraded behavior.
- [ ] No hook silently mixes testnet and mainnet data.
- [ ] At least one web page displays data produced by the local smoke scenario from Issue 5.
- [ ] Existing wallet and transaction flows remain usable.

### Verification commands

- [ ] Run `bun run --cwd apps/s03-indexer build`.
- [ ] Run `bun run --cwd apps/web typecheck`.
- [ ] Run `bun run --cwd apps/web build`.

---

## 7 - Add Full Local Integration Docs, Checks, and Handoff

**Bounty:** $100  
**Depends on:** Issue 6  
**Primary outcome:** A new contributor can run contracts, indexer, and web locally using one documented path with automated checks.

### Background

The final integration should not live in someone's terminal history. A contributor should be able to clone the repos, follow the docs, run the commands, and see web UI data sourced from local indexed contract activity.

### Implementation checklist

- [ ] Add a top-level integration guide under `docs/`, for example `docs/local-full-stack.md`.
- [ ] Document prerequisites: Bun, Docker, Stellar CLI, Rust/Soroban target, and local/testnet key setup.
- [ ] Document how to build contracts.
- [ ] Document how to deploy and bootstrap contracts.
- [ ] Document how to sync manifests into the indexer.
- [ ] Document how to start indexer services.
- [ ] Document how to run the local smoke scenario.
- [ ] Document how to start the web app.
- [ ] Document how to verify GraphQL data.
- [ ] Document how to verify the UI is reading indexed data.
- [ ] Add troubleshooting for missing `.deployed/<network>.env`.
- [ ] Add troubleshooting for wrong network passphrase.
- [ ] Add troubleshooting for stale market token IDs.
- [ ] Add troubleshooting for SubQuery database readiness.
- [ ] Add troubleshooting for the indexer being behind latest ledger.
- [ ] Add troubleshooting for missing local token balances or approvals.
- [ ] Add CI or local check scripts for indexer codegen/build.
- [ ] Add CI or local check scripts for web typecheck/build.
- [ ] Add CI or local check scripts for manifest sync validation with fixture deployment files.
- [ ] Add CI or local check scripts for mapping unit tests.
- [ ] Add fixture deployment files for tests that do not require live Stellar access.
- [ ] Include a final definition-of-done checklist for the complete local integration.

### Acceptance checklist

- [ ] A new contributor can follow the guide and get contracts, indexer, and web app running locally.
- [ ] CI or local scripts catch schema, mapping, and config regressions before review.
- [ ] The final guide includes expected URLs for web, SubQuery GraphQL, Postgres, Horizon/RPC, and Docker services.
- [ ] The final local smoke report can be compared against what appears in the UI.
- [ ] The docs clearly separate local, testnet, and future mainnet behavior.

### Verification commands

- [ ] Run `bun install`.
- [ ] Run `bun run --cwd apps/s03-indexer codegen`.
- [ ] Run `bun run --cwd apps/s03-indexer build`.
- [ ] Run `bun run --cwd apps/s03-indexer test`.
- [ ] Run `bun run --cwd apps/web typecheck`.
- [ ] Run `bun run --cwd apps/web build`.

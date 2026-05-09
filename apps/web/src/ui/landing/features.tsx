const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12h4l2-7 6 14 2-7h4" />
      </svg>
    ),
    title: "On-chain orderbook",
    body: "Every quote, fill, and liquidation lands in a verifiable block. No off-chain matching engine, no batch tricks — just a transparent ledger you can audit.",
    statKey: "Median latency",
    statVal: "38ms",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Up to 50× leverage",
    body: "Cross- and isolated-margin modes, per-market caps, and a partial-liquidation engine that protects healthy positions during volatility spikes.",
    statKey: "Max leverage",
    statVal: "50×",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
      </svg>
    ),
    title: "Self-custodied",
    body: "Your keys, your collateral. No deposits to a custodian, no withdrawal queues. Pull your margin on the same block you close a position.",
    statKey: "Withdraw time",
    statVal: "< 1 block",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
      </svg>
    ),
    title: "Sub-second matching",
    body: "A purpose-built sequencer commits orders in 200ms blocks. Cancels and replaces are first-class — no priority gas auctions to game.",
    statKey: "Block time",
    statVal: "200ms",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
    title: "Real yield to LPs",
    body: "Liquidity providers earn the trading fees and the funding spread, paid block-by-block. No emissions, no lockups, no vesting cliffs.",
    statKey: "30d APY",
    statVal: "18.4%",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    title: "One pool, every market",
    body: "BTC, ETH, SOL, the long-tail, FX perps and commodity perps all draw from the same balance sheet. Capital you don't deploy still earns.",
    statKey: "Live markets",
    statVal: "184",
  },
]

export function Features() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        {/* Section header */}
        <div className="mb-12">
          <div className="font-mono-num mb-4 flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-px w-4 bg-primary" />
            Engine
          </div>
          <h2
            className="font-trading font-medium leading-[1.04] tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(34px, 3.4vw, 46px)" }}
          >
            Built for traders{" "}
            <span className="italic font-normal text-primary">who care</span>{" "}
            where their fills come from.
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-[1.55] text-muted-foreground">
            so4 runs a unified liquidity layer — one pool backs every market,
            with deterministic settlement on every fill. No hidden routes, no
            opaque MM rebates.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, title, body, statKey, statVal }) => (
            <div
              key={title}
              className="group relative overflow-hidden border border-border bg-card p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="mb-5 inline-flex h-9 w-9 items-center justify-center border border-primary/20 bg-primary/8 text-primary">
                {icon}
              </div>
              <h3 className="mb-2.5 text-[18px] font-medium tracking-[-0.015em] text-foreground">
                {title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-muted-foreground">{body}</p>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4 font-mono-num">
                <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/60">
                  {statKey}
                </span>
                <span className="text-[18px] text-foreground">{statVal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const INFRA = [
  {
    key: "Block time",
    val: "200",
    unit: "ms",
    desc: "Deterministic finality. No reorgs, no MEV auctions.",
  },
  {
    key: "Throughput",
    val: "200k",
    unit: "/s",
    desc: "Orders per second on a single sequencer; horizontally shardable.",
  },
  {
    key: "Settlement",
    val: "L1",
    unit: "",
    desc: "Native settlement; no bridge, no L2 withdrawal delay.",
  },
  {
    key: "Audits",
    val: "7",
    unit: "",
    desc: "By Trail of Bits, Zellic, OtterSec — full reports public.",
  },
]

export function Infrastructure() {
  return (
    <section className="border-t border-b border-border bg-muted/10 px-4 py-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px] py-20">
        <div className="mb-12">
          <div className="font-mono-num mb-4 flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.18em] text-primary">
            <span className="inline-block h-px w-4 bg-primary" />
            Infrastructure
          </div>
          <h2
            className="font-trading font-medium leading-[1.04] tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(34px, 3.4vw, 46px)" }}
          >
            An{" "}
            <span className="italic font-normal text-primary">app-specific chain</span>{" "}
            with one job: settle perps.
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-[1.55] text-muted-foreground">
            so4 runs on a custom L1 tuned for orderbook throughput. We don't share
            blockspace with NFT mints or memecoin launches — your fill is the only
            thing in the queue.
          </p>
        </div>

        <div className="grid grid-cols-2 border-t border-border lg:grid-cols-4">
          {INFRA.map(({ key, val, unit, desc }, i) => (
            <div
              key={key}
              className={`p-6 sm:p-7 ${
                i < INFRA.length - 1 ? "border-b border-border lg:border-b-0 lg:border-r" : ""
              } ${i % 2 === 0 && i < 2 ? "max-lg:border-r" : ""}`}
            >
              <div className="font-mono-num text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                {key}
              </div>
              <div className="font-mono-num mt-3 text-[26px] tracking-[-0.02em] text-foreground">
                {val}
                {unit && (
                  <span className="ml-0.5 text-[16px] text-muted-foreground">{unit}</span>
                )}
              </div>
              <p className="mt-2.5 text-[13px] leading-[1.5] text-muted-foreground/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const STATS = [
  {
    label: "Cumulative Volume",
    value: "184.62",
    pre: "$",
    suf: "B",
    delta: "+$8.42B · 24h",
    down: false,
  },
  {
    label: "Open Interest",
    value: "2.41",
    pre: "$",
    suf: "B",
    delta: "+4.18% · 24h",
    down: false,
  },
  {
    label: "Active Traders",
    value: "214,802",
    pre: "",
    suf: "",
    delta: "+1,284 · 24h",
    down: false,
  },
  {
    label: "Pool TVL",
    value: "418.7",
    pre: "$",
    suf: "M",
    delta: "−0.42% · 24h",
    down: true,
  },
]

export function Stats() {
  return (
    <section className="px-4 pt-16 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-2 overflow-hidden border border-border bg-card lg:grid-cols-4">
          {STATS.map(({ label, value, pre, suf, delta, down }, i) => (
            <div
              key={label}
              className={`relative p-7 sm:p-8 ${
                i < STATS.length - 1
                  ? "border-b border-border lg:border-b-0 lg:border-r"
                  : ""
              } ${i % 2 === 0 && i < 2 ? "max-lg:border-r" : ""}`}
            >
              <div className="font-mono-num flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="inline-block h-1 w-1 rounded-full bg-primary" />
                {label}
              </div>
              <div className="font-mono-num mt-3.5 text-[40px] leading-none tracking-[-0.02em] text-foreground">
                {pre && <span className="text-muted-foreground">{pre}</span>}
                {value}
                {suf && <span className="text-muted-foreground">{suf}</span>}
              </div>
              <div
                className={`font-mono-num mt-2 text-[12px] ${
                  down ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

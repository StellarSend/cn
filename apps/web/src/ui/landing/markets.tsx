import { Button } from "@workspace/ui/components/button"

const MARKETS = [
  {
    sym: "BTC-PERP",
    name: "Bitcoin",
    icon: "B",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
    price: "$67,218.40",
    lev: "50×",
    change: "+2.41%",
    up: true,
    vol: "$2.18B",
    oi: "$612M",
  },
  {
    sym: "ETH-PERP",
    name: "Ethereum",
    icon: "E",
    iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-700",
    price: "$3,482.16",
    lev: "40×",
    change: "+3.18%",
    up: true,
    vol: "$1.42B",
    oi: "$418M",
  },
  {
    sym: "SOL-PERP",
    name: "Solana",
    icon: "S",
    iconBg: "bg-gradient-to-br from-purple-500 to-emerald-500",
    price: "$182.04",
    lev: "25×",
    change: "−1.24%",
    up: false,
    vol: "$684M",
    oi: "$208M",
  },
  {
    sym: "HYPE-PERP",
    name: "Hyperliquid",
    icon: "H",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-900",
    price: "$28.41",
    lev: "20×",
    change: "+8.62%",
    up: true,
    vol: "$118M",
    oi: "$42.1M",
  },
  {
    sym: "AAPL-PERP",
    name: "Apple Inc.",
    icon: "A",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconDark: true,
    price: "$214.80",
    lev: "10×",
    change: "+0.42%",
    up: true,
    vol: "$22.1M",
    oi: "$8.4M",
  },
  {
    sym: "XAU-PERP",
    name: "Gold (oz)",
    icon: "X",
    iconBg: "bg-gradient-to-br from-yellow-600 to-yellow-800",
    iconDark: true,
    price: "$2,684.12",
    lev: "15×",
    change: "+0.18%",
    up: true,
    vol: "$48.2M",
    oi: "$22.8M",
  },
  {
    sym: "NGN-PERP",
    name: "Naira / USD",
    icon: "N",
    iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-700",
    iconDark: true,
    price: "₦1,612.40",
    lev: "5×",
    change: "−0.62%",
    up: false,
    vol: "$4.1M",
    oi: "$1.2M",
  },
]

export function Markets() {
  return (
    <section className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono-num mb-4 flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.18em] text-primary">
              <span className="inline-block h-px w-4 bg-primary" />
              Markets
            </div>
            <h2
              className="font-trading font-medium leading-[1.04] tracking-[-0.025em] text-foreground"
              style={{ fontSize: "clamp(34px, 3.4vw, 46px)" }}
            >
              184 perpetuals.{" "}
              <span className="italic font-normal text-primary">One book.</span>
            </h2>
            <p className="mt-4 max-w-[520px] text-[16px] leading-[1.55] text-muted-foreground">
              Crypto, FX, rates, and commodity perps — all settled in USDC, all
              backed by the same unified liquidity layer.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 gap-2 self-start sm:self-auto">
            View all markets →
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden border border-border bg-card">
          {/* Header */}
          <div className="font-mono-num hidden grid-cols-[2fr_1.4fr_1fr_1.4fr_1.4fr_1.4fr_0.8fr] items-center gap-3 border-b border-border bg-muted/30 px-6 py-4 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground sm:grid">
            <span>Market</span>
            <span className="text-right">Price</span>
            <span>Max lev.</span>
            <span className="text-right">24h change</span>
            <span className="text-right">24h volume</span>
            <span className="text-right">Open interest</span>
            <span />
          </div>

          {MARKETS.map(({ sym, name, icon, iconBg, iconDark, price, lev, change, up, vol, oi }) => (
            <div
              key={sym}
              className="group cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-muted/20"
            >
              {/* Mobile layout */}
              <div className="flex items-center justify-between px-4 py-3.5 sm:hidden">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono-num text-[10.5px] font-semibold ${iconBg} ${iconDark ? "text-zinc-900" : "text-white"}`}
                  >
                    {icon}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{sym}</div>
                    <div className="text-xs text-muted-foreground">{name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-num text-sm text-foreground">{price}</div>
                  <div
                    className={`font-mono-num text-xs ${up ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {change}
                  </div>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden grid-cols-[2fr_1.4fr_1fr_1.4fr_1.4fr_1.4fr_0.8fr] items-center gap-3 px-6 py-4 sm:grid">
                <div className="flex items-center gap-3 font-medium">
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono-num text-[10.5px] font-semibold ${iconBg} ${iconDark ? "text-zinc-900" : "text-white"}`}
                  >
                    {icon}
                  </span>
                  <div>
                    <div className="text-[14px] text-foreground">{sym}</div>
                    <div className="text-[12px] font-normal text-muted-foreground">{name}</div>
                  </div>
                </div>

                <span className="font-mono-num text-right text-[13.5px] text-foreground">
                  {price}
                </span>

                <span>
                  <span className="font-mono-num border border-border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {lev}
                  </span>
                </span>

                <span
                  className={`font-mono-num text-right text-[13px] ${up ? "text-emerald-400" : "text-red-400"}`}
                >
                  {change}
                </span>

                <span className="font-mono-num text-right text-[13.5px] text-foreground">
                  {vol}
                </span>

                <span className="font-mono-num text-right text-[13.5px] text-foreground">
                  {oi}
                </span>

                <span className="font-mono-num text-right text-[11.5px] text-muted-foreground transition-colors group-hover:text-primary">
                  Trade →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

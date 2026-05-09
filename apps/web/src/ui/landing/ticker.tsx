const TICKERS = [
  ["BTC-PERP", "67,218.40", "+2.41%", "up"],
  ["ETH-PERP", "3,482.16", "+3.18%", "up"],
  ["SOL-PERP", "182.04", "−1.24%", "dn"],
  ["HYPE-PERP", "28.41", "+8.62%", "up"],
  ["ARB-PERP", "0.842", "−0.62%", "dn"],
  ["XAU-PERP", "2,684.12", "+0.18%", "up"],
  ["DOGE-PERP", "0.142", "+4.12%", "up"],
  ["SUI-PERP", "2.184", "+1.82%", "up"],
  ["AAPL-PERP", "214.80", "+0.42%", "up"],
  ["NGN-PERP", "1,612.40", "−0.62%", "dn"],
  ["AVAX-PERP", "42.18", "+2.04%", "up"],
  ["LINK-PERP", "18.42", "−0.84%", "dn"],
  ["TON-PERP", "6.28", "+1.24%", "up"],
  ["DOT-PERP", "7.42", "+0.42%", "up"],
] as const

function TickerItem({ sym, px, ch, dir }: { sym: string; px: string; ch: string; dir: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-r border-border px-6 py-3.5 font-mono-num text-[12.5px]">
      <span className="font-medium text-foreground">{sym}</span>
      <span className="text-muted-foreground">${px}</span>
      <span className={`text-[11.5px] ${dir === "up" ? "text-emerald-400" : "text-red-400"}`}>
        {ch}
      </span>
    </div>
  )
}

export function Ticker() {
  const doubled = [...TICKERS, ...TICKERS]

  return (
    <div className="mt-20 overflow-hidden border-t border-b border-border bg-muted/30">
      <div
        className="flex w-max"
        style={{ animation: "tickerSlide 60s linear infinite" }}
      >
        {doubled.map(([sym, px, ch, dir], i) => (
          <TickerItem key={i} sym={sym} px={px} ch={ch} dir={dir} />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Ticker } from "./ticker"

/* ─── Order Book ─────────────────────────────────────────── */
const ASKS = [
  { price: "67,224.0", size: "0.842", total: "5.218", w: "42%" },
  { price: "67,222.5", size: "1.204", total: "4.376", w: "55%" },
  { price: "67,221.0", size: "0.318", total: "3.172", w: "18%" },
  { price: "67,220.0", size: "2.108", total: "2.854", w: "78%" },
  { price: "67,219.5", size: "0.624", total: "0.746", w: "32%" },
]
const BIDS = [
  { price: "67,218.0", size: "1.418", total: "1.418", w: "60%" },
  { price: "67,217.5", size: "0.502", total: "1.920", w: "22%" },
  { price: "67,216.0", size: "2.348", total: "4.268", w: "85%" },
  { price: "67,214.5", size: "0.918", total: "5.186", w: "42%" },
  { price: "67,213.0", size: "1.124", total: "6.310", w: "50%" },
]

function OrderBook() {
  return (
    <div className="overflow-hidden rounded-none border border-border bg-muted/20 p-2.5 font-mono-num text-[10.5px]">
      {/* Header */}
      <div className="mb-1.5 grid grid-cols-3 border-b border-border pb-1.5 text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks */}
      {ASKS.map((row) => (
        <div key={row.price} className="relative grid grid-cols-3 py-[2.5px]">
          <div
            className="absolute right-0 top-0 bottom-0 bg-red-400/15"
            style={{ width: row.w }}
          />
          <span className="relative text-red-400">{row.price}</span>
          <span className="relative text-right text-foreground">{row.size}</span>
          <span className="relative text-right text-foreground">{row.total}</span>
        </div>
      ))}

      {/* Spread */}
      <div className="my-0.5 flex justify-between border-t border-b border-border py-1.5 text-[9.5px] text-muted-foreground">
        <span>Spread</span>
        <span className="text-primary font-medium">0.50</span>
        <span>0.0007%</span>
      </div>

      {/* Bids */}
      {BIDS.map((row) => (
        <div key={row.price} className="relative grid grid-cols-3 py-[2.5px]">
          <div
            className="absolute right-0 top-0 bottom-0 bg-emerald-400/15"
            style={{ width: row.w }}
          />
          <span className="relative text-emerald-400">{row.price}</span>
          <span className="relative text-right text-foreground">{row.size}</span>
          <span className="relative text-right text-foreground">{row.total}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Mini Chart ─────────────────────────────────────────── */
function MiniChart({ priceLabel }: { priceLabel: string }) {
  return (
    <div className="relative h-[220px] overflow-hidden rounded-none border border-border bg-muted/20">
      {/* Live price tag */}
      <div className="font-mono-num absolute right-2.5 top-2.5 z-10 border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[11px] text-primary">
        {priceLabel}
      </div>

      {/* Y-axis labels */}
      <div className="font-mono-num absolute right-2 top-0 bottom-6 flex flex-col justify-between py-3 text-right text-[9.5px] text-muted-foreground/60">
        <span>67.4k</span>
        <span>67.0k</span>
        <span>66.6k</span>
        <span>66.2k</span>
      </div>

      <svg
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" x2="400" y1="40" y2="40" stroke="currentColor" strokeOpacity="0.04" />
        <line x1="0" x2="400" y1="100" y2="100" stroke="currentColor" strokeOpacity="0.04" />
        <line x1="0" x2="400" y1="160" y2="160" stroke="currentColor" strokeOpacity="0.04" />

        {/* Candle bodies */}
        <g opacity="0.5">
          <rect x="8" y="120" width="6" height="22" fill="#34D399" />
          <line x1="11" x2="11" y1="110" y2="148" stroke="#34D399" strokeWidth="1" />
          <rect x="20" y="115" width="6" height="18" fill="#34D399" />
          <line x1="23" x2="23" y1="108" y2="138" stroke="#34D399" strokeWidth="1" />
          <rect x="32" y="118" width="6" height="14" fill="#F87171" />
          <line x1="35" x2="35" y1="112" y2="138" stroke="#F87171" strokeWidth="1" />
          <rect x="44" y="112" width="6" height="22" fill="#34D399" />
          <line x1="47" x2="47" y1="104" y2="140" stroke="#34D399" strokeWidth="1" />
          <rect x="56" y="105" width="6" height="20" fill="#34D399" />
          <line x1="59" x2="59" y1="98" y2="130" stroke="#34D399" strokeWidth="1" />
          <rect x="68" y="108" width="6" height="14" fill="#F87171" />
          <line x1="71" x2="71" y1="102" y2="128" stroke="#F87171" strokeWidth="1" />
          <rect x="80" y="98" width="6" height="22" fill="#34D399" />
          <line x1="83" x2="83" y1="90" y2="125" stroke="#34D399" strokeWidth="1" />
          <rect x="92" y="92" width="6" height="16" fill="#34D399" />
          <line x1="95" x2="95" y1="84" y2="115" stroke="#34D399" strokeWidth="1" />
        </g>

        {/* Price area fill */}
        <path
          d="M0,150 L20,142 L40,148 L60,134 L80,128 L100,120 L120,110 L140,118 L160,106 L180,98 L200,92 L220,86 L240,90 L260,80 L280,72 L300,66 L320,76 L340,60 L360,52 L380,46 L400,40 L400,220 L0,220 Z"
          fill="url(#chartFill)"
        />

        {/* Price line */}
        <path
          d="M0,150 L20,142 L40,148 L60,134 L80,128 L100,120 L120,110 L140,118 L160,106 L180,98 L200,92 L220,86 L240,90 L260,80 L280,72 L300,66 L320,76 L340,60 L360,52 L380,46 L400,40"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Last price dot */}
        <circle cx="400" cy="40" r="3" fill="var(--color-primary)" />
        <line
          x1="0"
          x2="400"
          y1="40"
          y2="40"
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          opacity="0.4"
        />
      </svg>

      {/* X-axis labels */}
      <div className="font-mono-num absolute right-2 bottom-1.5 left-2 flex justify-between text-[9.5px] text-muted-foreground/60">
        <span>09:00</span>
        <span>11:00</span>
        <span>13:00</span>
        <span>15:00</span>
        <span>17:00</span>
      </div>
    </div>
  )
}

/* ─── Trading Card ───────────────────────────────────────── */
function TradingCard() {
  const [price, setPrice] = useState(67218.4)

  useEffect(() => {
    let base = 67218.4
    const id = setInterval(() => {
      const delta = (Math.random() - 0.45) * 4
      base = Math.max(67100, Math.min(67320, base + delta))
      setPrice(base)
    }, 1600)
    return () => clearInterval(id)
  }, [])

  const fmt = price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="relative border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] after:pointer-events-none after:absolute after:inset-0 after:border after:border-primary/10">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 font-mono-num text-[12px] font-semibold text-white">
            B
          </span>
          <div>
            <div className="text-[14.5px] font-medium text-foreground">
              BTC<span className="ml-1 font-normal text-muted-foreground">-PERP</span>
            </div>
            <div className="font-mono-num mt-0.5 text-[11px] text-muted-foreground">
              ${fmt}
            </div>
          </div>
          <span className="font-mono-num rounded-none bg-emerald-400/10 px-1.5 py-0.5 text-[11.5px] text-emerald-400">
            +2.41%
          </span>
        </div>

        <div className="flex gap-4">
          {[
            { label: "24h Vol", value: "$2.18B" },
            { label: "OI", value: "$612M" },
            { label: "Funding", value: "+0.0098%" },
          ].map(({ label, value }) => (
            <div key={label} className="font-mono-num text-right">
              <div className="text-[11px] text-muted-foreground/60">{label}</div>
              <div className="mt-0.5 text-[12.5px] font-medium text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Card body: chart + order book */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-3.5 p-3.5">
        <MiniChart priceLabel={fmt} />
        <OrderBook />
      </div>

      {/* Card footer: buy/sell */}
      <div className="grid grid-cols-2 gap-2 p-3.5 pt-0">
        <button className="font-mono-num h-9 border border-emerald-400/35 bg-emerald-400/15 text-[12px] font-medium uppercase tracking-[0.04em] text-emerald-400 transition-all hover:brightness-110">
          Buy / Long
        </button>
        <button className="font-mono-num h-9 border border-red-400/32 bg-red-400/12 text-[12px] font-medium uppercase tracking-[0.04em] text-red-400 transition-all hover:brightness-110">
          Sell / Short
        </button>
      </div>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden px-4 pt-[88px] pb-14 sm:px-6 lg:px-8">
      <div className="hero-grid-bg absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Left column */}
        <div>
          <span className="font-mono-num inline-flex items-center gap-2.5 border border-border bg-card/50 px-3 py-1.5 text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
              style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
            />
            Mainnet · v1.4 · Lagos UTC+1
          </span>

          <h1
            className="font-trading mt-[22px] font-medium leading-none tracking-[-0.035em] text-foreground"
            style={{ fontSize: "clamp(48px, 5.6vw, 78px)" }}
          >
            <span className="block">perpetual</span>
            <span className="block">
              markets,{" "}
              <span className="italic font-normal text-primary">settled</span>
            </span>
            <span className="block">on-chain.</span>
          </h1>

          <p className="mt-[22px] max-w-[520px] text-[17px] leading-[1.55] text-muted-foreground">
            A unified-liquidity perp DEX. Deep books, sub-second matching, and
            self-custodied risk — built for traders who care where their fills
            come from.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="default" className="h-12 gap-2 px-5 text-sm font-medium">
              Start trading <span>→</span>
            </Button>
            <Button variant="outline" className="h-12 px-5 text-sm font-medium">
              Read the litepaper
            </Button>
          </div>

          <div className="font-mono-num mt-9 flex flex-wrap items-center gap-4 text-[12.5px] text-muted-foreground/60">
            <span>
              <span className="font-medium text-foreground">$8.42B</span> 24h volume
            </span>
            <span className="h-3 w-px bg-border" />
            <span>
              <span className="font-medium text-foreground">184</span> markets
            </span>
            <span className="h-3 w-px bg-border" />
            <span>
              <span className="font-medium text-foreground">0.014%</span> taker fee
            </span>
          </div>
        </div>

        {/* Right column: trading card */}
        <TradingCard />
      </div>

      <Ticker />
    </section>
  )
}

import type { OracleStaleness } from "../lib/pyth"

type Props = {
  staleness: OracleStaleness
  showLabel?: boolean
}

const DOT_CLASS: Record<OracleStaleness, string> = {
  fresh: "bg-green-500",
  warning: "bg-yellow-500",
  stale: "bg-red-500",
}

export function OracleStalenessIndicator({ staleness, showLabel = false }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block size-2 shrink-0 rounded-full ${DOT_CLASS[staleness]}`}
        title={
          staleness === "fresh"
            ? "Price < 5s old"
            : staleness === "warning"
              ? "Price 5–30s old"
              : "Price > 30s old"
        }
      />
      {showLabel && staleness === "stale" && (
        <span className="text-xs font-medium text-red-500">Stale</span>
      )}
    </span>
  )
}

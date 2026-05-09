import { useQuery } from "@tanstack/react-query"
import { fetch24hPriceDelta, type PriceDelta24h } from "../lib/oracle"
import { queryKeys } from "../lib/query-keys"

export function usePriceDelta24h(symbol: string | undefined) {
  return useQuery<PriceDelta24h | null>({
    queryKey: queryKeys.priceDelta24h(symbol ?? ""),
    queryFn: () => fetch24hPriceDelta(symbol!),
    enabled: !!symbol,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}

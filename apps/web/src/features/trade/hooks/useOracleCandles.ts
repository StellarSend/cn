import { useQuery } from "@tanstack/react-query"
import { fetchOracleCandles, type OhlcBar } from "../lib/oracle"
import { queryKeys } from "../lib/query-keys"

export function useOracleCandles(symbol: string | undefined, period: string) {
  return useQuery<OhlcBar[]>({
    queryKey: queryKeys.oracleCandles(symbol ?? "", period),
    queryFn: () => fetchOracleCandles(symbol!, period, 500),
    enabled: !!symbol,
    // Historical candles don't auto-refresh — period/symbol change triggers a manual invalidation
    // via queryClient.invalidateQueries() in TVChart.tsx when the user switches periods.
    // Live bar updates are handled separately by useLiveBar (1.5s polling).
    staleTime: 1000 * 60 * 5,  // 5min — refetch if tab was hidden and comes back
    refetchOnWindowFocus: false,
  })
}

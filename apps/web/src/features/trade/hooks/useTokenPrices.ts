import { useQuery } from "@tanstack/react-query"
import { fetchTokenPrices, type TokenPrice } from "../lib/oracle"
import { queryKeys } from "../lib/query-keys"

// TODO: Replace "stellar-mainnet" with real chainId from wallet context
const CHAIN_ID = "stellar-mainnet"

type PricesMap = Record<string, TokenPrice>

export function useTokenPrices() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.tokenPrices(CHAIN_ID),
    queryFn: fetchTokenPrices,
    // TODO: Tighten to 5s once real oracle is live — dummy data is static so 30s is fine
    refetchInterval: 30_000,
    select(prices): PricesMap {
      return Object.fromEntries(prices.map((p) => [p.symbol, p]))
    },
  })

  return {
    prices: data ?? {},
    isLoading,
    error,
    getPrice: (symbol: string): TokenPrice | undefined => data?.[symbol],
    getMidPrice: (symbol: string): number => {
      const p = data?.[symbol]
      if (!p) return 0
      return (p.minPrice + p.maxPrice) / 2
    },
  }
}

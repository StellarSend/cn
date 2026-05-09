import { useQuery } from "@tanstack/react-query"
import { MARKETS, type Market } from "../data/markets"
import { queryKeys } from "../lib/query-keys"

// TODO: Replace with actual Soroban RPC batch-read once contracts are deployed.
// Equivalent to GMX's useMarketsInfo: batch-reads from SyntheticsReader + DataStore via multicall.
// Fields to fetch per market:
//   - openInterestLong / openInterestShort  (from DataStore openInterestKey)
//   - poolAmountLong / poolAmountShort
//   - borrowingFactorLong / borrowingFactorShort
//   - fundingFactor
//   - positionFeeFactor
//   - maxLeverage
//   - isDisabled

export type MarketInfo = Market & {
  openInterestLong: number
  openInterestShort: number
  poolAmount: number
  availableLiquidityLong: number
  availableLiquidityShort: number
  borrowingRatePerHour: number
  fundingRatePerHour: number
  maxLeverage: number
  isDisabled: boolean
}

const CHAIN_ID = "stellar-mainnet"

async function fetchMarketsInfo(): Promise<MarketInfo[]> {
  // TODO: Replace with Soroban multicall:
  //   const reader = new SyntheticsReaderContract(READER_CONTRACT_ADDRESS)
  //   return Promise.all(MARKETS.map(m => reader.getMarketInfo(m.address)))
  return MARKETS.map((m) => ({
    ...m,
    openInterestLong: Math.random() * 50_000_000,
    openInterestShort: Math.random() * 50_000_000,
    poolAmount: Math.random() * 100_000_000,
    availableLiquidityLong: Math.random() * 20_000_000,
    availableLiquidityShort: Math.random() * 20_000_000,
    borrowingRatePerHour: 0.0001,
    fundingRatePerHour: 0.00005,
    maxLeverage: 50,
    isDisabled: false,
  }))
}

export function useMarketsInfo() {
  const { data, isLoading, error } = useQuery<MarketInfo[]>({
    queryKey: queryKeys.marketsInfo(CHAIN_ID),
    queryFn: fetchMarketsInfo,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  const marketsMap = Object.fromEntries((data ?? []).map((m) => [m.address, m]))

  return {
    marketsInfo: data ?? [],
    marketsMap,
    isLoading,
    error,
    getMarket: (address: string): MarketInfo | undefined => marketsMap[address],
  }
}

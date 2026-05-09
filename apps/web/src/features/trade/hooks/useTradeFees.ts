// Calculates all fees for the current trade before submission
// TODO: Replace with real values from Soroban DataStore once contracts are deployed.
//   Fee sources:
//     - positionFeeFactor    (DataStore: positionFeeFactorKey(market, isIncrease))
//     - priceImpact          (computed from pool balance + positionImpactFactor)
//     - executionFee         (dynamic gas estimate from Soroban)
//     - borrowingFee         (only for existing positions on increase)

export type TradeFees = {
  positionFeeUsd: number       // open/close fee (basis points of size)
  priceImpactUsd: number       // market impact (positive = rebate, negative = cost)
  executionFeeUsd: number      // keeper execution gas cost
  totalFeesUsd: number
  feesBreakdown: { label: string; valueUsd: number }[]
}

// TODO: Read positionFeeFactor from useMarketsInfo once DataStore read is live
const POSITION_FEE_BPS = 10   // 0.1% — GMX-style
const PRICE_IMPACT_BPS = 5    // 0.05% — simplified placeholder

export function useTradeFees(params: {
  sizeUsd: number
  marketAddress: string
  isIncrease: boolean
}): TradeFees {
  const { sizeUsd } = params

  if (!sizeUsd || sizeUsd <= 0) {
    return {
      positionFeeUsd: 0,
      priceImpactUsd: 0,
      executionFeeUsd: 0,
      totalFeesUsd: 0,
      feesBreakdown: [],
    }
  }

  // TODO: Compute real price impact from pool balance imbalance
  const positionFeeUsd = (sizeUsd * POSITION_FEE_BPS) / 10_000
  const priceImpactUsd = -(sizeUsd * PRICE_IMPACT_BPS) / 10_000   // negative = cost
  // TODO: Estimate execution fee from current Stellar network base fee
  const executionFeeUsd = 0.05

  const totalFeesUsd = positionFeeUsd + Math.abs(priceImpactUsd) + executionFeeUsd

  return {
    positionFeeUsd,
    priceImpactUsd,
    executionFeeUsd,
    totalFeesUsd,
    feesBreakdown: [
      { label: "Position fee", valueUsd: positionFeeUsd },
      { label: "Price impact", valueUsd: priceImpactUsd },
      { label: "Execution fee", valueUsd: executionFeeUsd },
    ],
  }
}

import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"

type PoolActionsProps = {
  hasWallet: boolean
  hasUserGm: boolean
}

export function PoolActions({ hasWallet, hasUserGm }: PoolActionsProps) {
  if (!hasWallet) {
    return (
      <Button variant="outline" size="sm" className="h-8" disabled>
        Connect
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-8" disabled>
        Deposit
      </Button>
      <Button variant="outline" size="sm" className="h-8" disabled={!hasUserGm}>
        Withdraw
      </Button>
      <Link
        to="/faucet"
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Faucet
      </Link>
    </div>
  )
}

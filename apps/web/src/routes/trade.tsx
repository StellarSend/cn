import { createFileRoute } from "@tanstack/react-router"
import { TradePage } from "../features/trade/components/TradePage"

export const Route = createFileRoute("/trade")({ component: TradePage })

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "../theme-toggle"

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 tracking-[-0.02em]">
      <span className="inline-flex h-[22px] w-[22px] items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <path
            d="M4 6 L12 2 L20 6 L20 14 L12 18 L4 14 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.08"
            className="text-primary"
          />
          <path
            d="M12 2 L12 18"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
          <path
            d="M4 6 L20 14"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.5"
            className="text-primary"
          />
          <path
            d="M20 6 L4 14"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.5"
            className="text-primary"
          />
        </svg>
      </span>
      <span className="font-mono-num text-[17px] font-medium tracking-[0.02em] text-foreground">
        so4<span className="text-muted-foreground">.market</span>
      </span>
    </a>
  )
}

const NAV_LINKS = [
  { label: "Trade", href: "#", active: true },
  { label: "Earn", href: "#" },
  { label: "Stats", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Governance", href: "#" },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ label, href, active }) => (
            <li key={label}>
              <a
                href={href}
                className={`text-[13.5px] font-normal transition-colors hover:text-foreground ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" className="h-[38px] px-4 text-[13.5px]">
            Connect
          </Button>
          <Button
            variant="default"
            className="hidden h-[38px] gap-2 px-4 text-[13.5px] sm:inline-flex"
          >
            Launch app
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Button>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ label, href, active }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`block rounded py-2 text-sm transition-colors hover:text-foreground ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Button variant="default" className="mt-3 w-full gap-2">
            Launch app →
          </Button>
        </div>
      )}
    </nav>
  )
}

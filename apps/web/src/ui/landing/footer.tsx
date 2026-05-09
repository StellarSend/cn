const FOOTER_COLS = [
  {
    heading: "Product",
    links: ["Trade", "Earn", "Vaults", "Stats", "Leaderboard"],
  },
  {
    heading: "Developers",
    links: ["Documentation", "API reference", "SDK", "Contracts", "Bug bounty"],
  },
  {
    heading: "Support",
    links: ["FAQ", "Status", "Feedback", "Audits"],
  },
  {
    heading: "About",
    links: ["Blog", "Brand kit", "Litepaper", "Terms", "Privacy"],
  },
]

function SocialLinks() {
  const socials = [
    {
      label: "X",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ),
    },
    {
      label: "Discord",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8" cy="12" r="1" />
          <circle cx="16" cy="12" r="1" />
          <path d="M5 7s2-2 7-2 7 2 7 2 2 5 2 9-3 5-3 5l-1-2s-2 1-5 1-5-1-5-1l-1 2s-3-1-3-5 2-9 2-9z" />
        </svg>
      ),
    },
    {
      label: "Telegram",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="m22 3-10 18-3-8-8-3 21-7z" />
        </svg>
      ),
    },
    {
      label: "Mirror",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 18v-2c-3 .5-3.5-1.3-3.5-1.3M15 21v-3.5a3 3 0 0 0-1-2.3c3-.3 5-1.5 5-5a3.8 3.8 0 0 0-1-2.7 3.7 3.7 0 0 0-.1-2.7s-1 0-3 1.3a10 10 0 0 0-5 0c-2-1.3-3-1.3-3-1.3a3.7 3.7 0 0 0-.1 2.7 3.8 3.8 0 0 0-1 2.7c0 3.5 2 4.7 5 5a3 3 0 0 0-1 2.3V21" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mt-7 flex gap-2">
      {socials.map(({ label, icon }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          className="inline-flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border bg-muted/10 px-4 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-10 pb-12 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5">
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
                </svg>
              </span>
              <span className="font-mono-num text-[14px] font-medium tracking-[0.02em] text-foreground">
                so4<span className="text-muted-foreground">.market</span>
              </span>
            </div>
            <p className="mt-5 max-w-[260px] text-[12.5px] leading-[1.55] text-muted-foreground">
              24/7 decentralized perpetuals layer for global markets.
            </p>
            <SocialLinks />
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h5 className="font-mono-num mb-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground">
                {heading}
              </h5>
              <ul className="space-y-0.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block py-1 text-[12.5px] text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark */}
        <div className="font-trading relative select-none overflow-hidden border-t border-border py-7 text-[16.4vw] font-semibold leading-[0.82] tracking-[-0.06em] text-foreground">
          <div className="flex items-start gap-[0.06em] whitespace-nowrap">
            <span>so4.market</span>
            <span className="mt-[0.04em] inline-flex h-[0.32em] w-[0.32em] shrink-0 items-center justify-center rounded-full border-[0.025em] border-current text-[0.18em] font-normal">
              C
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="font-mono-num flex flex-col gap-2 border-t border-border py-5 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-[5px] w-[5px] rounded-full bg-emerald-400"
              style={{ animation: "pulseDot 2s ease-in-out infinite" }}
            />
            Mainnet · block 84,218,402
          </span>
          <span>© 2026 so4 labs — all rights reserved · v1.4.2</span>
        </div>
      </div>
    </footer>
  )
}

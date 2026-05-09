import { Button } from "@workspace/ui/components/button"

export function FinalCTA() {
  return (
    <section className="final-glow relative overflow-hidden px-4 py-28 text-center sm:px-6 lg:px-8 sm:py-36">
      <div className="relative mx-auto max-w-[1320px]">
        <h2
          className="font-trading mx-auto max-w-[900px] font-medium leading-none tracking-[-0.035em] text-foreground"
          style={{ fontSize: "clamp(44px, 5.5vw, 76px)" }}
        >
          The book is{" "}
          <span className="italic font-normal text-primary">open.</span>
          <br />
          You're a wallet away.
        </h2>

        <p className="mx-auto mt-5 max-w-[540px] text-[17px] leading-[1.55] text-muted-foreground">
          No signup. No email. No deposit minimum. Connect and trade — or fork the
          contracts and run your own venue.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="default" className="h-12 gap-2 px-6 text-sm font-medium">
            Launch trading app →
          </Button>
          <Button variant="outline" className="h-12 px-6 text-sm font-medium">
            Read the docs
          </Button>
        </div>
      </div>
    </section>
  )
}

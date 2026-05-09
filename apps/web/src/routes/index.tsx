import { createFileRoute } from "@tanstack/react-router"

import "../styles/landing.css"

import { Navbar } from "../ui/Navbar"
import { Hero } from "../ui/landing/hero"
import { Stats } from "../ui/landing/stats"
import { Features } from "../ui/landing/features"
import { Markets } from "../ui/landing/markets"
import { HowItWorks } from "../ui/landing/how-it-works"
import { Infrastructure } from "../ui/landing/infrastructure"
import { FinalCTA } from "../ui/landing/final-cta"
import { Footer } from "../ui/landing/footer"

export const Route = createFileRoute("/")({ component: LandingPage })

function LandingPage() {
  return (
    <div className="font-trading min-h-svh bg-background text-foreground antialiased">
      <Navbar variant="landing" />
      <Hero />
      <Stats />
      <Features />
      <Markets />
      <HowItWorks />
      <Infrastructure />
      <FinalCTA />
      <Footer />
    </div>
  )
}

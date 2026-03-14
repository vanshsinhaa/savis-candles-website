"use client"

import { useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const processSteps = [
  {
    step: "01",
    title: "Sourcing",
    description: "We carefully select the finest natural soy wax and premium fragrance oils from trusted suppliers who share our commitment to sustainability and quality.",
    icon: "🌱",
  },
  {
    step: "02",
    title: "Blending",
    description: "Our master perfumers create unique scent combinations, testing and refining each blend until it reaches the perfect balance of fragrance and throw.",
    icon: "🧪",
  },
  {
    step: "03",
    title: "Hand-Pouring",
    description: "Each candle is carefully hand-poured in small batches at the optimal temperature to ensure even distribution and perfect wax texture.",
    icon: "🕯️",
  },
  {
    step: "04",
    title: "Curing",
    description: "Candles are left to cure for 48 hours, allowing the wax to settle and the fragrance to fully develop for the best possible burn experience.",
    icon: "⏰",
  },
  {
    step: "05",
    title: "Quality Control",
    description: "Every candle undergoes rigorous testing for burn quality, scent throw, and visual perfection before being approved for packaging.",
    icon: "✅",
  },
  {
    step: "06",
    title: "Packaging",
    description: "Finished candles are carefully packaged in eco-friendly materials and shipped with love to bring warmth and joy to your home.",
    icon: "📦",
  },
]

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef)

  return (
    <section ref={sectionRef} className="relative bg-muted/20 py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal-heading mb-10 sm:mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl sm:text-4xl font-light tracking-wide">How It's Made</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Every candle is a labor of love, crafted through our meticulous six-step process.
          </p>
        </div>

        <div className="relative">
          {/* Connection line — desktop only */}
          <div className="absolute left-6 sm:left-8 top-0 h-full w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden lg:block" />

          <div className="space-y-10 sm:space-y-16">
            {processSteps.map((step) => (
              <div key={step.step} className="reveal relative flex items-start gap-4 sm:gap-8">
                {/* Step number and icon */}
                <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-4">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-base sm:text-lg font-medium shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-xl sm:text-3xl">{step.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 sm:pt-2">
                  <h3 className="mb-2 sm:mb-3 font-heading text-xl sm:text-2xl font-light">{step.title}</h3>
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-16 rounded-2xl bg-card p-6 sm:p-8 text-center shadow-sm">
          <h3 className="mb-4 font-heading text-xl sm:text-2xl font-light">From Start to Finish</h3>
          <p className="mb-6 text-sm sm:text-base text-foreground/80 max-w-2xl mx-auto">
            Our entire process takes 5-7 days from sourcing to shipping, ensuring every candle
            meets our high standards for quality, sustainability, and beauty.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Eco-Friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Handcrafted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Small Batch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

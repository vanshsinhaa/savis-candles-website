"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const processSteps = [
  {
    step: "01",
    title: "Sourcing",
    description: "We carefully select the finest natural soy wax and premium fragrance oils from trusted suppliers who share our commitment to sustainability and quality.",
    icon: "🌱"
  },
  {
    step: "02", 
    title: "Blending",
    description: "Our master perfumers create unique scent combinations, testing and refining each blend until it reaches the perfect balance of fragrance and throw.",
    icon: "🧪"
  },
  {
    step: "03",
    title: "Hand-Pouring",
    description: "Each candle is carefully hand-poured in small batches at the optimal temperature to ensure even distribution and perfect wax texture.",
    icon: "🕯️"
  },
  {
    step: "04",
    title: "Curing",
    description: "Candles are left to cure for 48 hours, allowing the wax to settle and the fragrance to fully develop for the best possible burn experience.",
    icon: "⏰"
  },
  {
    step: "05",
    title: "Quality Control",
    description: "Every candle undergoes rigorous testing for burn quality, scent throw, and visual perfection before being approved for packaging.",
    icon: "✅"
  },
  {
    step: "06",
    title: "Packaging",
    description: "Finished candles are carefully packaged in eco-friendly materials and shipped with love to bring warmth and joy to your home.",
    icon: "📦"
  }
]

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const items = gsap.utils.toArray<HTMLElement>(".process-item")

    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
        },
      },
    )
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-muted/20 py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-light tracking-tight">How It's Made</h2>
          <p className="text-lg text-muted-foreground">
            Every candle is a labor of love, crafted through our meticulous six-step process.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden lg:block"></div>
          
          <div className="space-y-16">
            {processSteps.map((step, index) => (
              <div key={step.step} className="process-item relative flex items-start space-x-8">
                {/* Step number and icon */}
                <div className="flex shrink-0 flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-3xl">{step.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="mb-3 text-2xl font-light">{step.title}</h3>
                  <p className="text-foreground/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-card p-8 text-center shadow-sm">
          <h3 className="mb-4 text-2xl font-light">From Start to Finish</h3>
          <p className="mb-6 text-foreground/80 max-w-2xl mx-auto">
            Our entire process takes 5-7 days from sourcing to shipping, ensuring every candle 
            meets our high standards for quality, sustainability, and beauty.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Eco-Friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Handcrafted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>Small Batch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

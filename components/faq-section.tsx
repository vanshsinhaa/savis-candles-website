"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    id: "1",
    question: "What are your candles made from?",
    answer:
      "Our candles are crafted from 100% natural soy wax, premium fragrance oils, and lead-free cotton wicks. Each candle is hand-poured in small batches to ensure the highest quality.",
  },
  {
    id: "2",
    question: "How long do the candles burn?",
    answer:
      "Burn times vary by candle size, ranging from 42 to 55 hours. Each product listing includes specific burn time information. For optimal performance, trim the wick to 1/4 inch before each use.",
  },
  {
    id: "3",
    question: "Do you offer international shipping?",
    answer:
      "Currently, we ship within the United States and Canada. International shipping to select countries will be available soon. Sign up for our newsletter to be notified when we expand.",
  },
  {
    id: "4",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, contact us for a full refund or exchange. Candles must be unused and in original packaging.",
  },
  {
    id: "5",
    question: "Are your candles eco-friendly?",
    answer:
      "Yes! We use sustainable soy wax, recyclable glass containers, and biodegradable packaging materials. Our commitment to the environment extends throughout our entire production process.",
  },
]

interface FaqSectionProps {
  isInteractive?: boolean
}

export function FaqSection({ isInteractive = false }: FaqSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Only run animations if not interactive (for homepage)
    if (!isInteractive) {
      const items = gsap.utils.toArray<HTMLElement>(".faq-item")

      // Slide in from left animation
      gsap.fromTo(
        items,
        { opacity: 0, x: -50 },
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
    }
  }, [isInteractive])

  return (
    <section ref={sectionRef} className="relative bg-background py-24 pb-32">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="mb-16 text-center text-4xl font-light tracking-tight">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="faq-item rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-12 text-foreground/70">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

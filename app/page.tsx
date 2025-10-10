"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HeroSection } from "@/components/hero-section"
import { ProductGridSection } from "@/components/product-grid-section"
import { FaqSection } from "@/components/faq-section"
import { FooterGradient } from "@/components/footer-gradient"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sections = gsap.utils.toArray<HTMLElement>(".scroll-section")

    // Section snapping with ScrollTrigger
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        snap: {
          snapTo: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef}>
      <HeroSection />
      <ProductGridSection />
      <FaqSection />
      <FooterGradient />
    </div>
  )
}

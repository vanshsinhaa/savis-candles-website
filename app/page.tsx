"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HeroSection } from "@/components/hero-section"
import { ProductGridSection } from "@/components/product-grid-section"
import { AboutSection } from "@/components/about-section"
import { FeaturedProductsSection } from "@/components/featured-products-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProcessSection } from "@/components/process-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { FaqSection } from "@/components/faq-section"
import { FooterGradient } from "@/components/footer-gradient"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP completely disabled - just showing normal sections
    console.log("GSAP disabled - showing normal website sections")
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="hero-section">
        <HeroSection />
      </div>
      <div className="about-section">
        <AboutSection />
      </div>
      <div className="featured-products-section">
        <FeaturedProductsSection />
      </div>
      <div className="products-section">
        <ProductGridSection />
      </div>
      <div className="testimonials-section">
        <TestimonialsSection />
      </div>
      <div className="process-section">
        <ProcessSection />
      </div>
      <div className="newsletter-section">
        <NewsletterSection />
      </div>
      <div className="faq-section">
        <FaqSection isInteractive={true} />
      </div>
      <div className="animated-footer">
        <FooterGradient />
      </div>
    </div>
  )
}

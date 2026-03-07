"use client"

import { HeroSection } from "@/components/hero-section"
import { ProductGridSection } from "@/components/product-grid-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProcessSection } from "@/components/process-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { FaqSection } from "@/components/faq-section"
import { FooterGradient } from "@/components/footer-gradient"

export default function HomePage() {
  return (
    <div className="relative">
      <div className="hero-section">
        <HeroSection />
      </div>
      <div className="about-section">
        <AboutSection />
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

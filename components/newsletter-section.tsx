"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const items = gsap.utils.toArray<HTMLElement>(".newsletter-item")

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
        },
      },
    )
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-background py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="newsletter-item rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-12 text-center shadow-sm">
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-4xl font-light tracking-wide">Stay in the Glow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be the first to know about new fragrances, exclusive offers, and behind-the-scenes 
              glimpses into our candle-making process.
            </p>
          </div>

          <div className="mb-8">
            <div className="mx-auto max-w-md">
              <div className="flex rounded-lg border border-border bg-background shadow-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 rounded-l-lg border-0 bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
                <button className="rounded-r-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="newsletter-item grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Exclusive Discounts</span>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Early Access</span>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Behind the Scenes</span>
            </div>
          </div>

          <div className="newsletter-item mt-8 text-xs text-muted-foreground">
            <p>
              Join 5,000+ candle lovers. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

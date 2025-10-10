"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const items = gsap.utils.toArray<HTMLElement>(".about-item")

    gsap.fromTo(
      items,
      { opacity: 0, y: 50 },
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
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left side - Story */}
          <div className="about-item space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-light tracking-tight">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Born from a passion for creating moments of tranquility and warmth.
              </p>
            </div>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                At savis candles, we believe that every home deserves the gentle glow of handcrafted luxury. 
                Founded in 2023, our journey began with a simple vision: to create candles that don't just 
                illuminate spaces, but transform them into sanctuaries of peace and comfort.
              </p>
              
              <p>
                Each candle is meticulously crafted using 100% natural soy wax, premium fragrance oils, 
                and lead-free cotton wicks. Our small-batch approach ensures that every product meets our 
                uncompromising standards for quality, sustainability, and beauty.
              </p>
              
              <p>
                From our studio in San Francisco, we pour our hearts into every candle, knowing that 
                somewhere in the world, someone is creating a moment of joy, relaxation, or connection 
                with the gentle flicker of our flame.
              </p>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-light text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Natural Soy Wax</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Hours Burn Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right side - Values */}
          <div className="about-item space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-light">Our Values</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Sustainability First</h4>
                    <p className="text-sm text-muted-foreground">
                      Eco-friendly materials and sustainable practices in everything we do.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Handcrafted Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      Every candle is carefully hand-poured and inspected for perfection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Community Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Building relationships with our customers and supporting local communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-6">
              <blockquote className="text-lg italic text-foreground/80">
                "Creating candles isn't just our business—it's our way of spreading warmth, 
                one flame at a time."
              </blockquote>
              <cite className="mt-4 block text-sm text-muted-foreground">
                — The savis candles team
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

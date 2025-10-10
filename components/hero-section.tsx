"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    // Fade in animation on load
    gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
  }, [])

  return (
    <section className="scroll-section relative flex h-screen items-center justify-center overflow-hidden bg-background">
      {/* Subtle studio texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center">
        <h1 ref={titleRef} className="text-7xl font-light tracking-tight text-foreground md:text-8xl lg:text-9xl">
          savis candles
        </h1>
        <p className="mt-6 text-lg font-light tracking-wide text-foreground/60">Handcrafted luxury for your space</p>
      </div>
    </section>
  )
}

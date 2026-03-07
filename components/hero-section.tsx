"use client"

import { TextGenerateEffect } from "./text-generate-effect"

export function HeroSection() {

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-background pt-16">
      {/* Subtle studio texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center px-4">
        {/* Main headline — Playfair Display, large, light */}
        <div className="font-heading text-5xl md:text-7xl font-light tracking-wide text-foreground leading-none flex items-baseline justify-center">
          <TextGenerateEffect
            words="savis"
            className="italic"
            filter={true}
            duration={0.6}
            delay={0}
          />
          <TextGenerateEffect
            words="candles"
            className="font-normal ml-4 md:ml-8"
            filter={true}
            duration={0.6}
            delay={0.8}
          />
        </div>

        {/* Subheading — Inter, uppercase, wide tracking, luxury tagline */}
        <p className="hero-animate-sub mt-6 sm:mt-10 font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/50 max-w-xs sm:max-w-sm mx-auto px-2">
          Handcrafted with intention — warmth, tranquility, crafted by hand
        </p>

        {/* Email signup */}
        <div className="hero-animate-cta mt-10 sm:mt-12 max-w-xs sm:max-w-md mx-auto px-2">
          <div className="flex rounded-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-l-full border-0 bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
            <button className="rounded-r-full bg-primary px-4 sm:px-6 py-3 sm:py-4 text-sm font-body font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

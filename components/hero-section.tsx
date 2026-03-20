"use client"

import { TextGenerateEffect } from "./text-generate-effect"

export function HeroSection() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-background pt-16">

      {/* Warm ambient radial glow — amber-tinted, centred behind the headline */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 48%, hsla(36,90%,52%,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Subtle crosshatch texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center px-4">
        {/* Thin decorative rule above headline */}
        <div className="hero-animate-sub mb-8 flex items-center justify-center gap-4">
          <span className="block h-px w-12 bg-foreground/15" />
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-foreground/35">
            Handcrafted · Small Batch · Natural
          </span>
          <span className="block h-px w-12 bg-foreground/15" />
        </div>

        {/* Main headline — Playfair Display */}
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

        {/* Subheading */}
        <p className="hero-animate-sub mt-8 sm:mt-10 font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/45 max-w-xs sm:max-w-sm mx-auto">
          Warmth, tranquility, crafted by hand
        </p>

        {/* Email signup */}
        <div className="hero-animate-cta mt-10 sm:mt-12 max-w-xs sm:max-w-md mx-auto">
          <div className="flex rounded-full border border-border bg-card/70 backdrop-blur-sm shadow-md shadow-amber-900/5">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-l-full border-0 bg-transparent px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0"
            />
            <button className="rounded-r-full bg-foreground px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-body font-medium text-background transition-all hover:bg-foreground/85 hover:shadow-inner active:scale-95">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-3 font-body text-[11px] text-muted-foreground/50 tracking-wide">
            Join 1,000+ candle lovers · No spam, ever
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-animate-cta">
        <span className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/30">Scroll</span>
        <svg
          className="w-4 h-4 text-foreground/25 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

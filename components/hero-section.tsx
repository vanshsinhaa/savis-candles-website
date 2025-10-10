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

      <div className="relative z-10 text-center">
        <div className="text-8xl font-light tracking-tight text-foreground md:text-9xl lg:text-[12rem] leading-none flex items-baseline justify-center">
          <TextGenerateEffect 
            words="savis"
            className="font-serif italic"
            filter={true}
            duration={0.6}
            delay={0}
          />
          <TextGenerateEffect 
            words="candles"
            className="font-sans font-normal ml-8"
            filter={true}
            duration={0.6}
            delay={0.8}
          />
        </div>
        <p className="mt-6 text-lg font-light tracking-wide text-foreground/60 max-w-md mx-auto">
          Handcrafted luxury candles that transform your space into a sanctuary of warmth and tranquility
        </p>
        
        {/* Email signup */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex rounded-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-l-full border-0 bg-transparent px-6 py-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
            <button className="rounded-r-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
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

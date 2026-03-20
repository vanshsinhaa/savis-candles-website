"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

// Container + item variants for staggered entrance
// (SKILL.md: AnimatePresence / motion.div with stagger)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
}

const values = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Sustainability First",
    body: "Eco-friendly materials and sustainable practices in everything we do.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Handcrafted Excellence",
    body: "Every candle is carefully hand-poured and inspected for perfection.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Connection",
    body: "Building relationships with our customers and supporting local communities.",
  },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  // useInView instead of a custom IntersectionObserver hook — cleaner, same result
  const storyVisible  = useInView(storyRef,  { once: true, margin: "-80px" })
  const valuesVisible = useInView(valuesRef, { once: true, margin: "-80px" })

  return (
    <section ref={sectionRef} className="relative bg-background py-16 sm:py-24">
      {/* Warm ambient tint matching the hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 0% 100%, hsla(36,90%,52%,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: Story ── */}
          <motion.div
            ref={storyRef}
            variants={containerVariants}
            initial="hidden"
            animate={storyVisible ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-wide">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Born from a passion for creating moments of tranquility and warmth.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-5 text-foreground/75 leading-relaxed">
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
                From our studio, we pour our hearts into every candle — knowing that somewhere, someone
                is creating a moment of joy, relaxation, or connection with the gentle flicker of our flame.
              </p>
            </motion.div>

            {/* Stats with amber accent */}
            <motion.div variants={containerVariants} className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: "100%", label: "Natural Soy Wax" },
                { value: "50+",  label: "Hours Burn Time" },
                { value: "1k+",  label: "Happy Customers" },
              ].map(stat => (
                <motion.div key={stat.label} variants={statVariants} className="text-center">
                  <div
                    className="text-2xl sm:text-3xl font-light"
                    style={{ color: "hsl(var(--amber))" }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Values ── */}
          <motion.div
            ref={valuesRef}
            variants={containerVariants}
            initial="hidden"
            animate={valuesVisible ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.h3 variants={itemVariants} className="font-heading text-2xl font-light">
              Our Values
            </motion.h3>

            <div className="space-y-5">
              {values.map(v => (
                <motion.div key={v.title} variants={itemVariants} className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "hsla(36,90%,52%,0.1)", color: "hsl(var(--amber))" }}
                  >
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-medium tracking-wide">{v.title}</h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">{v.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pull quote */}
            <motion.div
              variants={itemVariants}
              className="rounded-xl border border-border/60 bg-accent/30 p-6"
            >
              <blockquote className="font-heading text-lg font-light italic text-foreground/80 leading-relaxed">
                &ldquo;Creating candles isn&rsquo;t just our business&mdash;it&rsquo;s our way of spreading
                warmth, one flame at a time.&rdquo;
              </blockquote>
              <cite className="mt-4 block text-sm text-muted-foreground not-italic tracking-wide">
                — The savis candles team
              </cite>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

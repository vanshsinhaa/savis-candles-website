"use client"

import { useEffect, RefObject } from "react"

interface ScrollRevealOptions {
  /** Delay between each revealed element in ms. Default: 80 */
  staggerMs?: number
  /** Intersection threshold (0–1). Default: 0.15 */
  threshold?: number
}

/**
 * Observes all .reveal and .reveal-heading elements inside `ref`.
 * When each enters the viewport, adds the `is-visible` class exactly once.
 * Respects prefers-reduced-motion — does nothing if the user has it set.
 *
 * @param ref      Container element to query within.
 * @param trigger  Re-run the observer when this value changes (e.g. products.length).
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  trigger: unknown = null,
  { staggerMs = 80, threshold = 0.15 }: ScrollRevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect OS-level reduced-motion preference — skip all animations
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const children = Array.from(
      el.querySelectorAll<HTMLElement>(".reveal, .reveal-heading"),
    )
    if (children.length === 0) return

    // Pre-assign stagger delays so each child always gets the correct delay
    // regardless of when its individual IntersectionObserver callback fires
    children.forEach((child, i) => {
      child.dataset.revealDelay = String(i * staggerMs)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          target.style.transitionDelay = `${target.dataset.revealDelay ?? "0"}ms`
          target.classList.add("is-visible")
          observer.unobserve(target) // animate only once
        })
      },
      { threshold },
    )

    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()

  // `ref` is a stable object; `trigger` drives re-subscription on async data load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}

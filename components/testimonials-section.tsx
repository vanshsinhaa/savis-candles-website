"use client"

import { useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "San Francisco, CA",
    rating: 5,
    text: "The Midnight Jasmine candle has become the centerpiece of my evening routine. The scent is absolutely intoxicating and the burn time is incredible. I've already ordered three more!",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    location: "Austin, TX",
    rating: 5,
    text: "As someone who's tried countless candle brands, savis candles truly stand out. The quality is unmatched and the packaging is so elegant. These make perfect gifts!",
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "Portland, OR",
    rating: 5,
    text: "The Ocean Breeze candle transports me to the coast every time I light it. The throw is perfect - not overwhelming but definitely noticeable throughout my entire home.",
  },
  {
    id: 4,
    name: "David Kim",
    location: "Seattle, WA",
    rating: 5,
    text: "I love that these are made with natural soy wax. As someone who's environmentally conscious, it's great to find a brand that aligns with my values without compromising on quality.",
  },
  {
    id: 5,
    name: "Jessica Martinez",
    location: "Los Angeles, CA",
    rating: 5,
    text: "The customer service is phenomenal and the candles are even better. The Warm Vanilla scent is my go-to for creating a cozy atmosphere during movie nights.",
  },
  {
    id: 6,
    name: "Alex Johnson",
    location: "Denver, CO",
    rating: 5,
    text: "These candles have completely transformed my home office. The subtle fragrance helps me focus and the beautiful packaging adds a touch of luxury to my workspace.",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef)

  return (
    <section ref={sectionRef} className="relative bg-background py-24">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Heading block revealed as one unit, 15px rise */}
        <div className="reveal-heading mb-16 text-center">
          <h2 className="mb-4 font-heading text-4xl font-light tracking-wide">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied customers who've made savis candles a part of their daily ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="reveal">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mb-4 text-sm leading-relaxed text-foreground/80">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-muted px-6 py-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium">4.9/5 average rating from 1,200+ customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

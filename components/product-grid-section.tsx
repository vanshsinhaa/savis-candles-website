"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { products, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { QuickViewDrawer } from "@/components/quick-view-drawer"

gsap.registerPlugin(ScrollTrigger)

export function ProductGridSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>(".product-card")

    // Stagger fade-in animation
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
        },
      },
    )
  }, [])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <section ref={sectionRef} className="relative bg-background py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-center text-4xl font-light tracking-tight">Our Collection</h2>

          {/* 4x2 Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "product-item product-card group relative cursor-pointer transition-opacity duration-300",
                  hoveredId && hoveredId !== product.id && "opacity-30",
                )}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium tracking-tight">{product.name}</h3>
                  <p className="mt-1 text-sm text-foreground/60">${product.price}</p>
                </div>

                {/* Spotlight effect on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewDrawer product={selectedProduct} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  )
}

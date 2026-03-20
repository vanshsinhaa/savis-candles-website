"use client"

import { useEffect, useRef, useState } from "react"
import { ProductDisplay, toProductDisplay, Product } from "@/lib/supabase"
import { QuickViewDrawer } from "@/components/quick-view-drawer"
import { ProductCard } from "@/components/product-card"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function ProductGridSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [products, setProducts] = useState<ProductDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductDisplay | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Re-run observer once products load so the freshly-rendered cards are found
  useScrollReveal(sectionRef, products.length)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Only active + featured products appear on the homepage
      const response = await fetch('/api/products?featured=true', { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      const displayProducts = (data.products as Product[])
        .slice(0, 8)
        .map((p: Product) => toProductDisplay(p))
      setProducts(displayProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: ProductDisplay) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <section ref={sectionRef} className="relative bg-background py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="reveal-heading mb-12 sm:mb-16 lg:mb-20 text-center font-heading text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide">
            Our Collection
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-secondary rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-secondary rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                // Wrapper carries the reveal class so ProductCard's dimming opacity is unaffected
                <div key={product.id} className="reveal">
                  <ProductCard
                    product={product}
                    onCardClick={handleProductClick}
                    dimmed={hoveredId !== null && hoveredId !== product.id}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <QuickViewDrawer product={selectedProduct} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  )
}

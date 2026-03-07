"use client"

import { useState, useEffect, useRef } from "react"
import { ProductDisplay, toProductDisplay, Product } from "@/lib/supabase"
import { QuickViewDrawer } from "@/components/quick-view-drawer"
import { ProductCard } from "@/components/product-card"
import { FooterGradient } from "@/components/footer-gradient"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export default function ShopPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductDisplay | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef, products.length)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products.map((p: Product) => toProductDisplay(p)))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: ProductDisplay) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  if (loading) {
    return (
      <main className="bg-background pt-24">
        <div className="container mx-auto px-6 pt-16 pb-24">
          <div className="mb-16 text-center">
            <h1 className="font-heading text-5xl font-light tracking-wide">Shop All Candles</h1>
            <p className="mt-5 font-body text-base text-foreground/60">
              Discover our complete collection of handcrafted luxury candles
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-background pt-24">
        <div className="container mx-auto px-6 pt-16 pb-24">
          <div className="text-center">
            <h1 className="font-heading text-5xl font-light tracking-wide mb-8">Shop All Candles</h1>
            <div className="max-w-md mx-auto">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
                <p className="font-body text-destructive">{error}</p>
              </div>
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-body"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (products.length === 0) {
    return (
      <main className="bg-background pt-24">
        <div className="container mx-auto px-6 pt-16 pb-24 text-center">
          <h1 className="font-heading text-5xl font-light tracking-wide mb-8">Shop All Candles</h1>
          <p className="font-body text-lg text-foreground/60">No products available at the moment.</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="bg-background pt-24">
        <div ref={gridRef} className="container mx-auto px-6 pt-16 pb-24">
          <div className="reveal-heading mb-16 text-center">
            <h1 className="font-heading text-5xl font-light tracking-wide">Shop All Candles</h1>
            <p className="mt-5 font-body text-base text-foreground/60">
              Discover our complete collection of handcrafted luxury candles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
        </div>

        <FooterGradient />
      </main>

      <QuickViewDrawer product={selectedProduct} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { products, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { QuickViewDrawer } from "@/components/quick-view-drawer"
import { FooterGradient } from "@/components/footer-gradient"

export default function ShopPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-6 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-light tracking-tight">Shop All Candles</h1>
            <p className="mt-4 text-lg text-foreground/60">
              Discover our complete collection of handcrafted luxury candles
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "group relative cursor-pointer transition-opacity duration-300",
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

        <FooterGradient />
      </main>

      <QuickViewDrawer product={selectedProduct} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Check } from "lucide-react"
import type { ProductDisplay } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"

interface QuickViewDrawerProps {
  product: ProductDisplay | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewDrawer({ product, open, onOpenChange }: QuickViewDrawerProps) {
  const { addItem } = useCart()
  const [added, setAdded]           = useState(false)
  const [bouncing, setBouncing]     = useState(false)
  const [showGhost, setShowGhost]   = useState(false)

  // Reset button state when product changes or drawer closes
  useEffect(() => {
    if (!open) {
      setAdded(false)
      setBouncing(false)
      setShowGhost(false)
    }
  }, [open, product])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!product) return null

  const handleAddToCart = () => {
    if (product.soldOut || added) return

    addItem({
      id:          product.id,
      name:        product.name,
      price:       product.price,
      image:       product.image ?? "/placeholder.svg",
      description: product.description ?? "",
    })

    // Bounce animation
    setBouncing(true)
    setTimeout(() => setBouncing(false), 350)

    // Ghost float
    setShowGhost(true)
    setTimeout(() => setShowGhost(false), 700)

    // Checkmark for 1.2 s
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full bg-background shadow-2xl transition-transform duration-500 ease-out sm:w-[500px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-body text-lg font-medium">Quick View</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 transition-colors hover:bg-secondary"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
              <Image
                src={product.image ?? "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-heading text-2xl font-normal tracking-tight">{product.name}</h3>
                  {product.soldOut && (
                    <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-body font-medium text-white">
                      Sold Out
                    </span>
                  )}
                  {!product.soldOut && product.stockQuantity > 0 && product.reorderLevel > 0 && product.stockQuantity <= product.reorderLevel && (
                    <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-body font-medium text-white">
                      Low Stock
                    </span>
                  )}
                </div>
                <p className="mt-2 font-body text-xl font-light text-foreground/80">
                  {product.price > 0 ? `$${product.price}` : "—"}
                </p>
              </div>

              {product.description && (
                <div>
                  <p className="font-body text-foreground/70">{product.description}</p>
                </div>
              )}

              <div className="space-y-3 border-t border-border pt-6">
                {product.burnTime && (
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-foreground/60">Burn Time</span>
                    <span className="font-body font-medium">{product.burnTime}</span>
                  </div>
                )}
                {product.scent && (
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-foreground/60">Scent Notes</span>
                    <span className="font-body font-medium">{product.scent}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-foreground/60">Weight</span>
                    <span className="font-body font-medium">{product.weight}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-foreground/60">Size</span>
                    <span className="font-body font-medium">{product.size}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="font-body text-foreground/60">Category</span>
                  <span className="font-body font-medium">{product.category}</span>
                </div>
              </div>

              {/* ── Add to Cart button with micro-interactions ── */}
              <div className="relative">
                {/* Ghost — floats upward toward cart icon on click */}
                {showGhost && (
                  <span
                    className="pointer-events-none absolute bottom-full left-1/2 h-5 w-5 rounded-full bg-foreground/20 blur-sm"
                    style={{ animation: "ghostFloat 0.7s ease-out forwards" }}
                    aria-hidden="true"
                  />
                )}

                <button
                  disabled={product.soldOut}
                  onClick={handleAddToCart}
                  className={cn(
                    // base
                    "w-full flex items-center justify-center gap-2 rounded-md py-3 font-body text-sm font-medium transition-colors",
                    // colours
                    product.soldOut
                      ? "cursor-not-allowed bg-foreground/10 text-foreground/30"
                      : added
                      ? "bg-green-600 text-white"
                      : "bg-foreground text-background hover:bg-foreground/80",
                  )}
                  style={
                    bouncing
                      ? { animation: "buttonBounce 0.35s ease-out" }
                      : undefined
                  }
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                      Added to cart
                    </>
                  ) : product.soldOut ? (
                    "Sold Out"
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface QuickViewDrawerProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewDrawer({ product, open, onOpenChange }: QuickViewDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!product) return null

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
            <h2 className="text-lg font-medium">Quick View</h2>
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
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>

            {/* Product Details */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-2xl font-medium tracking-tight">{product.name}</h3>
                <p className="mt-2 text-xl font-light text-foreground/80">${product.price}</p>
              </div>

              <div>
                <p className="text-foreground/70">{product.description}</p>
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Burn Time</span>
                  <span className="font-medium">{product.burnTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Scent Notes</span>
                  <span className="font-medium">{product.scent}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full" size="lg">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useState, useCallback } from "react"
import { Check, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string | null
    description: string | null
  }
  soldOut: boolean
}

export function AddToCartButton({ product, soldOut }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded]         = useState(false)
  const [bouncing, setBouncing]   = useState(false)
  const [showGhost, setShowGhost] = useState(false)

  const handleAdd = useCallback(() => {
    if (soldOut || added) return

    addItem({
      id:          product.id,
      name:        product.name,
      price:       product.price,
      image:       product.image ?? "/placeholder.svg",
      description: product.description ?? "",
    })

    setBouncing(true)
    setTimeout(() => setBouncing(false), 350)

    setShowGhost(true)
    setTimeout(() => setShowGhost(false), 700)

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }, [product, soldOut, added, addItem])

  return (
    <div className="relative">
      {showGhost && (
        <span
          className="pointer-events-none absolute bottom-full left-1/2 h-5 w-5 rounded-full bg-foreground/20 blur-sm"
          style={{ animation: "ghostFloat 0.7s ease-out forwards" }}
          aria-hidden="true"
        />
      )}
      <button
        disabled={soldOut}
        onClick={handleAdd}
        style={bouncing ? { animation: "buttonBounce 0.35s ease-out" } : undefined}
        className={cn(
          "w-full flex items-center justify-center gap-2.5 rounded-full py-4 font-body text-sm font-medium tracking-wide transition-all duration-200",
          soldOut
            ? "cursor-not-allowed bg-foreground/10 text-foreground/30"
            : added
            ? "bg-green-600 text-white"
            : "bg-foreground text-background hover:bg-foreground/85 active:scale-[0.98]",
        )}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Added to cart
          </>
        ) : soldOut ? (
          "Sold Out"
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}

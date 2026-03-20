"use client"

import { useState, useCallback, memo } from "react"
import Image from "next/image"
import { Check, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import type { ProductDisplay } from "@/lib/supabase"

interface ProductCardProps {
  product: ProductDisplay
  onCardClick: (product: ProductDisplay) => void
  dimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  /** Extra class applied to the outermost wrapper — e.g. GSAP class names */
  className?: string
}

/**
 * Derive up to 3 pills from available product data.
 * If scent is populated (old products), use Top/Heart/Base.
 * Otherwise fall back to Type/Size from category + weight.
 */
function getScentPills(product: ProductDisplay): Array<{ label: string; value: string }> {
  if (product.scent && product.scent.trim()) {
    const notes = product.scent.split(",").map((s) => s.trim()).filter(Boolean)
    const labels = ["Top", "Heart", "Base"]
    return notes.slice(0, 3).map((note, i) => ({ label: labels[i], value: note }))
  }
  const pills: Array<{ label: string; value: string }> = []
  if (product.category) pills.push({ label: "Type", value: product.category })
  if (product.weight)   pills.push({ label: "Size", value: product.weight })
  if (product.sku)      pills.push({ label: "SKU",  value: product.sku })
  return pills.slice(0, 3)
}

// React.memo prevents re-renders when parent updates but props haven't changed
// (SKILL.md: "React.memo for pure components")
export const ProductCard = memo(function ProductCard({
  product,
  onCardClick,
  dimmed,
  onMouseEnter,
  onMouseLeave,
  className,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [addedState, setAddedState] = useState<"idle" | "added">("idle")

  const img  = product.image || "/placeholder.svg"
  const pills = getScentPills(product)

  // useCallback so the function reference is stable across re-renders
  // (SKILL.md: "useCallback for functions passed to children")
  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.soldOut || addedState === "added") return

    addItem({
      id:          product.id,
      name:        product.name,
      price:       product.price,
      image:       img,
      description: product.description ?? "",
    })

    setAddedState("added")
    setTimeout(() => setAddedState("idle"), 1000)
  }, [product, addedState, addItem, img])

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-opacity duration-300",
        dimmed && "opacity-30",
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onCardClick(product)}
    >
      {/* ── Image container ─────────────────────────────────────────
          overflow-hidden clips the reveal panel until it slides up  */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">

        {/* Primary image — always visible, subtle scale on hover */}
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover layer — same image + warm amber wash, crossfades in 400ms */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100 pointer-events-none">
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-amber-700/10 to-transparent" />
        </div>

        {/* Stock badges */}
        {product.soldOut && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-500 px-2 py-1 text-xs font-body font-medium text-white">
            Sold Out
          </span>
        )}
        {!product.soldOut &&
          product.stockQuantity > 0 &&
          product.reorderLevel > 0 &&
          product.stockQuantity <= product.reorderLevel && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-yellow-500 px-2 py-1 text-xs font-body font-medium text-white">
              Low Stock
            </span>
          )}

        {/* ── Hover reveal panel ──────────────────────────────────────
            Starts below the card (translate-y-full, clipped by overflow-hidden).
            Slides up to translate-y-0 on group-hover in 300ms.             */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()} // clicks on panel don't open drawer
        >
          <div className="bg-white/88 backdrop-blur-md px-4 pt-3 pb-4 space-y-3">

            {/* Scent / attribute pills */}
            {pills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white/70 px-2.5 py-0.5"
                  >
                    <span className="font-body text-[10px] uppercase tracking-wider text-foreground/40">
                      {pill.label}
                    </span>
                    <span className="font-body text-[10px] text-foreground/70">
                      {pill.value}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Add button */}
            <button
              onClick={handleQuickAdd}
              disabled={product.soldOut}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-md py-2 text-xs font-body font-medium transition-colors duration-200",
                product.soldOut
                  ? "cursor-not-allowed bg-foreground/10 text-foreground/30"
                  : addedState === "added"
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-background hover:bg-foreground/80",
              )}
            >
              {addedState === "added" ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {product.soldOut ? "Sold Out" : "Quick Add"}
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ── Name + Price below image ──────────────────────────────── */}
      <div className="mt-4 sm:mt-5 text-center px-1">
        <h3 className="font-heading text-base sm:text-lg font-light tracking-wide leading-snug group-hover:text-foreground/70 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="mt-1.5 font-body text-sm tracking-widest text-foreground/50">
          {product.price > 0 ? `$${product.price.toFixed(2)}` : "—"}
        </p>
      </div>
    </div>
  )
})

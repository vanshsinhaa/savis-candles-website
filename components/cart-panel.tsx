"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"

const FREE_SHIPPING_THRESHOLD = 75

interface CartPanelProps {
  open: boolean
  onClose: () => void
}

export function CartPanel({ open, onClose }: CartPanelProps) {
  const { state, removeItem, updateQuantity } = useCart()

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - state.total)
  const progress  = Math.min(100, (state.total / FREE_SHIPPING_THRESHOLD) * 100)
  const isFree    = state.total >= FREE_SHIPPING_THRESHOLD

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        style={{ backdropFilter: open ? "blur(8px)" : "none" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Slide-out panel ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl sm:w-[420px]",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)" }}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-heading text-xl font-normal tracking-tight">Your Cart</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Free shipping progress bar ────────────────────────────────── */}
        <div className="border-b border-border px-6 py-4">
          <p className="mb-2 font-body text-xs text-foreground/60">
            {isFree
              ? "You've unlocked free shipping! 🎉"
              : `You're $${remaining.toFixed(2)} away from free shipping`}
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: isFree
                  ? "linear-gradient(90deg, #b45309, #d97706, #f59e0b, #fbbf24)"
                  : "linear-gradient(90deg, #d97706, #f59e0b)",
              }}
            />
          </div>
        </div>

        {/* ── Scrollable items area ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center gap-5 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-4xl">
                🕯️
              </div>
              <div>
                <p className="font-heading text-lg font-normal text-foreground/80">
                  Your cart is empty
                </p>
                <p className="mt-1 font-body text-sm text-foreground/50">
                  — light something up ✨
                </p>
              </div>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-2 rounded-md bg-foreground px-6 py-2.5 font-body text-sm font-medium text-background transition-colors hover:bg-foreground/80"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            /* Item list — keyed on open so items re-animate each time panel opens */
            <ul key={String(open)} className="space-y-4">
              {state.items.map((item, i) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-border p-3"
                  style={{
                    animation: "cartItemIn 0.3s ease-out both",
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="font-heading text-sm font-normal leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-sm text-foreground/60">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity + remove */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-body text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/30 transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="flex-shrink-0 font-body text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        {state.items.length > 0 && (
          <div className="border-t border-border px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-foreground/60">
                Subtotal ({state.items.length} {state.items.length === 1 ? "item" : "items"})
              </span>
              <span className="font-body text-base font-medium">
                ${state.total.toFixed(2)}
              </span>
            </div>
            {isFree && (
              <div className="flex items-center justify-between text-xs font-body text-amber-600">
                <span>Free shipping</span>
                <span>$0.00</span>
              </div>
            )}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-md bg-foreground py-3 text-center font-body text-sm font-medium text-background transition-colors hover:bg-foreground/80"
            >
              Checkout → ${state.total.toFixed(2)}
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center font-body text-xs text-foreground/40 transition-colors hover:text-foreground/60"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}

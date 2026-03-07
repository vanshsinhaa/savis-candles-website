"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useCart } from "@/hooks/use-cart"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id?: string
    text: string
    image: string
    price?: string
    description?: string
  } | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (!modalRef.current) return

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      )
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
      })
    }
  }, [isOpen])

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="aspect-square rounded-xl bg-muted overflow-hidden">
            <img
              src={product.image}
              alt={product.text}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-light">{product.text}</h3>
              <p className="text-3xl font-light text-primary mt-2">
                {product.price || "$48"}
              </p>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {product.description || "A beautifully crafted candle that brings warmth and ambiance to any space."}
            </p>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>55+ Hours Burn</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Natural Soy Wax</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Lead-Free Wick</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Handcrafted</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => {
                if (product) {
                  const price = parseFloat(product.price?.replace('$', '') || '48')
                  addItem({
                    id: product.id || '1',
                    name: product.text,
                    price: price,
                    image: product.image,
                    description: product.description || '',
                  })
                  onClose()
                }
              }}
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

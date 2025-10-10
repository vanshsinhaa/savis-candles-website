"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CircularGallery } from "@/components/ui/circular-gallery"
import { ProductModal } from "@/components/product-modal"

gsap.registerPlugin(ScrollTrigger)

const featuredProducts = [
  {
    id: "1",
    name: "Midnight Jasmine",
    description: "A sensual blend of jasmine, vanilla, and sandalwood",
    price: "$48",
    image: "/PHOTO-2025-10-09-13-31-36 (1).jpg",
    category: "Signature Collection",
    burnTime: "55 hours",
    size: "12oz"
  },
  {
    id: "2",
    name: "Ocean Breeze",
    description: "Fresh sea salt, eucalyptus, and citrus notes",
    price: "$42",
    image: "/PHOTO-2025-10-09-13-31-36 (2).jpg",
    category: "Seasonal",
    burnTime: "50 hours",
    size: "10oz"
  },
  {
    id: "3",
    name: "Warm Vanilla",
    description: "Rich vanilla bean with hints of caramel and cream",
    price: "$38",
    image: "/PHOTO-2025-10-09-13-31-36 (3).jpg",
    category: "Classic",
    burnTime: "45 hours",
    size: "8oz"
  },
  {
    id: "4",
    name: "Lavender Dreams",
    description: "Soothing lavender with subtle herbal undertones",
    price: "$45",
    image: "/PHOTO-2025-10-09-13-31-36 (4).jpg",
    category: "Relaxation",
    burnTime: "48 hours",
    size: "10oz"
  },
  {
    id: "5",
    name: "Sandalwood Serenity",
    description: "Exotic sandalwood with warm amber notes",
    price: "$52",
    image: "/PHOTO-2025-10-09-13-31-36 (5).jpg",
    category: "Premium",
    burnTime: "60 hours",
    size: "14oz"
  },
  {
    id: "6",
    name: "Rose Garden",
    description: "Delicate rose petals with green leaf accents",
    price: "$48",
    image: "/PHOTO-2025-10-09-13-31-36 (6).jpg",
    category: "Floral",
    burnTime: "55 hours",
    size: "12oz"
  }
]

export function FeaturedProductsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const items = gsap.utils.toArray<HTMLElement>(".section-item")

    gsap.fromTo(
      items,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
        },
      },
    )
  }, [])

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  // Convert products to gallery format
  const galleryItems = featuredProducts.map(product => ({
    image: product.image,
    text: product.name,
    id: product.id,
    price: product.price,
    description: product.description
  }))

  return (
    <section ref={sectionRef} className="relative bg-muted/30 py-24">
      <div className="container mx-auto max-w-full px-6">
        <div className="mb-16 text-center section-item">
          <h2 className="mb-4 text-4xl font-light tracking-tight">Featured Collection</h2>
          <p className="text-lg text-muted-foreground">
            Discover our most beloved candles, each one a masterpiece of fragrance and craftsmanship.
          </p>
        </div>

        {/* Wide Circular Gallery */}
        <div className="section-item w-full h-[80vh] max-w-none">
          <CircularGallery 
            items={galleryItems}
            bend={3}
            textColor="#000000"
            borderRadius={0.05}
            font="bold 24px 'Space Grotesk', sans-serif"
            onItemClick={handleProductClick}
            showArrows={true}
          />
        </div>

        {/* Collection CTA */}
        <div className="mt-16 text-center section-item">
          <p className="text-sm text-muted-foreground mb-6">Click on any candle to explore details and add to cart</p>
          <button className="rounded-lg border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-muted">
            View All Products
          </button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </section>
  )
}

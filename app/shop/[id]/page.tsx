import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Flame, Clock, Package2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AddToCartButton } from "./add-to-cart-button"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

// Fetch once per request — ISR-compatible
async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, sku, category, weight, selling_price, price, stock_quantity, reorder_level, image, description, burn_time, scent, size, is_active, is_featured"
    )
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} — savis candles`,
    description: product.description ?? "Handcrafted luxury candles",
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const price      = product.selling_price ?? product.price
  const soldOut    = product.stock_quantity === 0
  const lowStock   = !soldOut && product.stock_quantity <= (product.reorder_level ?? 5)
  const img        = product.image ?? "/placeholder.svg"

  const details = [
    product.burn_time  && { icon: <Clock className="h-4 w-4"   />, label: "Burn Time",   value: product.burn_time },
    product.scent      && { icon: <Flame className="h-4 w-4"   />, label: "Scent Notes",  value: product.scent },
    product.weight     && { icon: <Package2 className="h-4 w-4" />, label: "Weight",       value: product.weight },
    product.size       && { icon: <Package2 className="h-4 w-4" />, label: "Size",         value: product.size },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[]

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pb-24">

        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Image ── */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={img}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {soldOut && (
              <span className="absolute left-4 top-4 rounded-md bg-red-500 px-2.5 py-1 text-xs font-body font-medium text-white">
                Sold Out
              </span>
            )}
            {lowStock && (
              <span className="absolute left-4 top-4 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-body font-medium text-white">
                Low Stock
              </span>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col gap-6 lg:pt-2">

            {/* Category + SKU */}
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-border bg-accent/40 px-3 py-1 font-body text-xs uppercase tracking-widest text-muted-foreground">
                {product.category}
              </span>
              {product.sku && (
                <span className="font-body text-xs text-muted-foreground/60">
                  SKU: {product.sku}
                </span>
              )}
              {product.is_featured && (
                <span className="rounded-full bg-amber-100 px-3 py-1 font-body text-xs text-amber-700 tracking-wide">
                  Featured
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-heading text-3xl sm:text-4xl font-light tracking-wide leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <p className="font-body text-2xl font-light tracking-widest text-foreground/80">
              {price > 0 ? `$${price.toFixed(2)}` : "—"}
            </p>

            {/* Description */}
            {product.description && (
              <p className="font-body text-foreground/65 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product details grid */}
            {details.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-secondary/40 divide-y divide-border/40">
                {details.map(d => (
                  <div key={d.label} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      {d.icon}
                      <span className="font-body text-sm">{d.label}</span>
                    </div>
                    <span className="font-body text-sm font-medium text-foreground/80">{d.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  soldOut ? "bg-red-400" : lowStock ? "bg-amber-400" : "bg-green-400"
                }`}
              />
              <span className="font-body text-sm text-muted-foreground">
                {soldOut
                  ? "Out of stock"
                  : lowStock
                  ? `Only ${product.stock_quantity} left`
                  : "In stock"}
              </span>
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id:          product.id,
                name:        product.name,
                price,
                image:       product.image,
                description: product.description,
              }}
              soldOut={soldOut}
            />

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-1">
              {[
                "100% Natural Soy Wax",
                "Lead-Free Cotton Wick",
                "Hand-Poured",
              ].map(badge => (
                <span key={badge} className="font-body text-xs text-muted-foreground/60 flex items-center gap-1.5">
                  <span className="text-amber-500">✦</span>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
// Product interface matching Supabase schema
export interface Product {
  id: string
  name: string
  sku: string | null
  category: string
  weight: string | null
  // cost_price is intentionally omitted — never returned by the public API
  selling_price: number | null
  price: number          // legacy column kept for frontend compatibility (equals selling_price)
  profit: number | null
  image: string | null
  description: string | null
  burn_time: string | null
  scent: string | null
  size: string | null
  stock_quantity: number
  reorder_level: number
  supplier_name: string | null
  is_featured: boolean
  is_active: boolean
  notes: string | null
  last_restock_date: string | null
  created_at: string
}

// Client-friendly Product type with camelCase for backwards compatibility
export interface ProductDisplay {
  id: string
  name: string
  sku: string | null
  price: number
  sellingPrice: number | null
  image: string | null
  description: string | null
  burnTime: string | null
  scent: string | null
  category: string
  size: string | null
  weight: string | null
  stockQuantity: number
  reorderLevel: number
  supplierName: string | null
  isFeatured: boolean
  isActive: boolean
  soldOut: boolean
}

// Helper to convert database product to display format
export function toProductDisplay(product: Product): ProductDisplay {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    sellingPrice: product.selling_price,
    image: product.image,
    description: product.description,
    burnTime: product.burn_time,
    scent: product.scent,
    category: product.category,
    size: product.size,
    weight: product.weight,
    stockQuantity: product.stock_quantity,
    reorderLevel: product.reorder_level,
    supplierName: product.supplier_name,
    isFeatured: product.is_featured,
    isActive: product.is_active,
    soldOut: product.stock_quantity === 0,
  }
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  total_amount: number
  currency: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  stripe_payment_intent_id: string
  shipping_address: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  burn_time: string
  scent: string
  category: string
  size: string
  stock_quantity: number
  is_featured: boolean
  created_at: string
  updated_at: string
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

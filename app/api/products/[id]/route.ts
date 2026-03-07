import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // cost_price is excluded — private business info, never sent to the public
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, sku, category, weight, selling_price, price, profit, stock_quantity, reorder_level, supplier_name, is_featured, is_active, created_at, image, description, burn_time, scent, size, notes, last_restock_date')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in product GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

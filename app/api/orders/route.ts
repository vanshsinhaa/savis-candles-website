import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    // If no session and no email provided, return unauthorized
    if (!session && !email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            image,
            description
          )
        )
      `)
      .order('created_at', { ascending: false })

    // If user is authenticated, filter by their email
    if (session?.user?.email) {
      query = query.eq('customer_email', session.user.email)
    } 
    // If email is provided (for guest users), filter by email
    else if (email) {
      query = query.eq('customer_email', email)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

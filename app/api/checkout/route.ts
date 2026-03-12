import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { formatAmountForStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        error: 'Payment system not configured. Please set up Stripe keys.'
      }, { status: 503 })
    }

    const body = await request.json()
    const { items, customerEmail, customerName, shippingAddress } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // ── Stock validation — check BEFORE creating the order ───────────────────
    const requestedNames = items.map((item: any) => item.name)
    const { data: stockData, error: stockError } = await supabaseAdmin
      .from('products')
      .select('name, stock_quantity')
      .in('name', requestedNames)

    if (stockError) {
      console.error('Error checking product stock:', stockError)
      return NextResponse.json({ error: 'Failed to verify product availability' }, { status: 500 })
    }

    for (const item of items) {
      const product = stockData?.find((p: any) => p.name === item.name)
      if (!product) {
        return NextResponse.json(
          { error: `"${item.name}" is no longer available` },
          { status: 400 }
        )
      }
      if (product.stock_quantity === 0) {
        return NextResponse.json(
          { error: `Sorry, ${item.name} is sold out` },
          { status: 400 }
        )
      }
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Sorry, ${item.name} only has ${product.stock_quantity} left in stock` },
          { status: 400 }
        )
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Create order in database first
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            customer_email: customerEmail,
            customer_name: customerName,
            total_amount: totalAmount,
            currency: 'USD',
            status: 'pending',
            shipping_address: shippingAddress,
            // Note: user_id removed since we're using JWT strategy
            // Orders will be linked by email address instead
          })
          .select()
          .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Get product UUIDs from database based on names
    const productNames = items.map((item: any) => item.name)
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .in('name', productNames)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Create order items with correct product UUIDs
    const orderItems = items.map((item: any) => {
      const product = products?.find(p => p.name === item.name)
      return {
        order_id: order.id,
        product_id: product?.id,
        quantity: item.quantity,
        price: item.price,
      }
    }).filter(item => item.product_id) // Remove items where product wasn't found

    if (orderItems.length === 0) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Clean up the order if items creation fails
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
            // Temporarily skip images to get checkout working
            // images: [item.image.startsWith('http') ? item.image : `${request.nextUrl.origin}${item.image}`],
          },
          unit_amount: formatAmountForStripe(item.price, 'usd'),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        order_id: order.id,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    })

    return NextResponse.json({ 
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order.id 
    })
  } catch (error: any) {
    console.error('Error in checkout API:', error?.message ?? error)
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status: 500 })
  }
}

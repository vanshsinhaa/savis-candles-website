import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (!orderId) {
          console.warn('checkout.session.completed received with no order_id in metadata')
          break
        }

        // 1. Mark order as paid
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', orderId)

        if (orderError) {
          console.error(`Error updating order ${orderId} to paid:`, orderError)
        } else {
          console.log(`Order ${orderId} marked as paid`)
        }

        // 2. Fetch all items for this order
        const { data: orderItems, error: itemsError } = await supabaseAdmin
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId)

        if (itemsError) {
          console.error(`Error fetching order_items for order ${orderId}:`, itemsError)
          break
        }

        // 3. Decrement stock for each purchased item
        for (const item of orderItems ?? []) {
          const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('name, sku, stock_quantity, reorder_level')
            .eq('id', item.product_id)
            .single()

          if (productError || !product) {
            console.error(`Could not fetch product ${item.product_id} for stock update:`, productError)
            continue
          }

          const newStock = Math.max(0, product.stock_quantity - item.quantity)

          const { error: stockError } = await supabaseAdmin
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_id)

          if (stockError) {
            console.error(`Failed to decrement stock for "${product.name}":`, stockError)
            continue
          }

          console.log(
            `Stock updated: "${product.name}" (${product.sku ?? 'no SKU'}) — ${product.stock_quantity} → ${newStock}`
          )

          // 4. Warn if at or below reorder level
          if (product.reorder_level > 0 && newStock <= product.reorder_level) {
            console.warn(
              `⚠️  LOW STOCK ALERT: "${product.name}" (${product.sku ?? 'no SKU'}) now has ${newStock} unit(s) — reorder level is ${product.reorder_level}`
            )
            // TODO: Send low-stock email alert to admin
            // Integrate with Resend or SendGrid here, e.g.:
            // await sendLowStockEmail({ productName: product.name, sku: product.sku, stock: newStock, reorderLevel: product.reorder_level })
          }
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId)

          if (error) {
            console.error('Error updating order status to cancelled:', error)
          } else {
            console.log(`Order ${orderId} marked as cancelled`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

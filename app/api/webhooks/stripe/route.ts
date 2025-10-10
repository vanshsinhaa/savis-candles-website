import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
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

        if (orderId) {
          // Update order status to paid
          const { error } = await supabase
            .from('orders')
            .update({
              status: 'paid',
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', orderId)

          if (error) {
            console.error('Error updating order status:', error)
          } else {
            console.log(`Order ${orderId} marked as paid`)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          // Update order status to cancelled
          const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId)

          if (error) {
            console.error('Error updating order status:', error)
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

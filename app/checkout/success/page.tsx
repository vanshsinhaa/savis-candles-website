'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      // Clear cart on successful payment
      clearCart()
    }
  }, [searchParams, clearCart])

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-light mb-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {sessionId && (
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-2">Order Details</h2>
            <p className="text-sm text-muted-foreground">
              Session ID: {sessionId}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You will receive an email confirmation shortly with your order details.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Your handcrafted candles will be carefully packaged and shipped to you within 3-5 business days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/dashboard">View My Orders</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/shop">Continue Shopping</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

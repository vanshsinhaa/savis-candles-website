'use client'

import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <div className="mb-8">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-light mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-2">What happened?</h2>
          <p className="text-sm text-muted-foreground">
            You can cancel your payment at any time during the checkout process. 
            Your cart has been preserved, so you can easily try again.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Ready to complete your purchase? Your items are still waiting for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/checkout">Try Again</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/shop">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

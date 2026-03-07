'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'

export default function CheckoutPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  })

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in your name and email')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          shippingAddress: customerInfo.address,
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        alert('Checkout failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl font-light tracking-wide mb-8">Your Cart is Empty</h1>
          <p className="font-body text-lg text-muted-foreground mb-8">
            Discover our beautiful collection of handcrafted candles
          </p>
          <Button asChild>
            <a href="/shop">Continue Shopping</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-heading text-4xl font-light tracking-wide mb-16 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Information */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-normal">Customer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                <input
                  type="text"
                  value={customerInfo.address.line1}
                  onChange={(e) => setCustomerInfo(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={customerInfo.address.line2}
                  onChange={(e) => setCustomerInfo(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line2: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={customerInfo.address.city}
                    onChange={(e) => setCustomerInfo(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={customerInfo.address.state}
                    onChange={(e) => setCustomerInfo(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  value={customerInfo.address.postal_code}
                  onChange={(e) => setCustomerInfo(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, postal_code: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-2xl font-normal">Order Summary</h2>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between text-lg font-medium">
                <span>Total ({state.itemCount} items)</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Processing...' : `Pay $${state.total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

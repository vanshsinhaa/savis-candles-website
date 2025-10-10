"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  customer_email: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: string | {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  stripe_payment_intent_id?: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    name: string
    image: string
    description: string
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user?.email) {
      fetchOrders()
    }
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?email=${session?.user?.email}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name}! Here are your recent orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => router.push('/')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8)}
                      </CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Order Details</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Total:</strong> ${order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Email:</strong> {order.customer_email}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-muted-foreground">
                          {typeof order.shipping_address === 'string' ? (
                            <p>{order.shipping_address}</p>
                          ) : (
                            <div>
                              {order.shipping_address?.line1 && <p>{order.shipping_address.line1}</p>}
                              {order.shipping_address?.line2 && <p>{order.shipping_address.line2}</p>}
                              {order.shipping_address?.city && order.shipping_address?.state && (
                                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                              )}
                              {order.shipping_address?.postal_code && <p>{order.shipping_address.postal_code}</p>}
                              {order.shipping_address?.country && <p>{order.shipping_address.country}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                            <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                              <img 
                                src={item.products.image} 
                                alt={item.products.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.products.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

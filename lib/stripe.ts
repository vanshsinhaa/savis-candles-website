import Stripe from 'stripe'

// Temporarily allow missing Stripe key for testing
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set - payment features will be disabled')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16',
})

export const formatAmountForStripe = (amount: number, currency: string): number => {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency: boolean = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number, currency: string): number => {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(100)
  let zeroDecimalCurrency: boolean = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : amount / 100
}

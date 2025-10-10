export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  burnTime: string
  scent: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Midnight Bloom",
    price: 42,
    image: "/luxury-black-candle-in-glass-jar-on-white-backgrou.jpg",
    description: "A sophisticated blend of jasmine and sandalwood",
    burnTime: "50 hours",
    scent: "Jasmine, Sandalwood, Vanilla",
  },
  {
    id: "2",
    name: "Coastal Breeze",
    price: 38,
    image: "/luxury-white-candle-in-glass-jar-on-white-backgrou.jpg",
    description: "Fresh ocean air with hints of sea salt and driftwood",
    burnTime: "45 hours",
    scent: "Sea Salt, Driftwood, Citrus",
  },
  {
    id: "3",
    name: "Forest Whisper",
    price: 45,
    image: "/luxury-green-candle-in-glass-jar-on-white-backgrou.jpg",
    description: "Earthy notes of pine, cedar, and moss",
    burnTime: "55 hours",
    scent: "Pine, Cedar, Moss",
  },
  {
    id: "4",
    name: "Golden Hour",
    price: 40,
    image: "/luxury-amber-candle-in-glass-jar-on-white-backgrou.jpg",
    description: "Warm amber and honey with a touch of vanilla",
    burnTime: "48 hours",
    scent: "Amber, Honey, Vanilla",
  },
  {
    id: "5",
    name: "Lavender Dreams",
    price: 36,
    image: "/luxury-purple-candle-in-glass-jar-on-white-backgro.jpg",
    description: "Calming lavender with chamomile and bergamot",
    burnTime: "42 hours",
    scent: "Lavender, Chamomile, Bergamot",
  },
  {
    id: "6",
    name: "Spiced Ember",
    price: 44,
    image: "/luxury-red-candle-in-glass-jar-on-white-background.jpg",
    description: "Rich cinnamon, clove, and warm cardamom",
    burnTime: "52 hours",
    scent: "Cinnamon, Clove, Cardamom",
  },
  {
    id: "7",
    name: "Citrus Grove",
    price: 39,
    image: "/luxury-yellow-candle-in-glass-jar-on-white-backgro.jpg",
    description: "Bright blend of lemon, orange, and grapefruit",
    burnTime: "46 hours",
    scent: "Lemon, Orange, Grapefruit",
  },
  {
    id: "8",
    name: "Rose Garden",
    price: 43,
    image: "/luxury-pink-candle-in-glass-jar-on-white-backgroun.jpg",
    description: "Delicate rose petals with peony and musk",
    burnTime: "50 hours",
    scent: "Rose, Peony, Musk",
  },
]

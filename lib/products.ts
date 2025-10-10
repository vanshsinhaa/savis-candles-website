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
    image: "/PHOTO-2025-10-09-13-31-36 (7).jpg",
    description: "A sophisticated blend of jasmine and sandalwood",
    burnTime: "50 hours",
    scent: "Jasmine, Sandalwood, Vanilla",
  },
  {
    id: "2",
    name: "Coastal Breeze",
    price: 38,
    image: "/PHOTO-2025-10-09-13-31-36 (8).jpg",
    description: "Fresh ocean air with hints of sea salt and driftwood",
    burnTime: "45 hours",
    scent: "Sea Salt, Driftwood, Citrus",
  },
  {
    id: "3",
    name: "Forest Whisper",
    price: 45,
    image: "/PHOTO-2025-10-09-13-31-36 (9).jpg",
    description: "Earthy notes of pine, cedar, and moss",
    burnTime: "55 hours",
    scent: "Pine, Cedar, Moss",
  },
  {
    id: "4",
    name: "Golden Hour",
    price: 40,
    image: "/PHOTO-2025-10-09-13-31-36 (10).jpg",
    description: "Warm amber and honey with a touch of vanilla",
    burnTime: "48 hours",
    scent: "Amber, Honey, Vanilla",
  },
  {
    id: "5",
    name: "Lavender Dreams",
    price: 36,
    image: "/PHOTO-2025-10-09-13-31-36 (11).jpg",
    description: "Calming lavender with chamomile and bergamot",
    burnTime: "42 hours",
    scent: "Lavender, Chamomile, Bergamot",
  },
  {
    id: "6",
    name: "Spiced Ember",
    price: 44,
    image: "/PHOTO-2025-10-09-13-31-36 (12).jpg",
    description: "Rich cinnamon, clove, and warm cardamom",
    burnTime: "52 hours",
    scent: "Cinnamon, Clove, Cardamom",
  },
  {
    id: "7",
    name: "Citrus Grove",
    price: 39,
    image: "/PHOTO-2025-10-09-13-31-36 (13).jpg",
    description: "Bright blend of lemon, orange, and grapefruit",
    burnTime: "46 hours",
    scent: "Lemon, Orange, Grapefruit",
  },
  {
    id: "8",
    name: "Rose Garden",
    price: 43,
    image: "/PHOTO-2025-10-09-13-31-36 (14).jpg",
    description: "Delicate rose petals with peony and musk",
    burnTime: "50 hours",
    scent: "Rose, Peony, Musk",
  },
]

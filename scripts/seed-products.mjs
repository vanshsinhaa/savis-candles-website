// Savi's Candles — Product Seed Script
// Usage: node --env-file=.env.local scripts/seed-products.mjs
//
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Use service role key so we bypass RLS for seeding
const supabase = createClient(supabaseUrl, serviceRoleKey)

// Mom's inventory — exactly as provided
const products = [
  {
    name: 'Daisy Candle',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC01',
    category: 'Jar',
    weight: '08 oz',
    cost_price: 5,
    selling_price: 15,
    price: 15,       // keep in sync with selling_price for frontend
    profit: 10,
    stock_quantity: 2,
    reorder_level: 20,
    supplier_name: 'Candle Science',
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Vanilla Orchid',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC02',
    category: 'Jar',
    weight: '08 oz',
    cost_price: 4,
    selling_price: 12,
    price: 12,
    profit: 8,
    stock_quantity: 4,
    reorder_level: 20,
    supplier_name: 'Candle Science',
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Grape Fruit',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC03',
    category: 'Jar',
    weight: '08 oz',
    cost_price: 4,
    selling_price: 12,
    price: 12,
    profit: 8,
    stock_quantity: 1,
    reorder_level: 5,
    supplier_name: 'Candle Science',
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Lavender',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC04',
    category: 'Jar',
    weight: '08 oz',
    cost_price: 4,
    selling_price: 12,
    price: 12,
    profit: 8,
    stock_quantity: 0,
    reorder_level: 0,
    supplier_name: null,
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Egyptian Amber',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC05',
    category: 'Jar',
    weight: '08 oz',
    cost_price: 4,
    selling_price: 12,
    price: 12,
    profit: 8,
    stock_quantity: 0,
    reorder_level: 0,
    supplier_name: null,
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Jewellery Tray',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC06',
    category: 'Tray',
    weight: null,
    cost_price: null,
    selling_price: null,
    price: 0,
    profit: null,
    stock_quantity: 0,
    reorder_level: 0,
    supplier_name: null,
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
  {
    name: 'Jewellery Tray 2',
    description: '',
    image: '/placeholder.svg',
    sku: 'SC07',
    category: 'Tray',
    weight: null,
    cost_price: null,
    selling_price: null,
    price: 0,
    profit: null,
    stock_quantity: 0,
    reorder_level: 0,
    supplier_name: null,
    is_active: true,
    burn_time: '',
    scent: '',
    size: '',
  },
]

async function run() {
  console.log("🕯️  Savi's Candles — Product Seeder\n")

  // ── Upsert products ──────────────────────────────────────────
  console.log('Upserting products...')
  const { data, error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'sku' })
    .select('id, name, sku, category, weight, selling_price, cost_price, profit, stock_quantity, reorder_level, supplier_name, is_active')

  if (error) {
    console.error('❌ Upsert failed:', error.message)
    console.error('   Hint:', error.hint || error.details || '(no additional details)')
    process.exit(1)
  }

  console.log(`✅ Upserted ${data.length} products\n`)

  // ── Print all products ───────────────────────────────────────
  console.log('='.repeat(90))
  console.log('ALL PRODUCTS IN DATABASE')
  console.log('='.repeat(90))
  console.table(
    data.map(p => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Weight: p.weight ?? '—',
      'Cost £': p.cost_price ?? '—',
      'Sell £': p.selling_price ?? '—',
      'Profit £': p.profit ?? '—',
      Stock: p.stock_quantity,
      'Reorder At': p.reorder_level,
      Supplier: p.supplier_name ?? '—',
      Active: p.is_active ? 'yes' : 'no',
    }))
  )

  // ── Low stock alerts ─────────────────────────────────────────
  const lowStock = data.filter(p => p.reorder_level > 0 && p.stock_quantity < p.reorder_level)

  if (lowStock.length === 0) {
    console.log('\n✅ All products are adequately stocked.')
  } else {
    console.log('\n⚠️  LOW STOCK — needs restocking:')
    lowStock.forEach(p => {
      const gap = p.reorder_level - p.stock_quantity
      console.log(
        `   • ${p.name} (${p.sku}): only ${p.stock_quantity} in stock — reorder level is ${p.reorder_level} (need ${gap} more)`
      )
    })
  }

  // ── Confirm suppliers ────────────────────────────────────────
  console.log('\nChecking suppliers table...')
  const { data: suppliers, error: suppErr } = await supabase
    .from('suppliers')
    .select('id, name, created_at')

  if (suppErr) {
    console.error('❌ Could not read suppliers table:', suppErr.message)
    console.error('   Make sure you ran scripts/migrate.sql in the Supabase dashboard first.')
  } else {
    console.log(`✅ Suppliers table has ${suppliers.length} row(s):`)
    suppliers.forEach(s => console.log(`   • ${s.name}`))
  }

  console.log('\nDone! 🕯️\n')
}

run()

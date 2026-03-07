-- ============================================================
-- Savi's Candles — Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- STEP 1: Add missing columns to products table
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
    ALTER TABLE products ADD COLUMN sku text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight') THEN
    ALTER TABLE products ADD COLUMN weight text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cost_price') THEN
    ALTER TABLE products ADD COLUMN cost_price numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'selling_price') THEN
    ALTER TABLE products ADD COLUMN selling_price numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'profit') THEN
    ALTER TABLE products ADD COLUMN profit numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reorder_level') THEN
    ALTER TABLE products ADD COLUMN reorder_level integer DEFAULT 5;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'supplier_name') THEN
    ALTER TABLE products ADD COLUMN supplier_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'supplier_contact') THEN
    ALTER TABLE products ADD COLUMN supplier_contact text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'last_restock_date') THEN
    ALTER TABLE products ADD COLUMN last_restock_date date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'notes') THEN
    ALTER TABLE products ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_active') THEN
    ALTER TABLE products ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Add UNIQUE constraint on sku (required for upsert ON CONFLICT)
-- Drop partial index if it existed from a previous migration
DROP INDEX IF EXISTS products_sku_unique;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE products ADD CONSTRAINT products_sku_key UNIQUE (sku);


-- ============================================================
-- STEP 2: Create suppliers table
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL UNIQUE,
  contact_name  text,
  email         text,
  phone         text,
  website       text,
  notes         text,
  created_at    timestamptz DEFAULT now()
);

-- Insert Candle Science
INSERT INTO suppliers (name)
VALUES ('Candle Science')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- STEP 3: RLS — products table (public read, no public write)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are publicly readable" ON products;

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ============================================================
-- STEP 4: RLS — suppliers table (service role only, no public)
-- ============================================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated — service_role bypasses RLS


-- ============================================================
-- STEP 5: Verify schema
-- ============================================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

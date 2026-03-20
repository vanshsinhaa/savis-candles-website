-- ============================================================
-- Savi's Candles — Admin Products Fix Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Make optional columns nullable so new products can be created
--    without filling in every field.
ALTER TABLE products ALTER COLUMN image       DROP NOT NULL;
ALTER TABLE products ALTER COLUMN description DROP NOT NULL;
ALTER TABLE products ALTER COLUMN burn_time   DROP NOT NULL;
ALTER TABLE products ALTER COLUMN scent       DROP NOT NULL;
ALTER TABLE products ALTER COLUMN size        DROP NOT NULL;

-- 2. Fix SKU unique constraint so that multiple products can have
--    no SKU (NULL). The old constraint treats '' as a duplicate.
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sku_key;
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique_notnull
  ON products (sku)
  WHERE sku IS NOT NULL AND sku <> '';

-- 3. Confirm the updated schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

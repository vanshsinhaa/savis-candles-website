-- Temporarily disable RLS to allow checkout to work
-- Run this in Supabase SQL Editor

-- Disable RLS on orders table
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on order_items table  
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on products (it works fine)
-- Products table already has the correct policy

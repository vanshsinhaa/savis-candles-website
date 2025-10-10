-- Add missing RLS policies for checkout functionality
-- Run this in Supabase SQL Editor

-- Allow order creation (needed for checkout API)
CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow order updates (needed for payment status updates)
CREATE POLICY "Allow order updates" ON orders
    FOR UPDATE USING (true);

-- Allow order item creation (needed for checkout API)
CREATE POLICY "Allow order item creation" ON order_items
    FOR INSERT WITH CHECK (true);

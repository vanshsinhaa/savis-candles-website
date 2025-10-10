-- Update database schema for NextAuth.js and user authentication
-- Run this in Supabase SQL Editor

-- Add user_id column to orders table to link orders to users
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Update RLS policies to allow users to see their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.email() = customer_email
    );

-- Allow order creation for authenticated users
DROP POLICY IF EXISTS "Allow order creation" ON orders;
CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        user_id IS NULL -- Allow guest orders
    );

-- Allow order updates for the order owner
DROP POLICY IF EXISTS "Allow order updates" ON orders;
CREATE POLICY "Allow order updates" ON orders
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.email() = customer_email
    );

-- Update order_items policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                orders.user_id = auth.uid() OR 
                orders.customer_email = auth.email()
            )
        )
    );

-- Allow order item creation
DROP POLICY IF EXISTS "Allow order item creation" ON order_items;
CREATE POLICY "Allow order item creation" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                orders.user_id = auth.uid() OR 
                orders.user_id IS NULL -- Allow guest orders
            )
        )
    );

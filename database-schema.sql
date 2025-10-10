-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  burn_time VARCHAR(100) NOT NULL,
  scent TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  size VARCHAR(50) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Create policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.email() = customer_email);

-- Allow order creation (needed for checkout API)
CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow order updates (needed for payment status updates)
CREATE POLICY "Allow order updates" ON orders
    FOR UPDATE USING (true);

-- Create policies for order_items (users can only see items from their orders)
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.customer_email = auth.email()
        )
    );

-- Allow order item creation (needed for checkout API)
CREATE POLICY "Allow order item creation" ON order_items
    FOR INSERT WITH CHECK (true);

-- Insert sample products (your PHOTO images)
INSERT INTO products (name, price, image, description, burn_time, scent, category, size, stock_quantity, is_featured) VALUES
('Midnight Jasmine', 48.00, '/PHOTO-2025-10-09-13-31-36 (1).jpg', 'A sensual blend of jasmine, vanilla, and sandalwood', '55 hours', 'Jasmine, Vanilla, Sandalwood', 'Signature Collection', '12oz', 50, true),
('Ocean Breeze', 42.00, '/PHOTO-2025-10-09-13-31-36 (2).jpg', 'Fresh sea salt, eucalyptus, and citrus notes', '50 hours', 'Sea Salt, Eucalyptus, Citrus', 'Seasonal', '10oz', 30, true),
('Warm Vanilla', 38.00, '/PHOTO-2025-10-09-13-31-36 (3).jpg', 'Rich vanilla bean with hints of caramel and cream', '45 hours', 'Vanilla, Caramel, Cream', 'Classic', '8oz', 40, true),
('Lavender Dreams', 45.00, '/PHOTO-2025-10-09-13-31-36 (4).jpg', 'Soothing lavender with subtle herbal undertones', '48 hours', 'Lavender, Herbal, Bergamot', 'Relaxation', '10oz', 35, true),
('Sandalwood Serenity', 52.00, '/PHOTO-2025-10-09-13-31-36 (5).jpg', 'Exotic sandalwood with warm amber notes', '60 hours', 'Sandalwood, Amber, Musk', 'Premium', '14oz', 25, true),
('Rose Garden', 48.00, '/PHOTO-2025-10-09-13-31-36 (6).jpg', 'Delicate rose petals with green leaf accents', '55 hours', 'Rose, Green Leaves, Musk', 'Floral', '12oz', 30, true),
('Midnight Bloom', 42.00, '/PHOTO-2025-10-09-13-31-36 (7).jpg', 'A sophisticated blend of jasmine and sandalwood', '50 hours', 'Jasmine, Sandalwood, Vanilla', 'Signature Collection', '10oz', 40, false),
('Coastal Breeze', 38.00, '/PHOTO-2025-10-09-13-31-36 (8).jpg', 'Fresh ocean air with hints of sea salt and driftwood', '45 hours', 'Sea Salt, Driftwood, Citrus', 'Seasonal', '8oz', 35, false),
('Forest Whisper', 45.00, '/PHOTO-2025-10-09-13-31-36 (9).jpg', 'Earthy notes of pine, cedar, and moss', '55 hours', 'Pine, Cedar, Moss', 'Nature', '12oz', 30, false),
('Golden Hour', 40.00, '/PHOTO-2025-10-09-13-31-36 (10).jpg', 'Warm amber and honey with a touch of vanilla', '48 hours', 'Amber, Honey, Vanilla', 'Classic', '10oz', 40, false),
('Spiced Ember', 44.00, '/PHOTO-2025-10-09-13-31-36 (11).jpg', 'Rich cinnamon, clove, and warm cardamom', '52 hours', 'Cinnamon, Clove, Cardamom', 'Spice', '12oz', 25, false),
('Citrus Grove', 39.00, '/PHOTO-2025-10-09-13-31-36 (12).jpg', 'Bright blend of lemon, orange, and grapefruit', '46 hours', 'Lemon, Orange, Grapefruit', 'Citrus', '10oz', 35, false),
('Lavender Dreams Collection', 36.00, '/PHOTO-2025-10-09-13-31-36 (13).jpg', 'Calming lavender with chamomile and bergamot', '42 hours', 'Lavender, Chamomile, Bergamot', 'Relaxation', '8oz', 45, false),
('Rose Garden Collection', 43.00, '/PHOTO-2025-10-09-13-31-36 (14).jpg', 'Delicate rose petals with peony and musk', '50 hours', 'Rose, Peony, Musk', 'Floral', '10oz', 30, false);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

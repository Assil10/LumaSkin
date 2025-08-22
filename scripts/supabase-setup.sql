-- Create Product table for LumaSkin
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  category TEXT NOT NULL DEFAULT 'Other',
  skin_type TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  image TEXT,
  description TEXT,
  clean_ingreds TEXT[] DEFAULT '{}', -- Renamed from ingredients to match CSV
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on name + brand to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS products_name_brand_unique ON products(name, brand);

-- Create Profiles table for user authentication
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_skin_type_idx ON products USING GIN(skin_type);
CREATE INDEX IF NOT EXISTS products_concerns_idx ON products USING GIN(concerns);
CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
CREATE INDEX IF NOT EXISTS products_rating_idx ON products(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Allow public inserts to products" ON products;
DROP POLICY IF EXISTS "Allow public updates to products" ON products;

-- RLS policies for products
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public inserts to products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public updates to products" ON products FOR UPDATE USING (true) WITH CHECK (true);

-- Drop existing profile policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - can be removed)
INSERT INTO products (name, brand, price, rating, reviews, category, skin_type, concerns, image, description, clean_ingreds) VALUES
('Gentle Foaming Cleanser', 'CeraVe', 12.99, 4.5, 2847, 'Cleanser', ARRAY['Oily', 'Combination', 'Normal'], ARRAY['Acne', 'Oily Skin'], '/placeholder.svg?height=200&width=200', 'Gentle foaming cleanser with ceramides and hyaluronic acid', ARRAY['Ceramides', 'Hyaluronic Acid', 'Niacinamide']),
('Niacinamide 10% + Zinc 1%', 'The Ordinary', 7.20, 4.3, 5632, 'Serum', ARRAY['Oily', 'Combination'], ARRAY['Acne', 'Oily Skin', 'Pigmentation'], '/placeholder.svg?height=200&width=200', 'High-strength vitamin and mineral blemish formula', ARRAY['Niacinamide', 'Zinc PCA'])
ON CONFLICT (name, brand) DO NOTHING;

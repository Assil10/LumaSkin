-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  skin_type VARCHAR(50),
  age_range VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skin_analyses table
CREATE TABLE IF NOT EXISTS skin_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skin_type VARCHAR(50),
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create detected_conditions table
CREATE TABLE IF NOT EXISTS detected_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES skin_analyses(id) ON DELETE CASCADE,
  condition_name VARCHAR(100) NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES skin_analyses(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  category VARCHAR(50),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2),
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_skin_types table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_skin_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  skin_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_concerns table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_concerns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  concern VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_ingredients table
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ingredient_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user_id ON skin_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_date ON skin_analyses(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_detected_conditions_analysis_id ON detected_conditions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_product_skin_types_product_id ON product_skin_types(product_id);
CREATE INDEX IF NOT EXISTS idx_product_concerns_product_id ON product_concerns(product_id);

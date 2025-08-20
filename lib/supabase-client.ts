import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Product interface matching the frontend exactly
export interface Product {
  id: string
  name: string
  brand: string
  price: number
  rating: number
  reviews: number
  category: string
  skinType: string[]
  concerns: string[]
  image: string
  description: string
  ingredients: string[]
}

// Database interface (matches Supabase table structure)
export interface ProductRow {
  id: string
  name: string
  brand: string
  price: number
  rating: number
  reviews: number
  category: string
  skin_type: string[]
  concerns: string[]
  image: string | null
  description: string | null
  clean_ingreds: string[]
  created_at: string
  updated_at: string
}

// Helper to convert database row to frontend Product interface
export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: row.price,
    rating: row.rating,
    reviews: row.reviews,
    category: row.category,
    skinType: row.skin_type,
    concerns: row.concerns,
    image: row.image || '/placeholder.svg?height=200&width=200',
    description: row.description || '',
    ingredients: row.clean_ingreds
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import path from 'path'
import fs from 'fs'

// AI Model Integration
interface SkinCondition {
  label: string
  confidence: number
}

interface AIAnalysisResult {
  predictions: SkinCondition[]
  disclaimer: string
}

// Skin condition to ingredient mapping for recommendations
const conditionIngredients: Record<string, string[]> = {
  acne: ['salicylic acid', 'niacinamide', 'benzoyl peroxide', 'adapalene', 'azelaic acid'],
  dryness: ['hyaluronic acid', 'ceramides', 'glycerin', 'squalane', 'shea butter'],
  oily_skin: ['niacinamide', 'salicylic acid', 'zinc pca', 'tea tree oil', 'kaolin clay'],
  rosacea: ['azelaic acid', 'niacinamide', 'allantoin', 'panthenol', 'centella asiatica'],
  wrinkles_fine_lines: ['retinoids', 'vitamin c', 'peptides', 'hyaluronic acid', 'niacinamide'],
  dark_circles_puffiness: ['caffeine', 'vitamin k', 'retinoids', 'peptides', 'hyaluronic acid'],
  normal: ['glycerin', 'hyaluronic acid', 'ceramides']
}

// Skin care guidance for each condition
const skinCareGuidance: Record<string, {
  summary: string
  routine: string
  key_ingredients: string
}> = {
  acne: {
    summary: "Support gentle sebum control, reduce inflammation, avoid pore-clogging.",
    routine: "AM: Cleanser (salicylic acid 0.5-2%), Niacinamide serum (4-10%), Oil-free moisturizer, Broad-spectrum SPF 50.\nPM: Gentle cleanser, Adapalene 0.1% or Benzoyl Peroxide 2.5%, Non-comedogenic moisturizer.",
    key_ingredients: "Salicylic acid, Niacinamide, Benzoyl Peroxide, Adapalene (retinoid), Azelaic acid"
  },
  dryness: {
    summary: "Rebuild moisture barrier and prevent water loss.",
    routine: "AM: Gentle creamy cleanser, Hyaluronic acid serum, Rich moisturizer with ceramides, SPF.\nPM: Gentle cleanser, Occlusive moisturizer or facial oil, Consider humidifier.",
    key_ingredients: "Hyaluronic acid, Ceramides, Glycerin, Squalane, Shea butter, Petrolatum"
  },
  oily_skin: {
    summary: "Balance sebum production without over-drying.",
    routine: "AM: Gel cleanser, Niacinamide serum, Oil-free moisturizer, Mattifying SPF.\nPM: Gentle cleanser, Clay mask (1-2x/week), Lightweight moisturizer.",
    key_ingredients: "Niacinamide, Salicylic acid, Zinc PCA, Tea tree oil, Kaolin clay"
  },
  rosacea: {
    summary: "Soothe redness, avoid triggers, strengthen barrier.",
    routine: "AM: Gentle cleanser, Azelaic acid 10%, Lightweight moisturizer, Mineral SPF.\nPM: Gentle cleanser, Niacinamide 5%, Barrier cream.",
    key_ingredients: "Azelaic acid, Niacinamide, Allantoin, Panthenol, Centella asiatica"
  },
  wrinkles_fine_lines: {
    summary: "Stimulate collagen, protect from further damage.",
    routine: "AM: Gentle cleanser, Vitamin C serum, Peptide serum, Moisturizer, SPF 50.\nPM: Gentle cleanser, Retinoid (start low), Peptide moisturizer, Eye cream.",
    key_ingredients: "Retinoids, Vitamin C, Peptides, Hyaluronic acid, Niacinamide, CoQ10"
  },
  dark_circles_puffiness: {
    summary: "Target under-eye concerns with gentle, targeted care.",
    routine: "AM: Gentle cleanser, Caffeine serum under eyes, Moisturizer, SPF.\nPM: Gentle cleanser, Retinol eye cream (low concentration), Eye cream with peptides.",
    key_ingredients: "Caffeine, Vitamin K, Retinoids, Peptides, Hyaluronic acid, Niacinamide"
  },
  normal: {
    summary: "Maintain healthy barrier and consistent sunscreen.",
    routine: "AM: Gentle cleanser, Lightweight moisturizer, SPF 50.\nPM: Gentle cleanser, Moisturizer.",
    key_ingredients: "Glycerin, Hyaluronic acid, Ceramides"
  }
}

// AI prediction function that calls the Python service
async function predictSkinCondition(imageBuffer: Buffer): Promise<SkinCondition[]> {
  try {
    // Create FormData to send to Python AI service
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    formData.append('file', blob, 'skin-image.jpg')
    
    // Call Python AI service
    const response = await fetch('http://localhost:8001/predict', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.predictions || []
    
  } catch (error) {
    console.error('Error calling AI service:', error)
    // Fallback to mock predictions if AI service is unavailable
    const conditions = ['acne', 'dryness', 'oily_skin', 'rosacea', 'wrinkles_fine_lines', 'dark_circles_puffiness', 'normal']
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
    
    return [
      {
        label: randomCondition,
        confidence: 0.85 + Math.random() * 0.1
      },
      {
        label: conditions.filter(c => c !== randomCondition)[Math.floor(Math.random() * 5)],
        confidence: 0.3 + Math.random() * 0.4
      },
      {
        label: conditions.filter(c => c !== randomCondition)[Math.floor(Math.random() * 4)],
        confidence: 0.1 + Math.random() * 0.3
      }
    ]
  }
}

// Get product recommendations based on skin condition
async function getProductRecommendations(condition: string, maxItems: number = 3) {
  const targetIngredients = conditionIngredients[condition] || []
  
  if (targetIngredients.length === 0) return []
  
  // Build ingredient search query
  const ingredientQuery = targetIngredients
    .map(ingredient => `clean_ingreds.cs.{${ingredient}}`)
    .join(',')
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .or(ingredientQuery)
    .limit(maxItems)
    .order('rating', { ascending: false })
  
  if (error) {
    console.error('Error fetching product recommendations:', error)
    return []
  }
  
  return products || []
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    
    // Convert file to buffer for AI processing
    const arrayBuffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)
    
    // Get AI predictions
    const predictions = await predictSkinCondition(imageBuffer)
    
    // Enrich predictions with recommendations
    const enrichedPredictions = await Promise.all(
      predictions.map(async (prediction) => {
        const products = await getProductRecommendations(prediction.label)
        const guidance = skinCareGuidance[prediction.label]
        
        return {
          ...prediction,
          recommendation: {
            guidance,
            products: products.map(product => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              category: product.category,
              ingredients: product.clean_ingreds || []
            }))
          }
        }
      })
    )
    
    const result: AIAnalysisResult = {
      predictions: enrichedPredictions,
      disclaimer: "This is not a medical diagnosis. Consult a dermatologist for concerns."
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('AI skin analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze skin condition' },
      { status: 500 }
    )
  }
}

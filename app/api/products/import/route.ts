import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// Robust delimited text parser with delimiter auto-detection and CSV quoting
function parseDelimited(text: string): { headers: string[]; rows: string[][] } {
  const rawLines = text.split(/\r?\n/)
  const lines = rawLines.filter((l) => l.length > 0)
  if (lines.length === 0) return { headers: [], rows: [] }

  // Remove BOM from first header line if present
  lines[0] = lines[0].replace(/^\uFEFF/, '')

  // Simple delimiter detection by presence order
  let delimiter = ','
  const headerLine = lines[0]
  if (headerLine.includes(',')) delimiter = ','
  else if (headerLine.includes(';')) delimiter = ';'
  else if (headerLine.includes('\t')) delimiter = '\t'
  else if (headerLine.includes('|')) delimiter = '|'

  function splitLine(line: string): string[] {
    const result: string[] = []
    let value = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          value += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === delimiter && !inQuotes) {
        result.push(value)
        value = ''
      } else {
        value += ch
      }
    }
    result.push(value)
    return result
  }

  const headers = splitLine(lines[0]).map((h) => h.trim())
  const rows = lines.slice(1).map((line) => splitLine(line).map((v) => v.trim()))
  return { headers, rows }
}

export async function POST(request: NextRequest) {
  try {
    // Expect multipart/form-data with field 'file'
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'CSV file is required under field "file"' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    // Detect encoding via BOM (UTF-8/UTF-16LE/UTF-16BE)
    const bytes = new Uint8Array(arrayBuffer)
    let encoding: 'utf-8' | 'utf-16le' | 'utf-16be' = 'utf-8'
    if (bytes.length >= 2) {
      if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = 'utf-16le'
      else if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = 'utf-16be'
    }
    const decoder = new TextDecoder(encoding)
    const csvText = decoder.decode(arrayBuffer)
    const parsed = parseDelimited(csvText)
    const { headers, rows } = parsed
    if (!headers.length || !rows.length) {
      return NextResponse.json({ error: 'CSV appears to be empty or missing headers' }, { status: 400 })
    }

    // Normalize headers for mapping
    const norm = (s: string) =>
      s
        .trim()
        .replace(/^\uFEFF/, '')
        .toLowerCase()
        .replace(/[_\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const normalizedHeaders = headers.map(norm)

    const headerIndex = (names: string[]): number => {
      for (const n of names) {
        const i = normalizedHeaders.indexOf(n)
        if (i !== -1) return i
      }
      return -1
    }

    const headerIndexFuzzy = (keywords: string[]): number => {
      for (let i = 0; i < normalizedHeaders.length; i++) {
        const h = normalizedHeaders[i]
        for (const k of keywords) {
          if (h.includes(k)) return i
        }
      }
      return -1
    }

    // Common header variants
    let idxName = headerIndex(['name', 'product', 'product name', 'product title', 'title', 'product_name'])
    if (idxName === -1) idxName = headerIndexFuzzy(['name', 'product', 'title'])
    let idxBrand = headerIndex(['brand', 'brand name'])
    if (idxBrand === -1) idxBrand = headerIndexFuzzy(['brand', 'manufacturer', 'company'])
    let idxPrice = headerIndex(['price', 'price usd', 'cost', 'amount'])
    if (idxPrice === -1) idxPrice = headerIndexFuzzy(['price', 'cost', 'amount'])
    let idxRating = headerIndex(['rating', 'stars', 'average rating'])
    if (idxRating === -1) idxRating = headerIndexFuzzy(['rating', 'stars'])
    let idxReviews = headerIndex(['reviews', 'review count', 'ratings count', 'num reviews'])
    if (idxReviews === -1) idxReviews = headerIndexFuzzy(['review', 'ratings', 'count'])
    let idxCategory = headerIndex(['category', 'type', 'product_type'])
    if (idxCategory === -1) idxCategory = headerIndexFuzzy(['category', 'type'])
    let idxSkinType = headerIndex(['skin type', 'skintype', 'skin types', 'skin_type'])
    if (idxSkinType === -1) idxSkinType = headerIndexFuzzy(['skin type', 'skintype'])
    let idxConcerns = headerIndex(['concerns', 'concern', 'skin concerns', 'skin_concerns'])
    if (idxConcerns === -1) idxConcerns = headerIndexFuzzy(['concern'])
    let idxImage = headerIndex(['image', 'image url', 'image_url', 'img', 'photo', 'picture'])
    if (idxImage === -1) idxImage = headerIndexFuzzy(['image', 'photo', 'picture'])
    let idxDescription = headerIndex(['description', 'desc', 'details'])
    if (idxDescription === -1) idxDescription = headerIndexFuzzy(['description', 'details', 'desc'])
    let idxIngredients = headerIndex(['ingredients', 'inci', 'ingredient list', 'clean ingreds'])
    if (idxIngredients === -1) idxIngredients = headerIndexFuzzy(['ingredient', 'inci', 'clean ingreds'])

    // Map rows to Product fields using detected indices
    const docs = rows
      .map((values) => {
        const get = (idx: number) => (idx >= 0 ? (values[idx] || '').replace(/^"|"$/g, '') : '')

        const rawPrice = get(idxPrice)
        const rawRating = get(idxRating)
        const rawReviews = get(idxReviews)
        const rawSkinType = get(idxSkinType)
        const rawConcerns = get(idxConcerns)
        const rawIngredients = get(idxIngredients)

        const name = get(idxName)
        const brand = get(idxBrand)
        const category = get(idxCategory) || 'Other'
        const image = get(idxImage)
        const description = get(idxDescription)

        // Normalize price, remove currency symbols (e.g., £, $, €) and spaces
        const price = rawPrice
          ? (() => {
              const cleaned = rawPrice.replace(/[^0-9,.-]/g, '').replace(/\s/g, '')
              const normalized = cleaned.includes(',') && !cleaned.includes('.')
                ? cleaned.replace(/,(\d{2})$/, '.$1')
                : cleaned
              const parsed = parseFloat(normalized)
              return isNaN(parsed) ? 0 : parsed
            })()
          : 0
        const rating = rawRating ? parseFloat(rawRating.replace(',', '.')) || 0 : 0
        const reviews = rawReviews ? parseInt(rawReviews.replace(/[^0-9]/g, ''), 10) || 0 : 0

        const splitList = (s: string) =>
          s
            ? s
                .split('|')
                .flatMap((t) => t.split(','))
                .map((t) => t.trim())
                .filter(Boolean)
            : []

        let ingredients: string[] = []
        

        
        // Handle Python-like list string: ['a', 'b'] - this is your CSV format!
        if (rawIngredients && rawIngredients.startsWith('[') && rawIngredients.endsWith(']')) {
          const inner = rawIngredients.slice(1, -1)
          ingredients = inner
            .split(',')
            .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        }
        // If still no ingredients, try to parse the raw string directly
        if (!ingredients.length && rawIngredients) {
          ingredients = [rawIngredients.trim()]
        }

        if (!name) return null
        const safeBrand = brand || 'Unknown'

        return {
          name,
          brand: safeBrand,
          price,
          rating,
          reviews,
          category,
          skin_type: splitList(rawSkinType),
          concerns: splitList(rawConcerns),
          image: image || null,
          description: description || null,
          clean_ingreds: ingredients,
        }
      })
      .filter(Boolean) as any[]

    if (docs.length === 0) {
      return NextResponse.json(
        {
          error: 'No valid rows found in CSV',
          detectedHeaders: headers,
          sampleRow: rows[0] || [],
          note: 'Ensure there are columns for product name and brand. Send us the detectedHeaders if this persists.'
        },
        { status: 400 }
      )
    }



    // First, clear all existing products to avoid conflicts
    console.log('Clearing existing products...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .gt('created_at', '1900-01-01') // Delete all rows by using a condition that matches everything
    
    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to clear existing products' }, { status: 500 })
    }
    
    console.log('Inserting new products...')
    // Insert products into Supabase - fresh insert
    const { data, error } = await supabase
      .from('products')
      .insert(docs)

    if (error) {
      console.error('Supabase insert error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to insert products into database', 
        details: error.message || 'Unknown error'
      }, { status: 500 })
    }

    return NextResponse.json({ message: 'Products imported successfully', count: docs.length })
  } catch (error) {
    console.error('Import products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

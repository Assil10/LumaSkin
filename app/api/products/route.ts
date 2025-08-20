import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapProductRow } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const skinType = searchParams.get('skinType')
    const concern = searchParams.get('concern')
    const price = searchParams.get('price') || 'all'

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Search filter
    if (q) {
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
    }

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Skin type filter
    if (skinType && skinType !== 'all') {
      query = query.contains('skin_type', [skinType])
    }

    // Concern filter
    if (concern && concern !== 'all') {
      query = query.contains('concerns', [concern])
    }

    // Price filter
    if (price && price !== 'all') {
      if (price === 'under-10') {
        query = query.lt('price', 10)
      } else if (price === '10-20') {
        query = query.gte('price', 10).lte('price', 20)
      } else if (price === 'over-20') {
        query = query.gt('price', 20)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    // Map database rows to frontend Product interface
    const products = data.map(mapProductRow)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}





'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star, ShoppingCart, Filter, Search } from 'lucide-react'
import Link from "next/link"

interface Product {
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

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gentle Foaming Cleanser',
    brand: 'CeraVe',
    price: 12.99,
    rating: 4.5,
    reviews: 2847,
    category: 'Cleanser',
    skinType: ['Oily', 'Combination', 'Normal'],
    concerns: ['Acne', 'Oily Skin'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'Gentle foaming cleanser with ceramides and hyaluronic acid',
    ingredients: ['Ceramides', 'Hyaluronic Acid', 'Niacinamide']
  },
  {
    id: '2',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    price: 7.20,
    rating: 4.3,
    reviews: 5632,
    category: 'Serum',
    skinType: ['Oily', 'Combination'],
    concerns: ['Acne', 'Oily Skin', 'Pigmentation'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'High-strength vitamin and mineral blemish formula',
    ingredients: ['Niacinamide', 'Zinc PCA']
  },
  {
    id: '3',
    name: 'Daily Facial Moisturizer SPF 30',
    brand: 'Neutrogena',
    price: 13.47,
    rating: 4.4,
    reviews: 1923,
    category: 'Moisturizer',
    skinType: ['All Types'],
    concerns: ['Sun Protection', 'Hydration'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'Oil-free moisturizer with broad spectrum SPF 30',
    ingredients: ['Avobenzone', 'Octinoxate', 'Glycerin']
  },
  {
    id: '4',
    name: 'Salicylic Acid 2% Solution',
    brand: 'The Ordinary',
    price: 8.10,
    rating: 4.2,
    reviews: 3456,
    category: 'Treatment',
    skinType: ['Oily', 'Combination'],
    concerns: ['Acne', 'Blackheads'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'Direct acid exfoliant for blemish-prone skin',
    ingredients: ['Salicylic Acid', 'Witch Hazel']
  },
  {
    id: '5',
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    price: 9.90,
    rating: 4.6,
    reviews: 4521,
    category: 'Serum',
    skinType: ['All Types'],
    concerns: ['Hydration', 'Fine Lines'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'Multi-depth hydration serum',
    ingredients: ['Hyaluronic Acid', 'Vitamin B5']
  },
  {
    id: '6',
    name: 'Retinol 0.5% in Squalane',
    brand: 'The Ordinary',
    price: 10.90,
    rating: 4.1,
    reviews: 2134,
    category: 'Treatment',
    skinType: ['Normal', 'Dry'],
    concerns: ['Fine Lines', 'Pigmentation'],
    image: '/placeholder.svg?height=200&width=200',
    description: 'Intermediate strength retinol serum',
    ingredients: ['Retinol', 'Squalane']
  }
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSkinType, setSelectedSkinType] = useState('all')
  const [selectedConcern, setSelectedConcern] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const categories = ['all', 'Cleanser', 'Serum', 'Moisturizer', 'Treatment']
  const skinTypes = ['all', 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
  const concerns = ['all', 'Acne', 'Oily Skin', 'Pigmentation', 'Fine Lines', 'Hydration', 'Sun Protection']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSkinType = selectedSkinType === 'all' || product.skinType.includes(selectedSkinType)
    const matchesConcern = selectedConcern === 'all' || product.concerns.includes(selectedConcern)
    
    let matchesPrice = true
    if (priceRange === 'under-10') matchesPrice = product.price < 10
    else if (priceRange === '10-20') matchesPrice = product.price >= 10 && product.price <= 20
    else if (priceRange === 'over-20') matchesPrice = product.price > 20

    return matchesSearch && matchesCategory && matchesSkinType && matchesConcern && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to LumaSkin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            LumaSkin Products
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSkinType} onValueChange={setSelectedSkinType}>
                <SelectTrigger>
                  <SelectValue placeholder="Skin Type" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Skin Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedConcern} onValueChange={setSelectedConcern}>
                <SelectTrigger>
                  <SelectValue placeholder="Concern" />
                </SelectTrigger>
                <SelectContent>
                  {concerns.map(concern => (
                    <SelectItem key={concern} value={concern}>
                      {concern === 'all' ? 'All Concerns' : concern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-10">Under $10</SelectItem>
                  <SelectItem value="10-20">$10 - $20</SelectItem>
                  <SelectItem value="over-20">Over $20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-purple-600 font-medium">
                    {product.brand}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.concerns.slice(0, 2).map(concern => (
                    <Badge key={concern} variant="secondary" className="text-xs">
                      {concern}
                    </Badge>
                  ))}
                  {product.concerns.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.concerns.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </span>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedSkinType('all')
                setSelectedConcern('all')
                setPriceRange('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

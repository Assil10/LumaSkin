import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ProductDocument extends Document {
  name: string
  brand: string
  price: number
  rating: number
  reviews: number
  category: string
  skinType: string[]
  concerns: string[]
  image?: string | null
  description?: string | null
  ingredients: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true },
    skinType: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
    image: { type: String, default: null },
    description: { type: String, default: null },
    ingredients: { type: [String], default: [] },
  },
  { timestamps: true }
)

// Prevent duplicate products with same name and brand
ProductSchema.index({ name: 1, brand: 1 }, { unique: true })

const Product: Model<ProductDocument> =
  (mongoose.models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>('Product', ProductSchema)

export default Product





import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload image to Cloudinary
export const uploadImage = async (file: string, folder: string = 'lumaskin'): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })
    
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

// Get public ID from URL
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  const publicId = filename.split('.')[0]
  return `lumaskin/${publicId}`
}

// Upload avatar image
export const uploadAvatar = async (file: string): Promise<string> => {
  return uploadImage(file, 'lumaskin/avatars')
}

// Upload product image
export const uploadProductImage = async (file: string): Promise<string> => {
  return uploadImage(file, 'lumaskin/products')
}

// Upload analysis image
export const uploadAnalysisImage = async (file: string): Promise<string> => {
  return uploadImage(file, 'lumaskin/analysis')
}

export default cloudinary

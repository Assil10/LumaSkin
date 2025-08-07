import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { connectDB } from './mongodb'
import User from './models/User'

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Get user from token
export const getUserFromToken = async (token: string) => {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    await connectDB()
    const user = await User.findById(decoded.userId).select('-password')
    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// Extract token from request headers
export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Middleware to protect routes
export const authenticateUser = async (request: NextRequest) => {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return { error: 'No token provided', status: 401 }
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return { error: 'Invalid token', status: 401 }
    }

    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed', status: 500 }
  }
}

// Check if user is admin
export const requireAdmin = async (request: NextRequest) => {
  const authResult = await authenticateUser(request)
  if ('error' in authResult) {
    return authResult
  }

  if (authResult.user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 }
  }

  return authResult
}

// Generate new access token
export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  )
}

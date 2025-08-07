import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Find user by email
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    )

    // Update user's refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
        token,
        refreshToken
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Find user by refresh token
    const user = await User.findOne({ refreshToken })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Verify refresh token
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret')
    } catch (error) {
      // Clear invalid refresh token
      user.refreshToken = null
      await user.save()
      
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    )

    // Update user's refresh token
    user.refreshToken = newRefreshToken
    await user.save()

    return NextResponse.json(
      {
        message: 'Token refreshed successfully',
        token: newToken,
        refreshToken: newRefreshToken
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

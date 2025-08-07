import { NextRequest, NextResponse } from 'next/server'
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

    // Find user by refresh token and clear it
    const user = await User.findOne({ refreshToken })
    if (user) {
      user.refreshToken = null
      await user.save()
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

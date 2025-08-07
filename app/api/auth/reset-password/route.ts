import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Hash the token to compare with stored token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update user password and clear reset token
    user.password = hashedPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

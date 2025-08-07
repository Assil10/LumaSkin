import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Set token expiration (1 hour)
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)

    // Save token to user
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpires = resetPasswordExpires
    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`

    // Send email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl)
      
      return NextResponse.json(
        { message: 'Password reset email sent successfully' },
        { status: 200 }
      )
    } catch (emailError) {
      // If email fails, remove the reset token
      user.resetPasswordToken = null
      user.resetPasswordExpires = null
      await user.save()

      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

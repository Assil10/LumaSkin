import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { authenticateUser } from '@/lib/auth'
import User from '@/lib/models/User'
import { uploadAvatar } from '@/lib/cloudinary'

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()
    
    const user = await User.findById(authResult.user._id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires')
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const avatar = formData.get('avatar') as File | null

    await connectDB()

    const user = await User.findById(authResult.user._id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update name if provided
    if (name && name.trim()) {
      user.name = name.trim()
    }

    // Handle avatar upload if provided
    if (avatar) {
      try {
        // Convert file to base64
        const bytes = await avatar.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const dataURI = `data:${avatar.type};base64,${base64}`

        // Upload to Cloudinary
        const avatarUrl = await uploadAvatar(dataURI)
        user.avatar = avatarUrl
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload avatar' },
          { status: 500 }
        )
      }
    }

    await user.save()

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

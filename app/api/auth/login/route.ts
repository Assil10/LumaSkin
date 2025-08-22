import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

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

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see it.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Check if email is confirmed
    if (!data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Please confirm your email address before signing in. Check your inbox and spam folder.' },
        { status: 401 }
      )
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // Create user response in the same format as before
    const userResponse = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.name || 'User',
      email: data.user.email,
      avatar: profile?.avatar || data.user.user_metadata?.avatar || null,
      emailVerified: data.user.email_confirmed_at ? true : false,
      createdAt: data.user.created_at
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
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

'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  emailVerified: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshAuth: () => Promise<boolean>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setRefreshToken(storedRefreshToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!token || !refreshToken) return

    const refreshInterval = setInterval(async () => {
      const success = await refreshAuth()
      if (!success) {
        logout()
      }
    }, 14 * 60 * 1000) // Refresh every 14 minutes (assuming 15-minute token expiry)

    return () => clearInterval(refreshInterval)
  }, [token, refreshToken])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        setUser(data.user)
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        setUser(data.user)
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'An error occurred during registration' }
    }
  }

  const logout = () => {
    // Call logout API to invalidate refresh token
    if (refreshToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(console.error)
    }

    // Clear local state
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Redirect to login
    router.push('/auth')
  }

  const refreshAuth = async (): Promise<boolean> => {
    if (!refreshToken) return false

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to send password reset email' }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, error: 'An error occurred' }
    }
  }

  const value = {
    user,
    token,
    refreshToken,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
    forgotPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

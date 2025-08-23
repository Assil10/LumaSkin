'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Menu, Camera } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.substring(0, 2).toUpperCase()
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user?.email) return 'User'
    return user.email.split('@')[0]
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LumaSkin
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
            Features
          </Link>
          <Link href="/ai-skin-analysis" className="text-gray-600 hover:text-purple-600 transition-colors">
            AI Analysis
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-purple-600 transition-colors">
            Products
          </Link>
          {user && (
            <Link href="/profile" className="text-gray-600 hover:text-purple-600 transition-colors">
              Profile
            </Link>
          )}
        </nav>

        {/* Right Side - Auth/User Menu */}
        <div className="flex items-center space-x-4">
          {loading ? (
            // Loading state
            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
          ) : user ? (
            // Logged in - User Menu
            <>
              <Link href="/ai-skin-analysis">
                <Button className="bg-purple-600 hover:bg-purple-700 hidden sm:flex">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Analysis
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="pt-1">
                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"} className="text-xs">
                          {user.email_confirmed_at ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/ai-skin-analysis" className="cursor-pointer sm:hidden">
                      <Camera className="mr-2 h-4 w-4" />
                      Skin Analysis
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Soon
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Not logged in - Sign In/Sign Up buttons
            <>
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/ai-skin-analysis">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Analysis
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, TrendingUp, Camera, Star, Award, LogOut } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface ScanHistory {
  id: string
  date: string
  score: number
  conditions: string[]
  image: string
  improvements: string[]
}

// For now, we'll keep some mock data for scan history since we haven't implemented that yet
// But we'll make the profile info dynamic
const mockScanHistory: ScanHistory[] = [
  {
    id: '1',
    date: '2024-01-15',
    score: 72,
    conditions: ['Mild Acne', 'Oily Skin', 'Minor Pigmentation'],
    image: '/placeholder.svg?height=150&width=150',
    improvements: []
  },
  {
    id: '2',
    date: '2024-01-01',
    score: 68,
    conditions: ['Moderate Acne', 'Oily Skin', 'Pigmentation', 'Blackheads'],
    image: '/placeholder.svg?height=150&width=150',
    improvements: ['Acne reduced by 15%', 'Skin texture improved']
  },
  {
    id: '3',
    date: '2023-12-15',
    score: 61,
    conditions: ['Moderate Acne', 'Very Oily Skin', 'Significant Pigmentation'],
    image: '/placeholder.svg?height=150&width=150',
    improvements: ['Overall skin health improved by 18%']
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated (with delay to prevent race conditions)
  useEffect(() => {
    if (!loading && !user) {
      // Add a small delay to prevent race conditions
      const timer = setTimeout(() => {
        console.log('Profile: Redirecting to auth - User:', user, 'Loading:', loading, 'Session:', session)
        router.push('/auth')
      }, 500) // Increased delay to 500ms
      
      return () => clearTimeout(timer)
    }
  }, [user, loading, router, session])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreImprovement = () => {
    if (mockScanHistory.length < 2) return null
    const latest = mockScanHistory[0].score
    const previous = mockScanHistory[1].score
    return latest - previous
  }

  const improvement = getScoreImprovement()

  // Get user's join date
  const getJoinDate = () => {
    if (!user.created_at) return 'Recently'
    const date = new Date(user.created_at)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  // Get user's account age in a more engaging format
  const getAccountAge = () => {
    if (!user.created_at) return 'New member'
    const created = new Date(user.created_at)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 1) return 'Joined today! 🎉'
    if (diffInDays < 7) return `Joined ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    if (diffInDays < 30) return `Joined ${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
    if (diffInDays < 365) return `Joined ${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`
    return `Joined ${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) > 1 ? 's' : ''} ago`
  }

  // Get user's activity level
  const getActivityLevel = () => {
    if (!user.created_at) return 'New'
    const created = new Date(user.created_at)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 1) return 'New'
    if (diffInDays < 7) return 'Active'
    if (diffInDays < 30) return 'Regular'
    if (diffInDays < 90) return 'Established'
    return 'Veteran'
  }

  // Get user's last sign-in time in a user-friendly format
  const getLastSignIn = () => {
    if (!user.last_sign_in_at) return 'Recently'
    const date = new Date(user.last_sign_in_at)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get user's email domain for a more personalized experience
  const getEmailDomain = () => {
    if (!user.email) return ''
    return user.email.split('@')[1]
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to LumaSkin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            Your LumaSkin Profile
          </h1>
          <div className="flex items-center space-x-3">
            <Link href="/ai-skin-analysis">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Camera className="mr-2 h-4 w-4" />
                New Scan
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Message */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-purple-900 mb-2">
                    Welcome back, {user.email ? user.email.split('@')[0] : 'User'}! 👋
                  </h2>
                  <p className="text-purple-700">
                    Ready for your next skin analysis? Track your progress and discover personalized recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Email Verification Notice */}
            {!user.email_confirmed_at && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      📧 Please verify your email address
                    </h3>
                    <p className="text-yellow-700 mb-3">
                      Check your inbox for a verification link to unlock all features.
                    </p>
                    <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      Resend verification email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">{mockScanHistory.length}</div>
                  <p className="text-sm text-gray-600">Total Scans</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {mockScanHistory.length > 0 ? mockScanHistory[0].score : 0}
                  </div>
                  <p className="text-sm text-gray-600">Current Score</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.email_confirmed_at ? 'Verified' : 'Pending'}
                  </div>
                  <p className="text-sm text-gray-600">Account Status</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-orange-600">
                    {getActivityLevel()}
                  </div>
                  <p className="text-sm text-gray-600">Member Type</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      {user.email ? user.email.split('@')[0] : 'User'}
                    </h3>
                    <p className="text-gray-600">{getAccountAge()}</p>
                    {user.email && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-1">
                          <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                            {user.email_confirmed_at ? '✓ Verified' : '⏳ Pending'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Status:</span>
                      <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                        {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sign In:</span>
                      <span className="text-sm">
                        {getLastSignIn()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Scans:</span>
                      <span className="font-medium">{mockScanHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Score:</span>
                      <span className="font-medium text-green-600">
                        {mockScanHistory.length > 0 ? mockScanHistory[0].score : 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Improvement:</span>
                      <span className={`font-medium ${improvement && improvement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {improvement ? `${improvement > 0 ? '+' : ''}${improvement} pts` : 'No data'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Complete:</span>
                      <span className="text-sm font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Age:</span>
                      <span className="text-sm">{getAccountAge()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity:</span>
                      <span className="text-sm">{getLastSignIn()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity Level:</span>
                      <Badge variant="outline" className="text-xs">
                        {getActivityLevel()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="text-sm">{getJoinDate()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email Status:</span>
                      <Badge variant={user.email_confirmed_at ? "default" : "secondary"} className="text-xs">
                        {user.email_confirmed_at ? '✓ Verified' : '⏳ Pending'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Complete:</span>
                      <span className="text-sm font-medium text-green-600">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Skin Score</CardTitle>
                  <CardDescription>
                    From your most recent analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className={`text-5xl font-bold ${getScoreColor(mockScanHistory[0].score)}`}>
                    {mockScanHistory[0].score}
                  </div>
                  <div className="text-gray-600">out of 100</div>
                  
                  {improvement && (
                    <div className={`flex items-center justify-center space-x-1 ${
                      improvement > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">
                        {improvement > 0 ? '+' : ''}{improvement} points
                      </span>
                      <span className="text-gray-500">from last scan</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <Badge variant="secondary">
                      {new Date(mockScanHistory[0].date).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">First Scan</p>
                      <p className="text-sm text-gray-600">Completed your first analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Improvement Streak</p>
                      <p className="text-sm text-gray-600">2 consecutive improvements</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Monthly Tracker</p>
                      <p className="text-sm text-gray-600">Scan monthly for 3 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Current Skin Conditions</CardTitle>
                <CardDescription>
                  Based on your latest analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockScanHistory[0].conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan History</CardTitle>
                <CardDescription>
                  Your complete analysis timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockScanHistory.map((scan, index) => (
                    <div key={scan.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <img 
                        src={scan.image || "/placeholder.svg"} 
                        alt={`Scan from ${scan.date}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {new Date(scan.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <div className={`text-2xl font-bold ${getScoreColor(scan.score)}`}>
                            {scan.score}/100
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {scan.conditions.map((condition, conditionIndex) => (
                            <Badge key={conditionIndex} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>

                        {scan.improvements.length > 0 && (
                          <div className="space-y-1">
                            {scan.improvements.map((improvement, improvementIndex) => (
                              <p key={improvementIndex} className="text-sm text-green-600 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {improvement}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Progression</CardTitle>
                  <CardDescription>
                    Your skin health score over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockScanHistory.map((scan, index) => (
                      <div key={scan.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {new Date(scan.date).toLocaleDateString()}
                          </span>
                          <span className={`font-medium ${getScoreColor(scan.score)}`}>
                            {scan.score}/100
                          </span>
                        </div>
                        <Progress value={scan.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Areas</CardTitle>
                  <CardDescription>
                    Conditions that have improved over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Acne Severity</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">-15%</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Oil Production</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">-8%</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Skin Texture</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">+12%</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Overall Health</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">+18%</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations Timeline</CardTitle>
                <CardDescription>
                  How your skincare routine has evolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-purple-200 pl-4 space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-purple-600 rounded-full -ml-6"></div>
                        <span className="font-medium">January 2024</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Started using salicylic acid cleanser and niacinamide serum
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full -ml-6"></div>
                        <span className="font-medium">December 2023</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Initial analysis - recommended gentle cleansing routine
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

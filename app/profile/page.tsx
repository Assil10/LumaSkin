'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, TrendingUp, Camera, Star, Award } from 'lucide-react'
import Link from "next/link"

interface ScanHistory {
  id: string
  date: string
  score: number
  conditions: string[]
  image: string
  improvements: string[]
}

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
          <Link href="/analyze">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Camera className="mr-2 h-4 w-4" />
              New Scan
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                    <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                    <p className="text-gray-600">Member since Dec 2023</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skin Type:</span>
                      <Badge variant="outline">Combination</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age Range:</span>
                      <span>25-30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Scans:</span>
                      <span className="font-medium">{mockScanHistory.length}</span>
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

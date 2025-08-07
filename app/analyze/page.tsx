'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, ArrowLeft, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'

interface AnalysisResult {
  conditions: {
    name: string
    confidence: number
    severity: 'low' | 'medium' | 'high'
    description: string
  }[]
  skinType: string
  overallScore: number
  recommendations: string[]
}

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressSteps = [
      { progress: 20, message: "Processing image..." },
      { progress: 40, message: "Detecting skin features..." },
      { progress: 60, message: "Analyzing skin conditions..." },
      { progress: 80, message: "Generating recommendations..." },
      { progress: 100, message: "Analysis complete!" }
    ]

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalysisProgress(step.progress)
    }

    // Simulate realistic analysis results
    const mockResult: AnalysisResult = {
      conditions: [
        {
          name: "Mild Acne",
          confidence: 78,
          severity: 'medium',
          description: "Small inflammatory lesions detected on the T-zone area"
        },
        {
          name: "Oily Skin",
          confidence: 85,
          severity: 'medium',
          description: "Excess sebum production visible, particularly in forehead and nose areas"
        },
        {
          name: "Minor Pigmentation",
          confidence: 62,
          severity: 'low',
          description: "Slight uneven skin tone detected on cheek areas"
        },
        {
          name: "Early Fine Lines",
          confidence: 45,
          severity: 'low',
          description: "Minimal expression lines around eye area"
        }
      ],
      skinType: "Combination (Oily T-zone)",
      overallScore: 72,
      recommendations: [
        "Use a gentle salicylic acid cleanser twice daily",
        "Apply oil-free moisturizer to prevent over-drying",
        "Consider niacinamide serum for oil control",
        "Use broad-spectrum SPF 30+ sunscreen daily",
        "Incorporate gentle exfoliation 2-3 times per week"
      ]
    }

    setAnalysisResult(mockResult)
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => {
                setAnalysisResult(null)
                setSelectedImage(null)
              }}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            <Link href="/products">
              <Button className="bg-purple-600 hover:bg-purple-700">
                View Products
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image and Overall Score */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedImage && (
                    <div className="relative">
                      <img 
                        src={selectedImage || "/placeholder.svg"} 
                        alt="Analyzed skin" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                      {analysisResult.overallScore}/100
                    </div>
                    <p className="text-gray-600">Overall Skin Health Score</p>
                    <Badge variant="outline" className="mt-2">
                      {analysisResult.skinType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    Personalized skincare routine suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Detected Conditions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Detected Conditions</CardTitle>
                  <CardDescription>
                    AI-identified skin concerns with confidence levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.conditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{condition.name}</h3>
                        <Badge className={getSeverityColor(condition.severity)}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {condition.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <Progress value={condition.confidence} className="flex-1" />
                        <span className="text-xs font-medium">{condition.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="flex-1">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Find Products
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // Save to profile logic would go here
                    router.push('/profile')
                  }}
                >
                  Save to Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to LumaSkin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LumaSkin Analysis
          </h1>
          <p className="text-gray-600">
            Upload a clear photo of your skin for AI-powered analysis
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Upload Your Photo
            </CardTitle>
            <CardDescription>
              For best results, use good lighting and take a clear, close-up photo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedImage ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={selectedImage || "/placeholder.svg"} 
                    alt="Selected skin photo" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Change Photo
                  </Button>
                </div>
                
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5 text-purple-600 animate-spin" />
                      <span className="text-lg font-medium">Analyzing your skin...</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-center text-gray-600">
                      This may take a few moments
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={simulateAnalysis}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze My Skin
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
              Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use natural lighting or bright indoor lighting</li>
              <li>• Remove makeup for more accurate analysis</li>
              <li>• Take the photo straight-on, not at an angle</li>
              <li>• Ensure your face fills most of the frame</li>
              <li>• Avoid shadows on your face</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

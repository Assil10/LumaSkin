'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, Camera, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface SkinCondition {
  label: string
  confidence: number
  recommendation?: {
    guidance: {
      summary: string
      routine: string
      key_ingredients: string
    }
    products: Array<{
      id: string
      name: string
      brand: string
      price: number
      category: string
      ingredients: string[]
    }>
  }
}

interface AIAnalysisResult {
  predictions: SkinCondition[]
  disclaimer: string
}

export default function AISkinAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(blob))
            setError(null)
          }
        }, 'image/jpeg')
      }
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Camera access denied. Please upload an image instead.')
    }
  }

  const analyzeSkin = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedImage)

      const response = await fetch('/api/ai/skin-analysis', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      acne: 'bg-red-100 text-red-800',
      dryness: 'bg-blue-100 text-blue-800',
      oily_skin: 'bg-green-100 text-green-800',
      rosacea: 'bg-pink-100 text-pink-800',
      wrinkles_fine_lines: 'bg-purple-100 text-purple-800',
      dark_circles_puffiness: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-gray-100 text-gray-800',
    }
    return colors[condition] || 'bg-gray-100 text-gray-800'
  }

  const formatConditionName = (condition: string) => {
    return condition
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Skin Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get personalized skin condition insights and product recommendations powered by advanced AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload & Camera Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload or Capture Photo
            </CardTitle>
            <CardDescription>
              Take a clear photo of your skin area or upload an existing image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Capture */}
            <div className="space-y-4">
              <Button onClick={startCamera} variant="outline" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-100 rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                <Button
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  size="sm"
                >
                  Capture Photo
                </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload">Or upload an image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="cursor-pointer"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={analyzeSkin}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze Skin
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  AI-powered skin condition insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="predictions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="predictions" className="space-y-4">
                    {analysisResult.predictions.map((prediction, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getConditionColor(prediction.label)}>
                            {formatConditionName(prediction.label)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {Math.round(prediction.confidence * 100)}% confidence
                          </span>
                        </div>
                        <Progress value={prediction.confidence * 100} className="mb-2" />
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    {analysisResult.predictions[0]?.recommendation && (
                      <div className="space-y-4">
                        {/* Skin Care Guidance */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Skin Care Guidance</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label className="font-semibold">Summary:</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {analysisResult.predictions[0].recommendation.guidance.summary}
                              </p>
                            </div>
                            <div>
                              <Label className="font-semibold">Daily Routine:</Label>
                              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                                {analysisResult.predictions[0].recommendation.guidance.routine}
                              </p>
                            </div>
                            <div>
                              <Label className="font-semibold">Key Ingredients:</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {analysisResult.predictions[0].recommendation.guidance.key_ingredients}
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Product Recommendations */}
                        {analysisResult.predictions[0].recommendation.products && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Recommended Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {analysisResult.predictions[0].recommendation.products.map((product) => (
                                  <div key={product.id} className="border rounded-lg p-3">
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <p className="text-sm text-gray-600">{product.brand}</p>
                                    <p className="text-sm text-gray-600">${product.price}</p>
                                    <div className="mt-2">
                                      <Label className="text-xs font-semibold">Key Ingredients:</Label>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {product.ingredients.slice(0, 5).map((ingredient, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">
                                            {ingredient}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Disclaimer */}
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {analysisResult.disclaimer}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

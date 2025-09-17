"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, PenTool, Sparkles, Heart, RefreshCw, Save, Palette, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DoodleJournalPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#A8E6CF")
  const [brushSize, setBrushSize] = useState(3)
  const [selectedMood, setSelectedMood] = useState("")
  const [narrative, setNarrative] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasDrawing, setHasDrawing] = useState(false)
  const router = useRouter()

  const colors = [
    "#A8E6CF", // Soft mint
    "#CE93D8", // Muted violet
    "#FFABAB", // Coral
    "#FFD93D", // Warm yellow
    "#6BCF7F", // Gentle green
    "#4D9DE0", // Calm blue
    "#E15554", // Soft red
    "#F1A208", // Orange
    "#7209B7", // Purple
    "#2D3748", // Dark gray
  ]

  // Mock narrative generation
  const mockNarrative =
    "In your colors and shapes, I see a mind seeking expression beyond words. The gentle curves speak of hope, while the bold strokes show your inner strength. Your artistic expression reveals emotions that sometimes can't be captured in language—and that's perfectly beautiful."

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial canvas properties
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    setHasDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = brushSize
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawing(false)
    setNarrative("")
  }

  const generateNarrative = () => {
    setIsGenerating(true)
    // Simulate AI processing
    setTimeout(() => {
      setNarrative(mockNarrative)
      setIsGenerating(false)
    }, 3000)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to image data
    const imageData = canvas.toDataURL("image/png")
    console.log("Saving drawing:", { imageData, selectedMood, narrative })
    // In a real app, this would save to database
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Doodle Journal</h1>
            <p className="text-muted-foreground">Express your emotions through colors and shapes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Drawing Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-heading">Your Creative Space</CardTitle>
                <CardDescription>
                  Let your emotions flow through art. There's no right or wrong way to create.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drawing Tools */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Colors:</span>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color ? "border-foreground scale-110" : "border-muted"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Size:</span>
                    <div className="flex gap-2">
                      {[1, 3, 5, 8].map((size) => (
                        <button
                          key={size}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            brushSize === size ? "border-primary bg-primary/10" : "border-muted"
                          }`}
                          onClick={() => setBrushSize(size)}
                        >
                          <div
                            className="rounded-full bg-foreground"
                            style={{ width: `${size + 2}px`, height: `${size + 2}px` }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={clearCanvas} className="ml-auto bg-transparent">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Canvas */}
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-96 border-2 border-muted rounded-lg cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  {!hasDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-muted-foreground">
                        <PenTool className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start drawing to express your feelings</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mood Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">What emotions are you expressing? (Optional)</label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative">🎨 Creative</SelectItem>
                      <SelectItem value="peaceful">🌸 Peaceful</SelectItem>
                      <SelectItem value="chaotic">🌪️ Chaotic</SelectItem>
                      <SelectItem value="joyful">☀️ Joyful</SelectItem>
                      <SelectItem value="melancholy">🌧️ Melancholy</SelectItem>
                      <SelectItem value="energetic">⚡ Energetic</SelectItem>
                      <SelectItem value="contemplative">🌙 Contemplative</SelectItem>
                      <SelectItem value="free">🦋 Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateNarrative}
                    disabled={!hasDrawing || isGenerating}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Interpreting your art...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Interpret My Art
                      </>
                    )}
                  </Button>
                  <Button onClick={saveDrawing} disabled={!hasDrawing} variant="outline" className="bg-transparent">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generated Narrative */}
            {narrative && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-heading">Your Art Speaks</CardTitle>
                  </div>
                  <CardDescription>What your doodle reveals about your inner world</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-background/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm leading-relaxed italic text-muted-foreground">"{narrative}"</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Save Entry
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Share Art
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Art Therapy Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-accent/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Art Therapy Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Let your hand move freely without planning</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Choose colors that feel right in the moment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Abstract shapes can express complex emotions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">There's no need to create something "beautiful"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Meanings */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Color & Emotion</CardTitle>
                <CardDescription>What different colors might represent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#A8E6CF" }}></div>
                    <span className="text-muted-foreground">Green: Growth, healing, peace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#4D9DE0" }}></div>
                    <span className="text-muted-foreground">Blue: Calm, trust, stability</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FFABAB" }}></div>
                    <span className="text-muted-foreground">Pink: Love, compassion, nurturing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FFD93D" }}></div>
                    <span className="text-muted-foreground">Yellow: Joy, energy, optimism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#CE93D8" }}></div>
                    <span className="text-muted-foreground">Purple: Creativity, spirituality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encouragement */}
            {!hasDrawing && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Express Yourself Freely</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Art is a powerful way to express emotions that words can't capture. Let your creativity flow without
                    judgment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

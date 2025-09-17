"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, PenTool, Sparkles, Heart, RefreshCw, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { CrisisModal } from "@/components/crisis-modal"

export default function TextJournalPage() {
  const [textEntry, setTextEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [narrative, setNarrative] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [crisisTriggers, setCrisisTriggers] = useState<string[]>([])
  const router = useRouter()

  const handleTextChange = (value: string) => {
    setTextEntry(value)
    setWordCount(
      value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }

  const generateNarrative = async () => {
    if (!textEntry.trim()) return

    setIsGenerating(true)
    try {
      // Check for crisis indicators first
      const crisisResult = await apiClient.analyzeCrisisRisk(textEntry, "text")
      if (crisisResult.analysis.shouldShowModal) {
        setCrisisTriggers(crisisResult.analysis.triggers)
        setShowCrisisModal(true)
      }

      // Generate narrative
      const moodScore = getMoodScore(selectedMood)
      const emotions = selectedMood ? [selectedMood] : []

      const result = await apiClient.generateNarrative(textEntry, moodScore, emotions)
      setNarrative(result.narrative)
    } catch (error) {
      console.error("Narrative generation failed:", error)
      // Fallback to mock narrative
      setNarrative(
        "In your words, I see a soul learning to speak its truth. The vulnerability you share here is not weakness—it's the raw material of healing.",
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const saveEntry = async () => {
    if (!textEntry.trim()) return

    setIsSaving(true)
    try {
      const moodScore = getMoodScore(selectedMood)
      const emotions = selectedMood ? [selectedMood] : []

      await apiClient.createJournalEntry({
        type: "text",
        content: textEntry,
        mood: moodScore,
        emotions,
        aiNarrative: narrative,
      })

      // Redirect to dashboard after saving
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to save entry:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getMoodScore = (mood: string): number => {
    const moodScores: Record<string, number> = {
      sad: 2,
      overwhelmed: 3,
      anxious: 4,
      confused: 5,
      lonely: 3,
      angry: 4,
      calm: 7,
      hopeful: 8,
      grateful: 9,
      happy: 9,
    }
    return moodScores[mood] || 5
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Text Journal</h1>
            <p className="text-muted-foreground">Express your thoughts and feelings through writing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Writing Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-heading">Write Your Thoughts</CardTitle>
                <CardDescription>
                  Let your thoughts flow freely. There's no right or wrong way to express yourself.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Writing Area */}
                <div className="space-y-4">
                  <Textarea
                    placeholder="Start writing... What's on your mind today?"
                    value={textEntry}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="min-h-[300px] resize-none text-base leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>Take your time</span>
                  </div>
                </div>

                {/* Mood Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">How are you feeling? (Optional)</label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hopeful">🌱 Hopeful</SelectItem>
                      <SelectItem value="anxious">🌊 Anxious</SelectItem>
                      <SelectItem value="overwhelmed">🌪️ Overwhelmed</SelectItem>
                      <SelectItem value="calm">🌸 Calm</SelectItem>
                      <SelectItem value="sad">🌧️ Sad</SelectItem>
                      <SelectItem value="happy">☀️ Happy</SelectItem>
                      <SelectItem value="confused">🌫️ Confused</SelectItem>
                      <SelectItem value="grateful">🌟 Grateful</SelectItem>
                      <SelectItem value="angry">🔥 Angry</SelectItem>
                      <SelectItem value="lonely">🌙 Lonely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generateNarrative}
                    disabled={!textEntry.trim() || isGenerating}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating narrative...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Healing Story
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={saveEntry}
                    disabled={!textEntry.trim() || isSaving}
                    variant="outline"
                    className="bg-transparent"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Processing Section */}
          <div className="space-y-6">
            {/* Writing Prompts */}
            {!textEntry && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-accent/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Writing Prompts</CardTitle>
                  <CardDescription>Need inspiration? Try one of these prompts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-transparent"
                      onClick={() => setTextEntry("Today I'm feeling... because...")}
                    >
                      <div>
                        <p className="font-medium">Today I'm feeling...</p>
                        <p className="text-sm text-muted-foreground">Explore your current emotions</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-transparent"
                      onClick={() => setTextEntry("Something that's been on my mind lately is...")}
                    >
                      <div>
                        <p className="font-medium">Something that's been on my mind...</p>
                        <p className="text-sm text-muted-foreground">Share persistent thoughts</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-transparent"
                      onClick={() => setTextEntry("I wish I could tell someone that...")}
                    >
                      <div>
                        <p className="font-medium">I wish I could tell someone...</p>
                        <p className="text-sm text-muted-foreground">Express unspoken feelings</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-transparent"
                      onClick={() => setTextEntry("Right now I need...")}
                    >
                      <div>
                        <p className="font-medium">Right now I need...</p>
                        <p className="text-sm text-muted-foreground">Identify your needs</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Narrative */}
            {narrative && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-heading">Your Echo</CardTitle>
                  </div>
                  <CardDescription>A healing narrative created from your words</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-background/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm leading-relaxed italic text-muted-foreground">"{narrative}"</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={saveEntry}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Entry"
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Share Anonymously
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Writing Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-secondary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Write without editing - let your thoughts flow naturally</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">There's no wrong way to express yourself here</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Focus on how you feel, not just what happened</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Be kind to yourself as you write</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encouragement */}
            {textEntry && !narrative && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenTool className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">You're Doing Great</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Every word you write is a step toward understanding yourself better. Your thoughts and feelings
                    matter, and expressing them takes courage.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Crisis Modal */}
        <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} triggerWords={crisisTriggers} />
      </div>
    </div>
  )
}

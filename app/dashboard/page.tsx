"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Mic, PenTool, MessageCircle, TrendingUp, Plus, Calendar, Clock, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { CrisisModal } from "@/components/crisis-modal"
import { apiClient } from "@/lib/api-client"

const moodEmojis = {
  hopeful: "🌱",
  anxious: "🌊",
  overwhelmed: "🌪️",
  calm: "🌸",
  sad: "🌧️",
  happy: "☀️",
}

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState("")
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [crisisTriggers, setCrisisTriggers] = useState<string[]>([])
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Try to get current user or create anonymous user
      let currentUser = null
      try {
        const userResult = await apiClient.getCurrentUser()
        currentUser = userResult.user
      } catch (error) {
        // Create anonymous user if no auth
        const anonResult = await apiClient.createAnonymousUser()
        currentUser = anonResult.user
      }

      setUser(currentUser)

      // Load recent journal entries
      await loadRecentEntries()
    } catch (error) {
      console.error("Failed to initialize app:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentEntries = async () => {
    try {
      const result = await apiClient.getJournalEntries(5)
      setRecentEntries(result.entries || [])
    } catch (error) {
      console.error("Failed to load entries:", error)
      setRecentEntries([])
    }
  }

  const handleQuickMoodCheck = async (mood: string) => {
    setSelectedMood(mood)

    try {
      // Create mood entry
      await apiClient.createMoodEntry({
        mood: getMoodScore(mood),
        emotions: [mood],
        notes: `Quick mood check: ${mood}`,
      })

      // Check for crisis indicators with enhanced detection
      const moodText = `I'm feeling ${mood} right now`
      const crisisResult = await apiClient.analyzeCrisisRisk(moodText, "mood_check")

      if (crisisResult.analysis.shouldShowModal) {
        setCrisisTriggers(crisisResult.analysis.triggers)
        setShowCrisisModal(true)
      }
    } catch (error) {
      console.error("Failed to process mood check:", error)
    }
  }

  const getMoodScore = (mood: string): number => {
    const moodScores: Record<string, number> = {
      sad: 2,
      overwhelmed: 3,
      anxious: 4,
      calm: 7,
      hopeful: 8,
      happy: 9,
    }
    return moodScores[mood] || 5
  }

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Mic className="h-6 w-6 text-primary" />
      case "text":
        return <PenTool className="h-6 w-6 text-secondary" />
      case "doodle":
        return <PenTool className="h-6 w-6 text-accent" />
      default:
        return <PenTool className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getEntryBgColor = (type: string) => {
    switch (type) {
      case "voice":
        return "bg-primary/10"
      case "text":
        return "bg-secondary/10"
      case "doodle":
        return "bg-accent/10"
      default:
        return "bg-muted/10"
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="bg-primary/10 p-4 rounded-full animate-pulse mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your safe space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome back{user?.name ? `, ${user.name}` : ""} to your safe space
            </h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <div className="bg-primary/10 p-3 rounded-full animate-gentle-pulse">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Quick Mood Check */}
        <Card className="mb-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Quick Mood Check</CardTitle>
            <CardDescription>Tap how you're feeling right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className={`flex items-center gap-2 capitalize ${
                    selectedMood === mood ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => handleQuickMoodCheck(mood)}
                >
                  <span className="text-lg">{emoji}</span>
                  {mood}
                </Button>
              ))}
            </div>
            {selectedMood && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Thank you for sharing. Your feelings are valid and heard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Expression Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expression Mode Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card
                className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => router.push("/expression/voice")}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Voice Journal</h3>
                  <p className="text-sm text-muted-foreground">Record your thoughts and feelings</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => router.push("/expression/text")}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <PenTool className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Write</h3>
                  <p className="text-sm text-muted-foreground">Express yourself through words</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => router.push("/expression/doodle")}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <PenTool className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Doodle</h3>
                  <p className="text-sm text-muted-foreground">Draw your emotions freely</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Entries */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-heading">Your Recent Echoes</CardTitle>
                    <CardDescription>Your journey of self-expression</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/journal")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PenTool className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No entries yet. Start your journey!</p>
                    <Button onClick={() => router.push("/expression/voice")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Entry
                    </Button>
                  </div>
                ) : (
                  recentEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      className="bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${getEntryBgColor(entry.type)}`}
                            >
                              {getEntryIcon(entry.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-heading font-semibold">
                                {entry.type === "voice"
                                  ? "Voice Entry"
                                  : entry.type === "text"
                                    ? "Written Entry"
                                    : "Doodle Entry"}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                Mood: {entry.mood}/10
                              </Badge>
                              {entry.emotions?.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {entry.emotions[0]}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {entry.transcription || entry.content.substring(0, 100)}...
                            </p>
                            {entry.aiNarrative && (
                              <div className="bg-primary/5 p-3 rounded-lg mb-2">
                                <p className="text-sm italic text-muted-foreground">
                                  "{entry.aiNarrative.substring(0, 150)}..."
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(entry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => router.push("/practice/roleplay")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Practice Conversation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/insights")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Growth Insights
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/expression/voice")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Entry
                </Button>
              </CardContent>
            </Card>

            {/* Today's Inspiration */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Today's Gentle Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic text-pretty">
                  "Growth is not about perfection, but about progress. Every small step you take towards understanding
                  yourself is a victory worth celebrating."
                </p>
                <div className="mt-4 text-xs text-muted-foreground">— Your Echoes companion</div>
              </CardContent>
            </Card>

            {/* Mood Calendar Preview */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={index} className="text-xs text-muted-foreground p-1">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 7 }, (_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        index === 3
                          ? "bg-primary text-primary-foreground"
                          : index < 3
                            ? "bg-muted text-muted-foreground"
                            : "bg-background border border-border"
                      }`}
                    >
                      {index + 15}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {recentEntries.length} entries this week
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Crisis Modal */}
        <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} triggerWords={crisisTriggers} />
      </div>
    </div>
  )
}

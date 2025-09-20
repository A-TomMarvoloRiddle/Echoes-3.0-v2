"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Square, Play, ArrowLeft, Sparkles, Heart, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useVoiceRecorder } from "@/lib/voice-recorder"
import { CrisisModal } from "@/components/crisis-modal"

export default function VoiceJournalPage() {
  const [selectedMood, setSelectedMood] = useState("")
  const [transcription, setTranscription] = useState("")
  const [narrative, setNarrative] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [crisisTriggers, setCrisisTriggers] = useState<string[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Web Speech API recognition
  const recognitionRef = useRef<any>(null)
  const [isRecognizing, setIsRecognizing] = useState(false)

  // Start speech recognition
  const startRecognition = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setTranscription(transcript)
      console.log("Transcript:", transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Error:", event.error)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecognizing(true)
  }

  // Stop speech recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecognizing(false)
    }
  }

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
    } catch (error) {
      console.error("Failed to initialize app:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  const handlePlayAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
    }
  }

  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isSupported,
  } = useVoiceRecorder()

  const handleStopRecording = async () => {
    stopRecognition()
    try {
      const blob = await stopRecording()
      if (!blob) return

      setIsProcessingVoice(true)

      // If transcription is empty (recognition failed), fallback to backend
      let transcript = transcription
      if (!transcript) {
        // Process voice with backend
        const result = await apiClient.processVoice(blob)
        transcript = result.transcription
        setTranscription(transcript)
      }

      // Check for crisis indicators
      if (transcript) {
        const crisisResult = await apiClient.analyzeCrisisRisk(transcript, "voice")
        if (crisisResult.analysis.shouldShowModal) {
          setCrisisTriggers(crisisResult.analysis.triggers)
          setShowCrisisModal(true)
        }
      }
    } catch (error) {
      console.error("Voice processing failed:", error)
      // Fallback to mock transcription for demo
      setTranscription(
        "I've been feeling really overwhelmed with everything lately. School is getting harder and I don't know how to tell my parents that I'm struggling.",
      )
    } finally {
      setIsProcessingVoice(false)
    }
  }
  // Start/stop recognition with recording
  useEffect(() => {
    if (isRecording && !isRecognizing) {
      startRecognition()
    }
    if (!isRecording && isRecognizing) {
      stopRecognition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording])

  const generateNarrative = async () => {
    if (!transcription) return

    setIsGenerating(true)
    try {
      const moodScore = getMoodScore(selectedMood)
      const emotions = selectedMood ? [selectedMood] : []

      const result = await apiClient.generateNarrative(transcription, moodScore, emotions)
      setNarrative(result.narrative)
    } catch (error) {
      console.error("Narrative generation failed:", error)
      // Fallback to mock narrative
      setNarrative(
        "In your voice, I hear the weight of your experiences, and that's completely valid. Your willingness to express yourself shows incredible courage.",
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const saveEntry = async () => {
    if (!transcription) return

    setIsSaving(true)
    try {
      const moodScore = getMoodScore(selectedMood)
      const emotions = selectedMood ? [selectedMood] : []

      await apiClient.createJournalEntry({
        type: "voice",
        content: audioBlob ? "Voice recording" : transcription,
        transcription,
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
      calm: 7,
      hopeful: 8,
      grateful: 9,
      happy: 9,
    }
    return moodScores[mood] || 5
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Show error if voice recording not supported
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-heading font-bold mb-4">Voice Recording Not Supported</h2>
            <p className="text-muted-foreground mb-4">
              Your browser doesn't support voice recording. Please try using a different browser or device.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-3xl font-heading font-bold text-foreground">Voice Journal</h1>
            <p className="text-muted-foreground">Share your thoughts and feelings through voice</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recording Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-heading">Record Your Thoughts</CardTitle>
                <CardDescription>Take your time. This is your safe space to express yourself.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Controls */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div
                      className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                        isRecording ? "bg-destructive/20 animate-pulse" : "bg-primary/20 hover:bg-primary/30"
                      }`}
                    >
                      <Button
                        size="lg"
                        className={`w-20 h-20 rounded-full ${
                          isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                        }`}
                        onClick={isRecording ? handleStopRecording : startRecording}
                        disabled={isProcessingVoice}
                      >
                        {isRecording ? (
                          <Square className="h-8 w-8 text-destructive-foreground" />
                        ) : (
                          <Mic className="h-8 w-8 text-primary-foreground" />
                        )}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge variant="destructive" className="animate-pulse">
                          Recording
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="text-2xl font-mono font-bold text-foreground">{formatTime(duration)}</div>

                  <p className="text-sm text-muted-foreground">
                    {isProcessingVoice
                      ? "Processing your voice..."
                      : isRecording
                        ? "Speak freely. Your voice matters."
                        : audioBlob
                          ? "Recording complete. You can play it back or record again."
                          : "Tap the microphone to start recording"}
                  </p>
                </div>

                {/* Playback Controls */}
                {audioBlob && (
                  <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      disabled={isProcessingVoice}
                      onClick={handlePlayAudio}
                    >
                      <Play className="h-4 w-4" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Record Again
                    </Button>
                    {/* Hidden audio element for playback */}
                    <audio ref={audioRef} style={{ display: "none" }} />
                  </div>
                )}

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
                      <SelectItem value="overwhelmed">🌪 Overwhelmed</SelectItem>
                      <SelectItem value="calm">🌸 Calm</SelectItem>
                      <SelectItem value="sad">🌧 Sad</SelectItem>
                      <SelectItem value="happy">☀ Happy</SelectItem>
                      <SelectItem value="confused">🌫 Confused</SelectItem>
                      <SelectItem value="grateful">🌟 Grateful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Processing Section */}
          <div className="space-y-6">
            {/* Transcription */}
            {transcription && (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">What You Shared</CardTitle>
                  <CardDescription>AI transcription of your voice recording</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed">{transcription}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Narrative */}
            {transcription && !narrative && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-heading">Transform Your Words</CardTitle>
                  <CardDescription>Let AI create a healing narrative from your expression</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={generateNarrative}
                    disabled={isGenerating}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating your narrative...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Healing Story
                      </>
                    )}
                  </Button>
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
                  <CardDescription>A healing narrative created just for you</CardDescription>
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

            {/* Encouragement */}
            {!audioBlob && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-secondary/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">You're Brave for Being Here</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Taking time to express your feelings is an act of self-care. Whatever you're going through, your
                    emotions are valid and you deserve to be heard.
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
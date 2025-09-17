"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Mic, RotateCcw, TrendingUp, Heart, MessageCircle, Lightbulb } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"

const roleData = {
  parent: {
    name: "Sarah (Parent)",
    avatar: "SP",
    description: "A caring and understanding parent who wants to support you",
    personality: "empathetic, patient, sometimes worried but always loving",
  },
  friend: {
    name: "Alex (Friend)",
    avatar: "AF",
    description: "Your close friend who trusts you and needs your support",
    personality: "vulnerable, appreciative, sometimes struggling but hopeful",
  },
  teacher: {
    name: "Ms. Johnson (Teacher)",
    avatar: "MJ",
    description: "A supportive educator who cares about student wellbeing",
    personality: "professional, understanding, resourceful, wants to help",
  },
  counselor: {
    name: "Dr. Martinez (Counselor)",
    avatar: "DM",
    description: "A licensed therapist with experience helping young people",
    personality: "professional, non-judgmental, skilled at asking helpful questions",
  },
}

const mockResponses = {
  parent: [
    "I'm so glad you felt comfortable talking to me about this. Can you tell me more about when you started feeling this way?",
    "I want you to know that I love you no matter what you're going through. What kind of support would be most helpful right now?",
    "Thank you for trusting me with this. I may not have all the answers, but we'll figure this out together. What's been the hardest part for you?",
    "I'm proud of you for speaking up about this. It takes courage. How long have you been carrying this alone?",
  ],
  friend: [
    "Thank you for being here for me. I've been feeling really lost lately and wasn't sure who to talk to.",
    "It means so much that you noticed something was wrong. I've been trying to hide it, but it's been really hard.",
    "I'm scared to talk about this, but I trust you. I just don't know what to do anymore.",
    "You're such a good friend for asking. I've been struggling but didn't want to burden anyone.",
  ],
  teacher: [
    "I appreciate you coming to me with this. Student wellbeing is very important to me. What's been going on?",
    "Thank you for being honest about your situation. Let's see what accommodations we can arrange to help you succeed.",
    "I'm glad you felt comfortable approaching me. Many students go through similar challenges. How can I best support you?",
    "Your academic success matters, but your mental health comes first. What resources do you think would be most helpful?",
  ],
  counselor: [
    "I'm glad you decided to come in today. What brought you here, and what would you like to work on together?",
    "Thank you for sharing that with me. It sounds like you've been carrying a lot. How has this been affecting your daily life?",
    "I hear that you're struggling, and I want you to know this is a safe space. What feels most important to talk about right now?",
    "It takes strength to reach out for help. Can you tell me more about what's been on your mind lately?",
  ],
}

export default function RoleplayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string; timestamp: Date }>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null)
  const [confidenceAfter, setConfidenceAfter] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const role = params.role as string
  const scenario = searchParams.get("scenario") || "General conversation"
  const roleInfo = roleData[role as keyof typeof roleData]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startSession = () => {
    setSessionStarted(true)
    // Add initial AI message
    const initialMessage = {
      role: "ai" as const,
      content: getInitialMessage(),
      timestamp: new Date(),
    }
    setMessages([initialMessage])
  }

  const getInitialMessage = () => {
    switch (role) {
      case "parent":
        return "Hi honey, you said you wanted to talk to me about something? I'm here to listen."
      case "friend":
        return "Hey, thanks for reaching out. I've been going through a tough time lately..."
      case "teacher":
        return "Hello! I'm glad you came to see me. How can I help you today?"
      case "counselor":
        return "Welcome! Please, have a seat and make yourself comfortable. What would you like to talk about today?"
      default:
        return "Hello! I'm here to listen. What's on your mind?"
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      role: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(
      () => {
        const responses = mockResponses[role as keyof typeof mockResponses] || []
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const aiMessage = {
          role: "ai" as const,
          content: randomResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    )
  }

  const endSession = () => {
    setShowFeedback(true)
  }

  const restartSession = () => {
    setMessages([])
    setCurrentMessage("")
    setSessionStarted(false)
    setConfidenceBefore(null)
    setConfidenceAfter(null)
    setShowFeedback(false)
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-heading">Great Job!</CardTitle>
            <CardDescription className="text-lg">You completed your practice session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="font-heading font-semibold mb-4">How did that feel?</h3>
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={confidenceAfter === rating ? "default" : "outline"}
                    className="aspect-square"
                    onClick={() => setConfidenceAfter(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Rate your confidence (1-5)</p>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg">
              <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Feedback & Tips
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• You showed great empathy in your responses</p>
                <p>• Try using more "I feel" statements to express your emotions</p>
                <p>• Your listening skills were excellent - you asked thoughtful questions</p>
                <p>• Consider being more specific about what support you need</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={restartSession} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Practice Again
              </Button>
              <Button onClick={() => router.push("/practice")} className="flex-1 bg-primary hover:bg-primary/90">
                <Heart className="mr-2 h-4 w-4" />
                Back to Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarFallback className="text-lg font-heading bg-primary/10 text-primary">
                {roleInfo?.avatar}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-heading">Ready to Practice?</CardTitle>
            <CardDescription className="text-lg">{scenario}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-heading font-semibold mb-2">You'll be talking with:</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>{roleInfo?.name}</strong> - {roleInfo?.description}
                </p>
              </div>

              <div className="text-left space-y-3">
                <h4 className="font-heading font-semibold">Before we start:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• This is a safe space to practice - there's no judgment here</p>
                  <p>• Take your time with responses - real conversations have pauses</p>
                  <p>• Focus on expressing your feelings clearly and honestly</p>
                  <p>• You can end the session anytime if you need a break</p>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-semibold mb-3">How confident do you feel right now?</h4>
                <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={confidenceBefore === rating ? "default" : "outline"}
                      className="aspect-square"
                      onClick={() => setConfidenceBefore(rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">1 = Not confident, 5 = Very confident</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={startSession}
                disabled={confidenceBefore === null}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">{roleInfo?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-heading font-bold">{roleInfo?.name}</h1>
              <p className="text-sm text-muted-foreground">{scenario}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={endSession}>
              End Session
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm mb-6">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{roleInfo?.avatar}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-secondary/10 text-secondary">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{roleInfo?.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

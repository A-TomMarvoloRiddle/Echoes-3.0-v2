"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, User, MessageCircle, Sparkles } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const ROLES = [
  { value: "parent", label: "Parent" },
  { value: "friend", label: "Friend" },
  { value: "teacher", label: "Teacher" },
  { value: "counselor", label: "Counselor" },
  { value: "custom", label: "Custom" },
]

export default function PracticeRoleplayPage() {
  const [step, setStep] = useState<"setup" | "chat" | "feedback">("setup")
  const [role, setRole] = useState(ROLES[0].value)
  const [customRole, setCustomRole] = useState("")
  const [scenario, setScenario] = useState("")
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string>("")
  const [hints, setHints] = useState<string[]>([])

  // Start roleplay
  const handleStart = () => {
    if (!scenario.trim()) return
    setStep("chat")
    setMessages([
      {
        sender: "ai",
        content:
          role === "custom"
            ? `Let's begin! I'll act as: ${customRole}. Scenario: ${scenario}`
            : `Let's begin! I'll act as your ${role}. Scenario: ${scenario}`,
      },
    ])
  }

  // Send user message and get AI response
  const handleSend = async () => {
    if (!userInput.trim()) return
    const newMessages = [...messages, { sender: "user", content: userInput }]
  setMessages(newMessages as { sender: "user" | "ai"; content: string }[])
    setUserInput("")
    setIsLoading(true)
    try {
      const res = await apiClient.generateRoleplayResponse({
        roleType: role,
        scenario: role === "custom" ? customRole : role,
        conversationHistory: newMessages,
      }, userInput)
  setMessages([...newMessages, { sender: "ai" as const, content: res.response }] as { sender: "user" | "ai"; content: string }[])
    } catch (e) {
  setMessages([...newMessages, { sender: "ai" as const, content: "Sorry, something went wrong." }] as { sender: "user" | "ai"; content: string }[])
    } finally {
      setIsLoading(false)
    }
  }

  // Get feedback from AI
  const handleFeedback = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.generateSessionFeedback(messages, 5, 7) // Example confidence
      setFeedback(res.feedback)
      setHints(res.tips)
      setStep("feedback")
    } catch (e) {
      setFeedback("Sorry, could not get feedback.")
      setHints([])
      setStep("feedback")
    } finally {
      setIsLoading(false)
    }
  }

  // Try again with hints
  const handleRetry = () => {
    setMessages([])
    setFeedback("")
    setHints([])
    setStep("setup")
    setScenario("")
    setCustomRole("")
    setRole(ROLES[0].value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Practice Roleplay Conversation
          </CardTitle>
          <CardDescription>
            Practice difficult conversations with an AI roleplay partner. Get feedback and try again to build confidence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "setup" && (
            <div className="space-y-4">
              <div>
                <label className="font-medium">Who do you want to practice with?</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {role === "custom" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom role (e.g. boss, sibling, etc.)"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                  />
                )}
              </div>
              <div>
                <label className="font-medium">Describe your scenario</label>
                <Textarea
                  placeholder="e.g. I want to ask my teacher for an extension on an assignment."
                  value={scenario}
                  onChange={e => setScenario(e.target.value)}
                />
              </div>
              <Button onClick={handleStart} disabled={!scenario.trim()} className="w-full">
                Start Roleplay
              </Button>
            </div>
          )}

          {step === "chat" && (
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto bg-muted/30 rounded-lg p-3 mb-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-lg px-3 py-2 ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                      <span className="text-sm">{msg.content}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-muted-foreground text-xs">Echoes is typing...</div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !userInput.trim()}>
                  Send
                </Button>
              </div>
              <Button variant="outline" onClick={handleFeedback} className="w-full mt-2" disabled={isLoading}>
                Get Feedback & Suggestions
              </Button>
            </div>
          )}

          {step === "feedback" && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="font-semibold mb-2">AI Feedback</div>
                <div className="mb-2 text-sm">{feedback}</div>
                {hints.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                )}
              </div>
              <Button onClick={handleRetry} className="w-full flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

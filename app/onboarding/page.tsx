"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Heart, Shield, Mic, MessageCircle, TrendingUp, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Your Safe Space",
    description: "Echoes is here to support your emotional growth journey with AI-powered tools designed just for you.",
    icon: Heart,
    content: (
      <div className="text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-gentle-pulse">
          <Heart className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-heading font-semibold">You're not alone in this journey</h3>
          <p className="text-muted-foreground text-pretty max-w-md mx-auto">
            Whether you're dealing with anxiety, depression, or just need someone to talk to, Echoes provides a
            judgment-free space to express yourself and practice important conversations.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Privacy & Safety First",
    description: "Your conversations are completely private and secure. We're here to support, not judge.",
    icon: Shield,
    content: (
      <div className="space-y-6">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-heading font-semibold text-center">Your data stays yours</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">End-to-end encryption for all conversations</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">Crisis detection with immediate support resources</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">Option for completely anonymous usage</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center italic">
            "This is simulated guidance and not a substitute for professional help."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Choose Your Journey",
    description: "Select the features that feel right for you. You can always change these later.",
    icon: TrendingUp,
    content: null, // Will be handled separately
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedModes, setSelectedModes] = useState({
    journaling: true,
    practice: true,
    insights: true,
  })
  const [anonymousMode, setAnonymousMode] = useState(false)
  const router = useRouter()

  const currentStepData = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleMode = (mode: keyof typeof selectedModes) => {
    setSelectedModes((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {onboardingSteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
                {index < onboardingSteps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Badge variant="secondary" className="px-3 py-1">
                Step {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-balance">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground text-pretty">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Step 3: Mode Selection */}
            {currentStep === 2 ? (
              <div className="space-y-6">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-semibold text-center">What would you like to explore?</h3>

                  <div className="grid gap-4">
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedModes.journaling
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-muted/50 bg-transparent"
                      }`}
                      onClick={() => toggleMode("journaling")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                            <Mic className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold">Expression Mode</h4>
                            <p className="text-sm text-muted-foreground">
                              Voice journaling, doodles, and AI-generated healing narratives
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedModes.journaling ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {selectedModes.journaling && <Check className="h-4 w-4 text-primary-foreground" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedModes.practice
                          ? "ring-2 ring-secondary bg-secondary/5"
                          : "hover:bg-muted/50 bg-transparent"
                      }`}
                      onClick={() => toggleMode("practice")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold">Practice Mode</h4>
                            <p className="text-sm text-muted-foreground">
                              Roleplay difficult conversations with AI partners
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedModes.practice ? "border-secondary bg-secondary" : "border-muted-foreground"
                            }`}
                          >
                            {selectedModes.practice && <Check className="h-4 w-4 text-secondary-foreground" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedModes.insights ? "ring-2 ring-accent bg-accent/5" : "hover:bg-muted/50 bg-transparent"
                      }`}
                      onClick={() => toggleMode("insights")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold">Growth Insights</h4>
                            <p className="text-sm text-muted-foreground">
                              Track your emotional journey and confidence over time
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedModes.insights ? "border-accent bg-accent" : "border-muted-foreground"
                            }`}
                          >
                            {selectedModes.insights && <Check className="h-4 w-4 text-accent-foreground" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="anonymous-mode" className="font-medium">
                        Anonymous Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">Use Echoes without creating an account</p>
                    </div>
                    <Switch
                      id="anonymous-mode"
                      checked={anonymousMode}
                      onCheckedChange={setAnonymousMode}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              currentStepData.content
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6"
              >
                {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Support Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            If you're in immediate danger, please call{" "}
            <span className="font-semibold text-destructive">your local emergency number</span>. You are not alone.
          </p>
        </div>
      </div>
    </div>
  )
}

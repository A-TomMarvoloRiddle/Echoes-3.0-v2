"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Mic, MessageCircle, TrendingUp, Shield, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full animate-gentle-pulse">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4 text-balance">
            Welcome to <span className="text-primary">Echoes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Your AI-powered emotional growth companion. Practice difficult conversations, express your feelings, and
            track your journey to better mental health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl"
              onClick={() => router.push("/onboarding")}
            >
              Start Your Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 rounded-xl bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-heading">Expression Mode</CardTitle>
              <CardDescription className="text-muted-foreground">
                Share your feelings through voice, text, or doodles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Voice journaling with AI insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Transform feelings into healing stories
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Mood tracking and timeline
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-xl font-heading">Practice Mode</CardTitle>
              <CardDescription className="text-muted-foreground">
                Roleplay difficult conversations with AI partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Talk to AI parents, friends, teachers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Get feedback on tone and confidence
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Build communication skills safely
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl font-heading">Growth Insights</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your emotional journey over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Personalized growth stories
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Confidence progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Gentle daily check-ins
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Safety & Privacy Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-muted/50 to-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-heading">Your Safety Comes First</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Echoes is designed with privacy and safety at its core. Your conversations are confidential, and we
              provide immediate support resources when needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                End-to-End Encryption
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Crisis Detection
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Anonymous Mode
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Cultural Sensitivity
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "You're in a safe place. Share what's on your mind — your Echo is just for you."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Users, GraduationCap, Heart, Stethoscope, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const roleplayScenarios = [
  {
    id: "parent",
    title: "Talk to Parent",
    description: "Practice difficult conversations with a supportive parent figure",
    icon: Heart,
    color: "primary",
    scenarios: [
      "Tell your parents you're struggling with anxiety",
      "Ask for help with school stress",
      "Discuss feeling overwhelmed with expectations",
      "Share that you need mental health support",
    ],
  },
  {
    id: "friend",
    title: "Support a Friend",
    description: "Learn how to help friends who are going through tough times",
    icon: Users,
    color: "secondary",
    scenarios: [
      "Help a friend who seems depressed",
      "Respond when someone shares they're struggling",
      "Support a friend with anxiety",
      "Be there for someone feeling lonely",
    ],
  },
  {
    id: "teacher",
    title: "Talk to Teacher",
    description: "Practice asking for academic help and accommodations",
    icon: GraduationCap,
    color: "accent",
    scenarios: [
      "Ask for an extension due to mental health",
      "Explain difficulty concentrating in class",
      "Request additional support or resources",
      "Discuss academic struggles openly",
    ],
  },
  {
    id: "counselor",
    title: "Meet with Counselor",
    description: "Practice opening up to a mental health professional",
    icon: Stethoscope,
    color: "primary",
    scenarios: [
      "First therapy session conversation",
      "Discuss anxiety and coping strategies",
      "Talk about depression symptoms",
      "Share family or relationship concerns",
    ],
  },
]

const recentPractices = [
  {
    id: 1,
    scenario: "Talk to Parent about Anxiety",
    role: "parent",
    confidence: { before: 3, after: 7 },
    feedback: "Great improvement in directness. Try using 'I feel' statements more.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    scenario: "Support Depressed Friend",
    role: "friend",
    confidence: { before: 5, after: 8 },
    feedback: "Excellent empathy shown. Remember to ask open-ended questions.",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    scenario: "Request Teacher Help",
    role: "teacher",
    confidence: { before: 4, after: 6 },
    feedback: "Good progress. Practice being more specific about your needs.",
    timestamp: "3 days ago",
  },
]

export default function PracticeModePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary border-primary/20"
      case "secondary":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "accent":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Practice Mode</h1>
            <p className="text-muted-foreground">Build confidence through safe roleplay conversations</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Selection */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Choose Your Practice Partner</CardTitle>
                <CardDescription>Select who you'd like to practice talking with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {roleplayScenarios.map((role) => {
                    const IconComponent = role.icon
                    return (
                      <Card
                        key={role.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedRole === role.id
                            ? `ring-2 ring-${role.color} ${getColorClasses(role.color)}`
                            : "hover:bg-muted/50 bg-transparent"
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(role.color)}`}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading font-semibold mb-1">{role.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {role.scenarios.length} scenarios
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Scenario Selection */}
            {selectedRole && (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-heading">Choose a Scenario</CardTitle>
                  <CardDescription>
                    Pick a situation you'd like to practice with your{" "}
                    {roleplayScenarios.find((r) => r.id === selectedRole)?.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roleplayScenarios
                      .find((r) => r.id === selectedRole)
                      ?.scenarios.map((scenario, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-muted/50 transition-colors bg-transparent"
                          onClick={() =>
                            router.push(`/practice/${selectedRole}?scenario=${encodeURIComponent(scenario)}`)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="font-medium">{scenario}</span>
                              </div>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Start Practice
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors bg-transparent border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center gap-3 text-muted-foreground">
                          <Plus className="h-4 w-4" />
                          <span className="font-medium">Create Custom Scenario</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Practice Sessions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-heading">Recent Practice Sessions</CardTitle>
                    <CardDescription>Your progress in building communication confidence</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPractices.map((practice) => (
                  <Card key={practice.id} className="bg-background/50 hover:bg-background/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-heading font-semibold">{practice.scenario}</h4>
                          <p className="text-sm text-muted-foreground">{practice.timestamp}</p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {practice.role}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="ml-2 font-medium">
                              {practice.confidence.before}/10 → {practice.confidence.after}/10
                            </span>
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(practice.confidence.after / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Feedback:</span> {practice.feedback}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Practice Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Practice Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Take your time. There's no rush in these conversations.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Use "I feel" statements to express your emotions clearly.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">It's okay to pause and think before responding.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Practice makes progress, not perfection.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confidence Tracker */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Confidence</span>
                      <span className="font-medium">7.2/10</span>
                    </div>
                    <div className="bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "72%" }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-primary">12</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-secondary">4</div>
                      <div className="text-xs text-muted-foreground">Scenarios</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encouragement */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold mb-2">You're Building Courage</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Every conversation you practice here makes real-world conversations a little easier. You're developing
                  skills that will serve you for life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

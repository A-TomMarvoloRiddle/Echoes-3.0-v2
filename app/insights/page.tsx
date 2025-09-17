"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  Heart,
  MessageCircle,
  Mic,
  Download,
  Share2,
  Sparkles,
  Target,
  Award,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for charts
const moodData = [
  { date: "Jan 1", mood: 3, confidence: 4 },
  { date: "Jan 8", mood: 4, confidence: 5 },
  { date: "Jan 15", mood: 2, confidence: 3 },
  { date: "Jan 22", mood: 5, confidence: 6 },
  { date: "Jan 29", mood: 4, confidence: 7 },
  { date: "Feb 5", mood: 6, confidence: 8 },
  { date: "Feb 12", mood: 5, confidence: 7 },
  { date: "Feb 19", mood: 7, confidence: 8 },
  { date: "Feb 26", mood: 6, confidence: 9 },
  { date: "Mar 5", mood: 8, confidence: 9 },
]

const activityData = [
  { name: "Voice Journals", count: 15, color: "#A8E6CF" },
  { name: "Text Entries", count: 8, color: "#CE93D8" },
  { name: "Doodles", count: 5, color: "#FFABAB" },
  { name: "Practice Sessions", count: 12, color: "#F3E5F5" },
]

const weeklyMoodData = [
  { day: "Mon", mood: 6 },
  { day: "Tue", mood: 7 },
  { day: "Wed", mood: 5 },
  { day: "Thu", mood: 8 },
  { day: "Fri", mood: 6 },
  { day: "Sat", mood: 9 },
  { day: "Sun", mood: 7 },
]

const milestones = [
  {
    id: 1,
    title: "First Voice Journal",
    description: "You shared your first voice recording",
    date: "2 weeks ago",
    icon: Mic,
    achieved: true,
  },
  {
    id: 2,
    title: "Confidence Builder",
    description: "Completed 5 practice conversations",
    date: "1 week ago",
    icon: MessageCircle,
    achieved: true,
  },
  {
    id: 3,
    title: "Mood Tracker",
    description: "Logged mood for 7 consecutive days",
    date: "3 days ago",
    icon: Heart,
    achieved: true,
  },
  {
    id: 4,
    title: "Growth Mindset",
    description: "Show improvement in confidence scores",
    date: "In progress",
    icon: TrendingUp,
    achieved: false,
  },
]

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const router = useRouter()

  const growthStory = `Over the past month, your journey with Echoes has been remarkable. You started with hesitant whispers, unsure of your own voice, but now you speak with growing confidence. 

Your mood patterns show a beautiful upward trend - from those difficult days in January where anxiety felt overwhelming, to recent weeks where hope has become your companion more often than fear.

The practice conversations have been transformative. Remember that first session with the AI parent where you could barely express your feelings? Now you're articulating your needs with clarity and self-compassion. Your confidence scores have nearly doubled.

Most importantly, you've learned that growth isn't linear. The dips in your mood chart aren't failures - they're proof that you're human, that you're feeling, and that you're brave enough to keep showing up for yourself.

You're not the same person who started this journey. You're stronger, more self-aware, and more connected to your own emotional landscape. Keep going - your future self is cheering you on.`

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Growth Insights</h1>
              <p className="text-muted-foreground">Your journey of emotional growth and self-discovery</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
            <TabsTrigger value="confidence">Confidence</TabsTrigger>
            <TabsTrigger value="story">Growth Story</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Entries</p>
                      <p className="text-3xl font-heading font-bold text-primary">28</p>
                    </div>
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Mic className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Practice Sessions</p>
                      <p className="text-3xl font-heading font-bold text-secondary">12</p>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+25% confidence boost</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Mood</p>
                      <p className="text-3xl font-heading font-bold text-accent">7.2</p>
                    </div>
                    <div className="bg-accent/20 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Out of 10</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Streak</p>
                      <p className="text-3xl font-heading font-bold text-primary">14</p>
                    </div>
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Days active</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Mood & Confidence Trends</CardTitle>
                  <CardDescription>Your emotional journey over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#A8E6CF"
                        strokeWidth={3}
                        dot={{ fill: "#A8E6CF", strokeWidth: 2, r: 4 }}
                        name="Mood"
                      />
                      <Line
                        type="monotone"
                        dataKey="confidence"
                        stroke="#CE93D8"
                        strokeWidth={3}
                        dot={{ fill: "#CE93D8", strokeWidth: 2, r: 4 }}
                        name="Confidence"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Activity Breakdown</CardTitle>
                  <CardDescription>How you've been expressing yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {activityData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Milestones & Achievements
                </CardTitle>
                <CardDescription>Celebrating your progress along the way</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {milestones.map((milestone) => {
                    const IconComponent = milestone.icon
                    return (
                      <div
                        key={milestone.id}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                          milestone.achieved
                            ? "bg-primary/5 border border-primary/20"
                            : "bg-muted/30 border border-muted"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            milestone.achieved ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading font-semibold">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                        </div>
                        {milestone.achieved && <Badge className="bg-primary text-primary-foreground">Achieved</Badge>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Weekly Mood Pattern</CardTitle>
                    <CardDescription>How your mood varies throughout the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyMoodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="day" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="mood" fill="#A8E6CF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Mood Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-muted-foreground">
                          Your mood is highest on weekends, suggesting rest helps your wellbeing
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                        <p className="text-muted-foreground">
                          Wednesday tends to be your most challenging day - consider extra self-care
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <p className="text-muted-foreground">Your overall mood trend is positive and improving</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Mood Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center mb-4">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div key={index} className="text-xs text-muted-foreground p-1 font-medium">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 28 }, (_, index) => {
                        const moodLevel = Math.floor(Math.random() * 5) + 1
                        const colors = ["bg-red-200", "bg-orange-200", "bg-yellow-200", "bg-green-200", "bg-blue-200"]
                        return (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs ${colors[moodLevel - 1]} cursor-pointer hover:scale-110 transition-transform`}
                            title={`Day ${index + 1}: Mood ${moodLevel}/5`}
                          >
                            {index + 1}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-orange-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-yellow-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                      </div>
                      <span>High</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="confidence" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Confidence Growth</CardTitle>
                <CardDescription>Your journey building communication confidence</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#CE93D8"
                      strokeWidth={4}
                      dot={{ fill: "#CE93D8", strokeWidth: 2, r: 6 }}
                      name="Confidence Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-heading font-bold text-secondary mb-2">125%</div>
                  <p className="text-sm text-muted-foreground">Confidence Improvement</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">8.5</div>
                  <p className="text-sm text-muted-foreground">Current Confidence Level</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-heading font-bold text-accent mb-2">12</div>
                  <p className="text-sm text-muted-foreground">Practice Sessions Completed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-heading">Your Growth Story</CardTitle>
                <CardDescription className="text-lg">
                  A personalized narrative of your emotional journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  {growthStory.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex gap-4 justify-center pt-6">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Download className="mr-2 h-4 w-4" />
                    Download Story
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

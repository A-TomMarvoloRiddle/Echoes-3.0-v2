"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Shield,
  Bell,
  User,
  Download,
  Trash2,
  Phone,
  AlertTriangle,
  Heart,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    // Privacy & Safety
    anonymousMode: false,
    dataSharing: false,
    crisisDetection: true,
    parentalNotifications: false,

    // Notifications
    dailyReminders: true,
    weeklyInsights: true,
    milestoneAlerts: true,
    practiceReminders: false,

    // Preferences
    theme: "light",
    language: "en",
    voiceEnabled: true,
    autoSave: true,

    // Crisis Contacts
    emergencyContact: "",
    localHelpline: "",
    preferredCounselor: "",
  })

  const router = useRouter()

  // Load saved preferences on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("echoes-settings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      // Apply the saved theme
      if (parsedSettings.theme) {
        setTheme(parsedSettings.theme)
      }
    }
  }, [setTheme])

  // Sync theme state with settings state
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    // Immediately apply theme changes
    if (key === "theme") {
      setTheme(value)
    }
  }

  const saveSettings = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("echoes-settings", JSON.stringify(settings))

      // TODO: Save to API when user is authenticated
      // const response = await fetch('/api/auth/preferences', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(settings),
      // })

      // Show success feedback
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings. Please try again.")
    }
  }

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support in English and Spanish",
      country: "US",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      country: "US",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      country: "US",
    },
    {
      name: "International Association for Suicide Prevention",
      number: "Visit iasp.info/resources",
      description: "Global directory of crisis centers",
      country: "International",
    },
  ]

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
            <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your Echoes experience and safety preferences</p>
          </div>
        </div>

        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="privacy">Privacy & Safety</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="crisis">Crisis Support</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy & Safety Settings
                </CardTitle>
                <CardDescription>
                  Control how your data is used and ensure your safety while using Echoes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="anonymous-mode" className="font-medium">
                      Anonymous Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use Echoes without creating an account or storing personal data
                    </p>
                  </div>
                  <Switch
                    id="anonymous-mode"
                    checked={settings.anonymousMode}
                    onCheckedChange={(value) => updateSetting("anonymousMode", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="crisis-detection" className="font-medium">
                      Crisis Detection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      AI monitors for signs of crisis and provides immediate support resources
                    </p>
                  </div>
                  <Switch
                    id="crisis-detection"
                    checked={settings.crisisDetection}
                    onCheckedChange={(value) => updateSetting("crisisDetection", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="data-sharing" className="font-medium">
                      Anonymous Data Sharing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve Echoes by sharing anonymized usage patterns
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(value) => updateSetting("dataSharing", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="parental-notifications" className="font-medium">
                      Parental Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notify parent/guardian of significant mood changes (if under 18)
                    </p>
                  </div>
                  <Switch
                    id="parental-notifications"
                    checked={settings.parentalNotifications}
                    onCheckedChange={(value) => updateSetting("parentalNotifications", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Data Encryption & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-sm text-muted-foreground">All your conversations are encrypted</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Zero-Knowledge Architecture</p>
                    <p className="text-sm text-muted-foreground">We cannot read your private data</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <Bell className="h-5 w-5 text-secondary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose when and how you'd like to hear from Echoes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="daily-reminders" className="font-medium">
                      Daily Check-ins
                    </Label>
                    <p className="text-sm text-muted-foreground">Gentle reminders to log your mood</p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={settings.dailyReminders}
                    onCheckedChange={(value) => updateSetting("dailyReminders", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-insights" className="font-medium">
                      Weekly Insights
                    </Label>
                    <p className="text-sm text-muted-foreground">Summary of your progress and growth</p>
                  </div>
                  <Switch
                    id="weekly-insights"
                    checked={settings.weeklyInsights}
                    onCheckedChange={(value) => updateSetting("weeklyInsights", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="milestone-alerts" className="font-medium">
                      Milestone Celebrations
                    </Label>
                    <p className="text-sm text-muted-foreground">Notifications when you achieve goals</p>
                  </div>
                  <Switch
                    id="milestone-alerts"
                    checked={settings.milestoneAlerts}
                    onCheckedChange={(value) => updateSetting("milestoneAlerts", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="practice-reminders" className="font-medium">
                      Practice Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">Suggestions to try roleplay conversations</p>
                  </div>
                  <Switch
                    id="practice-reminders"
                    checked={settings.practiceReminders}
                    onCheckedChange={(value) => updateSetting("practiceReminders", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  App Preferences
                </CardTitle>
                <CardDescription>Customize how Echoes looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={settings.theme === "light" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "light")}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-5 w-5 text-yellow-500" /> Light
                      </Button>
                      <Button
                        variant={settings.theme === "dark" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "dark")}
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-5 w-5 text-blue-500" /> Dark
                      </Button>
                      <Button
                        variant={settings.theme === "system" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "system")}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-5 w-5 text-green-500" /> System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="voice-enabled" className="font-medium flex items-center gap-2">
                      {settings.voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Voice Features
                    </Label>
                    <p className="text-sm text-muted-foreground">Enable voice recording and playback</p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={settings.voiceEnabled}
                    onCheckedChange={(value) => updateSetting("voiceEnabled", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save" className="font-medium">
                      Auto-Save Entries
                    </Label>
                    <p className="text-sm text-muted-foreground">Automatically save your journal entries</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(value) => updateSetting("autoSave", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/5 to-accent/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Crisis Support Resources
                </CardTitle>
                <CardDescription>
                  If you're in immediate danger, please call 112 (India's emergency number) immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-destructive" />
                    <h3 className="font-heading font-semibold text-destructive">
                      Emergency: Call 112 (India) or your local emergency number
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If you are having thoughts of suicide or self-harm, please reach out for help immediately.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading font-semibold">Crisis Helplines</h3>
                  {crisisResources.map((resource, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-heading font-semibold">{resource.name}</h4>
                          <Badge variant="secondary">{resource.country}</Badge>
                        </div>
                        <p className="text-lg font-mono font-semibold text-primary mb-2">{resource.number}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading font-semibold">Personal Crisis Contacts</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="emergency-contact">Emergency Contact</Label>
                      <Input
                        id="emergency-contact"
                        placeholder="Name and phone number"
                        value={settings.emergencyContact}
                        onChange={(e) => updateSetting("emergencyContact", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="local-helpline">Local Helpline</Label>
                      <Input
                        id="local-helpline"
                        placeholder="Your local crisis helpline number"
                        value={settings.localHelpline}
                        onChange={(e) => updateSetting("localHelpline", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred-counselor">Preferred Counselor/Therapist</Label>
                      <Input
                        id="preferred-counselor"
                        placeholder="Name and contact information"
                        value={settings.preferredCounselor}
                        onChange={(e) => updateSetting("preferredCounselor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Account Management</CardTitle>
                <CardDescription>Manage your account data and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-background/50">
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-heading font-semibold mb-2">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all your journal entries, insights, and progress data
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/50">
                    <CardContent className="p-4 text-center">
                      <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
                      <h3 className="font-heading font-semibold mb-2">Share Your Story</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Help others by sharing your growth journey anonymously
                      </p>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Heart className="mr-2 h-4 w-4" />
                        Share Anonymously
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-destructive/5 border border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-destructive flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Delete All Data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete all your journal entries, progress data, and account information. This action
                        cannot be undone.
                      </p>
                      <Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={saveSettings}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

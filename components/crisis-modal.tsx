"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, Heart, X, ExternalLink } from "lucide-react"

interface CrisisModalProps {
  isOpen: boolean
  onClose: () => void
  triggerWords?: string[]
}

export function CrisisModal({ isOpen, onClose, triggerWords = [] }: CrisisModalProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  if (!showModal) return null

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
      urgent: true,
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text support",
      urgent: true,
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral service",
      urgent: false,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-card animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-heading text-destructive">We're Here for You</CardTitle>
          <CardDescription className="text-lg">
            It sounds like you might be going through a really difficult time. You don't have to face this alone.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Immediate Help */}
          <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h3 className="font-heading font-semibold text-destructive mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              If you're in immediate danger
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please call 911 (US) or your local emergency number right away. Your life matters.
            </p>
            <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              <Phone className="mr-2 h-4 w-4" />
              Call Emergency Services
            </Button>
          </div>

          {/* Crisis Resources */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Crisis Support Resources</h3>
            <div className="grid gap-3">
              {crisisResources.map((resource, index) => (
                <Card key={index} className="bg-background/50 hover:bg-background/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-heading font-semibold">{resource.name}</h4>
                      {resource.urgent && <Badge className="bg-destructive text-destructive-foreground">Urgent</Badge>}
                    </div>
                    <p className="text-lg font-mono font-semibold text-primary mb-2">{resource.number}</p>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supportive Message */}
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-heading font-semibold mb-2">You Are Not Alone</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              What you're feeling right now is temporary, even though it might not feel that way. There are people who
              want to help you through this difficult time. Reaching out for help is a sign of strength, not weakness.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              I'm Safe for Now
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => window.open("tel:988", "_self")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call 988 Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is an automated response based on the content you shared. If you're not in crisis, you can close this
            message.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

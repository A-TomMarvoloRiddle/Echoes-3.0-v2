// Enhanced crisis detection service with backend integration
import { db } from "./database"

export interface CrisisAnalysis {
  risk: "low" | "moderate" | "high" | "critical"
  confidence: number
  triggers: string[]
  shouldShowModal: boolean
  severity: "low" | "medium" | "high" | "critical"
  recommendations: string[]
}

export class CrisisDetectionService {
  private readonly CRISIS_KEYWORDS = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "better off dead",
    "no point living",
    "hurt myself",
    "self harm",
    "cut myself",
    "overdose",
    "hopeless",
    "worthless",
    "nobody cares",
    "give up",
    "can't go on",
    "end my life",
    "not worth living",
    "everyone would be better without me",
  ]

  private readonly MODERATE_CONCERN_KEYWORDS = [
    "depressed",
    "anxious",
    "overwhelmed",
    "scared",
    "alone",
    "isolated",
    "struggling",
    "difficult",
    "hard time",
    "can't cope",
    "breaking down",
    "falling apart",
    "lost",
    "empty",
    "numb",
    "exhausted",
    "trapped",
  ]

  private readonly CRITICAL_PHRASES = [
    "planning to kill myself",
    "have a plan",
    "tonight is the night",
    "goodbye everyone",
    "this is my last",
    "taking pills",
    "jumping off",
  ]

  // Analyze text for crisis indicators
  async analyzeContent(
    content: string,
    context: "journal" | "voice" | "practice" | "general" = "general",
    userId?: string,
  ): Promise<CrisisAnalysis> {
    const lowerContent = content.toLowerCase()
    const triggers: string[] = []
    let riskScore = 0
    let severity: "low" | "medium" | "high" | "critical" = "low"

    // Check for critical phrases first
    this.CRITICAL_PHRASES.forEach((phrase) => {
      if (lowerContent.includes(phrase)) {
        triggers.push(phrase)
        riskScore += 10
        severity = "critical"
      }
    })

    // Check for high-risk keywords
    this.CRISIS_KEYWORDS.forEach((keyword) => {
      if (lowerContent.includes(keyword)) {
        triggers.push(keyword)
        riskScore += 5
        if (severity !== "critical") {
          severity = "high"
        }
      }
    })

    // Check for moderate concern keywords
    this.MODERATE_CONCERN_KEYWORDS.forEach((keyword) => {
      if (lowerContent.includes(keyword)) {
        triggers.push(keyword)
        riskScore += 2
        if (severity === "low") {
          severity = "medium"
        }
      }
    })

    // Determine risk level
    let risk: "low" | "moderate" | "high" | "critical" = "low"
    if (riskScore >= 10) {
      risk = "critical"
    } else if (riskScore >= 8) {
      risk = "high"
    } else if (riskScore >= 4) {
      risk = "moderate"
    }

    // Calculate confidence
    const confidence = Math.min(
      triggers.length * 0.15 + riskScore * 0.08 + (context === "journal" ? 0.1 : 0), // Journal entries get slight confidence boost
      1,
    )

    // Generate recommendations
    const recommendations = this.generateRecommendations(risk, context)

    const analysis: CrisisAnalysis = {
      risk,
      confidence,
      triggers: [...new Set(triggers)], // Remove duplicates
      shouldShowModal: risk === "critical" || risk === "high" || (risk === "moderate" && confidence > 0.7),
      severity,
      recommendations,
    }

    // Store crisis alert if high risk and user is authenticated
    if (userId && (risk === "high" || risk === "critical")) {
      await this.createCrisisAlert(userId, content, analysis)
    }

    return analysis
  }

  // Create crisis alert in database
  private async createCrisisAlert(userId: string, content: string, analysis: CrisisAnalysis): Promise<void> {
    try {
      await db.createCrisisAlert({
        userId,
        content: content.substring(0, 500), // Limit content length
        severity: analysis.severity,
        resolved: false,
      })
    } catch (error) {
      console.error("Failed to create crisis alert:", error)
    }
  }

  // Generate contextual recommendations
  private generateRecommendations(risk: "low" | "moderate" | "high" | "critical", context: string): string[] {
    const baseRecommendations = {
      critical: [
        "Contact emergency services (911) immediately if in immediate danger",
        "Call National Suicide Prevention Lifeline: 988",
        "Reach out to a trusted friend, family member, or counselor",
        "Go to your nearest emergency room",
        "Remove any means of self-harm from your immediate environment",
      ],
      high: [
        "Call National Suicide Prevention Lifeline: 988",
        "Text HOME to 741741 for Crisis Text Line",
        "Contact a mental health professional",
        "Reach out to a trusted person in your support network",
        "Consider visiting a crisis center or emergency room",
      ],
      moderate: [
        "Talk to a counselor, therapist, or trusted adult",
        "Call SAMHSA National Helpline: 1-800-662-4357",
        "Practice grounding techniques and self-care",
        "Connect with supportive friends or family",
        "Consider scheduling an appointment with a mental health professional",
      ],
      low: [
        "Continue journaling and self-reflection",
        "Practice mindfulness and relaxation techniques",
        "Maintain connections with supportive people",
        "Consider talking to a counselor if feelings persist",
        "Engage in activities that bring you joy and peace",
      ],
    }

    return baseRecommendations[risk] || baseRecommendations.low
  }

  // Get user's crisis alerts
  async getUserCrisisAlerts(userId: string) {
    return await db.getCrisisAlertsByUser(userId)
  }

  // Resolve crisis alert
  async resolveCrisisAlert(alertId: string): Promise<boolean> {
    return await db.resolveCrisisAlert(alertId)
  }

  // Check if user has active crisis alerts
  async hasActiveCrisisAlerts(userId: string): Promise<boolean> {
    const alerts = await this.getUserCrisisAlerts(userId)
    return alerts.length > 0
  }
}

export const crisisDetectionService = new CrisisDetectionService()

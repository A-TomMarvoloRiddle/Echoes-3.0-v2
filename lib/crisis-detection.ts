"use client"

import React from "react"

// Client-side crisis detection utilities

export interface CrisisAnalysis {
  risk: "low" | "moderate" | "high"
  confidence: number
  triggers: string[]
  shouldShowModal: boolean
}

export async function analyzeCrisisRisk(text: string, context?: string): Promise<CrisisAnalysis> {
  try {
    const response = await fetch("/api/crisis-detection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, context }),
    })

    if (!response.ok) {
      throw new Error("Crisis detection API error")
    }

    const data = await response.json()

    return {
      ...data.analysis,
      shouldShowModal:
        data.analysis.risk === "high" || (data.analysis.risk === "moderate" && data.analysis.confidence > 0.7),
    }
  } catch (error) {
    console.error("Crisis detection failed:", error)
    // Fallback to basic keyword detection
    return basicCrisisDetection(text)
  }
}

function basicCrisisDetection(text: string): CrisisAnalysis {
  const lowerText = text.toLowerCase()
  const highRiskKeywords = ["suicide", "kill myself", "want to die", "end it all"]

  const hasHighRiskKeywords = highRiskKeywords.some((keyword) => lowerText.includes(keyword))

  return {
    risk: hasHighRiskKeywords ? "high" : "low",
    confidence: hasHighRiskKeywords ? 0.8 : 0.1,
    triggers: hasHighRiskKeywords ? ["detected concerning language"] : [],
    shouldShowModal: hasHighRiskKeywords,
  }
}

// Hook for easy integration in components
export function useCrisisDetection() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const analyzeText = React.useCallback(async (text: string, context?: string) => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeCrisisRisk(text, context)
      return result
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return { analyzeText, isAnalyzing }
}

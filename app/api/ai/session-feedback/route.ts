import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { aiService } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }
    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }
    const { messages, confidenceBefore, confidenceAfter } = await request.json()
    if (!messages || confidenceBefore === undefined || confidenceAfter === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }
    const result = await aiService.generateSessionFeedback(messages, confidenceBefore, confidenceAfter)
    return NextResponse.json({ success: true, feedback: result.feedback, tips: result.tips })
  } catch (error) {
    console.error("Session feedback error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate feedback" }, { status: 500 })
  }
}

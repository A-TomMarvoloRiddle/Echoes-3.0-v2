import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/database"
import { aiService } from "@/lib/ai-services"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const { confidenceAfter } = await request.json()
    const sessionId = params.id

    if (confidenceAfter === undefined) {
      return NextResponse.json({ success: false, error: "Confidence rating is required" }, { status: 400 })
    }

    // Get practice session
    const practiceSession = await db.getPracticeSession(sessionId)
    if (!practiceSession || practiceSession.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Practice session not found" }, { status: 404 })
    }

    // Generate feedback
    const { feedback, tips } = await aiService.generateSessionFeedback(
      practiceSession.messages,
      practiceSession.confidenceBefore,
      confidenceAfter,
    )

    // Update session with completion data
    const updatedSession = await db.updatePracticeSession(sessionId, {
      confidenceAfter,
      feedback,
      tips,
      completedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      feedback,
      tips,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Feedback generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate feedback" }, { status: 500 })
  }
}

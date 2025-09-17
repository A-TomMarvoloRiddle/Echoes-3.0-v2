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

    const { message } = await request.json()
    const sessionId = params.id

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Get practice session
    const practiceSession = await db.getPracticeSession(sessionId)
    if (!practiceSession || practiceSession.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Practice session not found" }, { status: 404 })
    }

    // Add user message to session
    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      content: message,
      timestamp: new Date(),
    }

    // Generate AI response
    const aiResponse = await aiService.generateRoleplayResponse(
      {
        roleType: practiceSession.roleType,
        scenario: practiceSession.scenario,
        conversationHistory: practiceSession.messages,
      },
      message,
    )

    const aiMessage = {
      id: crypto.randomUUID(),
      sender: "ai" as const,
      content: aiResponse,
      timestamp: new Date(),
    }

    // Update session with both messages
    const updatedSession = await db.updatePracticeSession(sessionId, {
      messages: [...practiceSession.messages, userMessage, aiMessage],
    })

    return NextResponse.json({
      success: true,
      response: aiResponse,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Message processing error:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}

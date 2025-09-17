import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const sessionId = params.id
    const practiceSession = await db.getPracticeSession(sessionId)

    if (!practiceSession || practiceSession.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Practice session not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: practiceSession,
    })
  } catch (error) {
    console.error("Practice session retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve practice session" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const sessionId = params.id
    const updates = await request.json()

    // Verify session belongs to user
    const practiceSession = await db.getPracticeSession(sessionId)
    if (!practiceSession || practiceSession.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Practice session not found" }, { status: 404 })
    }

    const updatedSession = await db.updatePracticeSession(sessionId, updates)

    return NextResponse.json({
      success: true,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Practice session update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update practice session" }, { status: 500 })
  }
}

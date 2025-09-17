import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/database"

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

    const { roleType, scenario, confidenceBefore } = await request.json()

    if (!roleType || !scenario || confidenceBefore === undefined) {
      return NextResponse.json(
        { success: false, error: "Role type, scenario, and confidence rating are required" },
        { status: 400 },
      )
    }

    const practiceSession = await db.createPracticeSession({
      userId: session.user.id,
      roleType,
      scenario,
      confidenceBefore,
      messages: [],
    })

    return NextResponse.json({
      success: true,
      session: practiceSession,
    })
  } catch (error) {
    console.error("Practice session creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create practice session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const sessions = await db.getPracticeSessionsByUser(session.user.id, limit)

    return NextResponse.json({
      success: true,
      sessions,
    })
  } catch (error) {
    console.error("Practice sessions retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve practice sessions" }, { status: 500 })
  }
}

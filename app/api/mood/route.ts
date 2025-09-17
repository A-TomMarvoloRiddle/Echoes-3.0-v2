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

    const { mood, emotions, notes } = await request.json()

    if (mood === undefined) {
      return NextResponse.json({ success: false, error: "Mood rating is required" }, { status: 400 })
    }

    if (mood < 1 || mood > 10) {
      return NextResponse.json({ success: false, error: "Mood must be between 1 and 10" }, { status: 400 })
    }

    const entry = await db.createMoodEntry({
      userId: session.user.id,
      mood,
      emotions: emotions || [],
      notes,
    })

    return NextResponse.json({
      success: true,
      entry,
    })
  } catch (error) {
    console.error("Mood entry creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create mood entry" }, { status: 500 })
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
    const days = Number.parseInt(searchParams.get("days") || "30")

    const entries = await db.getMoodEntriesByUser(session.user.id, days)

    return NextResponse.json({
      success: true,
      entries,
    })
  } catch (error) {
    console.error("Mood entries retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve mood entries" }, { status: 500 })
  }
}

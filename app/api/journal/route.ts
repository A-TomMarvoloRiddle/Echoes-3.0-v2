import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/database"
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

    const { type, content, transcription, mood, emotions } = await request.json()

    if (!type || !content || mood === undefined) {
      return NextResponse.json({ success: false, error: "Type, content, and mood are required" }, { status: 400 })
    }

    // Create journal entry
    const entry = await db.createJournalEntry({
      userId: session.user.id,
      type,
      content,
      transcription,
      mood,
      emotions: emotions || [],
    })

    // Generate AI narrative
    try {
      const narrative = await aiService.generateNarrative({
        content: transcription || content,
        mood,
        emotions: emotions || [],
        type,
      })

      // Update entry with narrative
      const updatedEntry = await db.updateJournalEntry(entry.id, {
        aiNarrative: narrative,
      })

      return NextResponse.json({
        success: true,
        entry: updatedEntry,
      })
    } catch (narrativeError) {
      console.error("Narrative generation failed:", narrativeError)
      // Return entry without narrative if AI fails
      return NextResponse.json({
        success: true,
        entry,
        warning: "Entry saved but narrative generation failed",
      })
    }
  } catch (error) {
    console.error("Journal creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create journal entry" }, { status: 500 })
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

    const entries = await db.getJournalEntriesByUser(session.user.id, limit)

    return NextResponse.json({
      success: true,
      entries,
    })
  } catch (error) {
    console.error("Journal retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve journal entries" }, { status: 500 })
  }
}

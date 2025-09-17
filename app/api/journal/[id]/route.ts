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

    const entryId = params.id
    const entries = await db.getJournalEntriesByUser(session.user.id)
    const entry = entries.find((e) => e.id === entryId)

    if (!entry) {
      return NextResponse.json({ success: false, error: "Journal entry not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      entry,
    })
  } catch (error) {
    console.error("Journal entry retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve journal entry" }, { status: 500 })
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

    const entryId = params.id
    const updates = await request.json()

    // Verify entry belongs to user
    const entries = await db.getJournalEntriesByUser(session.user.id)
    const entry = entries.find((e) => e.id === entryId)

    if (!entry) {
      return NextResponse.json({ success: false, error: "Journal entry not found" }, { status: 404 })
    }

    const updatedEntry = await db.updateJournalEntry(entryId, updates)

    return NextResponse.json({
      success: true,
      entry: updatedEntry,
    })
  } catch (error) {
    console.error("Journal entry update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update journal entry" }, { status: 500 })
  }
}

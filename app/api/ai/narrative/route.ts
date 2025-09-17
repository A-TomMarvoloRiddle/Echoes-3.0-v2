import { type NextRequest, NextResponse } from "next/server"
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

    const { content, mood, emotions, type = "text" } = await request.json()

    if (!content || mood === undefined) {
      return NextResponse.json({ success: false, error: "Content and mood are required" }, { status: 400 })
    }

    const narrative = await aiService.generateNarrative({
      content,
      mood,
      emotions: emotions || [],
      type,
    })

    return NextResponse.json({
      success: true,
      narrative,
    })
  } catch (error) {
    console.error("Narrative generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate narrative" }, { status: 500 })
  }
}

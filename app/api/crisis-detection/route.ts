import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { crisisDetectionService } from "@/lib/crisis-detection-service"

export async function POST(request: NextRequest) {
  try {
    const { text, context = "general" } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 })
    }

    // Get user ID if authenticated (optional for crisis detection)
    let userId: string | undefined
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (token) {
      const session = auth.validateSession(token)
      userId = session?.user.id
    }

    const analysis = await crisisDetectionService.analyzeContent(text, context, userId)

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      context,
      userId: userId || null,
    })
  } catch (error) {
    console.error("Crisis detection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

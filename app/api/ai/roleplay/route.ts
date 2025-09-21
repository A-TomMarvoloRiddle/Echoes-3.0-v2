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
    const { roleType, scenario, conversationHistory, userMessage } = await request.json()
    if (!roleType || !scenario || !conversationHistory || !userMessage) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }
    const response = await aiService.generateRoleplayResponse({
      roleType,
      scenario,
      conversationHistory,
    }, userMessage)
    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error("Roleplay response error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate roleplay response" }, { status: 500 })
  }
}

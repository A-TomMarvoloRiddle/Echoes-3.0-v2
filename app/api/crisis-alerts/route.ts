import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { crisisDetectionService } from "@/lib/crisis-detection-service"

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

    const alerts = await crisisDetectionService.getUserCrisisAlerts(session.user.id)

    return NextResponse.json({
      success: true,
      alerts,
    })
  } catch (error) {
    console.error("Crisis alerts retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve crisis alerts" }, { status: 500 })
  }
}

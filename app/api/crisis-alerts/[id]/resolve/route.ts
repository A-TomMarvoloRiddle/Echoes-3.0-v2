import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { crisisDetectionService } from "@/lib/crisis-detection-service"

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

    const alertId = params.id
    const resolved = await crisisDetectionService.resolveCrisisAlert(alertId)

    if (!resolved) {
      return NextResponse.json({ success: false, error: "Crisis alert not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Crisis alert resolved",
    })
  } catch (error) {
    console.error("Crisis alert resolution error:", error)
    return NextResponse.json({ success: false, error: "Failed to resolve crisis alert" }, { status: 500 })
  }
}

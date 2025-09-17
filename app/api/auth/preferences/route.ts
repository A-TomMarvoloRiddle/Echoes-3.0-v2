import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const preferences = await request.json()
    const updatedUser = await auth.updateUserPreferences(preferences)

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Preferences update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 })
  }
}

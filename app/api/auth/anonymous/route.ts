import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST() {
  try {
    const session = await auth.createAnonymousUser()

    return NextResponse.json({
      success: true,
      user: session.user,
      token: session.token,
    })
  } catch (error) {
    console.error("Anonymous auth error:", error)
    return NextResponse.json({ success: false, error: "Failed to create anonymous user" }, { status: 500 })
  }
}

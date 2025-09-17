import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { voiceProcessor } from "@/lib/voice-processing"

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

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "Audio file is required" }, { status: 400 })
    }

    // Validate audio file
    const validation = voiceProcessor.validateAudio(audioFile)
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
    }

    // Process the audio
    const result = await voiceProcessor.transcribeAudio(audioFile)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Voice processing error:", error)
    return NextResponse.json({ success: false, error: "Failed to process audio" }, { status: 500 })
  }
}

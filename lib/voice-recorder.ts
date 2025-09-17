"use client"

import { useState } from "react"

// Client-side voice recording utilities
export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
}

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime = 0
  private pausedDuration = 0

  // Start recording
  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType(),
      })

      this.audioChunks = []
      this.startTime = Date.now()
      this.pausedDuration = 0

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
    } catch (error) {
      console.error("Failed to start recording:", error)
      throw new Error("Microphone access denied or not available")
    }
  }

  // Stop recording and return audio blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.getSupportedMimeType(),
        })
        this.cleanup()
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  // Pause recording
  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause()
      this.pausedDuration += Date.now() - this.startTime
    }
  }

  // Resume recording
  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume()
      this.startTime = Date.now()
    }
  }

  // Get current recording duration
  getDuration(): number {
    if (!this.startTime) return 0

    const currentTime = Date.now()
    const activeDuration = this.mediaRecorder?.state === "recording" ? currentTime - this.startTime : 0

    return Math.floor((this.pausedDuration + activeDuration) / 1000)
  }

  // Check if recording is active
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording"
  }

  // Check if recording is paused
  isPaused(): boolean {
    return this.mediaRecorder?.state === "paused"
  }

  // Clean up resources
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
    this.mediaRecorder = null
    this.audioChunks = []
    this.startTime = 0
    this.pausedDuration = 0
  }

  // Get supported MIME type for recording
  private getSupportedMimeType(): string {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return "audio/webm" // Fallback
  }

  // Check if browser supports recording
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
  }
}

// Hook for using voice recorder in React components
export const useVoiceRecorder = () => {
  const [recorder] = useState(() => new VoiceRecorder())
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
  })

  const startRecording = async () => {
    try {
      await recorder.startRecording()
      setState((prev) => ({ ...prev, isRecording: true, isPaused: false }))

      // Update duration every second
      const interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: recorder.getDuration(),
        }))
      }, 1000)

      // Store interval for cleanup
      ;(recorder as any).durationInterval = interval
    } catch (error) {
      console.error("Recording failed:", error)
      throw error
    }
  }

  const stopRecording = async () => {
    try {
      const audioBlob = await recorder.stopRecording()

      // Clear duration interval
      if ((recorder as any).durationInterval) {
        clearInterval((recorder as any).durationInterval)
      }

      setState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioBlob,
      })

      return audioBlob
    } catch (error) {
      console.error("Stop recording failed:", error)
      throw error
    }
  }

  const pauseRecording = () => {
    recorder.pauseRecording()
    setState((prev) => ({ ...prev, isPaused: true }))
  }

  const resumeRecording = () => {
    recorder.resumeRecording()
    setState((prev) => ({ ...prev, isPaused: false }))
  }

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isSupported: VoiceRecorder.isSupported(),
  }
}

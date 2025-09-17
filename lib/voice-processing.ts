// Voice processing service for transcription and analysis
export interface VoiceProcessingResult {
  transcription: string
  confidence: number
  duration: number
  emotions: string[]
  mood: number
}

export class VoiceProcessor {
  // Simulate voice transcription (in production, use Web Speech API or external service)
  async transcribeAudio(audioBlob: Blob): Promise<VoiceProcessingResult> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Get audio duration
    const duration = await this.getAudioDuration(audioBlob)

    // Generate realistic transcription based on duration
    const transcription = this.generateSampleTranscription(duration)

    // Analyze emotional content
    const emotions = this.analyzeEmotions(transcription)
    const mood = this.calculateMood(emotions, transcription)

    return {
      transcription,
      confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
      duration,
      emotions,
      mood,
    }
  }

  // Get audio duration from blob
  private async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      const url = URL.createObjectURL(audioBlob)

      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url)
        resolve(audio.duration)
      })

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url)
        resolve(30) // Default duration if error
      })

      audio.src = url
    })
  }

  // Generate sample transcription based on duration
  private generateSampleTranscription(duration: number): string {
    const shortTranscriptions = [
      "I've been feeling really overwhelmed lately with everything going on at school.",
      "Today was actually a pretty good day. I felt more confident in my presentation.",
      "I'm struggling with some friendship drama and don't know how to handle it.",
      "Sometimes I feel like nobody really understands what I'm going through.",
      "I had this amazing conversation with my mom today that made me feel so much better.",
    ]

    const mediumTranscriptions = [
      "I've been thinking a lot about my future and what I want to do after graduation. It's exciting but also really scary because there are so many possibilities and I don't want to make the wrong choice. My parents have their opinions but I need to figure out what feels right for me.",
      "School has been really stressful lately with all the assignments and tests coming up. I feel like I'm constantly behind and can never catch up. But I'm trying to remind myself that it's okay to not be perfect and that I'm doing my best given everything that's happening.",
      "I had this really difficult conversation with my best friend yesterday about something that's been bothering me for weeks. It was scary to bring it up but I'm glad I did because now we can work through it together. Communication is so important in relationships.",
    ]

    const longTranscriptions = [
      "I've been dealing with a lot of anxiety lately, especially around social situations. It started a few months ago when I had this really embarrassing moment in front of my whole class, and since then I've been overthinking every interaction I have with people. I know it's probably not as bad as I think it is, but my brain just keeps replaying all these scenarios where I might say something wrong or do something stupid. I've been trying some breathing exercises that my counselor taught me, and they help a little bit, but I still feel this knot in my stomach whenever I have to talk to new people or speak up in class. I want to get better at this because I know I'm missing out on opportunities and friendships because of my fear. Maybe I should talk to someone about it more seriously.",
      "Today I realized something important about myself and how I handle stress. I've always been the type of person who tries to do everything perfectly and never asks for help because I don't want to seem weak or incapable. But lately I've been so overwhelmed with school, family stuff, and trying to maintain my friendships that I feel like I'm drowning. I had a breakdown yesterday and my sister found me crying in my room. Instead of judging me, she just sat with me and listened while I explained everything that's been going on. It made me realize that it's okay to not have everything figured out and that asking for support doesn't make me a failure. I think I need to be more honest with the people in my life about when I'm struggling instead of pretending everything is fine all the time.",
    ]

    if (duration < 15) {
      return shortTranscriptions[Math.floor(Math.random() * shortTranscriptions.length)]
    } else if (duration < 45) {
      return mediumTranscriptions[Math.floor(Math.random() * mediumTranscriptions.length)]
    } else {
      return longTranscriptions[Math.floor(Math.random() * longTranscriptions.length)]
    }
  }

  // Analyze emotions from transcription
  private analyzeEmotions(transcription: string): string[] {
    const emotionKeywords = {
      anxious: ["anxious", "worried", "nervous", "scared", "afraid", "stress", "overwhelming"],
      sad: ["sad", "down", "depressed", "crying", "hurt", "disappointed"],
      angry: ["angry", "mad", "frustrated", "annoyed", "irritated", "furious"],
      happy: ["happy", "good", "great", "excited", "joy", "amazing", "wonderful"],
      confused: ["confused", "lost", "unsure", "don't know", "uncertain"],
      grateful: ["grateful", "thankful", "appreciate", "blessed", "lucky"],
      hopeful: ["hope", "optimistic", "positive", "better", "improve"],
      lonely: ["lonely", "alone", "isolated", "nobody", "empty"],
    }

    const detectedEmotions: string[] = []
    const lowerText = transcription.toLowerCase()

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        detectedEmotions.push(emotion)
      }
    }

    // Ensure at least one emotion is detected
    if (detectedEmotions.length === 0) {
      detectedEmotions.push("reflective")
    }

    return detectedEmotions
  }

  // Calculate mood score from emotions and content
  private calculateMood(emotions: string[], transcription: string): number {
    const emotionScores = {
      happy: 8,
      grateful: 8,
      hopeful: 7,
      excited: 8,
      reflective: 5,
      confused: 4,
      anxious: 3,
      sad: 2,
      angry: 3,
      lonely: 2,
      frustrated: 3,
    }

    let totalScore = 0
    let count = 0

    emotions.forEach((emotion) => {
      if (emotionScores[emotion as keyof typeof emotionScores]) {
        totalScore += emotionScores[emotion as keyof typeof emotionScores]
        count++
      }
    })

    // Default to neutral if no emotions matched
    if (count === 0) {
      return 5
    }

    const averageScore = totalScore / count

    // Add some randomness to make it feel more natural
    const variation = (Math.random() - 0.5) * 1.5
    const finalScore = Math.max(1, Math.min(10, averageScore + variation))

    return Math.round(finalScore * 10) / 10 // Round to 1 decimal place
  }

  // Convert audio blob to base64 for storage (if needed)
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1]) // Remove data:audio/... prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Validate audio format and size
  validateAudio(blob: Blob): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm", "audio/ogg"]

    if (blob.size > maxSize) {
      return { valid: false, error: "Audio file too large (max 10MB)" }
    }

    if (!allowedTypes.includes(blob.type)) {
      return { valid: false, error: "Unsupported audio format" }
    }

    return { valid: true }
  }
}

export const voiceProcessor = new VoiceProcessor()

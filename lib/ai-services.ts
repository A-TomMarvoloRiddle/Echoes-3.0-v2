import Anthropic from '@anthropic-ai/sdk'

// AI services for narrative generation and roleplay
export interface NarrativeRequest {
  content: string
  mood: number
  emotions: string[]
  type: "voice" | "text" | "doodle"
}

export interface RoleplayContext {
  roleType: "parent" | "friend" | "teacher" | "counselor"
  scenario: string
  conversationHistory: { sender: "user" | "ai"; content: string }[]
}

export class AIService {
  private static _anthropic: Anthropic | null = null;
  private get anthropic(): Anthropic | null {
    if (typeof window !== 'undefined') {
      throw new Error('aiService cannot be used on the client. Use it only in API routes or server actions.');
    }
    if (!AIService._anthropic) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey) {
        AIService._anthropic = new Anthropic({ apiKey });
      }
    }
    return AIService._anthropic;
  }

  // Generate healing narrative from journal content
  async generateNarrative(request: NarrativeRequest): Promise<string> {
    const { content, mood, emotions, type } = request

    // Fallback to mock if no API key or client not initialized
    if (!this.anthropic) {
      console.warn('Anthropic API key not found, falling back to mock narrative')
      return this.generateMockNarrative(request)
    }

    try {
      const prompt = this.buildNarrativePrompt(content, mood, emotions, type)

      const response = await this.anthropic.messages.create({
        model: "Claude Sonnet 3.5 2024-10-22",
        max_tokens: 400,
        temperature: 0.7,
        system: "You are a compassionate AI therapist and mental health companion. Your role is to help users process their emotions through personalized, empathetic narratives. Always respond with kindness, validation, and gentle insights. Focus on emotional healing, self-compassion, and growth.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      const generatedText = response.content[0].text

      // Add a small delay to maintain consistent UX
      await new Promise(resolve => setTimeout(resolve, 500))

      return generatedText
    } catch (error) {
      console.error('Anthropic API error:', error)
      // Fallback to mock narrative on API error
      return this.generateMockNarrative(request)
    }
  }

  // Generate AI roleplay response
  async generateRoleplayResponse(context: RoleplayContext, userMessage: string): Promise<string> {
    const { roleType, scenario, conversationHistory } = context

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

    const rolePersonalities = {
      parent: {
        tone: "caring and supportive",
        responses: [
          "I can see this is really important to you. Help me understand what you're feeling right now.",
          "I'm glad you're talking to me about this. It takes courage to share what's on your mind.",
          "I hear you, and I want you to know that your feelings are valid. Let's work through this together.",
          "Thank you for trusting me with this. What do you think would help you feel better about the situation?",
          "I love you, and I want to support you. Can you tell me more about what's been bothering you?",
        ],
      },
      friend: {
        tone: "understanding and relatable",
        responses: [
          "Wow, that sounds really tough. I've been in similar situations before, and it's never easy.",
          "I totally get why you'd feel that way. Have you thought about what you want to do next?",
          "That's so frustrating! I'm here for you though. Want to talk through some options?",
          "I can relate to that feeling. Sometimes it helps to just get it all out, you know?",
          "You're not alone in this. I've got your back, whatever you decide to do.",
        ],
      },
      teacher: {
        tone: "encouraging and educational",
        responses: [
          "I appreciate you bringing this to my attention. Let's think about this step by step.",
          "This is a great learning opportunity. What do you think might be the best approach here?",
          "I can see you're putting thought into this. What resources do you think might help you?",
          "Every challenge is a chance to grow. How do you think we can turn this into a positive experience?",
          "I believe in your ability to handle this. What strategies have worked for you in the past?",
        ],
      },
      counselor: {
        tone: "professional and empathetic",
        responses: [
          "Thank you for sharing that with me. How are you feeling right now as you talk about this?",
          "I notice you mentioned feeling... Can you tell me more about that emotion?",
          "It sounds like this situation is causing you some distress. What would feeling better look like to you?",
          "You've shown a lot of insight in recognizing this pattern. What do you think might help you move forward?",
          "I hear the strength in your voice even as you're struggling. What coping strategies have helped you before?",
        ],
      },
    }

    const personality = rolePersonalities[roleType]
    const baseResponses = personality.responses

    // Analyze user message for emotional content
    const emotionalWords = this.detectEmotionalContent(userMessage)
    const responseIndex = Math.floor(Math.random() * baseResponses.length)
    let response = baseResponses[responseIndex]

    // Add contextual elements based on conversation history
    if (conversationHistory.length > 2) {
      const continuationPhrases = [
        "Building on what you shared earlier, ",
        "I remember you mentioned before that ",
        "Connecting this to our conversation, ",
        "This reminds me of when you said ",
      ]

      if (Math.random() > 0.7) {
        const phrase = continuationPhrases[Math.floor(Math.random() * continuationPhrases.length)]
        response = phrase + response.toLowerCase()
      }
    }

    // Add scenario-specific context
    if (scenario && Math.random() > 0.6) {
      response += ` Given what's happening with ${scenario.toLowerCase()}, how do you think we can best support you?`
    }

    return response
  }

  // Generate practice session feedback
  async generateSessionFeedback(
    messages: { sender: "user" | "ai"; content: string }[],
    confidenceBefore: number,
    confidenceAfter: number,
  ): Promise<{ feedback: string; tips: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const confidenceChange = confidenceAfter - confidenceBefore
    const messageCount = messages.filter((m) => m.sender === "user").length

    let feedback = ""
    const tips: string[] = []

    if (confidenceChange > 0) {
      feedback = `Great progress! Your confidence increased by ${confidenceChange} points during this conversation. `
      if (messageCount >= 5) {
        feedback += "You engaged deeply in the conversation and showed willingness to explore difficult topics."
        tips.push("Continue practicing active engagement in conversations")
        tips.push("Your openness to dialogue is a real strength")
      } else {
        feedback += "Even with a shorter conversation, you made meaningful progress."
        tips.push("Try extending conversations a bit longer to build more confidence")
      }
    } else if (confidenceChange === 0) {
      feedback = "You maintained your confidence level throughout the conversation, which shows emotional stability. "
      feedback += "Sometimes staying steady is just as valuable as gaining confidence."
      tips.push("Practice expressing your needs more directly")
      tips.push("Consider asking follow-up questions to deepen conversations")
    } else {
      feedback =
        "It's okay that your confidence dipped slightly. Difficult conversations can be challenging, and recognizing that is part of growth. "
      feedback += "The important thing is that you practiced and learned something about yourself."
      tips.push("Remember that confidence builds over time with practice")
      tips.push("Focus on one small improvement for your next conversation")
    }

    // Add general tips based on conversation analysis
    const generalTips = [
      "Practice active listening by reflecting back what you hear",
      "Use 'I' statements to express your feelings clearly",
      "Ask open-ended questions to keep conversations flowing",
      "Take breaks if conversations become overwhelming",
      "Celebrate small wins in your communication journey",
    ]

    // Add 1-2 random general tips
    const shuffledTips = generalTips.sort(() => Math.random() - 0.5)
    tips.push(...shuffledTips.slice(0, 2))

    return { feedback, tips }
  }

  private getMoodDescriptor(mood: number): string {
    if (mood <= 2) return "challenging"
    if (mood <= 4) return "difficult"
    if (mood <= 6) return "mixed"
    if (mood <= 8) return "positive"
    return "uplifting"
  }

  private generatePersonalizedEnding(content: string, mood: number): string {
    const endings = [
      "Remember, every feeling you experience is part of your unique human journey. You're exactly where you need to be right now.",
      "Your willingness to express yourself, even in difficult moments, is a gift you give to your future self. Keep nurturing this practice.",
      "In sharing your authentic experience, you're not just processing emotions—you're building emotional wisdom that will serve you well.",
      "This moment of expression is a small but significant act of self-care. You're learning to be your own compassionate companion.",
    ]

    return endings[Math.floor(Math.random() * endings.length)]
  }

  private detectEmotionalContent(message: string): string[] {
    const emotionalWords = {
      sad: ["sad", "down", "depressed", "blue", "unhappy"],
      angry: ["angry", "mad", "frustrated", "annoyed", "irritated"],
      anxious: ["anxious", "worried", "nervous", "scared", "afraid"],
      happy: ["happy", "good", "great", "excited", "joy"],
      confused: ["confused", "lost", "unsure", "don't know"],
    }

    const detected: string[] = []
    const lowerMessage = message.toLowerCase()

    for (const [emotion, words] of Object.entries(emotionalWords)) {
      if (words.some((word) => lowerMessage.includes(word))) {
        detected.push(emotion)
      }
    }

    return detected
  }

  private buildNarrativePrompt(content: string, mood: number, emotions: string[], type: string): string {
    const moodDescriptor = this.getMoodDescriptor(mood)
    const emotionContext = emotions.length > 0 ? emotions.join(", ") : "mixed emotions"

    return `Create a healing, therapeutic narrative based on this ${type} journal entry:

Content: "${content}"
Current mood level (1-10): ${mood} (${moodDescriptor})
Emotions detected: ${emotionContext}

Please create a personalized, empathetic response that:
1. Acknowledges their current emotional state with compassion
2. Validates their feelings as completely normal and understandable
3. Provides gentle insights or perspectives that might help them process their experience
4. Ends with encouragement and hope for their healing journey
5. Keeps the tone supportive, non-judgmental, and therapeutic

Write this as a cohesive narrative paragraph that feels like it's coming from a caring mental health companion.`
  }

  private async generateMockNarrative(request: NarrativeRequest): Promise<string> {
    const { content, mood, emotions, type } = request

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const moodDescriptor = this.getMoodDescriptor(mood)
    const emotionContext = emotions.length > 0 ? emotions.join(", ") : "mixed feelings"

    const narrativeTemplates = {
      voice: [
        `Your voice carries the weight of ${emotionContext}, and that's completely valid. In this moment of ${moodDescriptor}, you're showing incredible courage by expressing yourself. Every word you've shared is a step toward understanding yourself better.`,
        `I hear the ${emotionContext} in your voice, and it tells a story of someone who is navigating life with authenticity. Your ${moodDescriptor} feelings are not obstacles—they're guideposts showing you what matters most to your heart.`,
        `The emotions you've shared—${emotionContext}—paint a picture of someone who feels deeply. In your ${moodDescriptor} state, you're still choosing to reach out and express yourself, which shows remarkable strength.`,
      ],
      text: [
        `Your words reveal a journey through ${emotionContext}, and each sentence shows your willingness to explore your inner world. Even in moments of ${moodDescriptor}, you're creating space for growth and self-discovery.`,
        `Reading your thoughts, I see someone processing ${emotionContext} with honesty and vulnerability. Your ${moodDescriptor} experience is part of a larger story of resilience and self-awareness that you're writing every day.`,
        `The way you've articulated your ${emotionContext} shows deep emotional intelligence. Your ${moodDescriptor} feelings are valid messengers, helping you understand what you need right now.`,
      ],
      doodle: [
        `Your creative expression speaks volumes about your inner world. The emotions of ${emotionContext} flow through your art, creating something beautiful from your ${moodDescriptor} experience. Art has a way of healing that words sometimes cannot reach.`,
        `In your doodles, I see the visual language of ${emotionContext}. Your ${moodDescriptor} feelings have found a creative outlet, transforming internal experiences into external beauty. This is your unique way of processing and healing.`,
        `Your artistic expression captures the essence of ${emotionContext} in a way that's uniquely yours. Even in ${moodDescriptor} moments, you're creating something meaningful—a testament to your creative spirit and resilience.`,
      ],
    }

    const templates = narrativeTemplates[type]
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)]

    // Add personalized elements based on content analysis
    const personalizedEnding = this.generatePersonalizedEnding(content, mood)

    return `${selectedTemplate}\n\n${personalizedEnding}`
  }
}

export const aiService = new AIService()

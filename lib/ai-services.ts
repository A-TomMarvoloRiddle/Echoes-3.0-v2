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


class AIService {
  // Generate a narrative using Claude API
  async generateNarrative({ content, mood, emotions, type }: NarrativeRequest): Promise<string> {
    if (!this.anthropic) {
      console.warn('Anthropic API key not found, falling back to mock narrative response');
      return `Here's a narrative based on your input: "${content}" (mock)`;
    }

    try {
      // Compose a prompt for narrative generation
      const prompt = `You are Echoes, an empathetic AI guide for youth. Generate a supportive, engaging & healing story or poem based on the following journal entry.\n\nEntry: "${content}"\nMood: ${mood}\nEmotions: ${emotions && emotions.length > 0 ? emotions.join(", ") : "none specified"}\nType: ${type}.\n\nRespond with a short, encouraging narrative that helps the user reflect and feel understood. Avoid repeating the entry verbatim.`;

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        temperature: 0.7,
        system: `You are Echoes, an AI narrative generator for youth journaling. Respond with empathy, encouragement, and insight.`,
        messages: [
          { role: "user", content: prompt }
        ]
      });

      const textBlock = response.content.find((block: any) => block.type === 'text');
      const generatedText = textBlock ? (textBlock as any).text : '';
      return generatedText;
    } catch (error) {
      console.error('Anthropic API error (narrative):', error);
      return `Sorry, I couldn't generate a narrative right now.`;
    }
  }
  anthropic: Anthropic | null;
  constructor() {
    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
  }

  // Generate AI roleplay response using Claude API
  async generateRoleplayResponse(context: RoleplayContext, userMessage: string): Promise<string> {
    const { roleType, scenario, conversationHistory } = context;

    if (!this.anthropic) {
      console.warn('Anthropic API key not found, falling back to mock roleplay response');
      // fallback: just echo the last user message or a generic response
      return `Let's practice! (mock) You said: "${userMessage}"`;
    }

    try {
      // Build conversation history for Claude
      const messages: { role: "user" | "assistant"; content: string }[] = [
        {
          role: "user",
          content:
            `You are roleplaying as a ${roleType} in the following scenario: ${scenario}.
Your job is to respond realistically and help the user practice a difficult conversation. Don't be perfect always, respond as a real ${roleType} might, with some variety. After each user message, reply as the roleplay partner.
Here is the conversation so far:`
        },
        ...conversationHistory.map((msg) => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        })),
        { role: "user" as const, content: userMessage }
      ];

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        temperature: 0.8,
        system:
          `You are Echoes, an AI roleplay partner. Stay in character as the ${roleType} described in the scenario. Respond realistically and with variety. Do not break character or mention you are an AI.`,
        messages
      });

      // Claude's response.content is an array of ContentBlock, find the first 'text' type
      const textBlock = response.content.find((block: any) => block.type === 'text');
      const generatedText = textBlock ? (textBlock as any).text : '';
      return generatedText;
    } catch (error) {
      console.error('Anthropic API error (roleplay):', error);
      return `Sorry, I couldn't generate a response right now.`;
    }
  }

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

}

export const aiService = new AIService()

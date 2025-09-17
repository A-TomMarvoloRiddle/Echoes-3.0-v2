// API client with authentication
export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl

    // Load token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("echoes-auth-token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("echoes-auth-token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("echoes-auth-token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || "Request failed")
    }

    return response.json()
  }

  // Auth methods
  async createAnonymousUser() {
    const result = await this.request<{ success: boolean; user: any; token: string }>("/auth/anonymous", {
      method: "POST",
    })

    if (result.success) {
      this.setToken(result.token)
    }

    return result
  }

  async registerUser(email: string, name: string) {
    const result = await this.request<{ success: boolean; user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    })

    if (result.success) {
      this.setToken(result.token)
    }

    return result
  }

  async getCurrentUser() {
    return this.request<{ success: boolean; user: any }>("/auth/me")
  }

  async updatePreferences(preferences: any) {
    return this.request<{ success: boolean; user: any }>("/auth/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    })
  }

  async signOut() {
    const result = await this.request<{ success: boolean }>("/auth/signout", {
      method: "POST",
    })

    this.clearToken()
    return result
  }

  // Journal methods
  async createJournalEntry(entry: any) {
    return this.request<{ success: boolean; entry: any }>("/journal", {
      method: "POST",
      body: JSON.stringify(entry),
    })
  }

  async getJournalEntries(limit = 10) {
    return this.request<{ success: boolean; entries: any[] }>(`/journal?limit=${limit}`)
  }

  // Practice methods
  async createPracticeSession(session: any) {
    return this.request<{ success: boolean; session: any }>("/practice", {
      method: "POST",
      body: JSON.stringify(session),
    })
  }

  async getPracticeSession(id: string) {
    return this.request<{ success: boolean; session: any }>(`/practice/${id}`)
  }

  async updatePracticeSession(id: string, updates: any) {
    return this.request<{ success: boolean; session: any }>(`/practice/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async sendMessage(sessionId: string, message: string) {
    return this.request<{ success: boolean; response: string }>(`/practice/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  // Mood methods
  async createMoodEntry(mood: any) {
    return this.request<{ success: boolean; entry: any }>("/mood", {
      method: "POST",
      body: JSON.stringify(mood),
    })
  }

  async getMoodEntries(days = 30) {
    return this.request<{ success: boolean; entries: any[] }>(`/mood?days=${days}`)
  }

  // Voice methods
  async processVoice(audioBlob: Blob) {
    const formData = new FormData()
    formData.append("audio", audioBlob)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}/voice/process`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Voice processing failed")
    }

    return response.json()
  }

  // AI methods
  async generateNarrative(content: string, mood: number, emotions: string[]) {
    return this.request<{ success: boolean; narrative: string }>("/ai/narrative", {
      method: "POST",
      body: JSON.stringify({ content, mood, emotions }),
    })
  }

  // Crisis detection methods
  async analyzeCrisisRisk(text: string, context?: string) {
    return this.request<{
      success: boolean
      analysis: any
      timestamp: string
      context: string
    }>("/crisis-detection", {
      method: "POST",
      body: JSON.stringify({ text, context }),
    })
  }

  async getCrisisAlerts() {
    return this.request<{ success: boolean; alerts: any[] }>("/crisis-alerts")
  }

  async resolveCrisisAlert(alertId: string) {
    return this.request<{ success: boolean; message: string }>(`/crisis-alerts/${alertId}/resolve`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()

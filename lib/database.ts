// Database schema and storage management for Echoes app
export interface User {
  id: string
  email?: string
  name?: string
  isAnonymous: boolean
  preferences: {
    enabledModes: ("expression" | "practice")[]
    notifications: boolean
    crisisDetection: boolean
    theme: "light" | "dark" | "auto"
  }
  createdAt: Date
  lastActive: Date
}

export interface JournalEntry {
  id: string
  userId: string
  type: "voice" | "text" | "doodle"
  content: string
  transcription?: string
  mood: number // 1-10 scale
  emotions: string[]
  aiNarrative?: string
  createdAt: Date
  updatedAt: Date
}

export interface PracticeSession {
  id: string
  userId: string
  roleType: "parent" | "friend" | "teacher" | "counselor"
  scenario: string
  messages: {
    id: string
    sender: "user" | "ai"
    content: string
    timestamp: Date
  }[]
  confidenceBefore: number
  confidenceAfter?: number
  feedback?: string
  tips?: string[]
  createdAt: Date
  completedAt?: Date
}

export interface MoodEntry {
  id: string
  userId: string
  mood: number
  emotions: string[]
  notes?: string
  createdAt: Date
}

export interface CrisisAlert {
  id: string
  userId: string
  content: string
  severity: "low" | "medium" | "high" | "critical"
  resolved: boolean
  createdAt: Date
}

// In-memory storage (replace with real database in production)
class InMemoryDatabase {
  private users: Map<string, User> = new Map()
  private journalEntries: Map<string, JournalEntry> = new Map()
  private practiceSessions: Map<string, PracticeSession> = new Map()
  private moodEntries: Map<string, MoodEntry> = new Map()
  private crisisAlerts: Map<string, CrisisAlert> = new Map()

  // User operations
  async createUser(userData: Omit<User, "id" | "createdAt" | "lastActive">): Promise<User> {
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      lastActive: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = { ...user, ...updates, lastActive: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Journal operations
  async createJournalEntry(entryData: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): Promise<JournalEntry> {
    const entry: JournalEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.journalEntries.set(entry.id, entry)
    return entry
  }

  async getJournalEntriesByUser(userId: string, limit = 10): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    const entry = this.journalEntries.get(id)
    if (!entry) return null

    const updatedEntry = { ...entry, ...updates, updatedAt: new Date() }
    this.journalEntries.set(id, updatedEntry)
    return updatedEntry
  }

  // Practice session operations
  async createPracticeSession(sessionData: Omit<PracticeSession, "id" | "createdAt">): Promise<PracticeSession> {
    const session: PracticeSession = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    this.practiceSessions.set(session.id, session)
    return session
  }

  async getPracticeSession(id: string): Promise<PracticeSession | null> {
    return this.practiceSessions.get(id) || null
  }

  async updatePracticeSession(id: string, updates: Partial<PracticeSession>): Promise<PracticeSession | null> {
    const session = this.practiceSessions.get(id)
    if (!session) return null

    const updatedSession = { ...session, ...updates }
    this.practiceSessions.set(id, updatedSession)
    return updatedSession
  }

  async getPracticeSessionsByUser(userId: string, limit = 10): Promise<PracticeSession[]> {
    return Array.from(this.practiceSessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Mood operations
  async createMoodEntry(moodData: Omit<MoodEntry, "id" | "createdAt">): Promise<MoodEntry> {
    const mood: MoodEntry = {
      ...moodData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    this.moodEntries.set(mood.id, mood)
    return mood
  }

  async getMoodEntriesByUser(userId: string, days = 30): Promise<MoodEntry[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return Array.from(this.moodEntries.values())
      .filter((entry) => entry.userId === userId && entry.createdAt >= cutoffDate)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Crisis alert operations
  async createCrisisAlert(alertData: Omit<CrisisAlert, "id" | "createdAt">): Promise<CrisisAlert> {
    const alert: CrisisAlert = {
      ...alertData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    this.crisisAlerts.set(alert.id, alert)
    return alert
  }

  async getCrisisAlertsByUser(userId: string): Promise<CrisisAlert[]> {
    return Array.from(this.crisisAlerts.values())
      .filter((alert) => alert.userId === userId && !alert.resolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async resolveCrisisAlert(id: string): Promise<boolean> {
    const alert = this.crisisAlerts.get(id)
    if (!alert) return false

    alert.resolved = true
    this.crisisAlerts.set(id, alert)
    return true
  }
}

// Singleton database instance
export const db = new InMemoryDatabase()

// Helper functions for localStorage persistence (optional)
export const persistToStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "echoes-db",
      JSON.stringify({
        users: Array.from(db["users"].entries()),
        journalEntries: Array.from(db["journalEntries"].entries()),
        practiceSessions: Array.from(db["practiceSessions"].entries()),
        moodEntries: Array.from(db["moodEntries"].entries()),
        crisisAlerts: Array.from(db["crisisAlerts"].entries()),
      }),
    )
  }
}

export const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("echoes-db")
    if (stored) {
      const data = JSON.parse(stored)
      db["users"] = new Map(data.users || [])
      db["journalEntries"] = new Map(data.journalEntries || [])
      db["practiceSessions"] = new Map(data.practiceSessions || [])
      db["moodEntries"] = new Map(data.moodEntries || [])
      db["crisisAlerts"] = new Map(data.crisisAlerts || [])
    }
  }
}

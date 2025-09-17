// Authentication system for Echoes app
import { db, type User } from "./database"

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

class AuthManager {
  private sessions: Map<string, AuthSession> = new Map()
  private currentUserId: string | null = null

  // Create anonymous user
  async createAnonymousUser(): Promise<AuthSession> {
    const user = await db.createUser({
      isAnonymous: true,
      preferences: {
        enabledModes: ["expression", "practice"],
        notifications: false,
        crisisDetection: true,
        theme: "auto",
      },
    })

    const session = this.createSession(user)
    this.currentUserId = user.id
    return session
  }

  // Register user with email
  async registerUser(email: string, name: string): Promise<AuthSession> {
    const user = await db.createUser({
      email,
      name,
      isAnonymous: false,
      preferences: {
        enabledModes: ["expression", "practice"],
        notifications: true,
        crisisDetection: true,
        theme: "auto",
      },
    })

    const session = this.createSession(user)
    this.currentUserId = user.id
    return session
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUserId) return null
    return await db.getUserById(this.currentUserId)
  }

  // Update user preferences
  async updateUserPreferences(preferences: Partial<User["preferences"]>): Promise<User | null> {
    if (!this.currentUserId) return null

    const user = await db.getUserById(this.currentUserId)
    if (!user) return null

    return await db.updateUser(this.currentUserId, {
      preferences: { ...user.preferences, ...preferences },
    })
  }

  // Validate session
  validateSession(token: string): AuthSession | null {
    const session = this.sessions.get(token)
    if (!session || session.expiresAt < new Date()) {
      if (session) this.sessions.delete(token)
      return null
    }
    return session
  }

  // Sign out
  signOut(token?: string): void {
    if (token) {
      this.sessions.delete(token)
    }
    this.currentUserId = null
  }

  private createSession(user: User): AuthSession {
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    const session: AuthSession = {
      user,
      token,
      expiresAt,
    }

    this.sessions.set(token, session)
    return session
  }
}

export const auth = new AuthManager()

// Client-side auth helpers
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("echoes-auth-token")
}

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("echoes-auth-token", token)
}

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("echoes-auth-token")
}

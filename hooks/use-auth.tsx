"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
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
  createdAt: string
  lastActive: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  createAnonymousUser: () => Promise<void>
  updatePreferences: (preferences: Partial<User["preferences"]>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const result = await apiClient.getCurrentUser()
      setUser(result.user)
    } catch (error) {
      // No existing session, user needs to authenticate
      console.log("No existing session")
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, name: string) => {
    const result = await apiClient.registerUser(email, name)
    setUser(result.user)
  }

  const signOut = async () => {
    await apiClient.signOut()
    setUser(null)
  }

  const createAnonymousUser = async () => {
    const result = await apiClient.createAnonymousUser()
    setUser(result.user)
  }

  const updatePreferences = async (preferences: Partial<User["preferences"]>) => {
    const result = await apiClient.updatePreferences(preferences)
    setUser(result.user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        createAnonymousUser,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

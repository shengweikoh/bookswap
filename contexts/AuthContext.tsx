"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  location?: string
  interestedGenres?: string[]
  birthday?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated on client side
    setIsHydrated(true)
    
    // Check if user is logged in on app start
    const currentUser = apiService.getCurrentUser()
    if (currentUser && apiService.isAuthenticated()) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = await apiService.login({ email, password })
    if (result.success && result.data) {
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const signup = async (name: string, email: string, password: string) => {
    const result = await apiService.signup({ name, email, password })
    if (result.success && result.data) {
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const logout = async () => {
    await apiService.logout()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: isHydrated && !!user,
    isLoading: isLoading || !isHydrated,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

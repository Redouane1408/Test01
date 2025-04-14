"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  department: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Also replace the fetchUserProfile function with a mock version
  const fetchUserProfile = async (token: string) => {
    try {
      setIsLoading(true)

      // Mock user profile - no API call
      console.log("Mock fetchUserProfile with token:", token)

      // Create a mock user
      const mockUser: User = {
        id: "USR-" + Math.random().toString(36).substring(2),
        name: "Ahmed Benali",
        email: "ahmed.benali@finances.gov",
        role: "ADMIN",
        department: "Direction Générale",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
    } catch (error) {
      console.error("Mock fetchUserProfile error:", error)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  // Find the login function and replace it with this mock implementation:
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Mock successful login - no API call
      console.log("Mock login with:", email, password)

      // Create a fake token
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)
      localStorage.setItem("token", token)

      // Create a mock user based on email
      const mockUser: User = {
        id: "USR-" + Math.random().toString(36).substring(2),
        name: email
          .split("@")[0]
          .split(".")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        email: email,
        role: "ADMIN", // You can change this to "USER" if needed
        department: "Direction Générale",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      return mockUser
    } catch (error) {
      console.error("Mock login error:", error)
      throw new Error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    navigate("/login")
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "ADMIN"

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated, isAdmin }}>
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


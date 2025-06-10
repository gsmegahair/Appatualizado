"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useElectronStore } from "../hooks/use-electron-store"
import type { User } from "../types"
import { useConfig } from "./config-context"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAdmin: boolean
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const defaultAdmin: User = {
  id: "admin-1",
  username: "GSmega",
  role: "admin",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, isLoaded] = useElectronStore<User | null>("gs-mega-user", null)
  const { config } = useConfig()

  const login = (username: string, password: string): boolean => {
    if (username === config.loginCredentials.username && password === config.loginCredentials.password) {
      setUser(defaultAdmin)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

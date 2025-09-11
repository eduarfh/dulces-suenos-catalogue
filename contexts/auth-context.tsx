//contexts/auth-context.tsx

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar
    const authStatus = localStorage.getItem("admin-authenticated")
    setIsAuthenticated(authStatus === "true")
    setLoading(false)
  }, [])

  const login = (username: string, password: string) => {
    // Credenciales simples (en producción usar un sistema más seguro)
    if (username === "myeventas" && password === "myeventas123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin-authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-authenticated")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

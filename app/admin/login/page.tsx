"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Baby, Lock } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simple authentication (in production, use proper auth)
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdminAuthenticated", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/20 via-[#BEE4E7]/20 to-[#F7CCAD]/20 dark:from-[#FFD4E5]/10 dark:via-[#BEE4E7]/10 dark:to-[#F7CCAD]/10 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-gradient-to-br from-[#F490B9] to-[#95C7C3] p-4 rounded-2xl w-fit">
            <Baby className="h-12 w-12 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Panel de Administración</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white">
              <Lock className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#95C7C3] hover:underline">
              ← Volver al catálogo
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

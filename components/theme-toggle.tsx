// components/theme-toggle.tsx (cliente)
"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9 bg-transparent">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  // components/theme-toggle.tsx (fragmento relevante)
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    // guardamos cookie para persistencia entre cargas; server leerá 'dark' y añadirá clase 'dark' si corresponde
    document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=lax`
    // actualizar clase y color-scheme inmediatamente para evitar parpadeos
    document.documentElement.classList.remove(theme === "dark" ? "dark" : "light")
    document.documentElement.classList.add(next)
    document.documentElement.style.colorScheme = next
    setTheme(next)
  }


  return (
    <Button variant="outline" size="icon" onClick={toggle} className="w-9 h-9">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

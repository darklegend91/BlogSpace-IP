"use client"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0" aria-label="Toggle theme">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
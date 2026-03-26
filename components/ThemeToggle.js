'use client'

import { useTheme } from "@/components/ThemeProvider"

export default function ThemeToggle() {
  const theme = useTheme()

  // 🔥 evita error si contexto no está listo
  if (!theme) return null

  const { dark, toggleTheme } = theme

  return (
    <button onClick={toggleTheme} style={btn}>
      {dark ? "🌙" : "☀️"}
    </button>
  )
}

const btn = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#334155",
  color: "white"
}
'use client'
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} style={btn}>
      {dark ? "🌙 Oscuro" : "☀️ Claro"}
    </button>
  )
}

const btn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "bold"
}
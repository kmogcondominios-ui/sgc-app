'use client'
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "light") setDark(false)
  }, [])

  function toggleTheme() {
    const newTheme = !dark
    setDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div style={dark ? darkTheme : lightTheme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

// 🎨 estilos

const darkTheme = {
  background: "linear-gradient(135deg, #020617, #0f172a)",
  color: "white",
  minHeight: "100vh"
}

const lightTheme = {
  background: "#f1f5f9",
  color: "#020617",
  minHeight: "100vh"
}
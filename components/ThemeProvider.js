'use client'
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f8fafc"
    document.body.style.color = dark ? "white" : "#0f172a"
  }, [dark])

  function toggleTheme() {
    setDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
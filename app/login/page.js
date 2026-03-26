'use client'
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert("Error: " + error.message)
    } else {
      router.push("/")
    }
  }

  return (
    <div style={container}>
      <h1>🔐 Login</h1>

      <input
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={handleLogin} style={btn}>
        Iniciar sesión
      </button>
    </div>
  )
}

const container = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "300px",
  margin: "100px auto"
}

const input = {
  padding: "10px",
  borderRadius: "8px"
}

const btn = {
  padding: "10px",
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px"
}
'use client'

import { supabase } from "@/lib/supabase"

export default function LogoutButton() {
  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <button onClick={logout} style={btn}>
      🚪 Cerrar sesión
    </button>
  )
}

const btn = {
  padding: "8px 12px",
  background: "#ef4444",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
}
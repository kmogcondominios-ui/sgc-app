'use client'
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {

  useEffect(() => {
    probar()
  }, [])

  async function probar() {
    const { data, error } = await supabase
      .from("condominos")
      .select("*")

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  return (
    <h1>Probando conexión con Supabase...</h1>
  )
}
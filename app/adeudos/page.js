'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Adeudos() {
  const [lista, setLista] = useState([])

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data: condominos } = await supabase.from("condominos").select("*")
    const { data: pagos } = await supabase.from("pagos").select("*")

    const mesActual = new Date().getMonth()

    const pagaron = pagos
      ?.filter(p => new Date(p.fecha).getMonth() === mesActual)
      .map(p => p.condomino_id)

    const adeudos = condominos?.filter(c => !pagaron.includes(c.id)) || []

    setLista(adeudos)
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>⚠️ Adeudos</h1>

      {lista.map(c => (
        <div key={c.id} style={card}>
          <strong>{c.nombre}</strong>
          <p>Depto: {c.vivienda}</p>
          <p>Cuota: ${c.cuota}</p>
        </div>
      ))}
    </div>
  )
}

const card = {
  background: "#1e293b",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "10px"
}
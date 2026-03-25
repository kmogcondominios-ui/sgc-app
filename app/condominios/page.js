'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Condominios() {
  const [lista, setLista] = useState([])

  const [nombre, setNombre] = useState("")
  const [vivienda, setVivienda] = useState('')
  const [cuota, setCuota] = useState("")
  const [telefono, setTelefono] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data, error } = await supabase
      .from("condominos")
      .select("*")

    console.log("SELECT DATA:", data)
    console.log("SELECT ERROR:", error)

    if (data) setLista(data)
  }

  async function agregar() {
    if (loading) return

    if (!nombre || !vivienda || !cuota) {
      alert("Faltan datos")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.from("condominos").insert([
      {
        nombre,
        vivienda: Number(vivienda),
        cuota: Number(cuota),
        telefono
      }
    ])

    console.log("INSERT DATA:", data)
    console.log("INSERT ERROR:", error)

    setLoading(false)

    if (error) {
      alert("Error al guardar")
      return
    }

    // limpiar formulario
    setNombre("")
    setVivienda('')
    setCuota("")
    setTelefono("")

    // recargar lista
    cargar()
  }

  return (
    <div style={container}>
      <h1 style={title}>🏠 Condominios</h1>

      {/* FORMULARIO */}
      <div style={form}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={input}
        />

        <input
          placeholder="Vivienda (101)"
          value={vivienda}
          onChange={e => setVivienda(e.target.value)}
          style={input}
        />

        <input
          placeholder="Cuota"
          value={cuota}
          onChange={e => setCuota(e.target.value)}
          style={input}
        />

        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          style={input}
        />

        <button
          onClick={agregar}
          disabled={loading}
          style={button}
        >
          {loading ? "Guardando..." : "Agregar"}
        </button>
      </div>

      {/* LISTA */}
      <div>
        {lista.map(c => (
          <div key={c.id} style={card}>
            <strong>{c.nombre}</strong>
            <p>Depto: {c.vivienda}</p>
            <p>Cuota: ${c.cuota}</p>
            <p>Tel: {c.telefono || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎨 ESTILOS

const container = {
  padding: "20px",
  color: "white"
}

const title = {
  marginBottom: "20px"
}

const form = {
  display: "grid",
  gap: "10px",
  marginBottom: "20px",
  maxWidth: "300px"
}

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white"
}

const button = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
}

const card = {
  background: "#1e293b",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px"
}
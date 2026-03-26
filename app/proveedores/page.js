'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [tipo, setTipo] = useState("fijo")

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data } = await supabase.from("proveedores").select("*")
    setProveedores(data || [])
  }

  async function guardar() {
    if (!nombre) return alert("Nombre requerido")

    const { error } = await supabase.from("proveedores").insert([
      { nombre, telefono, tipo }
    ])

    if (error) {
      alert("Error al guardar")
      return
    }

    setNombre("")
    setTelefono("")
    setTipo("fijo")

    cargar()
  }

  return (
    <div style={container}>
      <h1>🏢 Proveedores</h1>

      {/* FORM */}
      <div style={form}>
        <input
          placeholder="Nombre proveedor"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
        />

        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="fijo">Fijo</option>
          <option value="temporal">Temporal</option>
        </select>

        <button onClick={guardar}>➕ Guardar</button>
      </div>

      {/* LISTA */}
      <div>
        {proveedores.map(p => (
          <div key={p.id} style={card}>
            <div>
              <strong>{p.nombre}</strong>
              <p style={{ opacity: 0.6 }}>
                {p.tipo} | {p.telefono || "Sin teléfono"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎨 ESTILOS

const container = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
}

const form = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
}

const card = {
  background: "rgba(255,255,255,0.03)",
  padding: "12px",
  borderRadius: "10px"
}
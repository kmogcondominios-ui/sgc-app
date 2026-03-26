'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Condominios() {
  const [condominios, setCondominios] = useState([])

  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [vivienda, setVivienda] = useState("")
  const [cuota, setCuota] = useState("")

  const [editando, setEditando] = useState(null)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data } = await supabase.from("condominos").select("*")
    setCondominios(data || [])
  }

  async function guardar() {
    if (!nombre) return alert("Nombre requerido")

    // 🔥 EDITAR
    if (editando) {
      const { error } = await supabase
        .from("condominos")
        .update({
          nombre,
          telefono,
          vivienda,
          cuota
        })
        .eq("id", editando)

      if (error) return alert("Error al actualizar")

      setEditando(null)
    } else {
      // 🔥 CREAR
      const { error } = await supabase
        .from("condominos")
        .insert([{ nombre, telefono, vivienda, cuota }])

      if (error) return alert("Error al guardar")
    }

    limpiar()
    cargar()
  }

  function editar(c) {
    setEditando(c.id)
    setNombre(c.nombre)
    setTelefono(c.telefono || "")
    setVivienda(c.vivienda || "")
    setCuota(c.cuota || "")
  }

  function limpiar() {
    setNombre("")
    setTelefono("")
    setVivienda("")
    setCuota("")
  }

  return (
    <div style={container}>
      <h1>🏠 Condóminos</h1>

      {/* FORM */}
      <div style={form}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <input placeholder="Vivienda" value={vivienda} onChange={e => setVivienda(e.target.value)} />
        <input placeholder="Cuota" value={cuota} onChange={e => setCuota(e.target.value)} />

        <button onClick={guardar}>
          {editando ? "💾 Actualizar" : "➕ Guardar"}
        </button>

        {editando && (
          <button onClick={limpiar} style={btnCancel}>
            ❌ Cancelar
          </button>
        )}
      </div>

      {/* LISTA */}
      {condominios.map(c => (
        <div key={c.id} style={card}>
          <div>
            <strong>{c.nombre}</strong>
            <p style={{ opacity: 0.6 }}>
              {c.vivienda} | {c.telefono || "Sin teléfono"} | ${c.cuota}
            </p>
          </div>

          <button onClick={() => editar(c)} style={btnEdit}>
            ✏️ Editar
          </button>
        </div>
      ))}
    </div>
  )
}

// 🎨 estilos

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
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const btnEdit = {
  background: "#38bdf8",
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
}

const btnCancel = {
  background: "#ef4444",
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
}
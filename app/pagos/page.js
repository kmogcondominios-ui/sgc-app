'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { registrarPagoCompleto } from "@/lib/pagoCompleto"

export default function Pagos() {
  const [condominios, setCondominios] = useState([])
  const [selected, setSelected] = useState("")
  const [monto, setMonto] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarCondominos()
  }, [])

  async function cargarCondominos() {
    const { data, error } = await supabase
      .from("condominos")
      .select("*")

    console.log("CONDÓMINOS:", data)
    console.log("ERROR:", error)

    if (data) setCondominios(data)
  }

  async function registrarPago() {
    if (loading) return

    if (!selected || !monto) {
      alert("Faltan datos")
      return
    }

    // ✅ CORRECCIÓN AQUÍ (condominios correcto)
    const cond = condominios.find(c => c.id === selected)

    if (!cond) {
      alert("Condómino no encontrado")
      return
    }

    setLoading(true)

    try {
      const pdfUrl = await registrarPagoCompleto({
        condomino_id: selected,
        nombre: cond.nombre,
        monto: Number(monto)
      })

      alert("Pago registrado y recibo generado ✅")

      // 📲 WhatsApp automático (opcional)
      if (cond.telefono) {
        const mensaje = `Hola ${cond.nombre}, aquí está tu recibo: ${pdfUrl}`
        window.open(`https://wa.me/52${cond.telefono}?text=${encodeURIComponent(mensaje)}`)
      }

    } catch (err) {
      console.error("ERROR COMPLETO:", err)
      alert("Error al registrar pago")
    }

    setLoading(false)
    setMonto("")
  }

  return (
    <div style={container}>
      <h1>💰 Pagos</h1>

      <div style={form}>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={input}
        >
          <option value="">Selecciona condómino</option>
          {condominios.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre} - {c.vivienda}
            </option>
          ))}
        </select>

        <input
          placeholder="Monto"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          style={input}
        />

        <button
          onClick={registrarPago}
          disabled={loading}
          style={button}
        >
          {loading ? "Guardando..." : "Registrar Pago"}
        </button>
      </div>
    </div>
  )
}

// 🎨 estilos

const container = {
  padding: "20px",
  color: "white"
}

const form = {
  display: "grid",
  gap: "10px",
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
  background: "#16a34a",
  color: "white",
  cursor: "pointer"
}
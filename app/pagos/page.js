'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { generarYSubirPDF } from "@/lib/pdfUpload"

export default function Pagos() {
  const [condominios, setCondominios] = useState([])
  const [pagos, setPagos] = useState([])

  const [selected, setSelected] = useState("")
  const [cond, setCond] = useState(null)

  const [monto, setMonto] = useState("")
  const [concepto, setConcepto] = useState("Mantenimiento")

  // 🔥 FILTROS
  const [filtroCond, setFiltroCond] = useState("")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")

  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarTodo()
  }, [])

  async function cargarTodo() {
    const { data: conds } = await supabase.from("condominos").select("*")
    const { data: pagosData } = await supabase
      .from("pagos")
      .select("*")
      .order("fecha", { ascending: false })

    setCondominios(conds || [])
    setPagos(pagosData || [])
  }

  function seleccionar(id) {
    setSelected(id)
    const c = condominios.find(x => x.id === id)
    setCond(c)
  }

  async function registrarPago() {
    try {
      if (!cond) return alert("Selecciona condómino")
      if (!monto) return alert("Ingresa monto")

      setCargando(true)

      const url = await generarYSubirPDF({
        nombre: cond.nombre,
        monto,
        concepto,
        fecha: new Date().toLocaleDateString()
      })

      const { error } = await supabase.from("pagos").insert([
        {
          condomino_id: cond.id,
          monto,
          concepto,
          fecha: new Date(),
          comprobante: url
        }
      ])

      if (error) throw error

      if (cond.telefono) {
        const mensaje = `Hola ${cond.nombre}, aquí está tu recibo: ${url}`

        window.open(
          `https://wa.me/52${cond.telefono}?text=${encodeURIComponent(mensaje)}`
        )
      }

      alert("✅ Pago registrado")

      setMonto("")
      setConcepto("")
      setSelected("")
      setCond(null)

      cargarTodo()

    } catch (err) {
      console.error("ERROR COMPLETO:", err)
      alert("Error al registrar pago")
    } finally {
      setCargando(false)
    }
  }

  // 🔥 obtener nombre
  function getNombre(id) {
    const c = condominios.find(x => x.id === id)
    return c?.nombre || "Desconocido"
  }

  // 🔥 reenviar
  function reenviar(pago) {
    const c = condominios.find(x => x.id === pago.condomino_id)
    if (!c?.telefono) return alert("Sin teléfono")

    const mensaje = `Hola ${c.nombre}, aquí está tu recibo: ${pago.comprobante}`

    window.open(
      `https://wa.me/52${c.telefono}?text=${encodeURIComponent(mensaje)}`
    )
  }

  // 🔥 FILTRADO
  const pagosFiltrados = pagos.filter(p => {
    let ok = true

    if (filtroCond) {
      ok = ok && p.condomino_id == filtroCond
    }

    if (desde) {
      ok = ok && new Date(p.fecha) >= new Date(desde)
    }

    if (hasta) {
      ok = ok && new Date(p.fecha) <= new Date(hasta)
    }

    return ok
  })

  return (
    <div style={container}>
      <h1>💰 Pagos</h1>

      {/* FORM */}
      <div style={form}>
        <select value={selected} onChange={e => seleccionar(e.target.value)}>
          <option value="">Seleccionar condómino</option>
          {condominios.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input
          placeholder="Monto"
          value={monto}
          onChange={e => setMonto(e.target.value)}
        />

        <input
          placeholder="Concepto"
          value={concepto}
          onChange={e => setConcepto(e.target.value)}
        />

        <button onClick={registrarPago} disabled={cargando}>
          {cargando ? "Procesando..." : "Registrar"}
        </button>
      </div>

      {/* 🔥 FILTROS */}
      <div style={filtros}>
        <select onChange={e => setFiltroCond(e.target.value)}>
          <option value="">Todos los condóminos</option>
          {condominios.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input type="date" onChange={e => setDesde(e.target.value)} />
        <input type="date" onChange={e => setHasta(e.target.value)} />
      </div>

      {/* HISTORIAL */}
      <h2>📄 Historial de pagos</h2>

      {pagosFiltrados.map(p => (
        <div key={p.id} style={card}>
          <div>
            <strong>{getNombre(p.condomino_id)}</strong>
            <p>${p.monto} - {p.concepto}</p>
            <small>{new Date(p.fecha).toLocaleDateString()}</small>
          </div>

          <div style={actions}>
            <button onClick={() => window.open(p.comprobante)} style={btnPdf}>
              📄 PDF
            </button>

            <button onClick={() => reenviar(p)} style={btnWa}>
              📲 WhatsApp
            </button>
          </div>
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

const filtros = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
}

const card = {
  background: "rgba(255,255,255,0.03)",
  padding: "12px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between"
}

const actions = {
  display: "flex",
  gap: "10px"
}

const btnPdf = {
  background: "#38bdf8",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
}

const btnWa = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
}
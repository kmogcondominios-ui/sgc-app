'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { registrarEgreso } from "@/lib/egresos"

export default function Egresos() {
  const [proveedores, setProveedores] = useState([])
  const [egresos, setEgresos] = useState([])
  const [comprobantes, setComprobantes] = useState([])

  const [selected, setSelected] = useState("")
  const [filtro, setFiltro] = useState("")

  const [concepto, setConcepto] = useState("")
  const [monto, setMonto] = useState("")

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data: prov } = await supabase.from("proveedores").select("*")
    const { data: egr } = await supabase.from("egresos").select("*").order("fecha", { ascending: false })
    const { data: comp } = await supabase.from("comprobantes").select("*")

    setProveedores(prov || [])
    setEgresos(egr || [])
    setComprobantes(comp || [])
  }

  async function guardar() {
    const prov = proveedores.find(p => p.id === selected)
    if (!prov) return alert("Selecciona proveedor")

    await registrarEgreso({
      proveedor_id: selected,
      nombre: prov.nombre,
      concepto,
      monto
    })

    setConcepto("")
    setMonto("")
    cargar()
  }

  function verPDF(id) {
    const comp = comprobantes.find(c => c.egreso_id === id)
    if (!comp) return alert("Sin comprobante")

    window.open(comp.pdf_url)
  }

  // 🔥 FILTRO
  const egresosFiltrados = filtro
    ? egresos.filter(e => e.proveedor_id === filtro)
    : egresos

  return (
    <div style={container}>
      <h1>💸 Egresos</h1>

      {/* FORM */}
      <div style={form}>
        <select onChange={e => setSelected(e.target.value)}>
          <option value="">Proveedor</option>
          {proveedores.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <input placeholder="Concepto" value={concepto} onChange={e => setConcepto(e.target.value)} />
        <input placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} />

        <button onClick={guardar}>➕ Registrar</button>
      </div>

      {/* FILTRO */}
      <select onChange={e => setFiltro(e.target.value)}>
        <option value="">🔎 Todos los proveedores</option>
        {proveedores.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {/* LISTA */}
      {egresosFiltrados.map(e => (
        <div key={e.id} style={card}>
          <div>
            <strong>{e.proveedor_nombre}</strong>
            <p>{e.concepto}</p>
            <small>${e.monto} | {new Date(e.fecha).toLocaleDateString()}</small>
          </div>

          <button onClick={() => verPDF(e.id)} style={btnPdf}>
            📄 PDF
          </button>
        </div>
      ))}
    </div>
  )
}

const container = { display: "flex", flexDirection: "column", gap: "20px" }
const form = { display: "flex", gap: "10px", flexWrap: "wrap" }

const card = {
  background: "rgba(255,255,255,0.03)",
  padding: "12px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between"
}

const btnPdf = {
  background: "#38bdf8",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "8px"
}
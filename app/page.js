'use client'
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function Dashboard() {
  const [total, setTotal] = useState(0)
  const [pagos, setPagos] = useState(0)
  const [condominios, setCondominios] = useState(0)
  const [promedio, setPromedio] = useState(0)
  const [grafica, setGrafica] = useState([])
  const [recientes, setRecientes] = useState([])
  const [alerta, setAlerta] = useState("")
  const [deudores, setDeudores] = useState([])

  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: pagosData } = await supabase.from("pagos").select("*")
    const { data: condData } = await supabase.from("condominos").select("*")

    let filtrados = pagosData || []

    if (desde) filtrados = filtrados.filter(p => new Date(p.fecha) >= new Date(desde))
    if (hasta) filtrados = filtrados.filter(p => new Date(p.fecha) <= new Date(hasta))

    const suma = filtrados.reduce((acc, p) => acc + Number(p.monto), 0)

    setTotal(suma)
    setPagos(filtrados.length)
    setCondominios(condData?.length || 0)

    const prom = filtrados.length ? suma / filtrados.length : 0
    setPromedio(prom)

    // 🔥 ALERTAS GENERALES
    if (filtrados.length === 0) {
      setAlerta("⚠️ No hay pagos en el periodo seleccionado")
    } else if (suma < 1000) {
      setAlerta("⚠️ Recaudación baja")
    } else {
      setAlerta("✅ Buen nivel de recaudación")
    }

    // 🔥 DEUDORES (MES ACTUAL)
    const mesActual = new Date().getMonth()

    const pagaron = pagosData
      ?.filter(p => new Date(p.fecha).getMonth() === mesActual)
      .map(p => p.condomino_id)

    const listaDeudores = condData?.filter(c => !pagaron.includes(c.id)) || []

    setDeudores(listaDeudores)

    // 📊 GRÁFICA
    const porMes = {}
    filtrados.forEach(p => {
      const mes = new Date(p.fecha).toLocaleString('es-MX', { month: 'short' })
      if (!porMes[mes]) porMes[mes] = 0
      porMes[mes] += Number(p.monto)
    })

    setGrafica(Object.keys(porMes).map(m => ({ mes: m, total: porMes[m] })))
    setRecientes(filtrados.slice(-5).reverse())
  }

  // 📥 EXPORTAR EXCEL
  function exportarExcel() {
    if (recientes.length === 0) {
      alert("No hay datos para exportar")
      return
    }

    const data = recientes.map(p => ({
      Fecha: p.fecha,
      Monto: p.monto,
      Condominio: p.condomino_id
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Pagos")

    const file = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    saveAs(new Blob([file]), "reporte_pagos.xlsx")
  }

  // 📲 WHATSAPP INDIVIDUAL
  function enviarWhatsApp(deudor) {
    if (!deudor.telefono) {
      alert("Este condómino no tiene teléfono")
      return
    }

    const telefono = "521" + deudor.telefono.replace(/\D/g, "")

    const mensaje = `Hola ${deudor.nombre}, te recordamos que tienes un adeudo pendiente de tu cuota de mantenimiento. Por favor realiza tu pago.`

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

    window.open(url, "_blank")
  }

  // 📲 WHATSAPP MASIVO
  function enviarTodos() {
    deudores.forEach(d => enviarWhatsApp(d))
  }

  return (
    <div style={container}>
      <h1 style={title}>📊 Analytics</h1>

      {/* ALERTA GENERAL */}
      {alerta && <div style={alertBox}>{alerta}</div>}

      {/* ALERTA DEUDORES */}
      {deudores.length > 0 && (
        <div style={alertDanger}>
          ⚠️ {deudores.length} condóminos con adeudo este mes
        </div>
      )}

      {/* FILTROS */}
      <div style={filtros}>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
        <button onClick={cargarDatos}>Filtrar</button>
        <button onClick={exportarExcel}>📥 Excel</button>
      </div>

      {/* KPIs */}
      <div style={grid}>
        <Card title="💰 Total" value={`$${total}`} />
        <Card title="📄 Pagos" value={pagos} />
        <Card title="🏠 Condóminos" value={condominios} />
        <Card title="📊 Promedio" value={`$${promedio.toFixed(2)}`} />
      </div>

      {/* GRÁFICA */}
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={grafica}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BOTÓN MASIVO */}
      {deudores.length > 0 && (
        <button onClick={enviarTodos} style={btnAll}>
          📲 Enviar WhatsApp a todos
        </button>
      )}

      {/* LISTA DEUDORES */}
      {deudores.length > 0 && (
        <div style={section}>
          <h2>⚠️ Deudores</h2>

          {deudores.map(d => (
            <div key={d.id} style={card}>
              <div>
                <strong>{d.nombre}</strong>
                <p>Depto: {d.vivienda}</p>
              </div>

              <button
                onClick={() => enviarWhatsApp(d)}
                style={btnWhatsapp}
              >
                📲 WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={kpi}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  )
}

// 🎨 ESTILOS

const container = { display: "flex", flexDirection: "column", gap: "20px" }
const title = { fontSize: "26px" }

const filtros = {
  display: "flex",
  gap: "10px"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px"
}

const kpi = {
  background: "rgba(255,255,255,0.03)",
  padding: "20px",
  borderRadius: "12px"
}

const alertBox = {
  padding: "10px",
  borderRadius: "10px",
  background: "rgba(245,158,11,0.2)"
}

const alertDanger = {
  padding: "10px",
  borderRadius: "10px",
  background: "rgba(239,68,68,0.2)",
  border: "1px solid #ef4444",
  fontWeight: "bold"
}

const section = { marginTop: "20px" }

const card = {
  background: "rgba(255,255,255,0.03)",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between"
}

const btnWhatsapp = {
  background: "#25D366",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
}

const btnAll = {
  background: "#22c55e",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
}
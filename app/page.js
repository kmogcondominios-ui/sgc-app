'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { generarReporte } from "@/lib/reporteFinanciero"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"

export default function Dashboard() {
  const [total, setTotal] = useState(0)
  const [egresos, setEgresos] = useState(0)
  const [adeudosTotal, setAdeudosTotal] = useState(0)

  const [grafica, setGrafica] = useState([])
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")

  useEffect(() => {
  cargarDatos()

  // 🔥 AUTO REPORTE DIARIO (1 vez por día)
  const lastRun = localStorage.getItem("ultimo_reporte")
  const hoy = new Date().toDateString()

  if (lastRun !== hoy) {
    setTimeout(() => {
      generarReporte({
        total,
        egresos,
        adeudos: adeudosTotal
      })

      localStorage.setItem("ultimo_reporte", hoy)
    }, 3000)
  }

}, [])

  async function cargarDatos() {
    const { data: pagos } = await supabase.from("pagos").select("*")
    const { data: egresosData } = await supabase.from("egresos").select("*")
    const { data: cond } = await supabase.from("condominos").select("*")

    let filtrados = pagos || []

    if (desde) filtrados = filtrados.filter(p => new Date(p.fecha) >= new Date(desde))
    if (hasta) filtrados = filtrados.filter(p => new Date(p.fecha) <= new Date(hasta))

    const suma = filtrados.reduce((a, p) => a + Number(p.monto), 0)
    setTotal(suma)

    const totalEgresos = egresosData?.reduce((a, e) => a + Number(e.monto), 0) || 0
    setEgresos(totalEgresos)

    const pagaron = pagos?.map(p => p.condomino_id)
    const deudores = cond?.filter(c => !pagaron.includes(c.id)) || []

    const totalAdeudos = deudores.reduce((a, d) => a + Number(d.cuota || 0), 0)
    setAdeudosTotal(totalAdeudos)

    // 📊 gráfica mensual
    const porMes = {}
    filtrados.forEach(p => {
      const mes = new Date(p.fecha).toLocaleString("es-MX", { month: "short" })
      porMes[mes] = (porMes[mes] || 0) + Number(p.monto)
    })

    setGrafica(Object.keys(porMes).map(m => ({ mes: m, total: porMes[m] })))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1>📊 Dashboard Financiero</h1>

      {/* 🔥 FILTROS */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
        <button onClick={cargarDatos}>Filtrar</button>

        {/* 📄 REPORTE POR FECHAS */}
        <button onClick={() =>
          generarReporte({ total, egresos, adeudos: adeudosTotal, desde, hasta })
        }>
          📄 PDF
        </button>

        {/* 📅 REPORTE MENSUAL */}
        <button onClick={() =>
          generarReporte({ total, egresos, adeudos: adeudosTotal })
        }>
          📅 Mensual
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
        <Card title="Ingresos" value={total} />
        <Card title="Egresos" value={egresos} />
        <Card title="Adeudos" value={adeudosTotal} />
      </div>

      {/* GRÁFICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={grafica}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Ingresos", value: total },
                { name: "Egresos", value: egresos },
                { name: "Adeudos", value: adeudosTotal }
              ]}
              dataKey="value"
              innerRadius={60}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={{ background: "#020617", padding: "20px", borderRadius: "10px" }}>
      <p>{title}</p>
      <h2>${value}</h2>
    </div>
  )
}
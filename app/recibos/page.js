'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Recibos() {
  const [recibos, setRecibos] = useState([])

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data, error } = await supabase
      .from("recibos")
      .select(`
        id,
        pdf_url,
        pagos (
          monto,
          fecha,
          condomino_id
        )
      `)

    console.log("RECIBOS:", data)
    if (data) setRecibos(data)
  }

  function enviarWhatsApp(telefono, link) {
    const mensaje = `Aquí está tu recibo: ${link}`
    window.open(`https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`)
  }

  return (
    <div style={container}>
      <h1>📄 Recibos</h1>

      {recibos.map(r => (
        <div key={r.id} style={card}>
          <p><strong>Monto:</strong> ${r.pagos?.monto}</p>
          <p><strong>Fecha:</strong> {r.pagos?.fecha}</p>

          <div style={buttons}>
            <a href={r.pdf_url} target="_blank" style={btn}>
              Ver PDF
            </a>

            <button
              onClick={() => enviarWhatsApp("521XXXXXXXXXX", r.pdf_url)}
              style={btnWhats}
            >
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// estilos

const container = {
  padding: "20px",
  color: "white"
}

const card = {
  background: "#1e293b",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px"
}

const buttons = {
  display: "flex",
  gap: "10px",
  marginTop: "10px"
}

const btn = {
  padding: "8px",
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px"
}

const btnWhats = {
  padding: "8px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
}
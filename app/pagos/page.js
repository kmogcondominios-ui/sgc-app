'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { generarYSubirPDF } from "@/lib/pdfUpload"
import { enviarWhatsApp } from "@/lib/whatsapp"

export default function Pagos() {
  const [condominios, setCondominios] = useState([])
  const [id, setId] = useState("")
  const [monto, setMonto] = useState("")

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data } = await supabase.from("condominos").select("*")
    setCondominios(data)
  }

  async function guardar() {
    const cond = condominos.find(c => c.id === id)

    const { data } = await supabase
      .from("pagos")
      .insert([{ condomino_id: id, monto }])
      .select()

    const pdfUrl = await generarYSubirPDF({ monto })

    await supabase.from("recibos").insert([
      { pago_id: data[0].id, pdf_url: pdfUrl }
    ])

    enviarWhatsApp(cond.telefono, pdfUrl)
  }

  return (
    <div>
      <h1>Registrar pago</h1>

      <select onChange={e => setId(e.target.value)}>
        <option>Selecciona</option>
        {condominios.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <input
        placeholder="Monto"
        onChange={e => setMonto(e.target.value)}
      />

      <button onClick={guardar}>
        Guardar y enviar
      </button>
    </div>
  )
}
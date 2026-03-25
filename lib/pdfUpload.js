import { jsPDF } from "jspdf"
import { supabase } from "./supabase"

export async function generarYSubirPDF({ nombre, monto, fecha }) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text("Recibo de Pago", 20, 20)

  doc.setFontSize(12)
  doc.text(`Nombre: ${nombre}`, 20, 40)
  doc.text(`Monto: $${monto}`, 20, 50)
  doc.text(`Fecha: ${fecha}`, 20, 60)

  const blob = doc.output("blob")

  // 🔥 nombre único + evita conflictos
  const fileName = `recibo-${Date.now()}.pdf`

  // 🔥 SOLUCIÓN: permitir sobrescribir (evita error 400)
  const { error } = await supabase.storage
    .from("recibos")
    .upload(fileName, blob, {
      upsert: true
    })

  if (error) {
    console.error("ERROR SUBIENDO PDF:", error)
    throw error
  }

  // 🔗 obtener URL pública
  const { data } = supabase.storage
    .from("recibos")
    .getPublicUrl(fileName)

  return data.publicUrl
}
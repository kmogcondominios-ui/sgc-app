import { jsPDF } from "jspdf"
import { supabase } from "./supabase"

export async function generarYSubirPDF(pago) {
  const doc = new jsPDF()

  doc.text("Recibo de Pago", 20, 20)
  doc.text(`Monto: $${pago.monto}`, 20, 40)

  const blob = doc.output("blob")
  const nombre = `recibo-${Date.now()}.pdf`

  await supabase.storage.from("recibos").upload(nombre, blob)

  const { data } = supabase.storage
    .from("recibos")
    .getPublicUrl(nombre)

  return data.publicUrl
}
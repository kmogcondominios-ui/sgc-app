import { supabase } from "./supabase"
import { generarYSubirPDF } from "./pdfUpload"

export async function registrarPagoCompleto({
  condomino_id,
  nombre,
  monto
}) {
  console.log("INICIANDO PROCESO...")

  // 1. guardar pago
  const { data, error } = await supabase
    .from("pagos")
    .insert([{ condomino_id, monto }])
    .select()

  console.log("DATA PAGO:", data)
  console.log("ERROR PAGO:", error)

  if (error) throw error

  const pago = data[0]
  console.log("PAGO ID:", pago.id)

  // 2. generar PDF
  let pdfUrl

  try {
    pdfUrl = await generarYSubirPDF({
      nombre,
      monto,
      fecha: new Date().toLocaleDateString()
    })
  } catch (err) {
    console.error("ERROR PDF:", err)
    throw err
  }

  console.log("PDF URL:", pdfUrl)

  // 3. guardar recibo
  const { data: reciboData, error: errorRecibo } = await supabase
    .from("recibos")
    .insert([
      {
        pago_id: pago.id,
        pdf_url: pdfUrl
      }
    ])
    .select()

  console.log("RECIBO DATA:", reciboData)
  console.log("ERROR RECIBO:", errorRecibo)

  if (errorRecibo) throw errorRecibo

  return pdfUrl
}
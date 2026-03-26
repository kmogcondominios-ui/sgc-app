import { supabase } from "./supabase"
import { generarYSubirPDF } from "./pdfUpload"

export async function registrarEgreso({
  proveedor_id,
  nombre,
  concepto,
  monto
}) {
  // 1 guardar egreso
  const { data, error } = await supabase
    .from("egresos")
    .insert([
      {
        proveedor_id,
        proveedor_nombre: nombre,
        concepto,
        monto
      }
    ])
    .select()

  if (error) throw error

  const egreso = data[0]

  // 2 generar PDF
  const pdfUrl = await generarYSubirPDF({
    nombre,
    monto,
    concepto,
    fecha: new Date().toLocaleDateString()
  })

  // 3 guardar comprobante
  await supabase.from("comprobantes").insert([
    {
      egreso_id: egreso.id,
      pdf_url: pdfUrl
    }
  ])

  return pdfUrl
}
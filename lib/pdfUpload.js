import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import { supabase } from "./supabase"

// 🔥 cargar imagen
function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => resolve(img)
  })
}

export async function generarYSubirPDF({
  nombre,
  monto,
  concepto,
  fecha
}) {
  const doc = new jsPDF()

  const safeNombre = nombre.replace(/\s+/g, "")
  const fileName = `recibo-${safeNombre}-${Date.now()}.pdf`

  // 🔥 URL REAL (directa)
  const url = `https://tpfifinuvouiqkvplxfj.supabase.co/storage/v1/object/public/recibos/${fileName}`

  // 🔥 QR directo
  const qr = await QRCode.toDataURL(url)

  const imgIzq = await loadImage("/logo-izq.png")
  const imgDer = await loadImage("/logo-der.png")

  // HEADER
  doc.setFillColor(2, 6, 23)
  doc.rect(0, 0, 210, 30, "F")

  doc.addImage(imgIzq, "PNG", 10, 5, 30, 15)
  doc.addImage(imgDer, "PNG", 170, 5, 30, 15)

  doc.setTextColor(255, 255, 255)
  doc.text("Sistema de Gestión de Condominio", 105, 18, { align: "center" })

  // CONTENIDO
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text("RECIBO DE PAGO", 20, 50)

  doc.setFontSize(12)
  doc.text(`Nombre: ${nombre}`, 20, 70)
  doc.text(`Concepto: ${concepto}`, 20, 80)
  doc.text(`Monto: $${monto}`, 20, 90)
  doc.text(`Fecha: ${fecha}`, 20, 100)

  // QR
  doc.addImage(qr, "PNG", 150, 65, 40, 40)

  // 🔥 mostrar URL (opcional)
  doc.setFontSize(7)
  doc.text(url, 20, 120, { maxWidth: 170 })

  // subir
  const pdfBlob = doc.output("blob")

  const { error } = await supabase.storage
    .from("recibos")
    .upload(fileName, pdfBlob, {
      contentType: "application/pdf"
    })

  if (error) throw error

  return url
}
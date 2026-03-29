import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import { supabase } from "./supabase"

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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [140, 216] // MEDIA CARTA
  })

  const safeNombre = nombre.replace(/\s+/g, "")
  const fileName = `recibo-${safeNombre}-${Date.now()}.pdf`

  const url = `https://tpfifinuvouiqkvplxfj.supabase.co/storage/v1/object/public/recibos/${fileName}`

  const qr = await QRCode.toDataURL(url)

  const imgIzq = await loadImage("/logo-izq.png")
  const imgDer = await loadImage("/logo-der.png")

  // HEADER
  doc.setFillColor(2, 6, 23)
  doc.rect(0, 0, 140, 25, "F")

  doc.addImage(imgIzq, "PNG", 8, 4, 25, 12)
  doc.addImage(imgDer, "PNG", 107, 4, 25, 12)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text("Sistema de Gestión de Condominio", 70, 15, { align: "center" })

  // TÍTULO
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.text("RECIBO DE PAGO", 70, 40, { align: "center" })

  // CAJA
  doc.setDrawColor(180)
  doc.rect(10, 50, 120, 55)

  doc.setFontSize(10)
  doc.text(`Nombre: ${nombre}`, 15, 65)
  doc.text(`Concepto: ${concepto}`, 15, 75)
  doc.text(`Monto: $${monto}`, 15, 85)
  doc.text(`Fecha: ${fecha}`, 15, 95)

  // QR
  doc.addImage(qr, "PNG", 95, 65, 30, 30)

  // LEYENDA CORREGIDA
  const leyenda = `ESTE RECIBO NO ES DE CARÁCTER FISCAL, YA QUE COBRA UNA CUOTA PARA EL MANTENIMIENTO Y CONSERVACION DE AREAS COMUNES DE ESTE CONDOMINIO. EL PAGO DE ESTE RECIBO SOLO SE APLICARÁ PARA EL MES ESPECIFICADO Y NO LIBERA AL DEPARTAMENTO DE ADEUDOS.`

  const texto = doc.splitTextToSize(leyenda, 120)

  doc.setFontSize(7)
  doc.text(texto, 70, 170, { align: "center" })

  // SUBIR
  const pdfBlob = doc.output("blob")

  const { error } = await supabase.storage
    .from("recibos")
    .upload(fileName, pdfBlob, {
      contentType: "application/pdf"
    })

  if (error) throw error

  return url
}
import { jsPDF } from "jspdf"

export async function generarReporte({ total, egresos, adeudos }) {
  const doc = new jsPDF()

  const imgIzq = await loadImage("/logo-izq.png")
  const imgDer = await loadImage("/logo-der.png")

  doc.setFillColor(2, 6, 23)
  doc.rect(0, 0, 210, 30, "F")

  doc.addImage(imgIzq, "PNG", 10, 5, 30, 15)
  doc.addImage(imgDer, "PNG", 170, 5, 30, 15)

  doc.setTextColor(255, 255, 255)
  doc.text("Sistema de Gestión de Condominio", 105, 18, { align: "center" })

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.text("REPORTE FINANCIERO", 20, 50)

  doc.text(`Ingresos: $${total}`, 20, 80)
  doc.text(`Egresos: $${egresos}`, 20, 90)
  doc.text(`Adeudos: $${adeudos}`, 20, 100)

  doc.save("reporte.pdf")
}

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
  })
}
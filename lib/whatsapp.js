export function enviarWhatsApp(telefono, url) {
  const mensaje = `Tu recibo: ${url}`
  window.open(`https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`)
}
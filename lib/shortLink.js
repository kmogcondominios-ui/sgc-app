export function generarShortLink(url) {
  const id = Math.random().toString(36).substring(2, 8)
  return `/r/${id}?to=${encodeURIComponent(url)}`
}
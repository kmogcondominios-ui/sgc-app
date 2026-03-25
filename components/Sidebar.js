'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const items = [
    { href: "/", label: "📊 Dashboard" },
    { href: "/pagos", label: "💰 Pagos" },
    { href: "/condominios", label: "🏠 Condóminos" },
    { href: "/adeudos", label: "⚠️ Adeudos" },
    { href: "/recibos", label: "📄 Recibos" }
  ]

  return (
    <div style={sidebar}>
      <h2 style={logo}>🏢 SGC</h2>

      {items.map(item => {
        const active = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...link,
              ...(active ? activeStyle : {})
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

const sidebar = {
  width: "220px",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  padding: "20px",
  background: "#020617",
  borderRight: "1px solid #1e293b"
}

const logo = {
  marginBottom: "20px"
}

const link = {
  display: "block",
  padding: "10px",
  borderRadius: "8px",
  color: "#38bdf8",
  textDecoration: "none",
  marginBottom: "8px"
}

const activeStyle = {
  background: "#38bdf8",
  color: "#020617"
}
'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"

export default function NavLink({ href, label }) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      style={{
        ...link,
        ...(active ? activeStyle : {})
      }}
      onMouseEnter={e => {
        if (!active) {
          e.target.style.background = "rgba(56,189,248,0.1)"
          e.target.style.transform = "translateY(-2px)"
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.target.style.background = "transparent"
          e.target.style.transform = "translateY(0)"
        }
      }}
    >
      {label}
    </Link>
  )
}

const link = {
  padding: "8px 14px",
  borderRadius: "999px",
  textDecoration: "none",
  color: "#38bdf8",
  fontWeight: "500",
  transition: "all 0.25s ease",
  display: "inline-block"
}

const activeStyle = {
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#020617",
  boxShadow: "0 4px 15px rgba(56,189,248,0.4)"
}
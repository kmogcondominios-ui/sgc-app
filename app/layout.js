import LogoutButton from "@/components/LogoutButton"
import NavLink from "@/components/NavLink"
import Logo from "@/components/Logo"
import ThemeToggle from "@/components/ThemeToggle"
import { ThemeProvider } from "@/components/ThemeProvider"

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, Arial", transition: "all 0.3s" }}>

        <ThemeProvider>

          {/* HEADER */}
          <header style={header}>
            <div style={logoLeft}>
              <Logo src="/logo-izq.png" />
            </div>

            <h1 style={title}>
              Sistema de Administración de Condominio
            </h1>

            <div style={right}>
              <ThemeToggle />
              <LogoutButton />
              <Logo src="/logo-der.png" />
            </div>
          </header>

          {/* NAV CENTRADO */}
          <nav style={nav}>
            <NavLink href="/" label="📊 Dashboard" />
            <NavLink href="/pagos" label="💰 Pagos" />
            <NavLink href="/condominios" label="🏠 Condóminos" />
            <NavLink href="/adeudos" label="⚠️ Adeudos" />
            <NavLink href="/recibos" label="📄 Recibos" />
            <NavLink href="/proveedores" label="🏢 Proveedores" />
            <NavLink href="/egresos" label="💸 Egresos" />
          </nav>

          {/* CONTENIDO */}
          <main style={main}>
            <div style={container}>
              {children}
            </div>
          </main>

        </ThemeProvider>

      </body>
    </html>
  )
}

// 🎨 estilos

const header = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  padding: "15px 30px",
  background: "rgba(2,6,23,0.7)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(255,255,255,0.05)"
}

const logoLeft = {
  display: "flex",
  alignItems: "center"
}

const right = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
}

const title = {
  textAlign: "center",
  fontSize: "40px",
  fontWeight: "600"
}

const nav = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  padding: "12px"
}

const main = {
  display: "flex",
  justifyContent: "center",
  padding: "20px"
}

const container = {
  width: "100%",
  maxWidth: "1200px"
}
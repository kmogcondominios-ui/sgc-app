'use client'

export default function Logo({ src }) {
  return (
    <img
      src={src}
      style={logo}
      onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
      onMouseLeave={e => e.target.style.transform = "scale(1)"}
    />
  )
}

const logo = {
  width: "250px",
  height: "125px",
  objectFit: "contain",
  transition: "all 0.3s ease"
}
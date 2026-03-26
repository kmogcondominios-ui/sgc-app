import { NextResponse } from "next/server"

export function middleware(req) {
  const isLogin = req.nextUrl.pathname.startsWith("/login")

  const token = req.cookies.get("sb-access-token")

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
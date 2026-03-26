import { redirect } from "next/navigation"

export default function Page({ searchParams }) {
  const url = searchParams.to
  redirect(url)
}
import { NextRequest } from "next/server"
import { findStudentByUSNOrName } from "@/data/students"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const usn = searchParams.get("usn")
  const fullName = searchParams.get("fullName")

  const match = findStudentByUSNOrName(usn || undefined, fullName || undefined)

  if (!match) {
    return new Response(
      JSON.stringify({ ok: false, error: "No matching record found. Please verify your Name or USN and try again." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(JSON.stringify({ ok: true, student: match }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

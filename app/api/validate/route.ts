import type { NextRequest } from "next/server"
import { findStudentByUSNOrName } from "@/data/students"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const usn = searchParams.get("usn")
  const fullName = searchParams.get("fullName")

  try {
    const match = await findStudentByUSNOrName(usn || undefined, fullName || undefined)

    if (!match) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "No matching record found. Please verify your Name or USN and try again.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    return new Response(JSON.stringify({ ok: true, student: match }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Validation error:", error)
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Server error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

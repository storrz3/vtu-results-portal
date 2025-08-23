import type { NextRequest } from "next/server"
import { findStudentByUSNOrName } from "@/data/students"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const usn = searchParams.get("usn")
  const fullName = searchParams.get("fullName")

  console.log('=== API VALIDATE DEBUG ===')
  console.log('Received params:', { usn, fullName })
  console.log('USN exists:', !!usn)
  console.log('FullName exists:', !!fullName)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Timestamp:', new Date().toISOString())

  try {
    console.log('🔄 Starting student search...')
    const match = await findStudentByUSNOrName(usn || undefined, fullName || undefined)
    console.log('Database search result:', match ? 'FOUND' : 'NOT_FOUND')
    
    if (match) {
      console.log('✅ Found student:', { usn: match.usn, name: match.fullName })
    }

    if (!match) {
      console.log('Returning 404 - no match found')
      return new Response(
        JSON.stringify({
          ok: false,
          error: "No matching record found. Please verify your Name or USN and try again.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }, // ✅ Fixed: 404 instead of 403
      )
    }

    console.log('Returning 200 - match found')
    return new Response(JSON.stringify({ ok: true, student: match }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("API Validation error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Server error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

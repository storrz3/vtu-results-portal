import type { NextRequest } from "next/server"
import { findStudentByUSNOrName } from "@/data/students"

// Add CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const usn = searchParams.get("usn")
  const fullName = searchParams.get("fullName")

  console.log('=== API VALIDATE DEBUG ===')
  console.log('Received params:', { usn, fullName })
  console.log('USN exists:', !!usn)
  console.log('FullName exists:', !!fullName)

  try {
    const match = await findStudentByUSNOrName(usn || undefined, fullName || undefined)
    console.log('Database search result:', match ? 'FOUND' : 'NOT_FOUND')

    if (!match) {
      console.log('Returning 404 - no match found')
      return new Response(
        JSON.stringify({
          ok: false,
          error: "No matching record found. Please verify your Name or USN and try again.",
        }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        },
      )
    }

    console.log('Returning 200 - match found')
    return new Response(JSON.stringify({ ok: true, student: match }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  } catch (error) {
    console.error("API Validation error:", error)
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Server error occurred. Please try again later.",
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      },
    )
  }
}

// Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

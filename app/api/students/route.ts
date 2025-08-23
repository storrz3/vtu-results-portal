import type { NextRequest } from "next/server"
import { getAllStudents } from "@/data/students"

export async function GET(req: NextRequest) {
  try {
    console.log('=== API STUDENTS DEBUG ===')
    console.log('Fetching all students data...')

    const students = await getAllStudents()
    console.log(`Found ${students.length} students`)

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      },
    })
  } catch (error) {
    console.error("API Students error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to load students data",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
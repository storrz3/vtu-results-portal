import { NextResponse } from "next/server"
import { loadStudentsData } from "@/data/students"

export async function GET() {
  try {
    console.log("🧪 Test API: Starting data load test...")
    
    const startTime = Date.now()
    const students = await loadStudentsData()
    const endTime = Date.now()
    
    console.log("🧪 Test API: Data load completed")
    
    return NextResponse.json({
      success: true,
      studentsCount: students.length,
      loadTime: `${endTime - startTime}ms`,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      sampleStudent: students.length > 0 ? {
        usn: students[0].usn,
        name: students[0].fullName,
        subjectsCount: students[0].subjects.length
      } : null
    })
  } catch (error) {
    console.error("🧪 Test API: Error occurred:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
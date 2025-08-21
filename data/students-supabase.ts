import { supabase } from '@/lib/supabase'

export type Student = {
  usn: string
  fullName: string
  totalMarks: number
  percentage: number
  sgpa: number
  subjects: Subject[]
  section?: string
  classRank?: number
  collegeRank?: number
  pdfLink?: string
}

export type Subject = {
  code: string
  subject: string
  marks: number
  grade: string
  status: "Pass" | "Fail"
}

// Transform database row to Student type
function transformStudentFromDB(dbStudent: any): Student {
  return {
    usn: dbStudent.usn,
    fullName: dbStudent.full_name,
    totalMarks: dbStudent.total_marks,
    percentage: dbStudent.percentage,
    sgpa: dbStudent.sgpa,
    subjects: dbStudent.subjects?.map((subject: any) => ({
      code: subject.code,
      subject: subject.subject_name,
      marks: subject.marks,
      grade: subject.grade,
      status: subject.status as "Pass" | "Fail"
    })) || [],
    section: dbStudent.section,
    classRank: dbStudent.class_rank,
    collegeRank: dbStudent.college_rank,
    pdfLink: dbStudent.pdf_link,
  }
}

export async function loadStudentsData(): Promise<Student[]> {
  try {
    console.log("🔄 Loading students data from Supabase...")

    const { data: students, error } = await supabase
      .from('students')
      .select(`
        *,
        subjects (
          code,
          subject_name,
          marks,
          grade,
          status
        )
      `)

    if (error) {
      console.error("❌ Error loading students from Supabase:", error)
      return []
    }

    const transformedStudents = students.map(transformStudentFromDB)
    console.log(`✅ Total students loaded from Supabase: ${transformedStudents.length}`)
    
    return transformedStudents
  } catch (error) {
    console.error("❌ Error in loadStudentsData:", error)
    return []
  }
}

export function normalizeUSN(input: string): string {
  return input.trim().toUpperCase()
}

export function normalizeName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ")
}

export async function findStudentByUSNOrName(usn?: string | null, fullName?: string | null): Promise<Student | null> {
  if (!usn && !fullName) return null

  console.log("🔍 Finding student in Supabase:", { usn, fullName })

  try {
    let query = supabase
      .from('students')
      .select(`
        *,
        subjects (
          code,
          subject_name,
          marks,
          grade,
          status
        )
      `)

    // Search by USN first (exact match)
    if (usn) {
      const normalizedUSN = normalizeUSN(usn)
      const { data: studentByUSN, error: usnError } = await query
        .ilike('usn', normalizedUSN)
        .single()

      if (!usnError && studentByUSN) {
        console.log("✅ Found by USN:", studentByUSN.usn)
        return transformStudentFromDB(studentByUSN)
      }
    }

    // Search by name (case-insensitive)
    if (fullName) {
      const normalizedName = normalizeName(fullName)
      const { data: studentsByName, error: nameError } = await query
        .ilike('full_name', `%${normalizedName}%`)

      if (!nameError && studentsByName && studentsByName.length > 0) {
        // Find exact match first
        const exactMatch = studentsByName.find(student => 
          normalizeName(student.full_name) === normalizedName
        )
        
        if (exactMatch) {
          console.log("✅ Found exact name match:", exactMatch.full_name)
          return transformStudentFromDB(exactMatch)
        }

        // Return first partial match
        console.log("✅ Found partial name match:", studentsByName[0].full_name)
        return transformStudentFromDB(studentsByName[0])
      }
    }

    console.log("❌ Student not found in Supabase")
    return null

  } catch (error) {
    console.error("❌ Error searching for student:", error)
    return null
  }
}

export async function getAllStudents(): Promise<Student[]> {
  return await loadStudentsData()
}

// Utility function to get student by ID (useful for API routes)
export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const { data: student, error } = await supabase
      .from('students')
      .select(`
        *,
        subjects (
          code,
          subject_name,
          marks,
          grade,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error || !student) {
      console.log("❌ Student not found by ID:", id)
      return null
    }

    return transformStudentFromDB(student)
  } catch (error) {
    console.error("❌ Error getting student by ID:", error)
    return null
  }
}
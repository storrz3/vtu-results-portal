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

// Subject code to name mapping
const SUBJECT_NAMES: Record<string, string> = {
  BMATS201: "MATHEMATICS-II FOR CSE STREAM",
  BCHES202: "APPLIED CHEMISTRY FOR CSE STREAM",
  BCEDK203: "COMPUTER-AIDED ENGINEERING DRAWING",
  BPWSK206: "PROFESSIONAL WRITING SKILLS IN ENGLISH",
  BICOK207: "INDIAN CONSTITUTION",
  BIDTK258: "INNOVATION AND DESIGN THINKING",
  BESCK204B: "INTRODUCTION TO ELECTRICAL ENGINEERING",
  BESCK204C: "INTRODUCTION TO ELECTRICAL ENGINEERING",
  BPLCK205D: "INTRODUCTION TO C++ PROGRAMMING",
}

function calculateGrade(marks: number): string {
  if (marks >= 90) return "S"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "F"
}

// Parse individual subject string like "BMATS201:64 (P)"
function parseSubjectString(subjectStr: string): Subject | null {
  if (!subjectStr || subjectStr.trim() === "") return null

  console.log(`🔍 Parsing subject: "${subjectStr}"`)

  // Match pattern: "BMATS201:64 (P)" or "BMATS201:64 (F)"
  const match = subjectStr.match(/^([A-Z0-9]+):(\d+)\s*$$(P|F)$$$/)

  if (match) {
    const code = match[1]
    const marks = Number.parseInt(match[2], 10)
    const status = match[3] === "P" ? "Pass" : "Fail"
    const grade = calculateGrade(marks)

    console.log(`✅ Parsed: ${code}: ${marks} (${grade}) ${status}`)

    return {
      code,
      subject: SUBJECT_NAMES[code] || code,
      marks,
      grade,
      status,
    }
  }

  console.log(`❌ Failed to parse: "${subjectStr}"`)
  return null
}

// Parse CSV line respecting quoted commas
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

// Main function to parse CSV text into array of Students
function parseStudentsCSV(csvText: string): Student[] {
  const lines = csvText.trim().split("\n")
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))

  console.log("📋 Headers:", headers)
  console.log("📊 Data lines:", lines.length - 1)

  const students: Student[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const record: any = {}
    headers.forEach((header, index) => {
      record[header] = values[index] || ""
    })

    console.log(`Processing student: ${record.name} (${record.usn})`)

    // Parse subjects from subject1 through subject8
    const subjects: Subject[] = []
    for (let j = 1; j <= 8; j++) {
      const subjectKey = `subject${j}`
      const subjectValue = record[subjectKey]

      if (subjectValue) {
        const parsedSubject = parseSubjectString(subjectValue)
        if (parsedSubject) {
          subjects.push(parsedSubject)
        }
      }
    }

    console.log(`✅ Parsed ${subjects.length} subjects for ${record.name}`)

    const student: Student = {
      usn: record.usn || "",
      fullName: record.name || "",
      totalMarks: Number.parseInt(record.total_marks, 10) || 0,
      percentage: Number.parseFloat(record.percentage) || 0,
      sgpa: Number.parseFloat(record.sgpa) || 0,
      subjects: subjects,
      section: record.section || undefined,
      pdfLink: record.pdf_drive_link || undefined,
      classRank: record.class_rank ? Number.parseInt(record.class_rank, 10) : undefined,
      collegeRank: record.college_rank ? Number.parseInt(record.college_rank, 10) : undefined,
    }

    if (student.usn && student.fullName) {
      students.push(student)
    }
  }

  return students
}

export async function loadStudentsData(): Promise<Student[]> {
  try {
    console.log("🔄 Loading students data...")

    // Updated CSV URL
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%282%29-qrDteB9HsWMIXFH7WN92QhMH6Ux3MW.csv"

    console.log("📍 Fetching from:", csvUrl)

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("📊 CSV fetched, length:", csvText.length)

    // Use the corrected parsing function
    const students = parseStudentsCSV(csvText)

    console.log(`✅ Total students loaded: ${students.length}`)
    return students
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

  console.log("🔍 Finding student:", { usn, fullName })

  const students = await loadStudentsData()
  console.log("📊 Available students:", students.length)

  const nUSN = usn ? normalizeUSN(usn) : null
  const nName = fullName ? normalizeName(fullName) : null

  for (const student of students) {
    if (nUSN && normalizeUSN(student.usn) === nUSN) {
      console.log("✅ Found by USN:", student)
      return student
    }
    if (nName && normalizeName(student.fullName) === nName) {
      console.log("✅ Found by name:", student)
      return student
    }
  }

  console.log("❌ Student not found")
  return null
}

export async function getAllStudents(): Promise<Student[]> {
  return await loadStudentsData()
}

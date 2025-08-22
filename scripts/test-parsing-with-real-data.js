// Test script to verify the parsing works with real CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-FXLyj75yrauF050Wq8lxwccRPDE4Y6.csv"

// Subject mapping
const SUBJECT_NAMES = {
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

function calculateGrade(marks) {
  if (marks >= 90) return "S"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "F"
}

// CORRECTED parsing function
function parseSubjects(subjectsStr) {
  console.log("🔍 Parsing subjects:", subjectsStr)

  if (!subjectsStr) return []

  let s = subjectsStr.trim()
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1)
  }
  if (s.startsWith("[")) s = s.slice(1)
  if (s.endsWith("]")) s = s.slice(0, -1)

  console.log("After cleaning:", s)

  return s
    .split(/',\s*'/)
    .map((token) => {
      token = token.replace(/^'+|'+$/g, "")
      console.log(`Parsing token: "${token}"`)

      // Match pattern: BMATS201:74 (P)
      const match = token.match(/^([A-Z0-9]+):(\d+)\s*$$(P|F)$$$/)
      if (!match) {
        console.log(`❌ No match for: "${token}"`)
        return null
      }

      const code = match[1]
      const marks = Number.parseInt(match[2]) // FIXED: was parseInt(match)
      const status = match[3] === "P" ? "Pass" : "Fail" // FIXED: was match === "P"
      const grade = calculateGrade(marks)
      const subject = SUBJECT_NAMES[code] || code

      console.log(`✅ Parsed: ${code}: ${marks} (${grade}) ${status}`)

      return { code, subject, marks, grade, status }
    })
    .filter(Boolean)
}

function parseCSVLine(line) {
  const values = []
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

async function testParsingWithRealData() {
  try {
    console.log("🚀 Testing parsing with real CSV data...")

    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("✅ CSV fetched, length:", csvText.length)

    const lines = csvText.trim().split("\n")
    const headers = parseCSVLine(lines[0]).map((h) => h.replace(/"/g, "").trim())

    console.log("📋 Headers:", headers)

    // Test with first student
    const firstLine = lines[1]
    const values = parseCSVLine(firstLine)

    const student = {}
    headers.forEach((header, index) => {
      student[header] = values[index] || ""
    })

    console.log("\n📊 FIRST STUDENT:")
    console.log("USN:", student.usn)
    console.log("Name:", student.name)
    console.log("SGPA:", student.sgpa)
    console.log("Raw subjects:", student.subjects)

    // Parse subjects
    const subjects = parseSubjects(student.subjects)

    console.log("\n📋 PARSED SUBJECTS:")
    console.log("Total subjects:", subjects.length)

    if (subjects.length > 0) {
      console.log("\nSUBJECTS TABLE:")
      console.log("CODE\t\tSUBJECT\t\t\t\tMARKS\tGRADE\tSTATUS")
      console.log("=" * 80)

      subjects.forEach((subject) => {
        console.log(
          `${subject.code}\t${subject.subject.substring(0, 30).padEnd(30)}\t${subject.marks}\t${subject.grade}\t${subject.status}`,
        )
      })

      console.log("\n🎉 SUCCESS! Subjects parsed correctly!")
    } else {
      console.log("❌ No subjects parsed - there's still an issue")
    }

    // Test with a few more students
    console.log("\n📊 TESTING MORE STUDENTS:")
    for (let i = 2; i <= Math.min(4, lines.length - 1); i++) {
      const values = parseCSVLine(lines[i])
      const student = {}
      headers.forEach((header, index) => {
        student[header] = values[index] || ""
      })

      const subjects = parseSubjects(student.subjects)
      console.log(`Student ${i}: ${student.name} - ${subjects.length} subjects parsed`)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run the test
testParsingWithRealData()

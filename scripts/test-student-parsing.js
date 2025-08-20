// Test script to parse and display specific student data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

// Subject code to name mapping
const SUBJECT_NAMES = {
  BMATS201: "MATHEMATICS FOR CSE STREAM-2",
  BCHES202: "CHEMISTRY FOR CSE STREAM",
  BCEDK203: "COMPUTER AIDED ENGINEERING DRAWING",
  BPWSK206: "PROFESSIONAL WRITING SKILLS IN KANNADA",
  BICOK207: "INDIAN CONSTITUTION",
  BIDTK258: "INTRODUCTION TO DATA STRUCTURES",
  BESCK204C: "INTRODUCTION TO ELECTRONICS ENGINEERING",
  BPLCK205D: "PROGRAMMING LABORATORY WITH C",
}

// Grade calculation
function calculateGrade(marks) {
  if (marks >= 90) return "S"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "F"
}

// Parse subjects from CSV format
function parseSubjects(subjectsStr) {
  if (!subjectsStr) return []

  try {
    console.log("Raw subjects string:", subjectsStr)

    // Clean up the string
    let cleanStr = subjectsStr.trim()
    if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
      cleanStr = cleanStr.slice(1, -1)
    }

    if (!cleanStr.startsWith("[") || !cleanStr.endsWith("]")) {
      return []
    }

    // Remove brackets
    cleanStr = cleanStr.slice(1, -1)

    // Split by comma, handling quotes
    const subjects = []
    let currentSubject = ""
    let inSingleQuotes = false
    let i = 0

    while (i < cleanStr.length) {
      const char = cleanStr[i]

      if (char === "'" && (i === 0 || cleanStr[i - 1] !== "\\")) {
        inSingleQuotes = !inSingleQuotes
        i++
        continue
      }

      if (char === "," && !inSingleQuotes) {
        const subject = currentSubject.trim().replace(/^'|'$/g, "")
        if (subject) subjects.push(subject)
        currentSubject = ""
        i++
        while (i < cleanStr.length && cleanStr[i] === " ") i++
        continue
      }

      currentSubject += char
      i++
    }

    // Add last subject
    const lastSubject = currentSubject.trim().replace(/^'|'$/g, "")
    if (lastSubject) subjects.push(lastSubject)

    console.log("Split subjects:", subjects)

    // Parse each subject
    return subjects
      .map((subject) => {
        console.log(`Parsing: "${subject}"`)

        // Match pattern: "BMATS201:74 (P)"
        const match = subject.match(/^([A-Z0-9]+):(\d+)\s*$$([FP])$$/)
        if (match) {
          const code = match[1]
          const marks = Number.parseInt(match[2])
          const status = match[3] === "P" ? "Pass" : "Fail"

          return {
            code,
            subject: SUBJECT_NAMES[code] || code,
            marks,
            grade: calculateGrade(marks),
            status,
          }
        }

        console.log(`Failed to parse: "${subject}"`)
        return null
      })
      .filter((s) => s !== null)
  } catch (error) {
    console.error("Error parsing subjects:", error)
    return []
  }
}

async function testStudentParsing() {
  try {
    console.log("Testing student 3VC24CD001 parsing...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("Headers:", headers)

    // Find student 3VC24CD001
    let targetStudent = null
    for (let i = 1; i < lines.length; i++) {
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current)
          current = ""
        } else {
          current += char
        }
      }
      values.push(current)

      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      if (record.usn === "3VC24CD001") {
        targetStudent = record
        break
      }
    }

    if (!targetStudent) {
      console.log("Student 3VC24CD001 not found")
      return
    }

    console.log("\n=== STUDENT FOUND ===")
    console.log("USN:", targetStudent.usn)
    console.log("Name:", targetStudent.name)
    console.log("SGPA:", targetStudent.sgpa)
    console.log("Total Marks:", targetStudent.total_marks)
    console.log("Percentage:", targetStudent.percentage)
    console.log("Class Rank:", targetStudent.class_rank)
    console.log("College Rank:", targetStudent.college_rank)

    // Parse subjects
    const subjects = parseSubjects(targetStudent.subjects)

    console.log("\n=== SUBJECTS AND MARKS ===")
    console.log(`Subjects and Marks (${subjects.length} subjects)`)
    console.log("\nCODE\t\tSUBJECT\t\t\t\t\tMARKS\tGRADE\tSTATUS")
    console.log("=".repeat(80))

    let aggregateMarks = 0
    subjects.forEach((subject) => {
      aggregateMarks += subject.marks
      console.log(
        `${subject.code}\t${subject.subject.substring(0, 30).padEnd(30)}\t${subject.marks}\t${subject.grade}\t${subject.status}`,
      )
    })

    console.log("=".repeat(80))
    console.log(`Total Subjects: ${subjects.length}`)
    console.log(`Aggregate Marks: ${aggregateMarks}`)
    console.log(`Total Marks: ${targetStudent.total_marks}`)

    // Verify the expected data matches
    const expectedData = [
      { code: "BMATS201", marks: 74, grade: "B", status: "Pass" },
      { code: "BCHES202", marks: 69, grade: "C", status: "Pass" },
      { code: "BCEDK203", marks: 87, grade: "A", status: "Pass" },
      { code: "BPWSK206", marks: 64, grade: "C", status: "Pass" },
      { code: "BICOK207", marks: 53, grade: "D", status: "Pass" },
      { code: "BIDTK258", marks: 72, grade: "B", status: "Pass" },
      { code: "BESCK204C", marks: 68, grade: "C", status: "Pass" },
      { code: "BPLCK205D", marks: 86, grade: "A", status: "Pass" },
    ]

    console.log("\n=== VERIFICATION ===")
    let allMatch = true
    expectedData.forEach((expected, index) => {
      const actual = subjects[index]
      if (
        actual &&
        actual.code === expected.code &&
        actual.marks === expected.marks &&
        actual.grade === expected.grade &&
        actual.status === expected.status
      ) {
        console.log(`✅ ${expected.code}: ${expected.marks} (${expected.grade}) ${expected.status}`)
      } else {
        console.log(
          `❌ ${expected.code}: Expected ${expected.marks} (${expected.grade}) ${expected.status}, got ${actual ? `${actual.marks} (${actual.grade}) ${actual.status}` : "null"}`,
        )
        allMatch = false
      }
    })

    if (allMatch) {
      console.log("\n🎉 All subjects parsed correctly!")
    } else {
      console.log("\n⚠️ Some subjects didn't match expected data")
    }
  } catch (error) {
    console.error("Error testing student parsing:", error)
  }
}

// Run the test
testStudentParsing()

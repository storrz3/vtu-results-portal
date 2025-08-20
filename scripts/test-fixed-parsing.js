// Test script with the fixed regex pattern
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

// Subject mapping
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

function calculateGrade(marks) {
  if (marks >= 90) return "S"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "F"
}

function parseStudentResults(subjectsStr) {
  console.log("🔍 Parsing subjects string:", subjectsStr)

  // Clean up the string
  let cleanStr = subjectsStr.trim()
  if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
    cleanStr = cleanStr.slice(1, -1)
  }

  if (!cleanStr.startsWith("[") || !cleanStr.endsWith("]")) {
    console.log("❌ Not in array format")
    return []
  }

  // Remove brackets
  cleanStr = cleanStr.slice(1, -1)

  // Split subjects properly
  const subjects = []
  let currentSubject = ""
  let inSingleQuotes = false

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i]

    if (char === "'" && (i === 0 || cleanStr[i - 1] !== "\\")) {
      inSingleQuotes = !inSingleQuotes
    } else if (char === "," && !inSingleQuotes) {
      const subject = currentSubject.trim().replace(/^'|'$/g, "")
      if (subject) subjects.push(subject)
      currentSubject = ""
    } else {
      currentSubject += char
    }
  }

  // Add last subject
  const lastSubject = currentSubject.trim().replace(/^'|'$/g, "")
  if (lastSubject) subjects.push(lastSubject)

  console.log("📋 Split subjects:", subjects)

  // Parse each subject with FIXED regex
  const parsedSubjects = subjects
    .map((subject) => {
      console.log(`🔍 Parsing: "${subject}"`)

      // FIXED REGEX: Match "BMATS201:74 (P)" - with space before parentheses
      const match = subject.match(/^([A-Z0-9]+):(\d+)\s+$$([FP])$$/)
      if (match) {
        const code = match[1]
        const marks = Number.parseInt(match[2])
        const status = match[3] === "P" ? "Pass" : "Fail"
        const grade = calculateGrade(marks)

        console.log(`✅ Parsed: ${code} - ${marks} marks - Grade ${grade} - ${status}`)

        return {
          code,
          subject: SUBJECT_NAMES[code] || code,
          marks,
          grade,
          status,
        }
      }

      console.log(`❌ Failed to parse: "${subject}"`)
      return null
    })
    .filter((s) => s !== null)

  return parsedSubjects
}

async function testFixedParsing() {
  try {
    console.log("🚀 Testing fixed parsing logic...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

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
      console.log("❌ Student 3VC24CD001 not found")
      return
    }

    console.log("✅ Found student:", targetStudent.name)

    // Parse subjects with fixed logic
    const subjects = parseStudentResults(targetStudent.subjects)

    console.log("\n📊 SUBJECTS AND MARKS TABLE")
    console.log("=" * 60)
    console.log("CODE\t\tSUBJECT\t\t\t\tMARKS\tGRADE\tSTATUS")
    console.log("=" * 60)

    let aggregateMarks = 0
    subjects.forEach((subject) => {
      aggregateMarks += subject.marks
      console.log(
        `${subject.code}\t${subject.subject.substring(0, 25).padEnd(25)}\t${subject.marks}\t${subject.grade}\t${subject.status}`,
      )
    })

    console.log("=" * 60)
    console.log(`Total Subjects: ${subjects.length}`)
    console.log(`Aggregate Marks: ${aggregateMarks}`)
    console.log(`Total Marks: ${targetStudent.total_marks}`)

    // Verify expected results
    const expectedResults = [
      { code: "BMATS201", marks: 74, grade: "B", status: "Pass" },
      { code: "BCHES202", marks: 69, grade: "C", status: "Pass" },
      { code: "BCEDK203", marks: 87, grade: "A", status: "Pass" },
      { code: "BPWSK206", marks: 64, grade: "C", status: "Pass" },
      { code: "BICOK207", marks: 53, grade: "D", status: "Pass" },
      { code: "BIDTK258", marks: 72, grade: "B", status: "Pass" },
      { code: "BESCK204C", marks: 68, grade: "C", status: "Pass" },
      { code: "BPLCK205D", marks: 86, grade: "A", status: "Pass" },
    ]

    console.log("\n🔍 VERIFICATION")
    let allCorrect = true
    expectedResults.forEach((expected, index) => {
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
        console.log(`❌ ${expected.code}: Expected vs Actual mismatch`)
        allCorrect = false
      }
    })

    if (allCorrect && aggregateMarks === 573) {
      console.log("\n🎉 SUCCESS! All subjects parsed correctly!")
      console.log("✅ Aggregate marks match: 573")
    } else {
      console.log("\n⚠️ Some issues found")
      console.log(`Expected aggregate: 573, Got: ${aggregateMarks}`)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run the test
testFixedParsing()

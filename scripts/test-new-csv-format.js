// Test script for the new CSV format with individual subject columns
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%282%29-qrDteB9HsWMIXFH7WN92QhMH6Ux3MW.csv"

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

function parseSubjectString(subjectStr) {
  if (!subjectStr || subjectStr.trim() === "") return null

  console.log(`🔍 Parsing: "${subjectStr}"`)

  // Match pattern: "BMATS201:64 (P)"
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

async function testNewCSVFormat() {
  try {
    console.log("🚀 Testing new CSV format...")

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("✅ CSV fetched, length:", csvText.length)

    const lines = csvText.trim().split("\n")
    const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))

    console.log("📋 Headers:", headers)
    console.log("📊 Total records:", lines.length - 1)

    // Test with first student
    if (lines.length > 1) {
      const values = parseCSVLine(lines[1])
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      console.log("\n📊 FIRST STUDENT:")
      console.log("USN:", record.usn)
      console.log("Name:", record.name)
      console.log("Total Marks:", record.total_marks)
      console.log("Percentage:", record.percentage)
      console.log("SGPA:", record.sgpa)
      console.log("Section:", record.section)
      console.log("Class Rank:", record.class_rank)
      console.log("College Rank:", record.college_rank)

      console.log("\n📋 SUBJECTS:")
      const subjects = []
      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        const subjectValue = record[subjectKey]

        console.log(`${subjectKey}: "${subjectValue}"`)

        if (subjectValue) {
          const parsedSubject = parseSubjectString(subjectValue)
          if (parsedSubject) {
            subjects.push(parsedSubject)
          }
        }
      }

      console.log(`\n✅ Successfully parsed ${subjects.length} subjects`)

      if (subjects.length > 0) {
        console.log("\n📊 SUBJECTS TABLE:")
        console.log("CODE\t\tSUBJECT\t\t\t\tMARKS\tGRADE\tSTATUS")
        console.log("=" * 80)

        subjects.forEach((subject) => {
          console.log(
            `${subject.code}\t${subject.subject.substring(0, 30).padEnd(30)}\t${subject.marks}\t${subject.grade}\t${subject.status}`,
          )
        })

        const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0)
        console.log("\n📊 SUMMARY:")
        console.log(`Total Subjects: ${subjects.length}`)
        console.log(`Aggregate Marks: ${totalMarks}`)
        console.log(`Expected Total: ${record.total_marks}`)
        console.log(`Match: ${totalMarks == record.total_marks ? "✅" : "❌"}`)
      }
    }

    // Test a few more students
    console.log("\n📊 TESTING MORE STUDENTS:")
    for (let i = 2; i <= Math.min(4, lines.length - 1); i++) {
      const values = parseCSVLine(lines[i])
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      const subjects = []
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

      console.log(`Student ${i}: ${record.name} (${record.usn}) - ${subjects.length} subjects`)
    }

    console.log("\n🎉 CSV format test completed!")
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run the test
testNewCSVFormat()

// Data migration script to move CSV data to Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zauotjcjjbxawukfartz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdW90amNqamJ4YXd1a2ZhcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTE2NDksImV4cCI6MjA3MTMyNzY0OX0.QJl1DpOq-S-212Te2iBQOIQSPptc-0GHq7WXSnHc20k'

const supabase = createClient(supabaseUrl, supabaseKey)

// Subject code to name mapping (from original students.ts)
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

// Parse individual subject string like "BMATS201:64 (P)"
function parseSubjectString(subjectStr) {
  if (!subjectStr || subjectStr.trim() === "") return null

  console.log(`🔍 Parsing subject: "${subjectStr}"`)

  // Match pattern: "BMATS201:64 (P)" or "BMATS201:64 (F)"
  const match = subjectStr.match(/^([A-Z0-9]+):(\d+)\s*$$(P|F)$$$/)

  if (match) {
    const code = match[1]
    const marks = parseInt(match[2], 10)
    const status = match[3] === "P" ? "Pass" : "Fail"
    const grade = calculateGrade(marks)

    console.log(`✅ Parsed: ${code}: ${marks} (${grade}) ${status}`)

    return {
      code,
      subject_name: SUBJECT_NAMES[code] || code,
      marks,
      grade,
      status,
    }
  }

  console.log(`❌ Failed to parse: "${subjectStr}"`)
  return null
}

// Parse CSV line respecting quoted commas
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

// Main function to parse CSV text into array of Students
function parseStudentsCSV(csvText) {
  const lines = csvText.trim().split("\n")
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))

  console.log("📋 Headers:", headers)
  console.log("📊 Data lines:", lines.length - 1)

  const students = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] || ""
    })

    console.log(`Processing student: ${record.name} (${record.usn})`)

    // Parse subjects from subject1 through subject8
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

    console.log(`✅ Parsed ${subjects.length} subjects for ${record.name}`)

    const student = {
      usn: record.usn || "",
      full_name: record.name || "",
      total_marks: parseInt(record.total_marks, 10) || 0,
      percentage: parseFloat(record.percentage) || 0,
      sgpa: parseFloat(record.sgpa) || 0,
      subjects: subjects,
      section: record.section || undefined,
      pdf_link: record.pdf_drive_link || undefined,
      class_rank: record.class_rank ? parseInt(record.class_rank, 10) : undefined,
      college_rank: record.college_rank ? parseInt(record.college_rank, 10) : undefined,
    }

    if (student.usn && student.full_name) {
      students.push(student)
    }
  }

  return students
}

async function fetchCSVData() {
  try {
    console.log("🔄 Fetching CSV data...")
    
    const csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%282%29-qrDteB9HsWMIXFH7WN92QhMH6Ux3MW.csv"
    
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("📊 CSV fetched, length:", csvText.length)

    return parseStudentsCSV(csvText)
  } catch (error) {
    console.error("❌ Error fetching CSV data:", error)
    return []
  }
}

async function migrateToSupabase() {
  try {
    console.log("🚀 Starting data migration to Supabase...")
    
    // Fetch CSV data
    const students = await fetchCSVData()
    console.log(`📊 Found ${students.length} students to migrate`)

    if (students.length === 0) {
      console.log("❌ No students found, aborting migration")
      return
    }

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await supabase.from('subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert students and subjects
    let successCount = 0
    let errorCount = 0

    for (const studentData of students) {
      try {
        // Insert student
        const { data: student, error: studentError } = await supabase
          .from('students')
          .insert({
            usn: studentData.usn,
            full_name: studentData.full_name,
            total_marks: studentData.total_marks,
            percentage: studentData.percentage,
            sgpa: studentData.sgpa,
            section: studentData.section,
            class_rank: studentData.class_rank,
            college_rank: studentData.college_rank,
            pdf_link: studentData.pdf_link,
          })
          .select()
          .single()

        if (studentError) {
          console.error(`❌ Error inserting student ${studentData.usn}:`, studentError)
          errorCount++
          continue
        }

        // Insert subjects for this student
        if (studentData.subjects && studentData.subjects.length > 0) {
          const subjectsToInsert = studentData.subjects.map(subject => ({
            student_id: student.id,
            code: subject.code,
            subject_name: subject.subject_name,
            marks: subject.marks,
            grade: subject.grade,
            status: subject.status,
          }))

          const { error: subjectsError } = await supabase
            .from('subjects')
            .insert(subjectsToInsert)

          if (subjectsError) {
            console.error(`❌ Error inserting subjects for ${studentData.usn}:`, subjectsError)
            errorCount++
            continue
          }
        }

        console.log(`✅ Migrated ${studentData.usn} - ${studentData.full_name}`)
        successCount++
        
      } catch (error) {
        console.error(`❌ Error processing student ${studentData.usn}:`, error)
        errorCount++
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} students`)
    console.log(`❌ Errors: ${errorCount}`)
    
    // Verify the migration
    const { data: verifyStudents, error: verifyError } = await supabase
      .from('students')
      .select('*, subjects(*)')
      .limit(5)

    if (verifyError) {
      console.error("❌ Error verifying migration:", verifyError)
    } else {
      console.log(`\n🔍 Verification: Found ${verifyStudents.length} students in database`)
      verifyStudents.forEach(student => {
        console.log(`  - ${student.usn}: ${student.full_name} (${student.subjects.length} subjects)`)
      })
    }

  } catch (error) {
    console.error("❌ Migration failed:", error)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSupabase()
}

module.exports = { migrateToSupabase, fetchCSVData }
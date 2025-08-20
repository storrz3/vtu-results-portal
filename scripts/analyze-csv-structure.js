// Script to analyze the actual CSV structure and data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_clean-ysNJ5PiNn9HFZJxbiF5afWDtPxfPFn.csv"

async function analyzeCSVStructure() {
  try {
    console.log("Fetching and analyzing CSV structure...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Split into lines and get headers
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("CSV Headers:", headers)
    console.log("Total records:", lines.length - 1)

    // Analyze first 3 records to understand the data structure
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      console.log(`\n--- Record ${i} ---`)
      console.log("USN:", record.usn)
      console.log("Name:", record.name)
      console.log("Total Marks:", record.total_marks)
      console.log("Percentage:", record.percentage)
      console.log("SGPA:", record.sgpa)
      console.log("Class:", record.class)
      console.log("Class Rank:", record.class_rank)
      console.log("College Rank:", record.college_rank)

      // Analyze subject structure
      console.log("\nSubjects:")
      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        if (record[subjectKey]) {
          console.log(`  ${subjectKey}: ${record[subjectKey]}`)

          // Parse subject format: "BMATS101: 51 (F)"
          const match = record[subjectKey].match(/^([A-Z0-9]+):\s*(\d+)\s*$$([FP])$$$/)
          if (match) {
            const [, code, marks, status] = match
            console.log(`    -> Code: ${code}, Marks: ${marks}, Status: ${status === "P" ? "Pass" : "Fail"}`)
          }
        }
      }
    }

    // Check if there are any records with the exact structure you mentioned
    console.log("\n--- Checking for specific columns ---")
    const hasCodeColumn = headers.includes("CODE")
    const hasSubjectColumn = headers.includes("SUBJECT")
    const hasMarksColumn = headers.includes("MARKS")
    const hasGradeColumn = headers.includes("GRADE")
    const hasStatusColumn = headers.includes("STATUS")

    console.log("Has CODE column:", hasCodeColumn)
    console.log("Has SUBJECT column:", hasSubjectColumn)
    console.log("Has MARKS column:", hasMarksColumn)
    console.log("Has GRADE column:", hasGradeColumn)
    console.log("Has STATUS column:", hasStatusColumn)

    if (!hasCodeColumn) {
      console.log("\nNote: CSV uses subject1-subject8 format, not separate CODE/SUBJECT/MARKS columns")
      console.log("Will need to parse subject strings like 'BMATS101: 51 (F)' to extract:")
      console.log("- CODE: BMATS101")
      console.log("- MARKS: 51")
      console.log("- STATUS: F (Fail) or P (Pass)")
      console.log("- GRADE: Will calculate based on marks")
    }
  } catch (error) {
    console.error("Error analyzing CSV:", error)
  }
}

// Run the analysis
analyzeCSVStructure()

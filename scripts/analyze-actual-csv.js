// Script to analyze the actual CSV data structure
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_clean-uyLpsZ3pq2R0cSYbl5D1cyEqGSRPlM.csv"

async function analyzeActualCSV() {
  try {
    console.log("Fetching actual CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("CSV Headers:", headers)
    console.log("Total records:", lines.length - 1)

    // Analyze first 3 records
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

      // Analyze subjects
      console.log("\nSubjects:")
      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        if (record[subjectKey]) {
          console.log(`  ${subjectKey}: ${record[subjectKey]}`)

          // Parse subject format
          const match = record[subjectKey].match(/^([A-Z0-9]+):\s*(\d+)\s*$$([FP])$$$/)
          if (match) {
            const [, code, marks, status] = match
            console.log(`    -> Code: ${code}, Marks: ${marks}, Status: ${status === "P" ? "Pass" : "Fail"}`)
          }
        }
      }
    }

    // Analyze subject codes to understand the curriculum
    console.log("\n--- Subject Code Analysis ---")
    const subjectCodes = new Set()
    for (let i = 1; i < Math.min(10, lines.length); i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        if (record[subjectKey]) {
          const match = record[subjectKey].match(/^([A-Z0-9]+):/)
          if (match) {
            subjectCodes.add(match[1])
          }
        }
      }
    }

    console.log("Found subject codes:", Array.from(subjectCodes).sort())
  } catch (error) {
    console.error("Error analyzing CSV:", error)
  }
}

// Run the analysis
analyzeActualCSV()

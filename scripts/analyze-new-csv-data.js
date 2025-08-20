// Script to analyze the new VTU results CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

async function analyzeNewCSVData() {
  try {
    console.log("Fetching new VTU results data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("CSV Data fetched successfully!")
    console.log("First 500 characters:", csvText.slice(0, 500))

    // Parse CSV manually
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("\nHeaders:", headers)
    console.log("Total records:", lines.length - 1)

    // Parse first few records
    const records = []
    for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
      // Handle CSV parsing with proper quote handling
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add the last value

      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })
      records.push(record)
    }

    console.log("\nSample records:")
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`)
      console.log("USN:", record.usn)
      console.log("Name:", record.name)
      console.log("Total Marks:", record.total_marks)
      console.log("Percentage:", record.percentage)
      console.log("SGPA:", record.sgpa)
      console.log("Section:", record.section)
      console.log("Class Rank:", record.class_rank)
      console.log("College Rank:", record.college_rank)
      console.log("PDF Drive Link:", record.pdf_drive_link)

      // Parse subjects array
      console.log("Raw subjects:", record.subjects)

      if (record.subjects) {
        try {
          // Clean up the subjects string and parse it
          const subjectsStr = record.subjects.replace(/^\[/, "").replace(/\]$/, "").replace(/'/g, '"')

          const subjectsList = subjectsStr.split('", "').map((s) => s.replace(/"/g, ""))

          console.log("Parsed subjects:")
          subjectsList.forEach((subject) => {
            // Parse format like "BMATS201:53 (P)"
            const match = subject.match(/^([A-Z0-9]+):(\d+)\s*$$([FP])$$$/)
            if (match) {
              console.log(`  - Code: ${match[1]}, Marks: ${match[2]}, Status: ${match[3] === "P" ? "Pass" : "Fail"}`)
            }
          })
        } catch (error) {
          console.log("Error parsing subjects:", error)
        }
      }
    })

    // Analyze data patterns
    console.log("\nData Analysis:")
    console.log("- Total students:", lines.length - 1)
    console.log("- USN pattern:", records[0]?.usn)
    console.log("- Name format:", records[0]?.name)
    console.log("- SGPA range:", records.map((r) => r.sgpa).join(", "))
    console.log("- Sections found:", [...new Set(records.map((r) => r.section))])

    // Extract unique subject codes
    const subjectCodes = new Set()
    records.forEach((record) => {
      if (record.subjects) {
        try {
          const subjectsStr = record.subjects.replace(/^\[/, "").replace(/\]$/, "").replace(/'/g, '"')

          const subjectsList = subjectsStr.split('", "').map((s) => s.replace(/"/g, ""))

          subjectsList.forEach((subject) => {
            const match = subject.match(/^([A-Z0-9]+):/)
            if (match) {
              subjectCodes.add(match[1])
            }
          })
        } catch (error) {
          // Skip parsing errors
        }
      }
    })

    console.log("- Subject codes found:", Array.from(subjectCodes).sort())
  } catch (error) {
    console.error("Error fetching or parsing data:", error)
  }
}

// Run the analysis
analyzeNewCSVData()

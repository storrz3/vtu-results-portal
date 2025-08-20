// Script to fetch and analyze the VTU results CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_clean-ysNJ5PiNn9HFZJxbiF5afWDtPxfPFn.csv"

async function fetchAndAnalyzeData() {
  try {
    console.log("Fetching VTU results data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("CSV Data fetched successfully!")
    console.log("First 500 characters:", csvText.slice(0, 500))

    // Parse CSV manually (simple approach)
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("\nHeaders:", headers)
    console.log("Total records:", lines.length - 1)

    // Parse first few records
    const records = []
    for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
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
      console.log("SGPA:", record.sgpa)
      console.log("Total Marks:", record.total_marks)
      console.log("Percentage:", record.percentage)

      // Parse subjects
      const subjects = []
      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        if (record[subjectKey]) {
          const subjectData = record[subjectKey]
          // Parse format like "BMATS101: 51 (F)"
          const match = subjectData.match(/^([A-Z0-9]+):\s*(\d+)\s*$$([FP])$$$/)
          if (match) {
            subjects.push({
              code: match[1],
              marks: Number.parseInt(match[2]),
              status: match[3] === "P" ? "Pass" : "Fail",
            })
          }
        }
      }
      console.log("Subjects:", subjects.slice(0, 3)) // Show first 3 subjects
    })

    // Analyze data patterns
    console.log("\nData Analysis:")
    console.log("- USN pattern:", records[0]?.usn)
    console.log("- Name format:", records[0]?.name)
    console.log("- SGPA range: Found values like", records.map((r) => r.sgpa).join(", "))
    console.log("- Subject codes: Found patterns like BMATS101, BPHYS102, etc.")
  } catch (error) {
    console.error("Error fetching or parsing data:", error)
  }
}

// Run the analysis
fetchAndAnalyzeData()

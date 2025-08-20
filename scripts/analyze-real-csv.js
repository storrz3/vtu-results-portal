// Script to analyze the real CSV data structure
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-FXLyj75yrauF050Wq8lxwccRPDE4Y6.csv"

async function analyzeRealCSV() {
  try {
    console.log("🔍 Analyzing real CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("✅ CSV fetched successfully")
    console.log("📊 Size:", csvText.length, "characters")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("📋 Headers:", headers)
    console.log("📊 Total records:", lines.length - 1)

    // Analyze first few records
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      console.log(`\n--- Record ${i} ---`)

      // Parse CSV line properly
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

      console.log("USN:", record.usn)
      console.log("Name:", record.name)
      console.log("Total Marks:", record.total_marks)
      console.log("Percentage:", record.percentage)
      console.log("SGPA:", record.sgpa)
      console.log("Section:", record.section)
      console.log("Class Rank:", record.class_rank)
      console.log("College Rank:", record.college_rank)
      console.log("PDF Link:", record.pdf_drive_link)

      // Analyze subjects format
      console.log("Raw subjects:", record.subjects)

      if (record.subjects) {
        // Parse the subjects array format: ['BMATS201:53 (P)', 'BCHES202:52 (F)', ...]
        try {
          // Remove outer quotes and brackets
          let subjectsStr = record.subjects.trim()
          if (subjectsStr.startsWith('"') && subjectsStr.endsWith('"')) {
            subjectsStr = subjectsStr.slice(1, -1)
          }

          if (subjectsStr.startsWith("[") && subjectsStr.endsWith("]")) {
            subjectsStr = subjectsStr.slice(1, -1)

            // Split by comma and parse each subject
            const subjectParts = subjectsStr.split("', '")
            console.log("Subject parts:", subjectParts)

            subjectParts.forEach((part, index) => {
              const cleanPart = part.replace(/'/g, "").trim()
              console.log(`Subject ${index + 1}: "${cleanPart}"`)

              // Parse format: "BMATS201:53 (P)"
              const match = cleanPart.match(/^([A-Z0-9]+):(\d+)\s*$$([FP])$$/)
              if (match) {
                console.log(`  -> Code: ${match[1]}, Marks: ${match[2]}, Status: ${match[3]}`)
              } else {
                console.log(`  -> Failed to parse: "${cleanPart}"`)
              }
            })
          }
        } catch (error) {
          console.log("Error parsing subjects:", error)
        }
      }
    }

    // Look for specific student
    console.log("\n🎯 Looking for student 3VC24CD010...")
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].includes("3VC24CD010")) {
        console.log("✅ Found 3VC24CD010 at line", i)
        break
      }
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run analysis
analyzeRealCSV()

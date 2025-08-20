// Script to verify the updated CSV data source
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

async function verifyNewCSVData() {
  try {
    console.log("Verifying new VTU results CSV data...")
    const response = await fetch(csvUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("✅ CSV file accessible")
    console.log("File size:", csvText.length, "characters")

    // Parse and verify structure
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("✅ Headers found:", headers)
    console.log("✅ Total records:", lines.length - 1)

    // Verify expected schema
    const expectedFields = [
      "usn",
      "name",
      "total_marks",
      "percentage",
      "sgpa",
      "subjects",
      "section",
      "pdf_drive_link",
      "class_rank",
      "college_rank",
    ]
    const missingFields = expectedFields.filter((field) => !headers.includes(field))

    if (missingFields.length === 0) {
      console.log("✅ All expected fields present")
    } else {
      console.log("⚠️ Missing fields:", missingFields)
    }

    // Test parsing first record
    if (lines.length > 1) {
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < lines[1].length; j++) {
        const char = lines[1][j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      console.log("✅ Sample record parsed successfully:")
      console.log("  USN:", record.usn)
      console.log("  Name:", record.name)
      console.log("  SGPA:", record.sgpa)
      console.log("  Section:", record.section)
      console.log("  Class Rank:", record.class_rank)
      console.log("  PDF Link:", record.pdf_drive_link ? "✅ Present" : "❌ Missing")

      // Test subjects parsing
      if (record.subjects) {
        try {
          const subjectsStr = record.subjects.replace(/^\[/, "").replace(/\]$/, "").replace(/'/g, '"')
          const subjectsList = subjectsStr.split('", "').map((s) => s.replace(/"/g, ""))
          console.log("✅ Subjects parsed:", subjectsList.length, "subjects found")
        } catch (error) {
          console.log("⚠️ Subjects parsing issue:", error.message)
        }
      }
    }

    console.log("\n🎯 CSV data source successfully updated and verified!")
  } catch (error) {
    console.error("❌ Error verifying CSV data:", error)
  }
}

// Run verification
verifyNewCSVData()

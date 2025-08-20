// Comprehensive debugging script to identify the exact parsing issue
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-FXLyj75yrauF050Wq8lxwccRPDE4Y6.csv"

async function comprehensiveDebug() {
  try {
    console.log("🚀 Starting comprehensive debug...")
    console.log("📍 CSV URL:", csvUrl)

    // Step 1: Test CSV accessibility
    console.log("\n=== STEP 1: CSV ACCESSIBILITY ===")
    const response = await fetch(csvUrl)
    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Step 2: Get raw CSV content
    console.log("\n=== STEP 2: RAW CSV CONTENT ===")
    const csvText = await response.text()
    console.log("CSV length:", csvText.length)
    console.log("First 200 characters:")
    console.log(JSON.stringify(csvText.substring(0, 200)))
    console.log("Last 200 characters:")
    console.log(JSON.stringify(csvText.substring(csvText.length - 200)))

    // Step 3: Parse lines
    console.log("\n=== STEP 3: LINE PARSING ===")
    const lines = csvText.trim().split("\n")
    console.log("Total lines:", lines.length)
    console.log("Header line:")
    console.log(JSON.stringify(lines[0]))

    if (lines.length > 1) {
      console.log("First data line:")
      console.log(JSON.stringify(lines[1]))
    }

    // Step 4: Parse headers
    console.log("\n=== STEP 4: HEADER PARSING ===")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    console.log("Parsed headers:", headers)
    console.log("Headers count:", headers.length)

    // Find subjects column
    const subjectsIndex = headers.indexOf("subjects")
    console.log("Subjects column index:", subjectsIndex)

    if (subjectsIndex === -1) {
      console.log("❌ 'subjects' column not found!")
      console.log("Available columns:", headers)
      return
    }

    // Step 5: Parse first data row
    console.log("\n=== STEP 5: FIRST DATA ROW PARSING ===")
    if (lines.length > 1) {
      // Manual CSV parsing
      const values = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < lines[1].length; i++) {
        const char = lines[1][i]
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

      console.log("Parsed values count:", values.length)
      console.log("Headers count:", headers.length)

      if (values.length !== headers.length) {
        console.log("⚠️ Mismatch between values and headers count!")
      }

      // Create record
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      console.log("Parsed record:")
      Object.keys(record).forEach((key) => {
        console.log(`  ${key}: ${JSON.stringify(record[key])}`)
      })

      // Step 6: Focus on subjects parsing
      console.log("\n=== STEP 6: SUBJECTS PARSING ===")
      const subjectsData = record.subjects
      console.log("Raw subjects data:", JSON.stringify(subjectsData))
      console.log("Subjects data type:", typeof subjectsData)
      console.log("Subjects data length:", subjectsData ? subjectsData.length : 0)

      if (subjectsData) {
        console.log("First 50 chars:", JSON.stringify(subjectsData.substring(0, 50)))
        console.log("Last 50 chars:", JSON.stringify(subjectsData.substring(subjectsData.length - 50)))

        // Test different parsing approaches
        console.log("\n--- Testing Parsing Approaches ---")

        // Approach 1: Direct JSON parse
        try {
          const jsonParsed = JSON.parse(subjectsData)
          console.log("✅ JSON.parse worked:", jsonParsed)
        } catch (e) {
          console.log("❌ JSON.parse failed:", e.message)
        }

        // Approach 2: Python-style list parsing
        try {
          let cleanStr = subjectsData.trim()
          if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
            cleanStr = cleanStr.slice(1, -1)
          }

          console.log("After removing outer quotes:", JSON.stringify(cleanStr))

          if (cleanStr.startsWith("[") && cleanStr.endsWith("]")) {
            const innerContent = cleanStr.slice(1, -1)
            console.log("Array inner content:", JSON.stringify(innerContent))

            // Try splitting by ', '
            const parts = innerContent.split("', '")
            console.log("Split by ', ' gives", parts.length, "parts:")
            parts.forEach((part, index) => {
              const cleanPart = part.replace(/^'|'$/g, "")
              console.log(`  Part ${index}: ${JSON.stringify(cleanPart)}`)

              // Test regex on each part
              const match = cleanPart.match(/^([A-Z0-9]+):(\d+)\s*$$([FP])$$/)
              if (match) {
                console.log(`    ✅ Parsed: ${match[1]} - ${match[2]} - ${match[3]}`)
              } else {
                console.log(`    ❌ Failed to parse: ${JSON.stringify(cleanPart)}`)
              }
            })
          }
        } catch (e) {
          console.log("❌ Python-style parsing failed:", e.message)
        }
      }
    }

    // Step 7: Test with multiple records
    console.log("\n=== STEP 7: MULTIPLE RECORDS TEST ===")
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      console.log(`\n--- Record ${i} ---`)
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

      console.log(`USN: ${record.usn}, Name: ${record.name}`)
      console.log(`Subjects: ${JSON.stringify(record.subjects)}`)
    }
  } catch (error) {
    console.error("❌ Comprehensive debug error:", error)
    console.error("Error stack:", error.stack)
  }
}

// Run comprehensive debug
comprehensiveDebug()

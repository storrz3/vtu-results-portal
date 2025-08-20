// Debug script to check CSV parsing issues
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_clean-uyLpsZ3pq2R0cSYbl5D1cyEqGSRPlM.csv"

async function debugCSVParsing() {
  try {
    console.log("Fetching CSV for debugging...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("Raw CSV first 500 chars:", csvText.slice(0, 500))

    // Split into lines
    const lines = csvText.trim().split("\n")
    console.log("Total lines:", lines.length)

    // Parse headers
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    console.log("Headers:", headers)

    // Check first data row
    if (lines.length > 1) {
      console.log("Raw first data line:", lines[1])

      // Try different parsing methods
      const values1 = lines[1].split(",").map((v) => v.replace(/"/g, "").trim())
      console.log("Simple split values:", values1)

      // Create record
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values1[index] || ""
      })

      console.log("Parsed record:", record)

      // Check subjects specifically
      console.log("\nSubject parsing:")
      for (let j = 1; j <= 8; j++) {
        const subjectKey = `subject${j}`
        const subjectValue = record[subjectKey]
        console.log(`${subjectKey}: "${subjectValue}"`)

        if (subjectValue) {
          // Test regex parsing
          const match = subjectValue.match(/^([A-Z0-9]+):\s*(\d+)\s*$$([FP])$$$/)
          if (match) {
            console.log(`  -> Parsed: Code=${match[1]}, Marks=${match[2]}, Status=${match[3]}`)
          } else {
            console.log(`  -> Failed to parse: "${subjectValue}"`)
            // Try alternative patterns
            const altMatch1 = subjectValue.match(/^([A-Z0-9]+):\s*(\d+)\s*$$([FP])$$/)
            if (altMatch1) {
              console.log(`  -> Alt pattern 1: Code=${altMatch1[1]}, Marks=${altMatch1[2]}, Status=${altMatch1[3]}`)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Debug error:", error)
  }
}

// Run debug
debugCSVParsing()

// Debug script to fix subjects parsing issue
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

async function debugSubjectsParsing() {
  try {
    console.log("Debugging subjects parsing...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("Headers:", headers)

    // Find subjects column index
    const subjectsIndex = headers.indexOf("subjects")
    console.log("Subjects column index:", subjectsIndex)

    // Test first few records
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      console.log(`\n--- Testing Record ${i} ---`)
      console.log("Raw line:", lines[i])

      // Try different parsing approaches

      // Method 1: Simple split (might break with commas in subjects)
      const simpleValues = lines[i].split(",")
      console.log("Simple split - subjects field:", simpleValues[subjectsIndex])

      // Method 2: Proper CSV parsing with quote handling
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

      console.log("Proper CSV parsing - subjects field:", values[subjectsIndex])

      // Method 3: Try to parse the subjects array
      const subjectsStr = values[subjectsIndex]
      if (subjectsStr) {
        console.log("Raw subjects string:", subjectsStr)

        try {
          // Clean up the string
          let cleanStr = subjectsStr.trim()

          // Remove outer quotes if present
          if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
            cleanStr = cleanStr.slice(1, -1)
          }

          console.log("After removing outer quotes:", cleanStr)

          // Check if it's an array format
          if (cleanStr.startsWith("[") && cleanStr.endsWith("]")) {
            // Remove brackets
            cleanStr = cleanStr.slice(1, -1)
            console.log("After removing brackets:", cleanStr)

            // Split by comma, but handle quotes
            const subjects = []
            let currentSubject = ""
            let inSingleQuotes = false

            for (let k = 0; k < cleanStr.length; k++) {
              const char = cleanStr[k]
              if (char === "'" && (k === 0 || cleanStr[k - 1] !== "\\")) {
                inSingleQuotes = !inSingleQuotes
              } else if (char === "," && !inSingleQuotes) {
                if (currentSubject.trim()) {
                  subjects.push(currentSubject.trim().replace(/^'|'$/g, ""))
                }
                currentSubject = ""
              } else {
                currentSubject += char
              }
            }

            // Add the last subject
            if (currentSubject.trim()) {
              subjects.push(currentSubject.trim().replace(/^'|'$/g, ""))
            }

            console.log("Parsed subjects:", subjects)

            // Parse each subject
            subjects.forEach((subject, index) => {
              console.log(`Subject ${index + 1}: "${subject}"`)
              // Fix the regex to match: "BMATS201:53 (P)"
              const match = subject.match(/^([A-Z0-9]+):(\d+)\s*$$([FP])$$/)
              if (match) {
                console.log(`  -> Code: ${match[1]}, Marks: ${match[2]}, Status: ${match[3]}`)
              } else {
                console.log(`  -> Failed to parse: "${subject}"`)
                // Show what we're trying to match
                console.log(`  -> Expected format: CODE:MARKS (P/F), got: "${subject}"`)
              }
            })
          }
        } catch (error) {
          console.log("Error parsing subjects:", error)
        }
      }
    }
  } catch (error) {
    console.error("Debug error:", error)
  }
}

// Run debug
debugSubjectsParsing()

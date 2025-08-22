// Comprehensive debug script to identify parsing issues
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

async function debugParsingIssue() {
  try {
    console.log("🔍 Starting comprehensive debug...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("✅ CSV fetched successfully")
    console.log("📊 CSV length:", csvText.length, "characters")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("📋 Headers:", headers)
    console.log("📊 Total lines:", lines.length)

    // Find the subjects column
    const subjectsIndex = headers.indexOf("subjects")
    console.log("📍 Subjects column index:", subjectsIndex)

    if (subjectsIndex === -1) {
      console.log("❌ 'subjects' column not found!")
      console.log("Available columns:", headers)
      return
    }

    // Find student 3VC24CD001
    let targetLine = null
    let targetIndex = -1

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].includes("3VC24CD001")) {
        targetLine = lines[i]
        targetIndex = i
        break
      }
    }

    if (!targetLine) {
      console.log("❌ Student 3VC24CD001 not found!")
      console.log("First few USNs found:")
      for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
        const firstField = lines[i].split(",")[0].replace(/"/g, "")
        console.log(`  Line ${i}: ${firstField}`)
      }
      return
    }

    console.log(`✅ Found student 3VC24CD001 at line ${targetIndex}`)
    console.log("📄 Raw line:", targetLine)

    // Try different parsing methods
    console.log("\n🔧 Testing different parsing methods...")

    // Method 1: Simple split
    console.log("\n--- Method 1: Simple Split ---")
    const simpleValues = targetLine.split(",")
    console.log("Subjects field (simple):", simpleValues[subjectsIndex])

    // Method 2: Proper CSV parsing
    console.log("\n--- Method 2: Proper CSV Parsing ---")
    const values = []
    let current = ""
    let inQuotes = false

    for (let j = 0; j < targetLine.length; j++) {
      const char = targetLine[j]
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

    console.log("Subjects field (proper):", values[subjectsIndex])

    // Method 3: Parse the subjects string
    console.log("\n--- Method 3: Subjects String Parsing ---")
    const subjectsStr = values[subjectsIndex]

    if (!subjectsStr) {
      console.log("❌ No subjects string found!")
      return
    }

    console.log("Raw subjects string:", JSON.stringify(subjectsStr))
    console.log("String length:", subjectsStr.length)
    console.log("First 100 chars:", subjectsStr.substring(0, 100))

    // Clean up the string step by step
    let cleanStr = subjectsStr.trim()
    console.log("After trim:", JSON.stringify(cleanStr))

    if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
      cleanStr = cleanStr.slice(1, -1)
      console.log("After removing outer quotes:", JSON.stringify(cleanStr))
    }

    if (!cleanStr.startsWith("[") || !cleanStr.endsWith("]")) {
      console.log("❌ Not in array format!")
      console.log("Starts with [:", cleanStr.startsWith("["))
      console.log("Ends with ]:", cleanStr.endsWith("]"))
      console.log("First char:", JSON.stringify(cleanStr[0]))
      console.log("Last char:", JSON.stringify(cleanStr[cleanStr.length - 1]))
      return
    }

    // Remove brackets
    cleanStr = cleanStr.slice(1, -1)
    console.log("After removing brackets:", JSON.stringify(cleanStr))

    // Try to split manually
    console.log("\n--- Method 4: Manual Array Splitting ---")
    const subjects = []
    let currentSubject = ""
    let inSingleQuotes = false

    for (let k = 0; k < cleanStr.length; k++) {
      const char = cleanStr[k]

      if (char === "'" && (k === 0 || cleanStr[k - 1] !== "\\")) {
        inSingleQuotes = !inSingleQuotes
        console.log(`Quote at position ${k}, inQuotes now: ${inSingleQuotes}`)
      } else if (char === "," && !inSingleQuotes) {
        const subject = currentSubject.trim().replace(/^'|'$/g, "")
        if (subject) {
          subjects.push(subject)
          console.log(`Added subject: "${subject}"`)
        }
        currentSubject = ""
      } else {
        currentSubject += char
      }
    }

    // Add the last subject
    const lastSubject = currentSubject.trim().replace(/^'|'$/g, "")
    if (lastSubject) {
      subjects.push(lastSubject)
      console.log(`Added last subject: "${lastSubject}"`)
    }

    console.log(`\n✅ Split into ${subjects.length} subjects:`)
    subjects.forEach((subject, index) => {
      console.log(`  ${index + 1}: "${subject}"`)
    })

    // Test regex patterns
    console.log("\n--- Method 5: Regex Pattern Testing ---")
    subjects.forEach((subject, index) => {
      console.log(`\nTesting subject ${index + 1}: "${subject}"`)

      // Test different regex patterns
      const patterns = [
        /^([A-Z0-9]+):(\d+)\s*$$([FP])$$/, // Current pattern
        /^([A-Z0-9]+):(\d+)\s*$$([FP])$$/, // Correct pattern
        /^([A-Z0-9]+):(\d+)\s*$$([FP])$$$/, // With end anchor
        /([A-Z0-9]+):(\d+)\s*$$([FP])$$/, // Without start anchor
      ]

      patterns.forEach((pattern, patternIndex) => {
        const match = subject.match(pattern)
        if (match) {
          console.log(`  ✅ Pattern ${patternIndex + 1} matched:`)
          console.log(`     Code: ${match[1]}`)
          console.log(`     Marks: ${match[2]}`)
          console.log(`     Status: ${match[3]}`)
        } else {
          console.log(`  ❌ Pattern ${patternIndex + 1} failed`)
        }
      })
    })

    // Show expected vs actual format
    console.log("\n--- Expected Format Analysis ---")
    console.log("Expected format: 'BMATS201:74 (P)'")
    if (subjects.length > 0) {
      console.log("Actual format:  ", JSON.stringify(subjects[0]))

      // Character by character comparison
      const expected = "BMATS201:74 (P)"
      const actual = subjects[0]
      console.log("\nCharacter comparison:")
      console.log(
        "Expected:",
        expected
          .split("")
          .map((c) => `'${c}'`)
          .join(" "),
      )
      console.log(
        "Actual:  ",
        actual
          .split("")
          .map((c) => `'${c}'`)
          .join(" "),
      )
    }
  } catch (error) {
    console.error("❌ Debug error:", error)
  }
}

// Run comprehensive debug
debugParsingIssue()

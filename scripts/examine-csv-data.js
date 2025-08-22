// Script to examine the actual CSV data structure
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

async function examineCSVData() {
  try {
    console.log("🔍 Examining actual CSV data structure...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("✅ CSV fetched successfully")
    console.log("📊 Total size:", csvText.length, "characters")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    console.log("📊 Total lines:", lines.length)

    // Show headers
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    console.log("📋 Headers:", headers)

    // Find subjects column index
    const subjectsIndex = headers.indexOf("subjects")
    console.log("📍 Subjects column index:", subjectsIndex)

    if (subjectsIndex === -1) {
      console.log("❌ 'subjects' column not found!")
      return
    }

    // Examine first 5 students
    console.log("\n📊 EXAMINING FIRST 5 STUDENTS:")
    console.log("=" * 80)

    for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
      console.log(`\n--- STUDENT ${i} ---`)

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

      // Create record
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      console.log("USN:", record.usn)
      console.log("Name:", record.name)
      console.log("SGPA:", record.sgpa)
      console.log("Total Marks:", record.total_marks)

      // Examine subjects data in detail
      const subjectsData = record.subjects
      console.log("Raw subjects data:", JSON.stringify(subjectsData))
      console.log("Subjects data type:", typeof subjectsData)
      console.log("Subjects data length:", subjectsData ? subjectsData.length : 0)

      if (subjectsData) {
        console.log("First 200 characters:", subjectsData.substring(0, 200))
        console.log("Starts with:", JSON.stringify(subjectsData.substring(0, 10)))
        console.log("Ends with:", JSON.stringify(subjectsData.substring(subjectsData.length - 10)))

        // Try to identify the format
        if (subjectsData.includes("[") && subjectsData.includes("]")) {
          console.log("✅ Contains array brackets")

          // Try to extract individual subjects
          let cleanStr = subjectsData.trim()
          if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
            cleanStr = cleanStr.slice(1, -1)
          }

          if (cleanStr.startsWith("[") && cleanStr.endsWith("]")) {
            const innerContent = cleanStr.slice(1, -1)
            console.log("Array content:", JSON.stringify(innerContent))

            // Try to split by comma (simple approach)
            const simpleSplit = innerContent.split(",")
            console.log("Simple comma split gives", simpleSplit.length, "parts:")
            simpleSplit.forEach((part, index) => {
              console.log(`  Part ${index + 1}: ${JSON.stringify(part.trim())}`)
            })

            // Look for subject patterns
            const subjectPattern = /[A-Z]+\d+:\d+\s*$$[FP]$$/g
            const matches = innerContent.match(subjectPattern)
            if (matches) {
              console.log("Found subject patterns:", matches)
            } else {
              console.log("No subject patterns found with regex")
            }
          }
        } else {
          console.log("❌ No array brackets found")
        }
      } else {
        console.log("❌ No subjects data")
      }

      console.log("-" * 50)
    }

    // Look for student 3VC24CD001 specifically
    console.log("\n🎯 SEARCHING FOR STUDENT 3VC24CD001:")
    let found = false
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].includes("3VC24CD001")) {
        console.log("✅ Found at line", i)

        // Parse this line
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
        console.log("SGPA:", record.sgpa)
        console.log("Subjects data:", JSON.stringify(record.subjects))

        found = true
        break
      }
    }

    if (!found) {
      console.log("❌ Student 3VC24CD001 not found in CSV")
      console.log("Available USNs (first 10):")
      for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
        const firstField = lines[i].split(",")[0].replace(/"/g, "")
        console.log(`  ${i}: ${firstField}`)
      }
    }
  } catch (error) {
    console.error("❌ Error examining CSV:", error)
  }
}

// Run examination
examineCSVData()

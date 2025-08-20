// Direct inspection of the actual CSV data to see the exact format
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-FXLyj75yrauF050Wq8lxwccRPDE4Y6.csv"

async function inspectActualData() {
  try {
    console.log("🔍 Direct inspection of CSV data...")

    const response = await fetch(csvUrl)
    if (!response.ok) {
      console.log("❌ Failed to fetch CSV:", response.status, response.statusText)
      return
    }

    const csvText = await response.text()
    console.log("✅ CSV fetched successfully")
    console.log("📊 CSV size:", csvText.length, "characters")

    // Show first 1000 characters
    console.log("\n📄 FIRST 1000 CHARACTERS:")
    console.log(csvText.substring(0, 1000))

    // Parse lines
    const lines = csvText.trim().split("\n")
    console.log("\n📊 Total lines:", lines.length)

    // Show header line
    console.log("\n📋 HEADER LINE:")
    console.log(lines[0])

    // Parse headers
    const headerParts = lines[0].split(",")
    console.log("\n📋 HEADER PARTS (split by comma):")
    headerParts.forEach((part, index) => {
      console.log(`  ${index}: ${JSON.stringify(part)}`)
    })

    // Find subjects column
    let subjectsIndex = -1
    headerParts.forEach((part, index) => {
      const clean = part.replace(/"/g, "").trim()
      if (clean === "subjects") {
        subjectsIndex = index
      }
    })

    console.log("\n📍 Subjects column index:", subjectsIndex)

    if (subjectsIndex === -1) {
      console.log("❌ 'subjects' column not found!")
      return
    }

    // Show first data line
    console.log("\n📄 FIRST DATA LINE:")
    console.log(lines[1])

    // Split first data line by comma
    const dataParts = lines[1].split(",")
    console.log("\n📊 FIRST DATA LINE PARTS:")
    dataParts.forEach((part, index) => {
      console.log(`  ${index}: ${JSON.stringify(part)}`)
    })

    // Show the subjects data specifically
    if (dataParts.length > subjectsIndex) {
      const subjectsData = dataParts[subjectsIndex]
      console.log("\n🎯 RAW SUBJECTS DATA:")
      console.log("Type:", typeof subjectsData)
      console.log("Length:", subjectsData.length)
      console.log("Value:", JSON.stringify(subjectsData))
      console.log("First 100 chars:", JSON.stringify(subjectsData.substring(0, 100)))
      console.log("Last 100 chars:", JSON.stringify(subjectsData.substring(subjectsData.length - 100)))

      // Try to identify the pattern
      console.log("\n🔍 PATTERN ANALYSIS:")
      console.log("Contains [:", subjectsData.includes("["))
      console.log("Contains ]:", subjectsData.includes("]"))
      console.log("Contains ':", subjectsData.includes("'"))
      console.log('Contains ":', subjectsData.includes('"'))
      console.log("Contains (:", subjectsData.includes("("))
      console.log("Contains ):", subjectsData.includes(")"))

      // Look for subject codes
      const subjectCodes = [
        "BMATS201",
        "BCHES202",
        "BCEDK203",
        "BPWSK206",
        "BICOK207",
        "BIDTK258",
        "BESCK204",
        "BPLCK205",
      ]
      console.log("\n🔍 SUBJECT CODE SEARCH:")
      subjectCodes.forEach((code) => {
        if (subjectsData.includes(code)) {
          console.log(`✅ Found ${code}`)
          // Find the context around this code
          const index = subjectsData.indexOf(code)
          const start = Math.max(0, index - 20)
          const end = Math.min(subjectsData.length, index + 50)
          console.log(`   Context: ${JSON.stringify(subjectsData.substring(start, end))}`)
        }
      })
    }

    // Check multiple students
    console.log("\n📊 CHECKING MULTIPLE STUDENTS:")
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      const parts = lines[i].split(",")
      const usn = parts[0] ? parts[0].replace(/"/g, "") : "Unknown"
      const name = parts[1] ? parts[1].replace(/"/g, "") : "Unknown"
      const subjects = parts[subjectsIndex] || ""

      console.log(`\nStudent ${i}: ${usn} - ${name}`)
      console.log(`Subjects length: ${subjects.length}`)
      console.log(`Subjects preview: ${JSON.stringify(subjects.substring(0, 50))}...`)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run inspection
inspectActualData()

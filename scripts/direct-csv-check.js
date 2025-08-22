// Direct CSV examination script
async function directCSVCheck() {
  try {
    console.log("🔍 Direct CSV examination...")

    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vtu_results_standalone%20%281%29-UlrOoLYxLoABgfvXgvBTrs6RHA206L.csv"

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("✅ CSV fetched, size:", csvText.length)

    // Show first 1000 characters
    console.log("📄 First 1000 characters:")
    console.log(csvText.substring(0, 1000))

    // Split into lines
    const lines = csvText.trim().split("\n")
    console.log("📊 Total lines:", lines.length)

    // Show first line (headers)
    console.log("📋 Headers line:")
    console.log(lines[0])

    // Show second line (first data row)
    if (lines.length > 1) {
      console.log("📋 First data line:")
      console.log(lines[1])
    }

    // Parse headers
    const headers = lines[0].split(",")
    console.log("📋 Parsed headers:", headers)

    // Find subjects column
    let subjectsIndex = -1
    headers.forEach((header, index) => {
      const cleanHeader = header.replace(/"/g, "").trim()
      if (cleanHeader === "subjects") {
        subjectsIndex = index
      }
    })

    console.log("📍 Subjects column index:", subjectsIndex)

    if (subjectsIndex >= 0 && lines.length > 1) {
      // Get subjects data from first row
      const firstRowParts = lines[1].split(",")
      if (firstRowParts.length > subjectsIndex) {
        const subjectsData = firstRowParts[subjectsIndex]
        console.log("📊 First row subjects data:")
        console.log("Raw:", subjectsData)
        console.log("Length:", subjectsData.length)
        console.log("Type:", typeof subjectsData)
      }
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Run the check
directCSVCheck()

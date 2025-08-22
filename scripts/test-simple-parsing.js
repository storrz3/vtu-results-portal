// Simple test with hardcoded data to verify our parsing logic works
console.log("🧪 Testing parsing logic with known data...")

// Test data that matches the expected format
const testSubjectsString =
  "['BMATS201:74 (P)', 'BCHES202:69 (P)', 'BCEDK203:87 (P)', 'BPWSK206:64 (P)', 'BICOK207:53 (P)', 'BIDTK258:72 (P)', 'BESCK204C:68 (P)', 'BPLCK205D:86 (P)']"

console.log("📝 Test input:", testSubjectsString)

function testParseSubjects(subjectsStr) {
  console.log("🔍 Starting parse...")

  if (!subjectsStr) {
    console.log("❌ No input")
    return []
  }

  let s = subjectsStr.trim()
  console.log("After trim:", JSON.stringify(s))

  if (s.startsWith("[")) s = s.slice(1)
  if (s.endsWith("]")) s = s.slice(0, -1)
  console.log("After bracket removal:", JSON.stringify(s))

  const tokens = s.split(/',\s*'/)
  console.log("Split tokens:", tokens)

  const results = []

  tokens.forEach((token, index) => {
    const cleanToken = token.replace(/^'+|'+$/g, "")
    console.log(`\nToken ${index}: "${cleanToken}"`)

    // Test the regex
    const match = cleanToken.match(/^([A-Z0-9]+):(\d+)\s*$$(P|F)$$$/)
    if (match) {
      console.log(`✅ Match found:`)
      console.log(`  Code: ${match[1]}`)
      console.log(`  Marks: ${match[2]}`)
      console.log(`  Status: ${match[3]}`)

      results.push({
        code: match[1],
        marks: Number.parseInt(match[2]),
        status: match[3] === "P" ? "Pass" : "Fail",
      })
    } else {
      console.log(`❌ No match for: "${cleanToken}"`)

      // Try alternative patterns
      const alt1 = cleanToken.match(/([A-Z0-9]+):(\d+)\s*$$(P|F)$$/)
      if (alt1) {
        console.log(`✅ Alternative pattern worked: ${alt1[1]}:${alt1[2]} (${alt1[3]})`)
      }
    }
  })

  console.log(`\n📊 Final results: ${results.length} subjects parsed`)
  return results
}

// Test with our sample data
const parsed = testParseSubjects(testSubjectsString)
console.log("\n🎯 FINAL PARSED RESULTS:")
parsed.forEach((subject, index) => {
  console.log(`${index + 1}. ${subject.code}: ${subject.marks} (${subject.status})`)
})

// Test with variations
console.log("\n🔄 Testing variations...")

const variations = [
  "['BMATS201:74 (P)', 'BCHES202:69 (F)']",
  '["BMATS201:74 (P)", "BCHES202:69 (F)"]',
  "BMATS201:74 (P), BCHES202:69 (F)",
  "[BMATS201:74 (P), BCHES202:69 (F)]",
]

variations.forEach((variation, index) => {
  console.log(`\n--- Variation ${index + 1}: ${variation} ---`)
  testParseSubjects(variation)
})

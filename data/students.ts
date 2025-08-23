export type Student = {
  usn: string
  fullName: string
  totalMarks: number
  percentage: number
  sgpa: number
  subjects: Subject[]
  section?: string
  classRank?: number
  collegeRank?: number
  pdfLink?: string
}

export type Subject = {
  code: string
  subject: string
  marks: number
  grade: string
  status: "Pass" | "Fail"
}

export type SearchResult = {
  student: Student
  matchType: "exact_usn" | "exact_name" | "partial_name"
  similarity: number
}

export type SearchSuggestion = {
  usn: string
  name: string
  similarity: number
  matchType: "partial_name" | "fuzzy_name"
}

// Subject code to name mapping
const SUBJECT_NAMES: Record<string, string> = {
  BMATS201: "MATHEMATICS-II FOR CSE STREAM",
  BMATE201: "MATHEMATICS-II FOR EES",
  BMATM201: "MATHEMATICS-II FOR MECHANICAL ENGG STREAM",
  BMATC201: "MATHEMATICS-II FOR CIVIL ENGG STREAM",
  BCHES202: "APPLIED CHEMISTRY FOR CSE STREAM",
  BPHYS202: "APPLIED PHYSICS FOR CSE STREAM",
  BPHYE202: "APPLIED PHYSICS FOR EES",
  BPHYM202: "APPLIED PHYSICS FOR ME STREAMS",
  BPHYC202: "APPLIED PHYSICS FOR CIVIL ENGG STREAM",
  BCEDK203: "COMPUTER-AIDED ENGINEERING DRAWING",
  BBEE203: "BASIC ELECTRONICS",
  BEEE203: "ELEMENT OF ELECTRICAL ENGINEERING",
  BEMEM203: "ELEMENTS OF MECHANICAL ENGINEERING",
  BCIVC203: "ENGINEERING MECHANICS",
  BPOPS203: "PRINCIPLES OF PROGRAMMING USING C",
  BPWSK206: "PROFESSIONAL WRITING SKILLS IN ENGLISH",
  BICOK207: "INDIAN CONSTITUTION",
  BKSKK207: "SAMSKRUTIKA KANNADA",
  BKBKK207: "BALAKE KANNADA",
  BIDTK258: "INNOVATION AND DESIGN THINKING",
  BSFHK258: "SCIENTIFIC FOUNDATIONS OF HEALTH",
  BESCK204B: "INTRODUCTION TO ELECTRICAL ENGINEERING",
  BESCK204C: "INTRODUCTION TO ELECTRONICS COMMUNICATION",
  BPLCK205A: "INTRODUCTION TO WEB PROGRAMMING",
  BPLCK205B: "INTRODUCTION TO PYTHON PROGRAMMING",
  BPLCK205D: "INTRODUCTION TO C++ PROGRAMMING",
}

// SIMPLIFIED: String similarity functions (avoiding complex matrix operations)
function calculateSimpleSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  // Exact match
  if (s1 === s2) return 1.0
  
  // Calculate overlap ratio
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length <= s2.length ? s1 : s2
  
  if (longer.length === 0) return 1.0
  
  // Count common substrings
  let commonChars = 0
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      commonChars++
    }
  }
  
  return commonChars / longer.length
}

function containsPartialMatch(fullName: string, searchTerm: string): boolean {
  const nameWords = fullName.toLowerCase().split(/\s+/)
  const searchWords = searchTerm.toLowerCase().split(/\s+/)
  
  // Check if all search words can be found in name words (partial match)
  return searchWords.every(searchWord => 
    nameWords.some(nameWord => 
      nameWord.includes(searchWord) || 
      searchWord.includes(nameWord) ||
      nameWord.startsWith(searchWord) ||
      searchWord.startsWith(nameWord)
    )
  )
}

function calculatePartialSimilarity(fullName: string, searchTerm: string): number {
  const nameWords = fullName.toLowerCase().split(/\s+/)
  const searchWords = searchTerm.toLowerCase().split(/\s+/)
  
  let totalSimilarity = 0
  let matches = 0
  
  for (const searchWord of searchWords) {
    let bestMatch = 0
    for (const nameWord of nameWords) {
      // Simple similarity calculation
      const similarity = calculateSimpleSimilarity(searchWord, nameWord)
      bestMatch = Math.max(bestMatch, similarity)
      
      // Bonus for partial contains
      if (nameWord.includes(searchWord) || searchWord.includes(nameWord)) {
        bestMatch = Math.max(bestMatch, 0.7)
      }
      
      // Bonus for starts with
      if (nameWord.startsWith(searchWord) || searchWord.startsWith(nameWord)) {
        bestMatch = Math.max(bestMatch, 0.8)
      }
    }
    totalSimilarity += bestMatch
    matches++
  }
  
  return matches > 0 ? totalSimilarity / matches : 0
}

function calculateGrade(marks: number): string {
  if (marks >= 90) return "S"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  if (marks >= 40) return "E"
  return "F"
}

function parseSubjectString(subjectStr: string): Subject | null {
  if (!subjectStr || subjectStr.trim() === "") return null

  let trimmed = subjectStr.trim()

  if (trimmed.includes(',')) {
    const firstPart = trimmed.split(',')[0].trim()
    trimmed = firstPart
  }

  const regex = /^([A-Z0-9]+):(\d+)\s*\(([PF])\)$/
  const match = trimmed.match(regex)

  if (match) {
    const code = match[1]
    const marksStr = match[2]
    const statusChar = match[3]

    const marks = parseInt(marksStr, 10)
    if (isNaN(marks)) {
      return null
    }

    const status: "Pass" | "Fail" = statusChar === "P" ? "Pass" : "Fail"
    const grade = calculateGrade(marks)

    return {
      code,
      subject: SUBJECT_NAMES[code] || code,
      marks,
      grade,
      status,
    }
  }

  return null
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

function parseStudentFromRecord(record: any): Student {
  const subjects: Subject[] = []
  for (let j = 1; j <= 8; j++) {
    const subjectKey = `subject${j}`
    const subjectValue = record[subjectKey]

    if (subjectValue && subjectValue.trim() !== "") {
      const parsedSubject = parseSubjectString(subjectValue)
      if (parsedSubject) {
        subjects.push(parsedSubject)
      }
    }
  }

  return {
    usn: record.usn || "",
    fullName: record.name || "",
    totalMarks: Number.parseInt(record.total_marks, 10) || 0,
    percentage: Number.parseFloat(record.percentage) || 0,
    sgpa: Number.parseFloat(record.sgpa) || 0,
    subjects: subjects,
    section: record.section || undefined,
    pdfLink: record.pdf_drive_link || undefined,
    classRank: record.class_rank ? Number.parseInt(record.class_rank, 10) : undefined,
    collegeRank: record.college_rank ? Number.parseInt(record.college_rank, 10) : undefined,
  }
}

// In-memory cache for student data to avoid re-fetching on every request.
let studentsCache: Student[] | null = null

// CSV data as a constant string - this will be bundled with the app
// This contains the first few lines of your real data as a fallback
const CSV_DATA = `usn,name,total_marks,percentage,sgpa,section,pdf_drive_link,class_rank,college_rank,subject1,subject2,subject3,subject4,subject5,subject6,subject7,subject8
3VC24CS096,PAVITHRA R,689,86.1,9.35,A SEC,https://drive.google.com/file/d/1fFqKFVsw3GL7fl1Iwd_jhmkoI8wdu3On/view?usp=sharing,1,4,BMATS201:87 (P),BCHES202:91 (P),BCEDK203:96 (P),BPWSK206:82 (P),BICOK207:81 (P),BIDTK258:82 (P),BESCK204C:88 (P),BPLCK205D:82 (P)
3VC24CS109,REDDYMASI RAKSHITHA,690,86.2,9.3,A SEC,https://drive.google.com/file/d/1TYJEGXnkfi1hJMxi3XZAfBREqQOe-E2U/view?usp=sharing,2,7,BMATS201:94 (P),BCHES202:85 (P),BCEDK203:89 (P),BPWSK206:82 (P),BICOK207:77 (P),BIDTK258:85 (P),BESCK204C:94 (P),BPLCK205D:84 (P)
3VC24CS083,MEHREEN ZAARA,673,84.1,9.25,A SEC,https://drive.google.com/file/d/12rVBbrqXWX5nKkYPap8iQKvxZgToBb35/view?usp=sharing,3,10,BMATS201:82 (P),BCHES202:92 (P),BCEDK203:93 (P),BPWSK206:82 (P),BICOK207:73 (P),BIDTK258:79 (P),BESCK204C:88 (P),BPLCK205D:84 (P)
3VC24CS080,MEENA KUMARI,654,81.8,9.2,A SEC,https://drive.google.com/file/d/13ZKZ5Eyh8O7lYSM_Xa-K733gTlgxqxGQ/view?usp=sharing,4,12,BMATS201:96 (P),BCHES202:87 (P),BCEDK203:91 (P),BPWSK206:74 (P),BICOK207:72 (P),BIDTK258:74 (P),BESCK204C:80 (P),BPLCK205D:80 (P)
3VC24CS107,RANJITHA M B,659,82.4,9.2,A SEC,https://drive.google.com/file/d/1BGpAwO62Td4o03PO3WTTo03mURSym1tr/view?usp=sharing,4,12,BMATS201:89 (P),BCHES202:96 (P),BCEDK203:94 (P),BPWSK206:62 (F),BICOK207:71 (P),BIDTK258:81 (P),BESCK204C:90 (P),BPLCK205D:76 (P)
3VC24CS112,S N DIVYASHRI,669,83.6,9.2,A SEC,https://drive.google.com/file/d/1vZ7NeTuMuVH-RMAWKV55fDtlrOPysRxr/view?usp=sharing,4,12,BMATS201:86 (P),BCHES202:96 (P),BCEDK203:96 (P),BPWSK206:69 (P),BICOK207:73 (P),BIDTK258:82 (P),BESCK204C:84 (P),BPLCK205D:83 (P)
3VC24CS038,EESHA DEVI B,667,83.4,9.15,A SEC,https://drive.google.com/file/d/1UuycKlguHaUuLy4hoICpL9n1IxFQOQ5k/view?usp=sharing,7,17,BMATS201:96 (P),BCHES202:92 (P),BCEDK203:87 (P),BPWSK206:75 (P),BICOK207:78 (P),BIDTK258:80 (P),BESCK204C:80 (P),BPLCK205D:79 (P)
3VC24CS099,PRAVYKYA K,659,82.4,9.05,A SEC,https://drive.google.com/file/d/1amNrWbEUAM2I8gJf7Q2f4hERbf6nmezx/view?usp=sharing,8,21,BMATS201:88 (P),BCHES202:93 (P),BCEDK203:96 (P),BPWSK206:75 (P),BICOK207:70 (P),BIDTK258:76 (P),BESCK204C:83 (P),BPLCK205D:78 (P)
3VC24CS128,SNEHA K,661,82.6,9.05,A SEC,https://drive.google.com/file/d/1KKb9HTr9ge8oNUZWtmoB3BW7fVuld0K0/view?usp=sharing,8,21,BMATS201:79 (P),BCHES202:92 (P),BCEDK203:92 (P),BPWSK206:77 (P),BICOK207:70 (P),BIDTK258:82 (P),BESCK204C:85 (P),BPLCK205D:84 (P)
3VC24CS028,C THEJASWINI,660,82.5,9.0,A SEC,https://drive.google.com/file/d/1aZnGvZoUhbmFqUVO6VgRwKwbWx7-H2j3/view?usp=sharing,10,25,BMATS201:77 (P),BCHES202:92 (P),BCEDK203:91 (P),BPWSK206:78 (P),BICOK207:68 (P),BIDTK258:81 (P),BESCK204C:86 (P),BPLCK205D:87 (P)
3VC24CS053,K KEDARANATHA,682,85.2,9.45,B SEC,https://drive.google.com/file/d/1cImWG9GQ3c88MpOXy6W_tMukjuiPBaJy/view?usp=sharing,1,2,BMATS201:93 (P),BCHES202:90 (P),BCEDK203:99 (P),BPWSK206:83 (P),BICOK207:70 (P),BIDTK258:71 (P),BESCK204C:89 (P),BPLCK205D:87 (P)
3VC24CS103,RADHIKA S KALAKAPUR,643,80.4,9.1,B SEC,https://drive.google.com/file/d/1Qc_KlwO4NR8GiObMMp22EHqHDLAxwa_o/view?usp=sharing,2,18,BMATS201:80 (P),BCHES202:84 (P),BCEDK203:97 (P),BPWSK206:74 (P),BICOK207:63 (P),BIDTK258:73 (P),BESCK204C:91 (P),BPLCK205D:81 (P)
3VC24CS078,MANYA B S,651,81.4,9.05,B SEC,https://drive.google.com/file/d/1NEDAmOkTcZV1Jroy76-RJvjSh_4thXxI/view?usp=sharing,3,21,BMATS201:90 (P),BCHES202:85 (P),BCEDK203:96 (P),BPWSK206:74 (P),BICOK207:62 (P),BIDTK258:81 (P),BESCK204C:87 (P),BPLCK205D:76 (P)`

// Centralized data loader with caching
export async function loadStudentsData(): Promise<Student[]> {
  if (studentsCache) {
    console.log("✅ Returning data from cache...")
    return studentsCache
  }

  try {
    console.log("🔄 Loading students data from bundled CSV...")
    
    // Use the bundled CSV data with existing CSV parsing functionality
    const students = loadStudentsFromText(CSV_DATA)

    console.log(`✅ Total students loaded and cached: ${students.length}`)
    studentsCache = students // Cache the data
    return students
  } catch (error) {
    console.error("❌ Error in loadStudentsData:", error)
    return []
  }
}

// ✅ REFACTORED: Use cached data loader
export async function findStudentByUSNOrName(usn?: string, fullName?: string): Promise<Student | null> {
  try {
    const students = await loadStudentsData()

    // Normalize inputs once
    const wantedUSN = usn ? normalizeUSN(usn) : undefined
    const wantedName = fullName ? normalizeName(fullName) : undefined

    // Track best partial for name-only queries
    let bestPartial: { student: Student; similarity: number } | null = null

    for (const student of students) {
      // Strict USN flow: if a USN is provided, only accept an exact USN match.
      if (wantedUSN) {
        if (student.usn === wantedUSN) {
          console.log('✅ Found exact USN match:', student.fullName);
          return student;
        }
        continue; // Do not consider name matches if USN is provided
      }

      // Name-only flow
      if (wantedName) {
        // Prefer exact name match
        if (normalizeName(student.fullName) === wantedName) {
          console.log('✅ Found exact name match:', student.fullName);
          return student;
        }

        // Track best partial match by highest similarity
        if (containsPartialMatch(student.fullName, wantedName)) {
          const similarity = calculatePartialSimilarity(student.fullName, wantedName);
          if (similarity > 0.2) {
            if (!bestPartial || similarity > bestPartial.similarity) {
              bestPartial = { student, similarity };
            }
          }
        }
      }
    }
    
    if (bestPartial) {
      console.log('✅ Returning best partial name match:', bestPartial.student.fullName, 'similarity:', bestPartial.similarity.toFixed(2));
      return bestPartial.student;
    }

    console.log('❌ No match found for:', { usn: wantedUSN, fullName: wantedName });
    return null;
    
  } catch (error) {
    console.error('Error in findStudentByUSNOrName:', error);
    throw error;
  }
}

// REFACTORED: Use cached data loader
export async function searchStudents(query: string, limit: number = 10): Promise<{
  exactMatch: Student | null
  results: SearchResult[]
  suggestions: SearchSuggestion[]
}> {
  if (!query || query.trim() === "") {
    return { exactMatch: null, results: [], suggestions: [] }
  }

  console.log("🔍 Enhanced search for:", query)

  try {
    const students = await loadStudentsData()
    const normalizedQuery = query.trim()

    let exactMatch: Student | null = null
    const results: SearchResult[] = []
    const suggestions: SearchSuggestion[] = []

    for (const student of students) {
      // Check for exact USN match
      if (normalizeUSN(student.usn) === normalizeUSN(normalizedQuery)) {
        exactMatch = student
        console.log("✅ Exact USN match found:", student.fullName)
        break // Found the best possible match, no need to search further
      }

      // Check for exact name match
      if (normalizeName(student.fullName) === normalizeName(normalizedQuery)) {
        if (!exactMatch) {
          exactMatch = student
          console.log("✅ Exact name match found:", student.fullName)
        }
        continue
      }

      // Partial name matching with simplified similarity
      const partialMatch = containsPartialMatch(student.fullName, normalizedQuery)
      const similarity = calculatePartialSimilarity(student.fullName, normalizedQuery)

      if (partialMatch && similarity > 0.2) {
        results.push({
          student,
          matchType: "partial_name",
          similarity
        })
      } else if (similarity > 0.4) {
        suggestions.push({
          usn: student.usn,
          name: student.fullName,
          similarity,
          matchType: "fuzzy_name"
        })
      }
    }

    results.sort((a, b) => b.similarity - a.similarity)
    suggestions.sort((a, b) => b.similarity - a.similarity)

    console.log(`✅ Search completed: ${results.length} results, ${suggestions.length} suggestions`)

    return {
      exactMatch,
      results: results.slice(0, limit),
      suggestions: suggestions.slice(0, limit)
    }

  } catch (error) {
    console.error("❌ Error in searchStudents:", error)
    return { exactMatch: null, results: [], suggestions: [] }
  }
}

export async function getSearchSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchResult = await searchStudents(query, limit)
  const allSuggestions: SearchSuggestion[] = []

  searchResult.results.forEach(result => {
    allSuggestions.push({
      usn: result.student.usn,
      name: result.student.fullName,
      similarity: result.similarity,
      matchType: "partial_name"
    })
  })

  allSuggestions.push(...searchResult.suggestions)

  return allSuggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}


export function loadStudentsFromText(csvText: string): Student[] {
  try {
    const lines = csvText.trim().split("\n")
    const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))
    const students: Student[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      if (record.usn && record.name) {
        const student = parseStudentFromRecord(record)
        students.push(student)
      }
    }

    return students
  } catch (error) {
    console.error("❌ Error in loadStudentsFromText:", error)
    return []
  }
}

export function normalizeUSN(input: string): string {
  return input.trim().toUpperCase()
}

export function normalizeName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ")
}

export async function getAllStudents(): Promise<Student[]> {
  return await loadStudentsData()
}

export function getStudentsBySection(students: Student[], section: string): Student[] {
  return students.filter(student => student.section === section)
}

export function getTopPerformers(students: Student[], count: number = 10): Student[] {
  return students
    .sort((a, b) => b.sgpa - a.sgpa)
    .slice(0, count)
}

export function getStudentsByGrade(students: Student[], minSGPA: number): Student[] {
  return students.filter(student => student.sgpa >= minSGPA)
}

export function getSubjectStatistics(students: Student[], subjectCode: string) {
  const subjectMarks = students
    .flatMap(student => student.subjects)
    .filter(subject => subject.code === subjectCode)
    .map(subject => subject.marks)

  if (subjectMarks.length === 0) {
    return null
  }

  const total = subjectMarks.reduce((sum, marks) => sum + marks, 0)
  const average = total / subjectMarks.length
  const highest = Math.max(...subjectMarks)
  const lowest = Math.min(...subjectMarks)
  const passCount = subjectMarks.filter(marks => marks >= 40).length
  const passPercentage = (passCount / subjectMarks.length) * 100

  return {
    subjectCode,
    subjectName: SUBJECT_NAMES[subjectCode] || subjectCode,
    totalStudents: subjectMarks.length,
    average: Math.round(average * 100) / 100,
    highest,
    lowest,
    passCount,
    passPercentage: Math.round(passPercentage * 100) / 100
  }
}

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
BKBKK207:  "BALAKE KANNADA",
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
    const csvUrl = "https://7uhlo80bojw9rwm9.public.blob.vercel-storage.com/combined_vtu_results_cleaned.csv"
    
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()
    
    if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html')) {
      throw new Error("Received HTML instead of CSV. Check the URL.")
    }
    
    const lines = csvText.trim().split("\n")
    const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))
    
    const normalizedQuery = query.trim()

    let exactMatch: Student | null = null
    const results: SearchResult[] = []
    const suggestions: SearchSuggestion[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      if (!record.usn || !record.name) continue

      const studentUSN = record.usn.trim()
      const studentName = record.name.trim()

      // Check for exact USN match
      if (normalizeUSN(studentUSN) === normalizeUSN(normalizedQuery)) {
        const student = parseStudentFromRecord(record)
        exactMatch = student
        console.log("✅ Exact USN match found:", student.fullName)
        continue
      }

      // Check for exact name match
      if (normalizeName(studentName) === normalizeName(normalizedQuery)) {
        const student = parseStudentFromRecord(record)
        if (!exactMatch) {
          exactMatch = student
          console.log("✅ Exact name match found:", student.fullName)
        }
        continue
      }

      // Partial name matching with simplified similarity
      const partialMatch = containsPartialMatch(studentName, normalizedQuery)
      const similarity = calculatePartialSimilarity(studentName, normalizedQuery)

      if (partialMatch && similarity > 0.2) {
        const student = parseStudentFromRecord(record)
        results.push({
          student,
          matchType: "partial_name",
          similarity
        })
      } else if (similarity > 0.4) {
        suggestions.push({
          usn: studentUSN,
          name: studentName,
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

// data/students.ts (or wherever your function is located)

export async function findStudentByUSNOrName(usn?: string, fullName?: string) {
  try {
    // Use Google Drive CSV instead of Vercel Blob
    const CSV_URL = process.env.CSV_DATA_URL || 'https://drive.google.com/uc?export=download&id=1cSZ_S2jbviCcg72FBtIyRrIVJCmKpIQZ';
    
    console.log('Fetching CSV from Google Drive...');
    
    const response = await fetch(CSV_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VTU-Results-Portal/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV fetched successfully, size:', csvText.length);
    
    // Parse CSV manually (adjust based on your CSV structure)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const students = lines.slice(1).map(line => {
      const values = line.split(',');
      const student: any = {};
      headers.forEach((header, index) => {
        student[header] = values[index]?.trim();
      });
      return student;
    }).filter(student => student.usn && student.usn.trim()); // Remove empty rows
    
    console.log('Students parsed:', students.length);
    
    // Search logic (adjust field names to match your CSV)
    const match = students.find((student: any) => {
      if (usn && student.usn?.toLowerCase() === usn.toLowerCase()) {
        return true;
      }
      if (fullName && student.fullName?.toLowerCase().includes(fullName.toLowerCase())) {
        return true;
      }
      return false;
    });
    
    console.log('Search result:', match ? 'FOUND' : 'NOT_FOUND');
    return match;
    
  } catch (error) {
    console.error('Error fetching CSV from Google Drive:', error);
    throw error;
  }
}


export async function loadStudentsData(): Promise<Student[]> {
  try {
    console.log("🔄 Loading students data...")
    const csvUrl = "https://7uhlo80bojw9rwm9.public.blob.vercel-storage.com/combined_vtu_results_cleaned.csv"

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const csvText = await response.text()

    if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html')) {
      throw new Error("Received HTML instead of CSV. Check the URL.")
    }

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

    console.log(`✅ Total students loaded: ${students.length}`)
    return students
  } catch (error) {
    console.error("❌ Error in loadStudentsData:", error)
    return []
  }
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

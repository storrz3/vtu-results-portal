export type Student = {
  usn: string
  fullName: string
  totalMarks: number
  percentage: number
  sgpa: number
  subjects: Subject[]
  class?: string
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

// Subject code to name mapping based on official VTU curriculum
const SUBJECT_NAMES: Record<string, string> = {
  // 1st Semester VTU Subjects (Official Names)
  BMATS101: "MATHEMATICS FOR CSE STREAM-1",
  BPHYS102: "PHYSICS FOR CSE STREAM",
  BPOPS103: "PRINCIPLES OF PROGRAMMING USING C",
  BENGK106: "COMMUNICATIVE ENGLISH",
  BKSKK107: "SAMSKRUTIKA KANNADA",
  BKBKK107: "SAMSKRUTIKA KANNADA", // Alternative code
  BSFHK158: "SCIENTIFIC FOUNDATIONS OF HEALTH",
  BESCK104B: "INTRODUCTION TO ELECTRONICS ENGINEERING", // Alternative code
  BESCK104C: "INTRODUCTION TO ELECTRONICS ENGINEERING",
  BETCK105H: "INTRODUCTION TO INTERNET OF THINGS (IOT)",
}

// VTU Grade calculation based on marks
function calculateGrade(marks: number): string {
  if (marks >= 90) return "S" // Outstanding (90-100)
  if (marks >= 80) return "A" // Excellent (80-89)
  if (marks >= 70) return "B" // Very Good (70-79)
  if (marks >= 60) return "C" // Good (60-69)
  if (marks >= 50) return "D" // Above Average (50-59)
  if (marks >= 40) return "E" // Average (40-49)
  return "F" // Fail (Below 40)
}

// Static student data from your attachment
const studentsData: Student[] = [
  {
    usn: "3VC24CD001",
    fullName: "A SAKSHI",
    totalMarks: 573,
    percentage: 71.62,
    sgpa: 7.55,
    class: "A",
    classRank: 1,
    collegeRank: 1,
    subjects: [
      { code: "BMATS101", subject: SUBJECT_NAMES["BMATS101"], marks: 76, grade: calculateGrade(76), status: "Pass" },
      { code: "BPHYS102", subject: SUBJECT_NAMES["BPHYS102"], marks: 69, grade: calculateGrade(69), status: "Pass" },
      { code: "BPOPS103", subject: SUBJECT_NAMES["BPOPS103"], marks: 83, grade: calculateGrade(83), status: "Pass" },
      { code: "BENGK106", subject: SUBJECT_NAMES["BENGK106"], marks: 59, grade: calculateGrade(59), status: "Pass" },
      { code: "BKBKK107", subject: SUBJECT_NAMES["BKBKK107"], marks: 96, grade: calculateGrade(96), status: "Pass" },
      { code: "BSFHK158", subject: SUBJECT_NAMES["BSFHK158"], marks: 57, grade: calculateGrade(57), status: "Pass" },
      { code: "BESCK104C", subject: SUBJECT_NAMES["BESCK104C"], marks: 68, grade: calculateGrade(68), status: "Pass" },
      { code: "BETCK105H", subject: SUBJECT_NAMES["BETCK105H"], marks: 65, grade: calculateGrade(65), status: "Pass" },
    ],
    pdfLink: "https://drive.google.com/file/d/1taBEiAw5GtBIKfNTIx-Dw_Xw1d9RlaTa/view?usp=drivesdk",
  },
  {
    usn: "3VC24CD002",
    fullName: "ADITHYA PRAKASH R",
    totalMarks: 435,
    percentage: 54.37,
    sgpa: 5.4,
    class: "A",
    classRank: 4,
    collegeRank: 4,
    subjects: [
      { code: "BMATS101", subject: SUBJECT_NAMES["BMATS101"], marks: 48, grade: calculateGrade(48), status: "Fail" },
      { code: "BPHYS102", subject: SUBJECT_NAMES["BPHYS102"], marks: 63, grade: calculateGrade(63), status: "Pass" },
      { code: "BPOPS103", subject: SUBJECT_NAMES["BPOPS103"], marks: 49, grade: calculateGrade(49), status: "Fail" },
      { code: "BENGK106", subject: SUBJECT_NAMES["BENGK106"], marks: 60, grade: calculateGrade(60), status: "Pass" },
      { code: "BKSKK107", subject: SUBJECT_NAMES["BKSKK107"], marks: 64, grade: calculateGrade(64), status: "Pass" },
      { code: "BSFHK158", subject: SUBJECT_NAMES["BSFHK158"], marks: 50, grade: calculateGrade(50), status: "Pass" },
      { code: "BESCK104B", subject: SUBJECT_NAMES["BESCK104B"], marks: 41, grade: calculateGrade(41), status: "Fail" },
      { code: "BETCK105H", subject: SUBJECT_NAMES["BETCK105H"], marks: 60, grade: calculateGrade(60), status: "Fail" },
    ],
    pdfLink: "https://drive.google.com/file/d/1xzGnpNn-ZDZoIn7vB32as6_oz_duVrNg/view?usp=drivesdk",
  },
  {
    usn: "3VC24CD003",
    fullName: "AKSHAY KUMAR U",
    totalMarks: 504,
    percentage: 63.0,
    sgpa: 6.8,
    class: "A",
    classRank: 3,
    collegeRank: 3,
    subjects: [
      { code: "BMATS101", subject: SUBJECT_NAMES["BMATS101"], marks: 67, grade: calculateGrade(67), status: "Pass" },
      { code: "BPHYS102", subject: SUBJECT_NAMES["BPHYS102"], marks: 62, grade: calculateGrade(62), status: "Pass" },
      { code: "BPOPS103", subject: SUBJECT_NAMES["BPOPS103"], marks: 61, grade: calculateGrade(61), status: "Fail" },
      { code: "BENGK106", subject: SUBJECT_NAMES["BENGK106"], marks: 62, grade: calculateGrade(62), status: "Pass" },
      { code: "BKSKK107", subject: SUBJECT_NAMES["BKSKK107"], marks: 83, grade: calculateGrade(83), status: "Pass" },
      { code: "BSFHK158", subject: SUBJECT_NAMES["BSFHK158"], marks: 49, grade: calculateGrade(49), status: "Pass" },
      { code: "BESCK104B", subject: SUBJECT_NAMES["BESCK104B"], marks: 63, grade: calculateGrade(63), status: "Pass" },
      { code: "BETCK105H", subject: SUBJECT_NAMES["BETCK105H"], marks: 57, grade: calculateGrade(57), status: "Pass" },
    ],
    pdfLink: "https://drive.google.com/file/d/1qDCXOmKvZTksM8hYGoSF55X-GI7l-4Ly/view?usp=drivesdk",
  },
  {
    usn: "3VC24CD004",
    fullName: "B AKHILA",
    totalMarks: 508,
    percentage: 63.5,
    sgpa: 6.8,
    class: "A",
    classRank: 2,
    collegeRank: 2,
    subjects: [
      { code: "BMATS101", subject: SUBJECT_NAMES["BMATS101"], marks: 51, grade: calculateGrade(51), status: "Fail" },
      { code: "BPHYS102", subject: SUBJECT_NAMES["BPHYS102"], marks: 74, grade: calculateGrade(74), status: "Pass" },
      { code: "BPOPS103", subject: SUBJECT_NAMES["BPOPS103"], marks: 64, grade: calculateGrade(64), status: "Pass" },
      { code: "BENGK106", subject: SUBJECT_NAMES["BENGK106"], marks: 63, grade: calculateGrade(63), status: "Pass" },
      { code: "BKSKK107", subject: SUBJECT_NAMES["BKSKK107"], marks: 60, grade: calculateGrade(60), status: "Pass" },
      { code: "BSFHK158", subject: SUBJECT_NAMES["BSFHK158"], marks: 69, grade: calculateGrade(69), status: "Pass" },
      { code: "BESCK104B", subject: SUBJECT_NAMES["BESCK104B"], marks: 61, grade: calculateGrade(61), status: "Pass" },
      { code: "BETCK105H", subject: SUBJECT_NAMES["BETCK105H"], marks: 66, grade: calculateGrade(66), status: "Pass" },
    ],
    pdfLink: "https://drive.google.com/file/d/1kGPJmQqFiCdkRpbBtotp0kPfwXaH3ahl/view?usp=drivesdk",
  },
]

// Helper functions
export function normalizeUSN(input: string): string {
  return input.trim().toUpperCase()
}

export function normalizeName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ")
}

export async function loadStudentsData(): Promise<Student[]> {
  console.log("Loading static student data...")
  return studentsData
}

export async function findStudentByUSNOrName(usn?: string | null, fullName?: string | null): Promise<Student | null> {
  if (!usn && !fullName) return null

  console.log("Finding student with USN:", usn, "Name:", fullName)

  const students = await loadStudentsData()
  console.log("Loaded students count:", students.length)

  const nUSN = usn ? normalizeUSN(usn) : null
  const nName = fullName ? normalizeName(fullName) : null

  for (const student of students) {
    if (nUSN && normalizeUSN(student.usn) === nUSN) {
      console.log("Found student by USN:", student)
      return student
    }
    if (nName && normalizeName(student.fullName) === nName) {
      console.log("Found student by name:", student)
      return student
    }
  }

  console.log("No student found")
  return null
}

// Get all students (for admin/testing purposes)
export async function getAllStudents(): Promise<Student[]> {
  return await loadStudentsData()
}

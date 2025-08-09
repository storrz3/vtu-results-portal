export type Student = {
  usn: string
  fullName: string
}

// Demo data. Replace with a real DB query later.
export const students: Student[] = [
  { usn: "3VC24IS081", fullName: "Ananya R Sharma" },
  { usn: "1RV23CS001", fullName: "Rahul Kumar" },
  { usn: "2GU22ME045", fullName: "Priya Singh" },
]

// Helpers to normalize and validate
export function normalizeUSN(input: string) {
  return input.trim().toUpperCase()
}

export function normalizeName(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, " ")
}

export function findStudentByUSNOrName(usn?: string | null, fullName?: string | null): Student | null {
  if (!usn && !fullName) return null
  const nUSN = usn ? normalizeUSN(usn) : null
  const nName = fullName ? normalizeName(fullName) : null

  for (const s of students) {
    if (nUSN && normalizeUSN(s.usn) === nUSN) return s
    if (nName && normalizeName(s.fullName) === nName) return s
  }
  return null
}

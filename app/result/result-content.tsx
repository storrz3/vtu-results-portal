"use client"

import Link from "next/link"
import { ArrowLeft, User, Hash, CalendarDays, BookOpen, Award, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

type Student = {
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

type Subject = {
  code: string
  subject: string
  marks: number
  grade: string
  status: "Pass" | "Fail"
}

export default function ResultContent({
  format,
  fullName,
  usn,
}: {
  format?: string
  fullName?: string
  usn?: string
}) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentData() {
      try {
        console.log("Fetching student data for:", { fullName, usn })

        const params = new URLSearchParams()
        if (fullName) params.set("fullName", fullName)
        if (usn) params.set("usn", usn)

        const response = await fetch(`/api/validate?${params.toString()}`)
        const data = await response.json()

        console.log("API response:", data)

        if (data.ok && data.student) {
          console.log("Student data received:", data.student)
          setStudent(data.student)
        } else {
          setError(data.error || "Student not found")
        }
      } catch (error) {
        console.error("Error fetching student data:", error)
        setError("Failed to load student data")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [fullName, usn])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-700 font-sans antialiased flex items-center justify-center">
        <div className="text-white text-lg">Loading student data...</div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-700 font-sans antialiased flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg mb-4">{error || "Student not found"}</p>
          <Button asChild variant="outline" className="bg-white text-gray-800">
            <Link href="/portal">Back to Portal</Link>
          </Button>
        </div>
      </div>
    )
  }

  console.log("Rendering student:", student)
  console.log("Student subjects:", student.subjects)

  const passCount = student.subjects.filter((s) => s.status === "Pass").length
  const totalSubjects = student.subjects.length
  const aggregateMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0)

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "bg-purple-500"
      case "A":
        return "bg-green-500"
      case "B":
        return "bg-blue-500"
      case "C":
        return "bg-yellow-500"
      case "D":
        return "bg-orange-500"
      case "E":
        return "bg-red-500"
      default:
        return "bg-red-600"
    }
  }

  return (
    <div className="min-h-screen bg-slate-700 font-sans antialiased">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          {/* Header with Back and Download buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              asChild
              className="bg-white text-gray-800 hover:bg-gray-50 border-gray-300 px-4 py-2 h-10 w-full sm:w-auto"
            >
              <Link href="/portal">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>

            {student.pdfLink && (
              <Button asChild variant="outline" className="bg-white text-gray-800 hover:bg-gray-50 px-4 py-2 h-10">
                <a href={student.pdfLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official PDF
                </a>
              </Button>
            )}
          </div>

          {/* Student Info Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
              {/* Left: Student Details */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <User className="h-4 w-4" />
                    <span>Student Name</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold leading-tight">{student.fullName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <Hash className="h-4 w-4" />
                    <span>USN</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold font-mono leading-tight">{student.usn}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <CalendarDays className="h-4 w-4" />
                    <span>Examination</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold leading-tight">JULY-2025 </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <BookOpen className="h-4 w-4" />
                    <span>Semester</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold leading-tight">II Semester</p>
                </div>

                {student.class && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                      <span>Class</span>
                    </div>
                    <p className="text-lg sm:text-xl font-semibold leading-tight">{student.class}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <span>Percentage</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold leading-tight">{student.percentage}%</p>
                </div>
              </div>

              {/* Right: SGPA Display */}
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-2 text-white/90 text-sm font-medium mb-2">
                  <Award className="h-4 w-4" />
                  <span>SGPA</span>
                </div>

                <div className="flex items-baseline justify-center lg:justify-end gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-extrabold tabular-nums leading-none">
                    {student.sgpa.toFixed(1)}
                  </span>
                  <span className="text-2xl text-white/80 font-bold">/ 10</span>
                </div>

                <p className="text-sm text-white/90 mb-2 font-medium">
                  {passCount}/{totalSubjects} subjects passed
                </p>

                {(student.classRank || student.collegeRank) && (
                  <div className="text-sm text-white/90 space-y-1 font-medium">
                    {student.classRank && (
                      <p className="opacity-100 text-xl">
                        Class Rank: <span className="font-bold">#{student.classRank}</span>
                      </p>
                    )}
                    {student.collegeRank && (
                      <p className="text-xl">
                        College Rank: <span className="font-bold">#{student.collegeRank}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <Card className="shadow-xl border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Subjects and Marks ({student.subjects.length} subjects)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {student.subjects.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No subjects found. This might be a data parsing issue.</p>
                </div>
              ) : (
                <>
                  {/* Mobile View - List */}
                  <div className="block lg:hidden px-6 pb-6">
                    <div className="space-y-4">
                      {student.subjects.map((subject, index) => (
                        <div
                          key={`${subject.code}-${index}`}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="text-sm text-blue-600 font-mono font-bold mb-1 tracking-wide">
                                {subject.code}
                              </div>
                              <div className="font-medium text-blue-600 text-sm leading-tight uppercase">
                                {subject.subject}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 tabular-nums">{subject.marks}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${getGradeColor(subject.grade)}`}
                              >
                                {subject.grade}
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-1 font-medium ${subject.status === "Pass" ? "text-green-600" : "text-red-600"}`}
                            >
                              {subject.status === "Pass" ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              <span className="text-sm font-medium">{subject.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop View - Table */}
                  <div className="hidden lg:block overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            CODE
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            SUBJECT
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                            MARKS
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                            GRADE
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                            STATUS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.subjects.map((subject, index) => (
                          <tr
                            key={`${subject.code}-${index}`}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 tracking-wide">
                              {subject.code}
                            </td>
                            <td className="px-6 py-4 text-sm text-blue-600 font-medium leading-tight uppercase">
                              {subject.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-xl font-bold text-gray-900 tabular-nums">
                              {subject.marks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${getGradeColor(subject.grade)}`}
                              >
                                {subject.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div
                                className={`flex items-center justify-center gap-2 font-medium ${subject.status === "Pass" ? "text-green-600" : "text-red-600"}`}
                              >
                                {subject.status === "Pass" ? (
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <span className="text-sm font-medium">{subject.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Stats - Updated to match the design */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-gray-600 font-medium">
                      <span>
                        Total Subjects: <strong className="text-gray-900 font-bold">{totalSubjects}</strong>
                      </span>
                      <span>
                        Aggregate Marks: <strong className="text-gray-900 font-bold">{aggregateMarks}</strong>
                      </span>
                      <span>
                        Total Marks: <strong className="text-gray-900 font-bold">{student.totalMarks}</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

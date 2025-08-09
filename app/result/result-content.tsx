'use client'

import Link from "next/link"
import { ArrowLeft, FileText, Download, CheckCircle, XCircle, Award, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CgpaBanner from "./cgpa-banner"
import SocialButtons from "@/components/social-buttons"

export default function ResultContent({
  format,
  fullName,
  usn,
}: {
  format?: string
  fullName?: string
  usn?: string
}) {
  const fmt = (format || "pdf").toLowerCase()
  const isCSV = fmt === "csv"
  const downloadLabel = isCSV ? "Download CSV" : "Download PDF"

  const dlUrl =
    `/api/download?format=${encodeURIComponent(fmt)}&compact=1&compress=gzip&fields=subject,marks,status` +
    (fullName ? `&fullName=${encodeURIComponent(fullName)}` : "") +
    (usn ? `&usn=${encodeURIComponent(usn)}` : "")

  type SubjectRow = {
    code: string
    name: string
    marks: number
    grade: string
    pass: boolean
  }

  const subjects: SubjectRow[] = [
    { code: "21CS42", name: "Data Structures and Algorithms", marks: 88, grade: "A", pass: true },
    { code: "21CS43", name: "Database Management Systems", marks: 76, grade: "B", pass: true },
    { code: "21CS44", name: "Operating Systems", marks: 81, grade: "A", pass: true },
    { code: "21CS45", name: "Computer Networks", marks: 74, grade: "B", pass: true },
    { code: "21CS46", name: "Discrete Mathematics", marks: 92, grade: "S", pass: true },
  ]

  const passCount = subjects.filter(s => s.pass).length
  const totalSubjects = subjects.length
  const cgpa = 8.45

  return (
    <div
      className="min-h-screen bg-slate-700 font-sans antialiased"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <SocialButtons instagramUrl="https://instagram.com" googleUrl="https://google.com" />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* Top actions (stack on mobile) */}
          <div className="mb-6 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:justify-between">
            <Button
              variant="outline"
              asChild
              className="h-11 bg-white text-gray-800 hover:bg-gray-50 w-full sm:w-auto justify-center"
            >
              <Link href="/" aria-label="Back to search" prefetch={false}>
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Back
              </Link>
            </Button>

            <Button
              asChild
              className="h-11 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto justify-center"
              aria-label={downloadLabel}
              title={downloadLabel}
            >
              <a href={dlUrl}>
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                {downloadLabel}
              </a>
            </Button>
          </div>

          {/* Revamped CGPA section */}
          <CgpaBanner
            fullName={fullName}
            usn={usn}
            examination="December 2024"
            semester="6th Semester"
            cgpa={cgpa}
            passSummary={`${passCount}/${totalSubjects} subjects passed`}
            className="mb-6"
          />

          <section aria-labelledby="how-cgpa-heading" className="mb-6">
            
          </section>

          {/* Subjects, Marks, Grade, and Status */}
          <Card className="border-0 shadow-lg card">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-900 text-base sm:text-lg">
                Subjects and Marks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Mobile-friendly list */}
              <div className="block sm:hidden">
                <ul className="divide-y divide-gray-200">
                  {subjects.map((s) => (
                    <li key={s.code} className="py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 px-1.5 py-0.5 text-[10px] font-mono tracking-wide">
                            {s.code}
                          </span>
                          <span className="text-sm font-medium text-gray-900 break-words">
                            {s.name}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-600">
                            Marks: <span className="font-medium text-gray-800">{s.marks}</span>
                          </span>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                            Grade: {s.grade}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              s.pass
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                            }`}
                            aria-label={s.pass ? 'Pass' : 'Fail'}
                          >
                            {s.pass ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {s.pass ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Table on larger screens */}
              <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 table-hover">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                        Code
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Marks
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Grade
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subjects.map((s, i) => (
                      <tr key={s.code} className={i % 2 === 1 ? 'bg-gray-50/40' : ''}>
                        <td className="px-3 py-3 text-sm text-gray-700 font-mono">{s.code}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{s.name}</td>
                        <td className="px-3 py-3 text-sm text-gray-700 text-right">{s.marks}</td>
                        <td className="px-3 py-3 text-sm text-right">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                            {s.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${
                              s.pass
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                            }`}
                          >
                            {s.pass ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <span className="text-xs">{s.pass ? 'Pass' : 'Fail'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Total Subjects: <span className="font-medium text-gray-900">{totalSubjects}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Aggregate Marks:{' '}
                  <span className="font-medium text-gray-900">
                    {subjects.reduce((acc, s) => acc + s.marks, 0)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}

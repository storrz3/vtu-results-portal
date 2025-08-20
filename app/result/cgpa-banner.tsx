"use client"

import { User, Hash, CalendarDays, BookOpen, Award } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  fullName?: string
  usn?: string
  examination?: string
  semester?: string
  cgpa: number
  passSummary?: string
  totalMarks?: number
  percentage?: number
  classRank?: number
  collegeRank?: number
  className?: string
}

export function CgpaBanner({
  fullName = "Student",
  usn = "USN",
  examination = "December 2024",
  semester = "1st Semester",
  cgpa,
  passSummary = "",
  className,
}: Props) {
  return (
    <section
      aria-labelledby="cgpa-heading"
      className={cn(
        "bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl",
        className,
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
        {/* Left: Student Details */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <User className="h-4 w-4" />
              <span>Student Name</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{fullName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Hash className="h-4 w-4" />
              <span>USN</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono">{usn}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <CalendarDays className="h-4 w-4" />
              <span>Examination</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold">{examination}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              <span>Semester</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold">{semester}</p>
          </div>
        </div>

        {/* Right: SGPA Display */}
        <div className="text-center lg:text-right">
          <div className="flex items-center justify-center lg:justify-end gap-2 text-white/90 text-sm font-medium mb-2">
            <Award className="h-4 w-4" />
            <span id="cgpa-heading">SGPA</span>
          </div>

          <div className="flex items-baseline justify-center lg:justify-end gap-2 mb-2">
            <span className="text-5xl sm:text-6xl font-extrabold tabular-nums">{cgpa.toFixed(1)}</span>
            <span className="text-2xl text-white/80">/10</span>
          </div>

          {passSummary && <p className="text-sm text-white/90">{passSummary}</p>}
        </div>
      </div>
    </section>
  )
}

export default CgpaBanner

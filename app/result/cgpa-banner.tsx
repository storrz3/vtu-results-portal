'use client'

import { User, Hash, CalendarDays, BookOpen, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  fullName?: string
  usn?: string
  examination?: string
  semester?: string
  cgpa: number
  passSummary?: string
  className?: string
}

export function CgpaBanner({
  fullName = 'Student',
  usn = 'USN',
  examination = 'December 2024',
  semester = '6th Semester',
  cgpa,
  passSummary = '',
  className,
}: Props) {
  return (
    <section
      aria-labelledby="cgpa-heading"
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white',
        'p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl',
        // subtle gradient shift on hover
        'hover:to-blue-600',
        className
      )}
    >
      {/* soft ring and glow layers */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="grid gap-6 sm:grid-cols-5 sm:items-center">
        {/* Left grid: info blocks */}
        <div className="sm:col-span-3 grid grid-cols-1 xs:grid-cols-2 gap-6">
          {/* Student Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <User className="h-4 w-4" aria-hidden="true" />
              <span>Student Name</span>
            </div>
            <p className="text-base sm:text-lg font-semibold leading-tight">{fullName}</p>
          </div>

          {/* Examination */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span>Examination</span>
            </div>
            <p className="text-base sm:text-lg font-semibold leading-tight">{examination}</p>
          </div>

          {/* USN */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <Hash className="h-4 w-4" aria-hidden="true" />
              <span>USN</span>
            </div>
            <p className="text-base sm:text-lg font-extrabold tracking-wide font-mono">{usn}</p>
          </div>

          {/* Semester */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Semester</span>
            </div>
            <p className="text-base sm:text-lg font-semibold leading-tight">{semester}</p>
          </div>
        </div>

        {/* Right: CGPA summary */}
        <div className="sm:col-span-2 sm:text-right">
          <div className="flex sm:block items-center justify-between">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Medal className="h-4 w-4" aria-hidden="true" />
              <span id="cgpa-heading">SGPA</span>
            </div>
          </div>
          <div
            className={cn(
              'mt-2 sm:mt-3 inline-flex sm:flex sm:flex-col items-baseline gap-3 sm:gap-1',
              'transition-transform duration-300 ease-out group-hover:scale-[1.02]'
            )}
            aria-describedby="cgpa-caption"
          >
            <span className="text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight">
              {cgpa.toFixed(2)}
            </span>
          </div>
          {passSummary ? (
            <p id="cgpa-caption" className="mt-1 text-xs text-white/90">
              {passSummary}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default CgpaBanner

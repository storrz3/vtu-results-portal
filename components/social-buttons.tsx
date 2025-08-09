'use client'

import Link from 'next/link'
import { Instagram, MailIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
instagramUrl?: string
googleUrl?: string
className?: string
}

const EASE = '[cubic-bezier(0.31,-0.105,0.43,1.59)]'

export default function SocialButtons({
instagramUrl = '#',
googleUrl = '#',
className,
}: Props) {
return (
  <div
    className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 leading-10 my-7 mt-7 py-6',
      'flex flex-row justify-center gap-3 items-center',
      'text-center tracking-normal border-0 mx-3.5',
      className
    )}
    aria-label="Quick links"
  >
    {/* Instagram */}
    <Link
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Instagram"
      className={cn(
        'group relative inline-flex items-center justify-center',
        'w-14 h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5 sm:w-12 sm:h-12',
        'overflow-hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.05] active:scale-95'
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#e1306c]',
          `motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-${EASE}`,
          'group-hover:-left-[10%] group-hover:-top-[10%]'
        )}
      />
      <Instagram
        className="relative z-10 h-7 text-[#e1306c] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-white w-7"
        aria-hidden="true"
      />
    </Link>

    {/* Google */}
    <Link
      href={googleUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Google"
      className={cn(
        'group relative inline-flex items-center justify-center',
        'w-14 h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5 sm:w-12 sm:h-12',
        'overflow-hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.05] active:scale-95'
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#405de6]',
          `motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-${EASE}`,
          'group-hover:-left-[10%] group-hover:-top-[10%]'
        )}
      />
      <MailIcon
        className="relative z-10 w-7 h-7 text-[#405de6] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-white"
        aria-hidden="true"
      />
    </Link>
  </div>
)
}

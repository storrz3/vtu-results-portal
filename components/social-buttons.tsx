"use client"

import type React from "react"

import Link from "next/link"
import { Instagram, MailIcon, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button as UIButton } from "@/components/ui/button"

type Props = {
  instagramUrl?: string
  googleUrl?: string
  className?: string
}

const EASE = "[cubic-bezier(0.31,-0.105,0.43,1.59)]"

export default function SocialButtons({
  instagramUrl = "https://www.instagram.com/8.46am.__?igsh=MXh1cXE3ZTlubDJ2NQ==",
  googleUrl = "#",
  className,
}: Props) {
  const pathname = usePathname()
  const isResultsPage = pathname?.startsWith("/result") || pathname?.startsWith("/portal")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fullName = [firstName, lastName].filter(Boolean).join(" ")
    const subject = `VTU Results Portal Contact: ${fullName || "Inquiry"}`
    const body = `From: ${fullName || "Anonymous"}\nEmail: ${email || "N/A"}\n\nMessage:\n${message}`
    const mailto = `mailto:heyathere234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <div
      className={cn(
        "fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50",
        "flex flex-row justify-center gap-2 sm:gap-3 items-center",
        "px-3 sm:px-4 py-2 sm:py-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000",
        isResultsPage && "hidden",
        className,
      )}
      aria-label="Quick links"
    >
      {/* Instagram - Enhanced Responsive */}
      <Link
        href="https://www.instagram.com/8.46am.__?igsh=MXh1cXE3ZTlubDJ2NQ=="
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Instagram"
        className={cn(
          "group relative inline-flex items-center justify-center",
          "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5",
          "overflow-hidden motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out hover:scale-110 active:scale-95 hover:shadow-xl",
          "touch-manipulation min-h-[44px] min-w-[44px] hover:-translate-y-1",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#e1306c]",
            `motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-${EASE}`,
            "group-hover:-left-[10%] group-hover:-top-[10%]",
          )}
        />
        <Instagram
          className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#e1306c] motion-safe:transition-all motion-safe:duration-300 group-hover:text-white group-hover:scale-110"
          aria-hidden="true"
        />
      </Link>

      {/* LinkedIn - Enhanced Responsive */}
      <Link
        href="https://www.linkedin.com/in/tabrez-ahamed"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open LinkedIn"
        className={cn(
          "group relative inline-flex items-center justify-center",
          "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5",
          "overflow-hidden motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out hover:scale-110 active:scale-95 hover:shadow-xl",
          "touch-manipulation min-h-[44px] min-w-[44px] hover:-translate-y-1",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#0077b5]",
            `motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-${EASE}`,
            "group-hover:-left-[10%] group-hover:-top-[10%]",
          )}
        />
        <Linkedin
          className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#0077b5] motion-safe:transition-all motion-safe:duration-300 group-hover:text-white group-hover:scale-110"
          aria-hidden="true"
        />
      </Link>

      {/* Contact (opens form) - Enhanced Responsive */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Open Contact Form"
            className={cn(
              "group relative inline-flex items-center justify-center",
              "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5",
              "overflow-hidden motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out hover:scale-110 active:scale-95 hover:shadow-xl",
              "touch-manipulation min-h-[44px] min-w-[44px] hover:-translate-y-1",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#405de6]",
                `motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-${EASE}`,
                "group-hover:-left-[10%] group-hover:-top-[10%]",
              )}
            />
            <MailIcon
              className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#405de6] motion-safe:transition-all motion-safe:duration-300 group-hover:text-white group-hover:scale-110"
              aria-hidden="true"
            />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg p-0 overflow-hidden mx-3 sm:mx-4 max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white">
            <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight animate-in fade-in slide-in-from-top-2 duration-300 delay-100">
                  Contact Us
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Send your query or feedback to VTU results support.
                </DialogDescription>
              </DialogHeader>
            </div>
            <hr className="border-t border-gray-200" />
            <form
              className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-200"
              onSubmit={handleSubmit}
            >
              {/* Full Name - Enhanced Responsive */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 font-sans">Full Name</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-10 sm:h-11 touch-manipulation text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-10 sm:h-11 touch-manipulation text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Email - Enhanced Responsive */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 font-sans">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 touch-manipulation text-sm sm:text-base"
                />
              </div>

              {/* Message - Enhanced Responsive */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="message" className="text-xs sm:text-sm font-medium text-gray-700 font-sans">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Type your message..."
                  className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] resize-y font-sans touch-manipulation text-sm sm:text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Submit - Enhanced Responsive */}
              <div className="pt-1 sm:pt-2">
                <UIButton
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-black hover:bg-black/90 text-white touch-manipulation min-h-[44px] text-sm sm:text-base"
                >
                  SUBMIT
                </UIButton>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

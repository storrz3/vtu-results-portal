"use client"

import type React from "react"

import Link from "next/link"
import { Instagram, MailIcon } from "lucide-react"
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
  const isResultsPage = pathname?.startsWith("/result")

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
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 leading-10 my-7 mt-7 py-6",
        "flex flex-row justify-center gap-3 items-center",
        "text-center tracking-normal border-0 mx-3.5",
        isResultsPage && "hidden",
        className,
      )}
      aria-label="Quick links"
    >
      {/* Instagram */}
      <Link
        href="https://www.instagram.com/8.46am.__?igsh=MXh1cXE3ZTlubDJ2NQ=="
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Instagram"
        className={cn(
          "group relative inline-flex items-center justify-center",
          "w-14 h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5 sm:w-12 sm:h-12",
          "overflow-hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.05] active:scale-95",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#e1306c]",
            `motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-${EASE}`,
            "group-hover:-left-[10%] group-hover:-top-[10%]",
          )}
        />
        <Instagram
          className="relative z-10 h-7 text-[#e1306c] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-white w-7"
          aria-hidden="true"
        />
      </Link>

      {/* Contact (opens form) */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Open Contact Form"
            className={cn(
              "group relative inline-flex items-center justify-center",
              "w-14 h-14 rounded-[28%] bg-white shadow-lg ring-1 ring-black/5 sm:w-12 sm:h-12",
              "overflow-hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.05] active:scale-95",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute w-[120%] h-[120%] -left-[110%] top-[90%] rotate-45 bg-[#405de6]",
                `motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-${EASE}`,
                "group-hover:-left-[10%] group-hover:-top-[10%]",
              )}
            />
            <MailIcon
              className="relative z-10 w-7 h-7 text-[#405de6] motion-safe:transition-colors motion-safe:duration-300 group-hover:text-white"
              aria-hidden="true"
            />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-white">
            <div className="px-6 pt-6 pb-2">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold tracking-tight">Contact Us</DialogTitle>
                <DialogDescription className="sr-only">
                  Send your query or feedback to VTU results support.
                </DialogDescription>
              </DialogHeader>
            </div>
            <hr className="border-t border-gray-200" />
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-sans">
                  Full Name 
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
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
                    />
                    
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 font-sans">
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
                />
                
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 font-sans">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Type your message..."
                  className="min-h-[120px] resize-y font-sans"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <UIButton type="submit" className="w-full h-11 bg-black hover:bg-black/90 text-white">
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

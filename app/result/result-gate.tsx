'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ResultContent from "./result-content"

type Props = {
  searchParams: { format?: string; fullName?: string; usn?: string }
}

type State =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; student: { usn: string; fullName: string } }

export default function ResultGate({ searchParams }: Props) {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchParams.fullName) params.set("fullName", searchParams.fullName)
    if (searchParams.usn) params.set("usn", searchParams.usn)
    fetch(`/api/validate?${params.toString()}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Validation failed.")
        }
        setState({ status: "success", student: data.student })
      })
      .catch((err) => {
        setState({
          status: "error",
          message:
            err?.message ||
            "We could not validate your details. Please check your Name or USN and try again.",
        })
      })
  }, [searchParams.fullName, searchParams.usn])

  if (state.status === "loading") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:justify-between">
          <Button variant="outline" asChild className="h-11 bg-white text-gray-800 hover:bg-gray-50 w-full sm:w-auto">
            <Link href="/" aria-label="Back to search">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back
            </Link>
          </Button>
          <div className="h-11 w-full sm:w-40 bg-blue-600/70 text-white rounded-md inline-flex items-center justify-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            Checking…
          </div>
        </div>

        <Card className="border-0 shadow-lg card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-base sm:text-lg">Validating your details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
              <p className="text-sm">Please wait while we verify your Name/USN…</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="outline" asChild className="h-11 bg-white text-gray-800 hover:bg-gray-50">
            <Link href="/" aria-label="Back to search">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-base sm:text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
              Unable to show results
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-sm text-gray-700">{state.message}</p>
            <ul className="text-xs text-gray-500 list-disc pl-5">
              <li>Check for typos in your Name or USN.</li>
              <li>Use the exact name registered with the university.</li>
              <li>If the issue persists, contact your department for assistance.</li>
            </ul>
            <div className="pt-2">
              <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/" aria-label="Try again">Try again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authorized
  return (
    <ResultContent
      format={searchParams.format}
      fullName={state.student.fullName}
      usn={state.student.usn}
    />
  )
}

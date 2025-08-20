import { Download, GraduationCapIcon, FileText, Table, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SocialButtons from "@/components/social-buttons"
import Link from "next/link"

export default function VTUResultsPortal() {
  return (
    <div
      className="min-h-screen bg-slate-700 font-sans antialiased"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 bg-[rgba(28,61,90,1)] animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:transition-none motion-reduce:animate-none">
        <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Back Button - Enhanced Responsive */}
          <div className="pt-3 pb-2 sm:pt-4 animate-in fade-in slide-in-from-left-3 duration-500">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2 h-auto min-h-[44px] touch-manipulation hover:scale-105 active:scale-95 transition-all duration-300 group text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header - Enhanced Responsive */}
          <header className="text-center mb-4 sm:mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 hover:bg-blue-500 transition-colors duration-300 hover:scale-110 animate-in zoom-in duration-700 delay-200">
                <GraduationCapIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white px-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
                VTU Results Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                Visvesvaraya Technological University
              </p>
            </div>
          </header>

          {/* Main Card - Enhanced Responsive */}
          <Card className="shadow-lg border-0 bg-white card mx-1 sm:mx-2 md:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 animate-in fade-in duration-500 delay-600">
                Download Your Results
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base animate-in fade-in duration-500 delay-700">
                Enter your Full Name OR USN to download result
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 sm:px-4 md:px-6">
              {/* Form - Enhanced Responsive */}
              <form action="/result" method="GET" className="space-y-4 sm:space-y-5 md:space-y-6" aria-busy="false">
                {/* Full Name Input - Enhanced Responsive */}
                <div className="space-y-1.5 sm:space-y-2 group animate-in fade-in slide-in-from-left-3 duration-500 delay-800">
                  <Label
                    htmlFor="fullName"
                    className="text-xs sm:text-sm font-medium text-gray-700 transition-colors duration-150 ease-in-out group-focus-within:text-blue-600"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    inputMode="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base border-gray-300 rounded-md sm:rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation hover:border-blue-300 focus:scale-[1.02]"
                    aria-describedby="fullName-help"
                  />
                  <p id="fullName-help" className="text-xs text-gray-500">
                    Enter your full name as per university records
                  </p>
                </div>

                {/* OR Separator - Enhanced */}
                <div className="relative animate-in fade-in duration-500 delay-900" aria-hidden="true">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 sm:px-3 text-xs font-semibold tracking-wider uppercase text-gray-500">
                      OR
                    </span>
                  </div>
                </div>

                {/* USN Input - Enhanced Responsive */}
                <div className="space-y-1.5 sm:space-y-2 group animate-in fade-in slide-in-from-right-3 duration-500 delay-1000">
                  <Label
                    htmlFor="usn"
                    className="text-xs sm:text-sm font-medium text-gray-700 transition-colors duration-150 ease-in-out group-focus-within:text-blue-600"
                  >
                    University Seat Number (USN)
                  </Label>
                  <Input
                    id="usn"
                    name="usn"
                    type="text"
                    placeholder="Enter your USN"
                    inputMode="text"
                    autoCapitalize="characters"
                    className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base border-gray-300 rounded-md sm:rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-wider touch-manipulation hover:border-blue-300 focus:scale-[1.02]"
                    maxLength={10}
                    aria-describedby="usn-help"
                  />
                  <p id="usn-help" className="text-xs text-gray-500">
                    Enter your 10-character USN
                  </p>
                </div>

                {/* Download Format Selection - Enhanced Responsive */}
                <fieldset className="space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-1100">
                  <legend className="text-xs sm:text-sm font-medium text-gray-700">Download Format</legend>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <input
                        type="radio"
                        id="pdf"
                        name="format"
                        value="pdf"
                        className="sr-only peer"
                        defaultChecked
                        aria-checked="true"
                      />
                      <label
                        htmlFor="pdf"
                        className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 min-h-[44px] border-2 border-gray-200 rounded-md sm:rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 touch-manipulation hover:shadow-md"
                      >
                        <FileText
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 peer-checked:text-blue-600 transition-colors duration-300"
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">PDF</span>
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="csv" name="format" value="csv" className="sr-only peer" />
                      <label
                        htmlFor="csv"
                        className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 min-h-[44px] border-2 border-gray-200 rounded-md sm:rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 touch-manipulation hover:shadow-md"
                      >
                        <Table
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 peer-checked:text-blue-600 transition-colors duration-300"
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">CSV</span>
                      </label>
                    </div>
                  </div>
                </fieldset>

                {/* Get Result Button - Enhanced Responsive */}
                <Button
                  type="submit"
                  className="relative overflow-hidden w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-md sm:rounded-lg transition-all duration-300 ease-out flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] min-h-[44px] touch-manipulation hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1200 group"
                  title="Get Result"
                  aria-label="Get Result"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-md sm:rounded-lg opacity-0 group-active:opacity-100 transition-opacity bg-white/10" />
                  <Download
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                  Get Result
                </Button>
              </form>

              {/* Information Section - Enhanced Responsive */}
              <section className="bg-blue-50 border border-blue-200 rounded-md sm:rounded-lg p-2.5 sm:p-3 md:p-4 interactive animate-in fade-in slide-in-from-bottom-3 duration-500 delay-1300">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex justify-center flex-shrink-0 mt-0.5 font-extrabold flex-col items-center gap-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div className="text-xs sm:text-sm text-blue-800">
                    <p className="mb-1 font-extrabold font-serif">DISCLAIMER:</p>
                    <ul className="space-y-0.5 sm:space-y-1 text-blue-700 text-xs">
                      <li className="font-semibold font-sans">
                        ➲ All rights and data are the property of Visvesvaraya Technological University.
                      </li>
                      <li className="font-semibold font-sans">
                        ➲ No security protocols were violated; all CAPTCHAs were solved manually without automation
                        (Trust me Bro).
                      </li>
                      <li className="font-semibold font-sans">
                        ➲ Currently, the results are available exclusively of RYMEC students for the 2nd semester
                        Examinations.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Footer - Enhanced Responsive */}
          <footer className="text-center mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3 pb-3 sm:pb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-1400">
            {/* Contact label */}
            <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">Contact Us</p>

            {/* Social buttons */}
            <SocialButtons
              instagramUrl="https://instagram.com"
              googleUrl="https://google.com"
              className="static relative mx-auto flex justify-center gap-2 sm:gap-3"
            />

            {/* Copyright */}
            <p className="text-xs text-indigo-100 py-1 -mt-1 px-4">
              © 2025 Visvesvaraya Technological University. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

import { Download, GraduationCapIcon, FileText, Table } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SocialButtons from "@/components/social-buttons"

export default function VTUResultsPortal() {
return (
<div
  className="min-h-screen bg-slate-700 font-sans antialiased"
  style={{
    paddingTop: 'max(1rem, env(safe-area-inset-top))',
    paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
  }}
>
  <div className="w-full px-4 sm:px-6 lg:px-8 bg-[rgba(28,61,90,1)] animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:transition-none motion-reduce:animate-none">
    <div className="mx-auto w-full max-w-md sm:max-w-lg">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCapIcon className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">VTU Results Portal</h1>
          <p className="text-sm text-slate-300">Visvesvaraya Technological University</p>
        </div>
      </header>

      {/* Main Card */}
      <Card className="shadow-lg border-0 bg-white card">
        <CardHeader className="text-center pb-3 sm:pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Download Your Results</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Enter your Full Name OR USN to download result
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form: GET to pass selection to /result */}
          <form action="/result" method="GET" className="space-y-6" aria-busy="false">
            {/* Full Name Input */}
            <div className="space-y-2 group">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 transition-colors duration-150 ease-in-out group-focus-within:text-blue-600">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder=""
                inputMode="text"
                autoCapitalize="words"
                autoComplete="name"
                className="w-full h-12 text-base border-gray-300 rounded-lg transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="fullName-help"
              />
              <p id="fullName-help" className="text-xs text-gray-500">
                Enter your full name as per university records
              </p>
            </div>

            {/* OR Separator */}
            <div className="relative" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold tracking-wider uppercase text-gray-500">
                  OR
                </span>
              </div>
            </div>

            {/* USN Input */}
            <div className="space-y-2 group">
              <Label htmlFor="usn" className="text-sm font-medium text-gray-700 transition-colors duration-150 ease-in-out group-focus-within:text-blue-600">
                University Seat Number (USN)
              </Label>
              <Input
                id="usn"
                name="usn"
                type="text"
                placeholder=""
                inputMode="text"
                autoCapitalize="characters"
                className="w-full h-12 text-base border-gray-300 rounded-lg transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-wider"
                maxLength={10}
                aria-describedby="usn-help"
              />
              <p id="usn-help" className="text-xs text-gray-500">
                Enter your 10-character USN
              </p>
            </div>

            {/* Download Format Selection */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-gray-700">Download Format</legend>
              <div className="flex gap-3">
                <div className="flex-1">
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
                    className="flex items-center justify-center gap-2 p-3 min-h-11 sm:min-h-12 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-gray-600 peer-checked:text-blue-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-700">PDF</span>
                  </label>
                </div>
                <div className="flex-1">
                  <input type="radio" id="csv" name="format" value="csv" className="sr-only peer" />
                  <label
                    htmlFor="csv"
                    className="flex items-center justify-center gap-2 p-3 min-h-11 sm:min-h-12 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-95"
                  >
                    <Table className="w-4 h-4 text-gray-600 peer-checked:text-blue-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-700">CSV</span>
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Get Result Button */}
            <Button
              type="submit"
              className="relative overflow-hidden w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors duration-200 ease-out flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] active:animate-pulse"
              title="Get Result"
              aria-label="Get Result"
            >
              <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 active:opacity-100 transition-opacity bg-white/10" />
              <Download className="w-5 h-5" aria-hidden="true" />
              Get Result
            </Button>
          </form>
          <div className="hidden aria-[busy=true]:block mt-6" aria-hidden="true">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
              <div className="h-10 bg-white/20 rounded"></div>
              <div className="h-10 bg-white/20 rounded"></div>
              <div className="h-10 bg-white/20 rounded w-2/3"></div>
            </div>
          </div>

          {/* Information Section */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 interactive">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex justify-center flex-shrink-0 mt-0.5 font-extrabold flex-col items-center gap-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="mb-1 font-extrabold font-serif">Important Information</p>
                <ul className="space-y-1 text-blue-700">
                  <li className="font-semibold font-sans"> ➲ All rights and data are the property of Visvesvaraya Technological University.           </li>
                  <li className="font-semibold font-sans"> ➲ No security protocols were violated; all CAPTCHAs were solved manually without automation (Trust me  Bro).                                  </li>
                  <li className="font-semibold font-sans"> ➲ Currently, the results are available exclusively of RYMEC students for the 2nd semester Examinations .                    </li>
                </ul>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center mt-8 space-y-3">
        {/* Contact label */}
        <p className="text-sm text-indigo-100/90 font-medium">Contact Us</p>

        {/* Moved buttons: centered above the copyright, below "Contact Us" */}
        <SocialButtons
          instagramUrl="https://instagram.com"
          googleUrl="https://google.com"
          className="static relative mx-auto flex justify-center gap-3"
        />

        {/* Copyright */}
        <p className="text-xs text-indigo-100 py-1 -mt-1">
          © 2024 Visvesvaraya Technological University. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
</div>
)
}

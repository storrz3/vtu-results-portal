import Link from "next/link"
import { ArrowRight, GraduationCap, Download, SkullIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation - Fully Responsive */}
      <nav className="relative z-10 px-4 py-3 safe-area-inset-top animate-in fade-in slide-in-from-top-4 duration-500 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 group-hover:scale-110" />
            <span className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
              VTU Portal
            </span>
          </div>
          <Link href="/portal">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent text-xs sm:text-sm px-2 py-1.5 h-8 sm:px-3 sm:py-2 sm:h-9 md:px-4 md:h-10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Access Portal
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Mobile First with Enhanced Breakpoints */}
      <main className="relative">
        {/* Background Effects - Responsive */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 sm:-top-20 sm:-right-20 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:-top-40 lg:-right-40 lg:w-80 lg:h-80 bg-blue-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 sm:top-20 sm:-left-20 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:top-40 lg:-left-40 lg:w-60 lg:h-60 bg-purple-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-24 h-24 sm:bottom-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:bottom-40 lg:right-1/3 lg:w-60 lg:h-60 bg-cyan-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-12 sm:px-6 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge - Responsive */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-1 mb-4 sm:px-3 sm:py-1.5 sm:mb-6 md:px-4 md:py-2 md:mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-xs sm:text-sm font-medium">VTU Results Portal - Now Live</span>
            </div>

            {/* Main Heading - Enhanced Responsive Typography */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight px-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Access Your
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                VTU Results
              </span>
              Instantly
            </h1>

            {/* Subheading - Responsive */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-300 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-400">
              {"“Get detailed subject-wise reports with SGPA, along with class and college rankings. \nCurrently available only for RYMEC 2nd SEM Students ."}
            </p>

            {/* CTA Buttons - Mobile-Optimized Single Button Layout */}
            <div className="flex justify-center mb-8 sm:mb-12 md:mb-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 flex-row gap-0 py-11 shadow-xl">
              <Link href="/portal" className="w-full max-w-sm sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation hover:scale-105 active:scale-95"
                >
                  Get Your Results
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section - Enhanced Responsive Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-8 sm:px-6 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8 py-0">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm touch-manipulation hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 group">
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:bg-blue-500/30 transition-colors duration-300 group-hover:scale-110">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:text-blue-300 transition-colors duration-300 text-amber-100" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors duration-300 text-emerald-300">
                Comprehensive Reports
              </h3>
              <p className="text-xs sm:text-sm md:text-base group-hover:text-slate-300 transition-colors duration-300 text-yellow-50">
                Subject-wise marks, grades, and SGPA/CGPA all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm touch-manipulation hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800 group">
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:bg-green-500/30 transition-colors duration-300 group-hover:scale-110">
                <SkullIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:text-green-300 transition-colors duration-300 text-emerald-400" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-green-300 transition-colors duration-300 text-yellow-500">
                Rank Insights
              </h3>
              <p className="text-xs sm:text-sm md:text-base group-hover:text-slate-300 transition-colors duration-300 text-yellow-50">
                See your position within the class and overall college ranking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm touch-manipulation hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900 group lg:col-span-1">
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:bg-purple-500/30 transition-colors duration-300 group-hover:scale-110">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors duration-300 text-indigo-300">
                Continuous Updates
              </h3>
              <p className="text-xs sm:text-sm md:text-base group-hover:text-slate-300 transition-colors duration-300 text-yellow-50">
                Results are synced as soon as they are officially published.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer - Enhanced Responsive */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm safe-area-inset-bottom animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 md:py-8">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:flex-row md:justify-between md:gap-0">
            <div className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              <span className="text-white font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-100 transition-colors duration-300">
                VTU Results Portal
              </span>
            </div>
            <div className="text-slate-400 text-xs sm:text-sm text-center hover:text-slate-300 transition-colors duration-300">
              © 2025 Visvesvaraya Technological University. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

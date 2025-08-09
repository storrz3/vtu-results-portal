import { ArrowLeft, Award, FileText, Table, Download, CheckCircle, XCircle } from 'lucide-react'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ResultGate from "./result-gate"

type SearchParams = {
  format?: string
  fullName?: string
  usn?: string
}

export default function ResultPage({ searchParams }: { searchParams: SearchParams }) {
  return <ResultGate searchParams={searchParams} />
}

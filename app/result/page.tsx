import ResultGate from "./result-gate"

type SearchParams = {
  format?: string
  fullName?: string
  usn?: string
}

export default function ResultPage({ searchParams }: { searchParams: SearchParams }) {
  return <ResultGate searchParams={searchParams} />
}

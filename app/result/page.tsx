import ResultGate from "./result-gate"

type SearchParams = {
  format?: string
  fullName?: string
  usn?: string
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { format, fullName, usn } = await searchParams
  return <ResultGate searchParams={{ format, fullName, usn }} />
}

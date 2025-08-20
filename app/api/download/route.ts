import type { NextRequest } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { findStudentByUSNOrName } from "@/data/students"

// Helpers
function parseBool(value: string | null) {
  if (!value) return false
  const v = value.toLowerCase()
  return v === "1" || v === "true" || v === "yes"
}

function parseFields(param: string | null): Array<"subject" | "marks" | "status"> {
  if (!param) return ["subject", "marks"]
  const tokens = param.split(",").map((t) => t.trim().toLowerCase())
  const out: Array<"subject" | "marks" | "status"> = []
  for (const t of tokens) {
    if (t === "subject" || t === "sub") out.push("subject")
    else if (t === "marks" || t === "m") out.push("marks")
    else if (t === "status" || t === "st") out.push("status")
  }
  return out.length ? out : ["subject", "marks"]
}

async function gzipIfRequested(
  body: Uint8Array | string | Blob,
  contentType: string,
  filename: string,
  compress: boolean,
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${filename}"`,
    Vary: "Accept-Encoding",
  }

  if (compress && typeof CompressionStream !== "undefined") {
    const stream = (body instanceof Blob ? body : new Blob([body])).stream().pipeThrough(new CompressionStream("gzip"))
    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Encoding": "gzip",
      },
    })
  }

  return new Response(body, { headers })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const format = (searchParams.get("format") || "pdf").toLowerCase()
  const fullName = searchParams.get("fullName")
  const usn = searchParams.get("usn")

  try {
    // Validate access
    const student = await findStudentByUSNOrName(usn, fullName)
    if (!student) {
      return new Response("Forbidden: invalid Name/USN.", { status: 403 })
    }

    const compact = parseBool(searchParams.get("compact"))
    const compress = parseBool(searchParams.get("compress")) || searchParams.get("compress")?.toLowerCase() === "gzip"
    const fields = parseFields(searchParams.get("fields"))

    const withStatus = fields.includes("status")

    if (format === "csv") {
      const headerFull = ["Subject Code", "Subject Name", "Marks"].concat(withStatus ? ["Status"] : [])
      const headerCompact = ["code", "name", "marks"].concat(withStatus ? ["status"] : [])
      const header = (compact ? headerCompact : headerFull).join(",")

      const rows = student.subjects
        .map((s) => {
          const parts: string[] = []
          for (const f of fields) {
            if (f === "subject") {
              parts.push(`"${s.code}"`)
              if (!compact) parts.push(`"${s.name.replace(/"/g, '""')}"`)
            }
            if (f === "marks") parts.push(String(s.marks))
            if (f === "status") parts.push(s.status)
          }
          return parts.join(",")
        })
        .join("\n")

      const footer = compact
        ? ""
        : `\n\nSGPA,${student.sgpa}\nTotal Marks,${student.totalMarks}\nPercentage,${student.percentage}%`
      const csv = header + "\n" + rows + footer

      return gzipIfRequested(csv, "text/csv; charset=utf-8", `vtu-result-${student.usn}.csv`, compress)
    }

    // PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const hasBold = !compact
    const fontBold = hasBold ? await pdfDoc.embedFont(StandardFonts.HelveticaBold) : font

    let y = 740
    const draw = (text: string, size: number, bold = false, color = rgb(0.15, 0.15, 0.2)) => {
      page.drawText(text, { x: 72, y, size, font: bold ? fontBold : font, color })
      y -= size + 8
    }

    if (compact) {
      draw("VTU Result", 14, true, rgb(0.15, 0.25, 0.55))
      draw(`SGPA: ${student.sgpa} / 10`, 12, false)
    } else {
      draw("Visvesvaraya Technological University", 16, true, rgb(0.15, 0.25, 0.55))
      draw("Result Summary", 12, false)
      draw(`Name: ${student.fullName}`, 11)
      draw(`USN: ${student.usn}`, 11)
      draw(`SGPA: ${student.sgpa} / 10`, 12, true)
      draw(`Total Marks: ${student.totalMarks}`, 11)
      draw(`Percentage: ${student.percentage}%`, 11)
      if (student.classRank) draw(`Class Rank: ${student.classRank}`, 11)
      if (student.collegeRank) draw(`College Rank: ${student.collegeRank}`, 11)
      y -= 4
      draw("Subjects and Marks:", 12, true)
    }

    for (const s of student.subjects) {
      if (y < 72) {
        y = 740
        pdfDoc.addPage()
      }
      const statusText = withStatus ? ` (${s.status})` : ""
      const gradeText = compact ? ` - ${s.marks}` : ` - ${s.marks} (Grade: ${s.grade})`
      page.drawText(`${s.code}: ${s.name}${gradeText}${statusText}`, {
        x: 72,
        y,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.2),
      })
      y -= 16
    }

    const pdfBytes = await pdfDoc.save()
    return gzipIfRequested(pdfBytes, "application/pdf", `vtu-result-${student.usn}.pdf`, compress)
  } catch (error) {
    console.error("Download error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}

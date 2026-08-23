import { NextResponse } from "next/server"
import { resolveMtwsDate } from "@/lib/prayer-time"
import { buildTodayResponse } from "@/lib/server/build-today-response"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const unsupportedParameter = [
    "latitude",
    "longitude",
    "lat",
    "lon",
    "mode",
  ].find((parameter) => searchParams.has(parameter))

  if (unsupportedParameter) {
    return NextResponse.json(
      {
        error: `The official MTWS endpoint does not accept ${unsupportedParameter}.`,
      },
      { status: 400 },
    )
  }

  let date: string
  try {
    date = resolveMtwsDate(searchParams.get("date"))
  } catch (error) {
    console.error("[GET /api/v1/today] Invalid date parameter", error)
    return NextResponse.json(
      {
        error:
          "Invalid date. Expected a valid YYYY-MM-DD Durham calendar date.",
      },
      { status: 400 },
    )
  }

  try {
    return NextResponse.json(await buildTodayResponse(date))
  } catch (error) {
    console.error("[GET /api/v1/today] Failed to build response", error)
    return NextResponse.json(
      { error: "Failed to build today prayer response" },
      { status: 502 },
    )
  }
}

import { NextResponse } from "next/server"
import { resolveMtwsDate } from "@/lib/prayer-time"
import { fetchHijriDate } from "@/lib/server/fetch-hijri-date"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    const date = resolveMtwsDate(dateParam)
    const hijri = await fetchHijriDate(date)
    const hijriDate = [hijri.weekdayArabic, hijri.formattedArabic]
      .filter(Boolean)
      .join(" ")

    return NextResponse.json({ hijriDate })
  } catch (error) {
    console.error("Error fetching Hijri date:", error)
    return NextResponse.json(
      { error: "Failed to fetch Hijri date" },
      { status: 500 },
    )
  }
}

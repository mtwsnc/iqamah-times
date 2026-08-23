import { NextResponse } from "next/server"
import { getPrayerTimesForDate } from "@/lib/server/fetch-adhan-times"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    const date = dateParam ? new Date(dateParam) : new Date()
    const prayerData = await getPrayerTimesForDate(date)

    return NextResponse.json({
      prayer: "shurooq",
      adhan: prayerData.sunrise,
      date: date.toISOString(),
    })
  } catch (error) {
    console.error("Error fetching Shurooq time:", error)
    return NextResponse.json(
      { error: "Failed to fetch Shurooq time" },
      { status: 500 },
    )
  }
}

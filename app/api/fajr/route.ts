import { NextResponse } from "next/server"
import { getPrayerTimesForDate } from "@/lib/server/fetch-adhan-times"
import { fetchIqamahTimes } from "@/lib/server/fetch-iqamah-times"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    const date = dateParam ? new Date(dateParam) : new Date()
    const [prayerData, iqamahTimes] = await Promise.all([
      getPrayerTimesForDate(date),
      fetchIqamahTimes(),
    ])

    return NextResponse.json({
      prayer: "fajr",
      adhan: prayerData.fajr,
      iqamah: iqamahTimes?.fajr || null,
      date: date.toISOString(),
    })
  } catch (error) {
    console.error("Error fetching Fajr times:", error)
    return NextResponse.json(
      { error: "Failed to fetch Fajr times" },
      { status: 500 },
    )
  }
}

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
      prayer: "isha",
      adhan: prayerData.isha,
      iqamah: iqamahTimes?.isha || null,
      date: date.toISOString(),
    })
  } catch (error) {
    console.error("Error fetching Isha times:", error)
    return NextResponse.json(
      { error: "Failed to fetch Isha times" },
      { status: 500 },
    )
  }
}

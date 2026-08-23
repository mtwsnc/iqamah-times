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
      adhan: {
        fajr: prayerData.fajr,
        shurooq: prayerData.sunrise,
        dhuhr: prayerData.dhuhr,
        asr: prayerData.asr,
        maghrib: prayerData.maghrib,
        isha: prayerData.isha,
      },
      iqamah: iqamahTimes
        ? {
            fajr: iqamahTimes.fajr,
            dhuhr: iqamahTimes.dhuhr,
            asr: iqamahTimes.asr,
            maghrib: iqamahTimes.maghrib,
            isha: iqamahTimes.isha,
          }
        : null,
      metadata: {
        date: date.toISOString(),
        hijri: prayerData.hijri,
        weekday: prayerData.weekday,
      },
    })
  } catch (error) {
    console.error("Error fetching all prayer times:", error)
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 500 },
    )
  }
}

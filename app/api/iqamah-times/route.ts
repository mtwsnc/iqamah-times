import { NextResponse } from "next/server"
import {
  formatTo12Hour,
  getMtwsDate,
  getWeekdayForDate,
} from "@/lib/prayer-time"
import { getOfficialJumuahTime } from "@/lib/server/build-today-response"
import { fetchIqamahTimes } from "@/lib/server/fetch-iqamah-times"

export async function GET() {
  try {
    const date = getMtwsDate()
    const iqamahTimes = await fetchIqamahTimes(date)

    if (!iqamahTimes) {
      return NextResponse.json(
        { error: "Failed to fetch iqamah times from external API" },
        { status: 503 },
      )
    }

    return NextResponse.json({
      fajr: formatTo12Hour(iqamahTimes.fajr, "fajr"),
      dhuhr: formatTo12Hour(iqamahTimes.dhuhr, "dhuhr"),
      asr: formatTo12Hour(iqamahTimes.asr, "asr"),
      maghrib: formatTo12Hour(iqamahTimes.maghrib, "maghrib"),
      isha: formatTo12Hour(iqamahTimes.isha, "isha"),
      ...(getWeekdayForDate(date) === "Friday" && {
        jumuah: formatTo12Hour(getOfficialJumuahTime(), "dhuhr"),
      }),
    })
  } catch (error) {
    console.error("Error fetching iqamah times:", error)
    return NextResponse.json(
      { error: "Failed to fetch iqamah times" },
      { status: 500 },
    )
  }
}

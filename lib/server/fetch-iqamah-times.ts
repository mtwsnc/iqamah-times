import {
  getMtwsDate,
  getWeekdayForDate,
  normalizeTime,
} from "@/lib/prayer-time"

export interface IqamahSchedule {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

const DAY_INDEXES = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const

function getIqamahApiUrl(): string {
  return (
    process.env.IQAMAH_API_URL ?? process.env.NEXT_PUBLIC_IQAMAH_API_URL ?? ""
  )
}

export async function fetchIqamahTimes(
  date = getMtwsDate(),
): Promise<IqamahSchedule | null> {
  const apiUrl = getIqamahApiUrl()
  if (!apiUrl) {
    console.warn("[fetchIqamahTimes] IQAMAH_API_URL is not set")
    return null
  }

  try {
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Iqamah provider returned HTTP ${response.status}`)
    }

    const payload = await response.json()
    const schedule = payload?.data ?? payload
    const weekday = getWeekdayForDate(date)
    const values = schedule?.[weekday]

    if (!Array.isArray(values) || values.length < DAY_INDEXES.length) {
      throw new Error(`Iqamah provider has no valid ${weekday} schedule`)
    }

    return Object.fromEntries(
      DAY_INDEXES.map((prayerName, index) => [
        prayerName,
        normalizeTime(values[index], prayerName),
      ]),
    ) as unknown as IqamahSchedule
  } catch (error) {
    console.error("[fetchIqamahTimes] Unable to load MTWS schedule", error)
    return null
  }
}

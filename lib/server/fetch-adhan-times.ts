import {
  getMtwsDate,
  getWeekdayForDate,
  normalizeTime,
  zonedDateTimeToUtc,
} from "@/lib/prayer-time"
import { fetchHijriDate } from "@/lib/server/fetch-hijri-date"
import type { PrayerData } from "@/types/prayer"

export interface AdhanTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  isApproximate: boolean
}

const DURHAM_LATITUDE = 35.994
const DURHAM_LONGITUDE = -78.8986
const ISNA_METHOD = 2

const APPROXIMATE_TIMES: Omit<AdhanTimes, "isApproximate"> = {
  fajr: "05:00",
  sunrise: "06:30",
  dhuhr: "13:15",
  asr: "17:00",
  maghrib: "20:00",
  isha: "21:30",
}

export async function fetchAdhanTimes(date: string): Promise<AdhanTimes> {
  try {
    const timestamp = Math.floor(
      zonedDateTimeToUtc(date, "12:00").getTime() / 1000,
    )
    const url = new URL(`https://api.aladhan.com/v1/timings/${timestamp}`)
    url.searchParams.set("latitude", String(DURHAM_LATITUDE))
    url.searchParams.set("longitude", String(DURHAM_LONGITUDE))
    url.searchParams.set("method", String(ISNA_METHOD))

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`AlAdhan returned HTTP ${response.status}`)
    }

    const json = await response.json()
    const timings = json?.data?.timings
    if (!timings) {
      throw new Error("AlAdhan response did not include timings")
    }

    return {
      fajr: normalizeTime(timings.Fajr, "fajr"),
      sunrise: normalizeTime(timings.Sunrise, "sunrise"),
      dhuhr: normalizeTime(timings.Dhuhr, "dhuhr"),
      asr: normalizeTime(timings.Asr, "asr"),
      maghrib: normalizeTime(timings.Maghrib, "maghrib"),
      isha: normalizeTime(timings.Isha, "isha"),
      isApproximate: false,
    }
  } catch (error) {
    console.error("[fetchAdhanTimes] Falling back after AlAdhan failure", error)
    return {
      ...APPROXIMATE_TIMES,
      isApproximate: true,
    }
  }
}

// Compatibility shape for the unversioned website endpoints during migration.
export async function getPrayerTimesForDate(
  date: Date | string,
): Promise<PrayerData> {
  const resolvedDate = typeof date === "string" ? date : getMtwsDate(date)
  const [times, hijri] = await Promise.all([
    fetchAdhanTimes(resolvedDate),
    fetchHijriDate(resolvedDate),
  ])

  return {
    day: Number(resolvedDate.slice(-2)),
    hijri: hijri.formatted,
    weekday: getWeekdayForDate(resolvedDate).slice(0, 3),
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
    isApproximate: times.isApproximate || hijri.isApproximate,
  }
}

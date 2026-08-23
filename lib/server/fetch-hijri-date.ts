import { resolveMtwsDate } from "@/lib/prayer-time"
import type { HijriDate } from "@/types/prayer"

export interface HijriDateResult extends HijriDate {
  weekdayArabic: string
  isApproximate: boolean
}

const UNKNOWN_HIJRI: HijriDateResult = {
  day: 0,
  month: "Unknown",
  monthArabic: "غير معروف",
  year: 0,
  formatted: "Unknown",
  formattedArabic: "غير معروف",
  weekdayArabic: "",
  isApproximate: true,
}

export async function fetchHijriDate(date: string): Promise<HijriDateResult> {
  const resolvedDate = resolveMtwsDate(date)
  const formattedDate = resolvedDate.split("-").reverse().join("-")

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`,
      { signal: AbortSignal.timeout(5000) },
    )

    if (!response.ok) {
      throw new Error(`AlAdhan Hijri endpoint returned HTTP ${response.status}`)
    }

    const hijri = (await response.json())?.data?.hijri
    const day = Number(hijri?.day)
    const year = Number(hijri?.year)
    const month = hijri?.month?.en
    const monthArabic = hijri?.month?.ar

    if (
      !Number.isInteger(day) ||
      !Number.isInteger(year) ||
      !month ||
      !monthArabic
    ) {
      throw new Error("AlAdhan Hijri response is incomplete")
    }

    return {
      day,
      month,
      monthArabic,
      year,
      formatted: `${day} ${month} ${year}`,
      formattedArabic: `${day} ${monthArabic} ${year}`,
      weekdayArabic: hijri?.weekday?.ar ?? "",
      isApproximate: false,
    }
  } catch (error) {
    console.error(
      "[fetchHijriDate] Falling back after Hijri provider failure",
      error,
    )
    return UNKNOWN_HIJRI
  }
}

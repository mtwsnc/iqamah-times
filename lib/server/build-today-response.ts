import {
  createTimeValue,
  getWeekdayForDate,
  normalizeTime,
} from "@/lib/prayer-time"
import { fetchAdhanTimes } from "@/lib/server/fetch-adhan-times"
import { fetchHijriDate } from "@/lib/server/fetch-hijri-date"
import {
  fetchIqamahTimes,
  type IqamahSchedule,
} from "@/lib/server/fetch-iqamah-times"
import type { TodayResponse } from "@/types/prayer"

const DEFAULT_JUMUAH_TIME = "13:00"

export function getOfficialJumuahTime(): string {
  return normalizeTime(
    process.env.MTWS_JUMUAH_TIME ?? DEFAULT_JUMUAH_TIME,
    "dhuhr",
  )
}

export async function buildTodayResponse(date: string): Promise<TodayResponse> {
  const [adhan, iqamah, hijri] = await Promise.all([
    fetchAdhanTimes(date),
    fetchIqamahTimes(date),
    fetchHijriDate(date),
  ])

  const fallbackIqamah: IqamahSchedule = {
    fajr: adhan.fajr,
    dhuhr: adhan.dhuhr,
    asr: adhan.asr,
    maghrib: adhan.maghrib,
    isha: adhan.isha,
  }
  const resolvedIqamah = iqamah ?? fallbackIqamah

  return {
    date,
    timezone: "America/New_York",
    weekday: getWeekdayForDate(date),
    hijri: {
      day: hijri.day,
      month: hijri.month,
      monthArabic: hijri.monthArabic,
      year: hijri.year,
      formatted: hijri.formatted,
      formattedArabic: hijri.formattedArabic,
    },
    adhan: {
      fajr: createTimeValue(date, adhan.fajr),
      sunrise: createTimeValue(date, adhan.sunrise),
      dhuhr: createTimeValue(date, adhan.dhuhr),
      asr: createTimeValue(date, adhan.asr),
      maghrib: createTimeValue(date, adhan.maghrib),
      isha: createTimeValue(date, adhan.isha),
    },
    iqamah: {
      fajr: createTimeValue(date, resolvedIqamah.fajr),
      dhuhr: createTimeValue(date, resolvedIqamah.dhuhr),
      asr: createTimeValue(date, resolvedIqamah.asr),
      maghrib: createTimeValue(date, resolvedIqamah.maghrib),
      isha: createTimeValue(date, resolvedIqamah.isha),
    },
    jumuah: createTimeValue(date, getOfficialJumuahTime()),
    meta: {
      isApproximate: adhan.isApproximate || !iqamah || hijri.isApproximate,
      generatedAt: new Date().toISOString(),
    },
  }
}

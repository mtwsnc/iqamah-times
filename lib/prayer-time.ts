import type {
  IqamahTimes,
  PrayerData,
  TimeValue,
  TodayResponse,
} from "@/types/prayer"

export const MTWS_TIMEZONE = "America/New_York" as const

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const PM_PRAYERS = new Set(["dhuhr", "asr", "maghrib", "isha"])

type DateTimePart = {
  type: string
  value: string
}

function getDateTimeParts(
  date: Date,
  timeZone: string,
): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date) as DateTimePart[]

  return Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  )
}

function assertValidDate(date: string): void {
  const match = DATE_PATTERN.exec(date)
  if (!match) {
    throw new Error("Date must use YYYY-MM-DD format")
  }

  const [, year, month, day] = match
  const parsed = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), 12),
  )
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== Number(month) - 1 ||
    parsed.getUTCDate() !== Number(day)
  ) {
    throw new Error("Date is not a valid calendar date")
  }
}

export function getMtwsDate(now = new Date()): string {
  const parts = getDateTimeParts(now, MTWS_TIMEZONE)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function resolveMtwsDate(dateParam: string | null): string {
  if (!dateParam) {
    return getMtwsDate()
  }

  assertValidDate(dateParam)
  return dateParam
}

export function getWeekdayForDate(date: string): string {
  assertValidDate(date)
  const atNoon = zonedDateTimeToUtc(date, "12:00")
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MTWS_TIMEZONE,
    weekday: "long",
  }).format(atNoon)
}

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const parts = getDateTimeParts(date, timeZone)
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )

  return (asUtc - date.getTime()) / 60000
}

export function zonedDateTimeToUtc(date: string, time: string): Date {
  assertValidDate(date)
  const normalizedTime = normalizeTime(time)
  const [hours, minutes] = normalizedTime.split(":").map(Number)
  const [year, month, day] = date.split("-").map(Number)
  const wallTime = Date.UTC(year, month - 1, day, hours, minutes)

  let utcTime = wallTime
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const offset = getTimeZoneOffset(new Date(utcTime), MTWS_TIMEZONE)
    utcTime = wallTime - offset * 60000
  }

  return new Date(utcTime)
}

export function normalizeTime(value: unknown, prayerName?: string): string {
  if (typeof value !== "string") {
    throw new Error("Prayer time must be a string")
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i)
  if (!match) {
    throw new Error(`Invalid prayer time: ${value}`)
  }

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const period = match[3]?.toUpperCase()

  if (minutes > 59) {
    throw new Error(`Invalid prayer time: ${value}`)
  }

  if (period) {
    if (hours < 1 || hours > 12) {
      throw new Error(`Invalid prayer time: ${value}`)
    }
    if (period === "AM" && hours === 12) {
      hours = 0
    }
    if (period === "PM" && hours < 12) {
      hours += 12
    }
  } else {
    if (hours > 23) {
      throw new Error(`Invalid prayer time: ${value}`)
    }
    if (hours < 12 && prayerName && PM_PRAYERS.has(prayerName.toLowerCase())) {
      hours += 12
    }
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export function createTimeValue(date: string, time: string): TimeValue {
  const normalizedTime = normalizeTime(time)
  return {
    time: normalizedTime,
    at: zonedDateTimeToUtc(date, normalizedTime).toISOString(),
  }
}

export function formatTo12Hour(time24h: string, prayerName?: string): string {
  const normalizedTime = normalizeTime(time24h, prayerName)
  const [hours, minutes] = normalizedTime.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 || 12

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

export function createTimeDate(
  baseDate: Date,
  timeStr: string,
  prayerName?: string,
): Date {
  const normalizedTime = normalizeTime(timeStr, prayerName)
  const [hours, minutes] = normalizedTime.split(":").map(Number)
  const date = new Date(baseDate)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function getTimeValueDate(
  baseDate: Date,
  time: string,
  at?: string,
  prayerName?: string,
): Date {
  if (at) {
    const absoluteTime = new Date(at)
    if (!Number.isNaN(absoluteTime.getTime())) {
      return absoluteTime
    }
  }

  return createTimeDate(baseDate, time, prayerName)
}

export function toLegacyPrayerData(today: TodayResponse): PrayerData {
  return {
    day: Number(today.date.slice(-2)),
    hijri: today.hijri.formatted,
    weekday: today.weekday.slice(0, 3),
    fajr: today.adhan.fajr.time,
    sunrise: today.adhan.sunrise.time,
    dhuhr: today.adhan.dhuhr.time,
    asr: today.adhan.asr.time,
    maghrib: today.adhan.maghrib.time,
    isha: today.adhan.isha.time,
    isApproximate: today.meta.isApproximate,
    at: {
      fajr: today.adhan.fajr.at,
      sunrise: today.adhan.sunrise.at,
      dhuhr: today.adhan.dhuhr.at,
      asr: today.adhan.asr.at,
      maghrib: today.adhan.maghrib.at,
      isha: today.adhan.isha.at,
    },
  }
}

export function toLegacyIqamahTimes(today: TodayResponse): IqamahTimes {
  return {
    fajr: formatTo12Hour(today.iqamah.fajr.time, "fajr"),
    dhuhr: formatTo12Hour(today.iqamah.dhuhr.time, "dhuhr"),
    asr: formatTo12Hour(today.iqamah.asr.time, "asr"),
    maghrib: formatTo12Hour(today.iqamah.maghrib.time, "maghrib"),
    isha: formatTo12Hour(today.iqamah.isha.time, "isha"),
    jumuah: formatTo12Hour(today.jumuah.time, "dhuhr"),
    at: {
      fajr: today.iqamah.fajr.at,
      dhuhr: today.iqamah.dhuhr.at,
      asr: today.iqamah.asr.at,
      maghrib: today.iqamah.maghrib.at,
      isha: today.iqamah.isha.at,
      jumuah: today.jumuah.at,
    },
  }
}

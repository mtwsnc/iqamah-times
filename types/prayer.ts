export interface PrayerData {
  day: number
  hijri: string
  weekday: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  isApproximate?: boolean
  at?: {
    fajr: string
    sunrise: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
}

export interface IqamahTimes {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  jumuah?: string
  at?: {
    fajr: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
    jumuah?: string
  }
}

export interface PrayerTime {
  name: string
  time: Date
  iqamahTime: Date
}

export interface TimeValue {
  time: string
  at: string
}

export interface HijriDate {
  day: number
  month: string
  monthArabic: string
  year: number
  formatted: string
  formattedArabic: string
}

export interface TodayResponse {
  date: string
  timezone: "America/New_York"
  weekday: string
  hijri: HijriDate
  adhan: {
    fajr: TimeValue
    sunrise: TimeValue
    dhuhr: TimeValue
    asr: TimeValue
    maghrib: TimeValue
    isha: TimeValue
  }
  iqamah: {
    fajr: TimeValue
    dhuhr: TimeValue
    asr: TimeValue
    maghrib: TimeValue
    isha: TimeValue
  }
  jumuah: TimeValue
  meta: {
    isApproximate: boolean
    generatedAt: string
  }
}

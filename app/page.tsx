"use client"

import { useEffect, useState } from "react"
import PrayerTimesDisplay from "@/components/PrayerTimesDisplay"
import { toLegacyIqamahTimes, toLegacyPrayerData } from "@/lib/prayer-time"
import type { IqamahTimes, PrayerData, TodayResponse } from "@/types/prayer"

export default function Home() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)
  const [iqamahTimes, setIqamahTimes] = useState<IqamahTimes | null>(null)
  const [hijriDate, setHijriDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadPrayerTimes() {
      try {
        const response = await fetch("/api/v1/today", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Today API returned HTTP ${response.status}`)
        }

        const today = (await response.json()) as TodayResponse

        if (isMounted) {
          setPrayerData(toLegacyPrayerData(today))
          setIqamahTimes(toLegacyIqamahTimes(today))
          setHijriDate(today.hijri.formattedArabic)
        }
      } catch (error) {
        console.error("Error loading prayer times:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPrayerTimes()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading prayer times...</div>
      </div>
    )
  }

  return (
    <PrayerTimesDisplay
      prayerData={prayerData}
      iqamahTimes={iqamahTimes}
      hijriDate={hijriDate}
    />
  )
}

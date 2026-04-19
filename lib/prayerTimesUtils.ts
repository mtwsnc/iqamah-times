import type { PrayerData, IqamahTimes } from '@/types/prayer';

const API_URL = process.env.NEXT_PUBLIC_IQAMAH_API_URL || '';

// Durham, NC - hardcoded coordinates, ISNA calculation method
const DURHAM_LAT = 35.994
const DURHAM_LON = -78.8986
const ISNA_METHOD = 2

export async function fetchIqamahTimes(): Promise<IqamahTimes | null> {
  if (!API_URL) {
    console.warn('NEXT_PUBLIC_IQAMAH_API_URL is not set');
    return null;
  }

  try {
    const response = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Iqamah times:', data);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];

    const todayTimes = data[currentDay];

    if (!todayTimes || !Array.isArray(todayTimes) || todayTimes.length < 5) {
      console.error('Invalid data format for today\'s Iqamah times');
      return null;
    }

    return {
      fajr: todayTimes[0],
      dhuhr: todayTimes[1],
      asr: todayTimes[2],
      maghrib: todayTimes[3],
      isha: todayTimes[4],
      jumuah: '1:30 PM'
    };
  } catch (error) {
    console.error('Error fetching Iqamah times:', error);
    return null;
  }
}

export async function getPrayerTimesForDate(date: Date): Promise<PrayerData & { isApproximate?: boolean }> {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  try {
    const timestamp = Math.floor(date.getTime() / 1000)
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${DURHAM_LAT}&longitude=${DURHAM_LON}&method=${ISNA_METHOD}`
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      throw new Error(`aladhan API error: ${response.status}`)
    }

    const json = await response.json()
    const timings = json?.data?.timings
    const hijriData = json?.data?.date?.hijri

    if (!timings) {
      throw new Error("Unexpected aladhan response shape")
    }

    const hijri = hijriData
      ? `${hijriData.day} ${hijriData.month.en} ${hijriData.year}`
      : "N/A"

    return {
      day,
      hijri,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
    }
  } catch (error) {
    console.error("Failed to fetch ISNA prayer times from aladhan:", error)
    return {
      day,
      hijri: "N/A",
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      fajr: "5:00",
      sunrise: "6:30",
      dhuhr: "1:15",
      asr: "5:00",
      maghrib: "8:00",
      isha: "9:30",
      isApproximate: true,
    }
  }
}

export function formatTo12Hour(time24h: string, prayerName?: string): string {
  const [hours, minutes] = time24h.split(':').map(Number);

  let isPM = hours >= 12;
  if (prayerName && ['dhuhr', 'asr', 'maghrib', 'isha'].includes(prayerName.toLowerCase())) {
    isPM = true;
  }

  const period = isPM ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function createTimeDate(baseDate: Date, timeStr: string, prayerName?: string): Date {
  if (!timeStr || typeof timeStr !== 'string') {
    console.error("Invalid time string for", prayerName, ":", timeStr);
    return new Date(baseDate);
  }

  let hours: number, minutes: number, isPM = false;

  if (timeStr.includes(' ')) {
    const [timeOnly, period] = timeStr.split(' ');
    [hours, minutes] = timeOnly.split(':').map(Number);
    isPM = period.toUpperCase() === 'PM';
  } else {
    [hours, minutes] = timeStr.split(':').map(Number);

    if (hours < 12 && prayerName && ['dhuhr', 'asr', 'maghrib', 'isha'].includes(prayerName.toLowerCase())) {
      isPM = true;
    }
  }

  if (isPM && hours < 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0;
  }

  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export async function fetchHijriDate(date: Date): Promise<string> {
  try {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const hijri = data.data.hijri;
    return `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year}`;
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    return 'Error loading Hijri date';
  }
}

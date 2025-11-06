import type { PrayerData, IqamahTimes } from '@/types/prayer';
import { ADHAN_TIMES_DATA } from './prayerTimesData';

const API_URL = process.env.NEXT_PUBLIC_IQAMAH_API_URL || '';

export async function fetchIqamahTimes(): Promise<IqamahTimes | null> {
  try {
    const response = await fetch(API_URL);

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

export async function getPrayerTimesForDate(date: Date): Promise<PrayerData> {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthData = ADHAN_TIMES_DATA[month];

  if (!monthData) {
    console.warn(`Prayer data for month ${month} is not available`);
    // Use fallback data
    return {
      day: day,
      hijri: "N/A",
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fajr: "5:00",
      sunrise: "6:30",
      dhuhr: "1:15",
      asr: "5:00",
      maghrib: "8:00",
      isha: "9:30"
    };
  }

  const dayData = monthData.find(entry => entry.day === day);

  if (!dayData) {
    console.warn(`No data for day ${day} in month ${month}, using first available day`);
    return monthData[0];
  }

  return dayData;
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

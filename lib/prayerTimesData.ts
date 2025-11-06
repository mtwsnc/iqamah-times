import type { PrayerData } from '@/types/prayer';

// Adhan times data for May-August 2025
// This data should be updated monthly by uploading markdown files
// For now, we're using hardcoded data from the original implementation

const MAY_ADHAN_TIMES: PrayerData[] = [
  { day: 1, hijri: "3/11", weekday: "Thu", fajr: "5:06", sunrise: "6:23", dhuhr: "1:13", asr: "4:59", maghrib: "8:03", isha: "9:21" },
  { day: 15, hijri: "17/11", weekday: "Thu", fajr: "4:49", sunrise: "6:10", dhuhr: "1:12", asr: "5:00", maghrib: "8:14", isha: "9:36" },
  // Add more days as needed
];

const JUNE_ADHAN_TIMES: PrayerData[] = [
  { day: 1, hijri: "5/12", weekday: "Sun", fajr: "4:35", sunrise: "6:00", dhuhr: "1:14", asr: "5:03", maghrib: "8:27", isha: "9:53" },
  // Add more days as needed
];

const JULY_ADHAN_TIMES: PrayerData[] = [
  { day: 1, hijri: "6/1", weekday: "Tue", fajr: "4:36", sunrise: "6:02", dhuhr: "1:20", asr: "5:10", maghrib: "8:37", isha: "10:04" },
  // Add more days as needed
];

const AUGUST_ADHAN_TIMES: PrayerData[] = [
  { day: 1, hijri: "7/2", weekday: "Fri", fajr: "5:03", sunrise: "6:22", dhuhr: "1:23", asr: "5:10", maghrib: "8:21", isha: "9:42" },
  // Add more days as needed
];

export const ADHAN_TIMES_DATA: { [key: number]: PrayerData[] } = {
  5: MAY_ADHAN_TIMES,
  6: JUNE_ADHAN_TIMES,
  7: JULY_ADHAN_TIMES,
  8: AUGUST_ADHAN_TIMES,
};

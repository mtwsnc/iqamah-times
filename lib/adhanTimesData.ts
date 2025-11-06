import type { PrayerData } from '@/types/prayer';

// Adhan times data organized by month (1-12) and day (1-31)
// Data is year-agnostic - works for any year
// Hijri dates and weekdays are from 2025 reference but times are consistent

export const ADHAN_TIMES_DATA: { [month: number]: PrayerData[] } = {
  // Data will be added month by month
};

import type { PrayerData } from '@/types/prayer';

// Adhan times data organized by month (1-12) and day (1-31)
// Data is year-agnostic - works for any year
// Hijri dates and weekdays are from 2025 reference but times are consistent

export const ADHAN_TIMES_DATA: { [month: number]: PrayerData[] } = {
  1: [ // January
    { day: 1, hijri: "1/7", weekday: "Wed", fajr: "6:10", sunrise: "7:26", dhuhr: "12:20", asr: "2:55", maghrib: "5:13", isha: "6:29" },
    { day: 2, hijri: "2/7", weekday: "Thu", fajr: "6:11", sunrise: "7:26", dhuhr: "12:20", asr: "2:56", maghrib: "5:14", isha: "6:30" },
    { day: 3, hijri: "3/7", weekday: "Fri", fajr: "6:11", sunrise: "7:26", dhuhr: "12:21", asr: "2:56", maghrib: "5:15", isha: "6:30" },
    { day: 4, hijri: "4/7", weekday: "Sat", fajr: "6:11", sunrise: "7:26", dhuhr: "12:21", asr: "2:57", maghrib: "5:15", isha: "6:31" },
    { day: 5, hijri: "5/7", weekday: "Sun", fajr: "6:11", sunrise: "7:26", dhuhr: "12:21", asr: "2:58", maghrib: "5:16", isha: "6:32" },
    { day: 6, hijri: "6/7", weekday: "Mon", fajr: "6:11", sunrise: "7:26", dhuhr: "12:22", asr: "2:59", maghrib: "5:17", isha: "6:33" },
    { day: 7, hijri: "7/7", weekday: "Tue", fajr: "6:11", sunrise: "7:26", dhuhr: "12:22", asr: "3:00", maghrib: "5:18", isha: "6:34" },
    { day: 8, hijri: "8/7", weekday: "Wed", fajr: "6:11", sunrise: "7:26", dhuhr: "12:23", asr: "3:00", maghrib: "5:19", isha: "6:34" },
    { day: 9, hijri: "9/7", weekday: "Thu", fajr: "6:11", sunrise: "7:26", dhuhr: "12:23", asr: "3:01", maghrib: "5:20", isha: "6:35" },
    { day: 10, hijri: "10/7", weekday: "Fri", fajr: "6:11", sunrise: "7:26", dhuhr: "12:24", asr: "3:02", maghrib: "5:21", isha: "6:36" },
    { day: 11, hijri: "11/7", weekday: "Sat", fajr: "6:11", sunrise: "7:26", dhuhr: "12:24", asr: "3:03", maghrib: "5:22", isha: "6:37" },
    { day: 12, hijri: "12/7", weekday: "Sun", fajr: "6:11", sunrise: "7:25", dhuhr: "12:24", asr: "3:04", maghrib: "5:23", isha: "6:38" },
    { day: 13, hijri: "13/7", weekday: "Mon", fajr: "6:11", sunrise: "7:26", dhuhr: "12:25", asr: "3:05", maghrib: "5:24", isha: "6:39" },
    { day: 14, hijri: "14/7", weekday: "Tue", fajr: "6:11", sunrise: "7:25", dhuhr: "12:25", asr: "3:06", maghrib: "5:25", isha: "6:40" },
    { day: 15, hijri: "15/7", weekday: "Wed", fajr: "6:10", sunrise: "7:25", dhuhr: "12:25", asr: "3:07", maghrib: "5:26", isha: "6:40" },
    { day: 16, hijri: "16/7", weekday: "Thu", fajr: "6:10", sunrise: "7:24", dhuhr: "12:26", asr: "3:07", maghrib: "5:27", isha: "6:41" },
    { day: 17, hijri: "17/7", weekday: "Fri", fajr: "6:10", sunrise: "7:24", dhuhr: "12:26", asr: "3:08", maghrib: "5:28", isha: "6:42" },
    { day: 18, hijri: "18/7", weekday: "Sat", fajr: "6:10", sunrise: "7:24", dhuhr: "12:26", asr: "3:09", maghrib: "5:29", isha: "6:43" },
    { day: 19, hijri: "19/7", weekday: "Sun", fajr: "6:09", sunrise: "7:23", dhuhr: "12:27", asr: "3:10", maghrib: "5:30", isha: "6:44" },
    { day: 20, hijri: "20/7", weekday: "Mon", fajr: "6:09", sunrise: "7:23", dhuhr: "12:27", asr: "3:11", maghrib: "5:31", isha: "6:45" },
    { day: 21, hijri: "21/7", weekday: "Tue", fajr: "6:09", sunrise: "7:22", dhuhr: "12:27", asr: "3:12", maghrib: "5:32", isha: "6:46" },
    { day: 22, hijri: "22/7", weekday: "Wed", fajr: "6:08", sunrise: "7:22", dhuhr: "12:28", asr: "3:13", maghrib: "5:33", isha: "6:47" },
    { day: 23, hijri: "23/7", weekday: "Thu", fajr: "6:08", sunrise: "7:21", dhuhr: "12:28", asr: "3:14", maghrib: "5:34", isha: "6:48" },
    { day: 24, hijri: "24/7", weekday: "Fri", fajr: "6:08", sunrise: "7:21", dhuhr: "12:28", asr: "3:15", maghrib: "5:35", isha: "6:49" },
    { day: 25, hijri: "25/7", weekday: "Sat", fajr: "6:07", sunrise: "7:20", dhuhr: "12:28", asr: "3:16", maghrib: "5:36", isha: "6:50" },
    { day: 26, hijri: "26/7", weekday: "Sun", fajr: "6:07", sunrise: "7:19", dhuhr: "12:28", asr: "3:17", maghrib: "5:37", isha: "6:50" },
    { day: 27, hijri: "27/7", weekday: "Mon", fajr: "6:06", sunrise: "7:19", dhuhr: "12:29", asr: "3:17", maghrib: "5:38", isha: "6:51" },
    { day: 28, hijri: "28/7", weekday: "Tue", fajr: "6:05", sunrise: "7:18", dhuhr: "12:29", asr: "3:18", maghrib: "5:39", isha: "6:52" },
    { day: 29, hijri: "29/7", weekday: "Wed", fajr: "6:05", sunrise: "7:17", dhuhr: "12:29", asr: "3:19", maghrib: "5:40", isha: "6:53" },
    { day: 30, hijri: "30/7", weekday: "Thu", fajr: "6:04", sunrise: "7:17", dhuhr: "12:29", asr: "3:20", maghrib: "5:41", isha: "6:54" },
    { day: 31, hijri: "1/8", weekday: "Fri", fajr: "6:04", sunrise: "7:16", dhuhr: "12:29", asr: "3:21", maghrib: "5:42", isha: "6:55" }
  ]
};

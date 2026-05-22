export interface PrayerData {
  day: number;
  hijri: string;
  weekday: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface IqamahTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah?: string;
}

export interface PrayerTime {
  name: string;
  time: Date;
  iqamahTime: Date;
}

'use client';

import { useEffect, useState } from 'react';
import { Check, Download, Maximize, CalendarClock, X } from 'lucide-react';
import { formatTo12Hour, createTimeDate, fetchHijriDate } from '@/lib/prayerTimesUtils';
import type { PrayerData, IqamahTimes, PrayerTime } from '@/types/prayer';

interface Props {
  prayerData: PrayerData | null;
  iqamahTimes: IqamahTimes | null;
}

export default function PrayerTimesDisplay({ prayerData, iqamahTimes }: Props) {
  const [hijriDate, setHijriDate] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isIqamahCountdown, setIsIqamahCountdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    async function loadHijriDate() {
      const date = await fetchHijriDate(new Date());
      setHijriDate(date);
    }
    loadHijriDate();
  }, []);

  useEffect(() => {
    if (!prayerData) return;

    const now = new Date();
    const prayerTimes: PrayerTime[] = [
      { 
        name: 'FAJR', 
        time: createTimeDate(now, prayerData.fajr, 'fajr'), 
        iqamahTime: iqamahTimes ? createTimeDate(now, iqamahTimes.fajr, 'fajr') : createTimeDate(now, prayerData.fajr, 'fajr')
      },
      { 
        name: 'DHUHR', 
        time: createTimeDate(now, prayerData.dhuhr, 'dhuhr'), 
        iqamahTime: iqamahTimes ? createTimeDate(now, iqamahTimes.dhuhr, 'dhuhr') : createTimeDate(now, prayerData.dhuhr, 'dhuhr')
      },
      { 
        name: 'ASR', 
        time: createTimeDate(now, prayerData.asr, 'asr'), 
        iqamahTime: iqamahTimes ? createTimeDate(now, iqamahTimes.asr, 'asr') : createTimeDate(now, prayerData.asr, 'asr')
      },
      { 
        name: 'MAGHRIB', 
        time: createTimeDate(now, prayerData.maghrib, 'maghrib'), 
        iqamahTime: iqamahTimes ? createTimeDate(now, iqamahTimes.maghrib, 'maghrib') : createTimeDate(now, prayerData.maghrib, 'maghrib')
      },
      { 
        name: 'ISHA', 
        time: createTimeDate(now, prayerData.isha, 'isha'), 
        iqamahTime: iqamahTimes ? createTimeDate(now, iqamahTimes.isha, 'isha') : createTimeDate(now, prayerData.isha, 'isha')
      }
    ];

    let next: PrayerTime | null = null;
    let isIqamah = false;

    // Check if between Adhan and Iqamah
    for (const prayer of prayerTimes) {
      if (prayer.time <= now && prayer.iqamahTime > now) {
        next = prayer;
        isIqamah = true;
        break;
      }
    }

    // Find next Adhan
    if (!next) {
      for (const prayer of prayerTimes) {
        if (prayer.time > now) {
          next = prayer;
          break;
        }
      }
    }

    // Next prayer is Fajr tomorrow
    if (!next) {
      next = { ...prayerTimes[0] };
      next.time.setDate(next.time.getDate() + 1);
      next.iqamahTime.setDate(next.iqamahTime.getDate() + 1);
    }

    setNextPrayer(next);
    setIsIqamahCountdown(isIqamah);
  }, [prayerData, iqamahTimes]);

  useEffect(() => {
    if (!nextPrayer) return;

    const interval = setInterval(() => {
      const now = new Date();
      const targetTime = isIqamahCountdown ? nextPrayer.iqamahTime : nextPrayer.time;
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        window.location.reload();
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setCountdown({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer, isIqamahCountdown]);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const bannerDismissed = localStorage.getItem('app_banner_dismissed');
    
    if (isAndroid && !bannerDismissed) {
      setTimeout(() => setShowBanner(true), 7000);
    }
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem('app_banner_dismissed', 'true');
  };

  if (!prayerData) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const gregorianDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {showBanner && (
        <div className="app-banner flex">
          <div className="app-banner-content">
            <div className="app-banner-icon">
              <CalendarClock className="w-5 h-5 text-masjid-accent" />
            </div>
            <div className="app-banner-text">
              <div className="app-banner-title">MTWS Iqāmah Times</div>
              <div>Get real-time prayer times on your Android device</div>
            </div>
          </div>
          <a href="/MTWS%20Iqaamah%20Times.apk" className="app-banner-download">Download</a>
          <div className="app-banner-close" onClick={handleCloseBanner}>
            <X className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="page-content">
        <header className="pt-6 pb-2 px-4 text-white">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="text-lg font-light mb-2 sm:mb-0 text-center sm:text-left">
              <span>{gregorianDate}</span>
            </div>
            <div className="text-lg font-light text-center sm:text-right">
              <span className="hijri-date-arabic">{hijriDate}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pb-8">
          <div className="text-center text-white mb-6">
            <h1 className="text-xl mb-1 font-light">Prayer times</h1>
            <div className="flex items-center justify-center">
              <h2 className="text-3xl font-bold mb-1">Masjid Tawheed Was-Sunnah</h2>
              <div className="ml-2 tooltip">
                <span className="text-white bg-masjid-accent rounded-full p-1 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                <span className="tooltip-text">Official Prayer Times Source</span>
              </div>
            </div>
            <p className="text-sm opacity-90">3714 South Alston Avenue, Durham, NC, USA</p>
          </div>

          <div className="text-center text-white mb-10">
            <p className="text-xl font-light">
              {isIqamahCountdown ? 'IQAMAH at MTWS IN:' : `The prayer of ${nextPrayer?.name} is in`}
            </p>
            <div className="countdown-container flex justify-center gap-2 my-2">
              <div className="text-5xl sm:text-7xl font-bold countdown-digit">
                {countdown.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-5xl sm:text-7xl font-bold">:</div>
              <div className="text-5xl sm:text-7xl font-bold countdown-digit">
                {countdown.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-5xl sm:text-7xl font-bold">:</div>
              <div className="text-5xl sm:text-7xl font-bold countdown-digit">
                {countdown.seconds.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="countdown-labels flex justify-center gap-2 text-sm font-light">
              <div className="w-16 sm:w-20 text-center">Hours</div>
              <div className="w-16 sm:w-20 text-center">Minutes</div>
              <div className="w-16 sm:w-20 text-center">Seconds</div>
            </div>
          </div>

          <div className="wavy-divider">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#FFFFFF" fillOpacity="0.3"
                d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,197.3C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              </path>
            </svg>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <PrayerCard 
                name="FAJR" 
                iqamahTime={iqamahTimes?.fajr || formatTo12Hour(prayerData.fajr, 'fajr')}
                adhanTime={formatTo12Hour(prayerData.fajr, 'fajr')}
                isActive={nextPrayer?.name === 'FAJR'}
              />
              <PrayerCard 
                name="SHURUQ" 
                iqamahTime={formatTo12Hour(prayerData.sunrise, 'sunrise')}
                adhanTime=""
                isActive={false}
                isSunrise
              />
              <PrayerCard 
                name="DHUHR" 
                iqamahTime={iqamahTimes?.dhuhr || formatTo12Hour(prayerData.dhuhr, 'dhuhr')}
                adhanTime={formatTo12Hour(prayerData.dhuhr, 'dhuhr')}
                isActive={nextPrayer?.name === 'DHUHR'}
              />
              <PrayerCard 
                name="ASR" 
                iqamahTime={iqamahTimes?.asr || formatTo12Hour(prayerData.asr, 'asr')}
                adhanTime={formatTo12Hour(prayerData.asr, 'asr')}
                isActive={nextPrayer?.name === 'ASR'}
              />
              <PrayerCard 
                name="MAGHRIB" 
                iqamahTime={iqamahTimes?.maghrib || formatTo12Hour(prayerData.maghrib, 'maghrib')}
                adhanTime={formatTo12Hour(prayerData.maghrib, 'maghrib')}
                isActive={nextPrayer?.name === 'MAGHRIB'}
              />
              <PrayerCard 
                name="ISHA" 
                iqamahTime={iqamahTimes?.isha || formatTo12Hour(prayerData.isha, 'isha')}
                adhanTime={formatTo12Hour(prayerData.isha, 'isha')}
                isActive={nextPrayer?.name === 'ISHA'}
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-4">
            <div className="prayer-card flex flex-col w-full">
              <div className="prayer-name text-lg">JUMUAH</div>
              <div className="prayer-time">1:00 PM</div>
              <div className="adhan-time">&nbsp;</div>
            </div>
          </div>

          <div className="mt-8 text-center download-buttons flex flex-wrap justify-center gap-2">
            <a href="/MTWS%20Iqaamah%20Times.apk"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-masjid-accent hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-masjid-accent">
              <Download className="w-4 h-4 mr-2" />
              Download the Android App
            </a>
            <a href="/fullscreen"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-masjid-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-masjid-dark">
              <Maximize className="w-4 h-4 mr-2" />
              Enter Fullscreen Mode
            </a>
          </div>
        </main>
      </div>

      <footer className="footer bg-opacity-20 bg-black text-white py-4 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <img src="/mtws-logo.png" alt="MTWS Logo" className="h-6 w-auto" />
            <a href="https://mtws.one" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">mtws.one</a>
            <a href="https://mtws.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">mtws.org</a>
          </div>
        </div>
      </footer>
    </>
  );
}

interface PrayerCardProps {
  name: string;
  iqamahTime: string;
  adhanTime: string;
  isActive: boolean;
  isSunrise?: boolean;
}

function PrayerCard({ name, iqamahTime, adhanTime, isActive, isSunrise }: PrayerCardProps) {
  return (
    <div className={`prayer-card flex flex-col h-full ${isActive ? 'active' : ''}`}>
      <div className="prayer-name text-lg">{name}</div>
      <div className="prayer-time">{iqamahTime}</div>
      <div className="adhan-time">
        {isSunrise ? '\u00A0' : `COMES IN AT: ${adhanTime}`}
      </div>
    </div>
  );
}

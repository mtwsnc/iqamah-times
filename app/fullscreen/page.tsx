'use client';

import { useEffect, useState } from 'react';
import { X, Maximize } from 'lucide-react';
import { formatTo12Hour, createTimeDate, fetchHijriDate } from '@/lib/prayerTimesUtils';
import type { PrayerData, IqamahTimes, PrayerTime } from '@/types/prayer';

export default function FullscreenPage() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [iqamahTimes, setIqamahTimes] = useState<IqamahTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isIqamahCountdown, setIsIqamahCountdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReloadPrompt, setShowReloadPrompt] = useState(false);

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Check for updates periodically
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('/api/prayer-times', { cache: 'no-store' });
        if (response.ok) {
          // If we get a successful response, check if content has changed
          setShowReloadPrompt(true);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check for updates every 5 minutes
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch prayer data
    const fetchData = async () => {
      try {
        const [prayerRes, iqamahRes, hijriDateStr] = await Promise.all([
          fetch('/api/prayer-times'),
          fetch('/api/iqamah-times'),
          fetchHijriDate(new Date())
        ]);

        if (prayerRes.ok) {
          const data = await prayerRes.json();
          setPrayerData(data);
        }

        if (iqamahRes.ok) {
          const data = await iqamahRes.json();
          setIqamahTimes(data);
        }

        setHijriDate(hijriDateStr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

    for (const prayer of prayerTimes) {
      if (prayer.time > now) {
        next = prayer;
        isIqamah = false;
        break;
      } else if (prayer.iqamahTime > now) {
        next = prayer;
        isIqamah = true;
        break;
      }
    }

    if (!next) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fajrTomorrow = createTimeDate(tomorrow, prayerData.fajr, 'fajr');
      next = { name: 'FAJR', time: fajrTomorrow, iqamahTime: fajrTomorrow };
      isIqamah = false;
    }

    setNextPrayer(next);
    setIsIqamahCountdown(isIqamah);

    const updateCountdown = () => {
      const now = new Date();
      const target = isIqamah ? next!.iqamahTime : next!.time;
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayerData, iqamahTimes]);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Error entering fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      window.location.href = '/';
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!prayerData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const gregorianDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen p-8">
      {/* Fullscreen Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        {!isFullscreen && (
          <button
            onClick={enterFullscreen}
            className="text-white bg-masjid-accent hover:bg-opacity-90 rounded-full p-3 transition-all"
            aria-label="Enter fullscreen"
          >
            <Maximize className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={exitFullscreen}
          className="text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-all"
          aria-label="Exit to home"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Reload Prompt */}
      {showReloadPrompt && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-masjid-accent text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span className="font-semibold">New prayer times available</span>
          <button
            onClick={handleReload}
            className="bg-white text-masjid-green px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-all"
          >
            Reload Page
          </button>
          <button
            onClick={() => setShowReloadPrompt(false)}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="text-center text-white mb-4">
        <h1 className="text-2xl mb-1 font-light">Prayer times</h1>
        <h2 className="text-3xl font-bold mb-2">Masjid Tawheed Was-Sunnah</h2>
        <p className="text-sm opacity-90 mb-1">{gregorianDate}</p>
        <p className="text-sm hijri-date-arabic opacity-90">{hijriDate}</p>
      </div>

      <div className="text-center text-white mb-6">
        <p className="text-lg font-light mb-2">
          {isIqamahCountdown ? 'IQAMAH at MTWS IN:' : `The prayer of ${nextPrayer?.name} is in`}
        </p>
        <div className="flex justify-center gap-2">
          <div className="text-4xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
          <div className="text-4xl font-bold">:</div>
          <div className="text-4xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
          <div className="text-4xl font-bold">:</div>
          <div className="text-4xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
        </div>
        <div className="flex justify-center gap-2 text-xs font-light mt-1">
          <div className="w-12 text-center">Hours</div>
          <div className="w-12 text-center">Minutes</div>
          <div className="w-12 text-center">Seconds</div>
        </div>
      </div>

      <div className="wavy-divider mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#FFFFFF" fillOpacity="0.3"
            d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,197.3C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
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
        
        <div className="prayer-card flex flex-col w-full">
          <div className="prayer-name text-base">JUMUAH</div>
          <div className="prayer-time text-2xl">1:00 PM</div>
          <div className="adhan-time">&nbsp;</div>
        </div>
      </div>
    </div>
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
    <div className={`prayer-card flex flex-col ${isActive ? 'active' : ''}`}>
      <div className="prayer-name text-base">{name}</div>
      <div className="prayer-time text-2xl">{iqamahTime}</div>
      {!isSunrise && <div className="adhan-time text-xs">{adhanTime}</div>}
      {isSunrise && <div className="adhan-time">&nbsp;</div>}
    </div>
  );
}

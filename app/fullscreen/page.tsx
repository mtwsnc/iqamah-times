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

      <div className="text-center text-white mb-12">
        <h1 className="text-5xl font-bold mb-4">Masjid Tawheed Was-Sunnah</h1>
        <p className="text-2xl opacity-90 mb-2">{gregorianDate}</p>
        <p className="text-2xl hijri-date-arabic opacity-90">{hijriDate}</p>
      </div>

      <div className="text-center text-white mb-16">
        <p className="text-3xl font-light mb-4">
          {isIqamahCountdown ? 'IQAMAH at MTWS IN:' : `The prayer of ${nextPrayer?.name} is in`}
        </p>
        <div className="flex justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-7xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
            <div className="text-2xl opacity-75 mt-2">Hours</div>
          </div>
          <div className="text-7xl font-bold">:</div>
          <div className="text-center">
            <div className="text-7xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
            <div className="text-2xl opacity-75 mt-2">Minutes</div>
          </div>
          <div className="text-7xl font-bold">:</div>
          <div className="text-center">
            <div className="text-7xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
            <div className="text-2xl opacity-75 mt-2">Seconds</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
        {[
          { name: 'FAJR', adhan: prayerData.fajr, iqamah: iqamahTimes?.fajr },
          { name: 'DHUHR', adhan: prayerData.dhuhr, iqamah: iqamahTimes?.dhuhr },
          { name: 'ASR', adhan: prayerData.asr, iqamah: iqamahTimes?.asr },
          { name: 'MAGHRIB', adhan: prayerData.maghrib, iqamah: iqamahTimes?.maghrib },
          { name: 'ISHA', adhan: prayerData.isha, iqamah: iqamahTimes?.isha }
        ].map((prayer) => (
          <div
            key={prayer.name}
            className={`prayer-card ${nextPrayer?.name === prayer.name ? 'active' : ''} p-8`}
          >
            <h3 className="prayer-name text-3xl font-bold mb-6">{prayer.name}</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-75 mb-1">ADHAN</div>
                <div className="text-4xl font-bold">{formatTo12Hour(prayer.adhan, prayer.name.toLowerCase())}</div>
              </div>
              <div>
                <div className="text-sm opacity-75 mb-1">IQAMAH</div>
                <div className="text-4xl font-bold">
                  {prayer.iqamah ? formatTo12Hour(prayer.iqamah, prayer.name.toLowerCase()) : formatTo12Hour(prayer.adhan, prayer.name.toLowerCase())}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import PrayerTimesDisplay from '@/components/PrayerTimesDisplay';
import { getPrayerTimesForDate, fetchIqamahTimes } from '@/lib/prayerTimesUtils';
import type { PrayerData, IqamahTimes } from '@/types/prayer';

export default function Home() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [iqamahTimes, setIqamahTimes] = useState<IqamahTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPrayerTimes() {
      try {
        const currentDate = new Date();
        
        // Fetch in parallel for better performance
        const [data, iqamah] = await Promise.all([
          getPrayerTimesForDate(currentDate),
          fetchIqamahTimes()
        ]);
        
        if (isMounted) {
          setPrayerData(data);
          setIqamahTimes(iqamah);
        }
      } catch (error) {
        console.error('Error loading prayer times:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPrayerTimes();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading prayer times...</div>
      </div>
    );
  }

  return (
    <PrayerTimesDisplay 
      prayerData={prayerData} 
      iqamahTimes={iqamahTimes}
    />
  );
}

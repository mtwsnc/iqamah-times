import { NextResponse } from 'next/server';
import { getPrayerTimesForDate, fetchIqamahTimes } from '@/lib/prayerTimesUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    const [prayerData, iqamahTimes] = await Promise.all([
      getPrayerTimesForDate(date),
      fetchIqamahTimes()
    ]);
    
    return NextResponse.json({
      prayer: 'dhuhr',
      adhan: prayerData.dhuhr,
      iqamah: iqamahTimes?.dhuhr || null,
      date: date.toISOString()
    });
  } catch (error) {
    console.error('Error fetching Dhuhr times:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Dhuhr times' },
      { status: 500 }
    );
  }
}

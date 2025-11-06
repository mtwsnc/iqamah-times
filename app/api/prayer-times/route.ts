import { NextResponse } from 'next/server';
import { getPrayerTimesForDate } from '@/lib/prayerTimes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    const prayerData = await getPrayerTimesForDate(date);
    
    return NextResponse.json(prayerData);
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer times' },
      { status: 500 }
    );
  }
}

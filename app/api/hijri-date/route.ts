import { NextResponse } from 'next/server';
import { fetchHijriDate } from '@/lib/prayerTimesUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    const hijriDate = await fetchHijriDate(date);
    
    return NextResponse.json({ hijriDate });
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Hijri date' },
      { status: 500 }
    );
  }
}

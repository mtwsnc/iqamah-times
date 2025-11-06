import { NextResponse } from 'next/server';
import { fetchIqamahTimes } from '@/lib/prayerTimesUtils';

export async function GET() {
  try {
    const iqamahTimes = await fetchIqamahTimes();
    
    if (!iqamahTimes) {
      return NextResponse.json(
        { error: 'Failed to fetch iqamah times from external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(iqamahTimes);
  } catch (error) {
    console.error('Error fetching iqamah times:', error);
    return NextResponse.json(
      { error: 'Failed to fetch iqamah times' },
      { status: 500 }
    );
  }
}

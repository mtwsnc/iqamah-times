import { NextResponse } from 'next/server';

export async function GET() {
  const content = `PRAYER TIMES API DOCUMENTATION
================================

Access adhan and iqamah times for MTWS (Durham, NC) through our REST API.

Adhan times are calculated using the ISNA method via the AlAdhan API.
Iqamah times are fetched live from the MTWS schedule.


ENDPOINTS
=========

GET /api/all
------------
All adhan and iqamah times for the day, plus Hijri date metadata.

Query parameters:
  date (optional) — ISO date string (YYYY-MM-DD). Defaults to today.

Example request:
  https://iqamah.mtws.org/api/all
  https://iqamah.mtws.org/api/all?date=2025-11-15

Example response:
  {
    "adhan": {
      "fajr": "05:30",
      "shurooq": "06:45",
      "dhuhr": "13:15",
      "asr": "16:30",
      "maghrib": "19:45",
      "isha": "21:00"
    },
    "iqamah": {
      "fajr": "6:00 AM",
      "dhuhr": "1:30 PM",
      "asr": "5:00 PM",
      "maghrib": "7:50 PM",
      "isha": "9:15 PM"
    },
    "metadata": {
      "date": "2025-11-06T00:00:00.000Z",
      "hijri": "4 Jumada al-Ula 1447",
      "weekday": "Thu"
    }
  }

Note: "iqamah" is null if the MTWS schedule is unavailable.


GET /api/prayer-times
---------------------
Full adhan timing object for a given date (all prayers).

Query parameters:
  date (optional) — ISO date string (YYYY-MM-DD). Defaults to today.

Example response:
  {
    "day": 6,
    "hijri": "4 Jumada al-Ula 1447",
    "weekday": "Thu",
    "fajr": "05:30",
    "sunrise": "06:45",
    "dhuhr": "13:15",
    "asr": "16:30",
    "maghrib": "19:45",
    "isha": "21:00",
    "isApproximate": false
  }

Note: "isApproximate" is true only when the upstream AlAdhan API is unreachable
and fallback times are returned.


GET /api/iqamah-times
---------------------
MTWS iqamah schedule for today (fetched live from the MTWS API).
No query parameters.

Example response:
  {
    "fajr": "6:00 AM",
    "dhuhr": "1:30 PM",
    "asr": "5:00 PM",
    "maghrib": "7:50 PM",
    "isha": "9:15 PM",
    "jumuah": "1:30 PM"
  }

Returns HTTP 503 if the upstream MTWS schedule is unavailable.


GET /api/hijri-date
-------------------
Hijri (Islamic) date for a given Gregorian date, using the UAQ calendar method.

Query parameters:
  date (optional) — ISO date string (YYYY-MM-DD). Defaults to today.

Example response:
  {
    "hijriDate": "الخميس 4 جمادى الأولى 1447"
  }


GET /api/fajr
GET /api/dhuhr
GET /api/asr
GET /api/maghrib
GET /api/isha
---------------------
Adhan and iqamah times for a single prayer.

Query parameters:
  date (optional) — ISO date string (YYYY-MM-DD). Defaults to today.

Example response (fajr):
  {
    "prayer": "fajr",
    "adhan": "05:30",
    "iqamah": "6:00 AM",
    "date": "2025-11-06T00:00:00.000Z"
  }

Note: "iqamah" is null if the MTWS schedule is unavailable.


GET /api/shurooq
----------------
Sunrise time only — no iqamah.

Query parameters:
  date (optional) — ISO date string (YYYY-MM-DD). Defaults to today.

Example response:
  {
    "prayer": "shurooq",
    "adhan": "06:45",
    "date": "2025-11-06T00:00:00.000Z"
  }


ERRORS
======

All endpoints return JSON error objects on failure:

  HTTP 500 — { "error": "Failed to fetch ..." }
  HTTP 503 — { "error": "Failed to fetch iqamah times from external API" }
             (only from /api/iqamah-times when upstream is down)


NOTES
=====

• Adhan times are in 24-hour format (HH:MM) from AlAdhan.
• Iqamah times are in 12-hour format (h:MM AM/PM) from the MTWS schedule.
• Location: Durham, NC (35.994, -78.8986), ISNA calculation method.
• All timestamps in responses are ISO 8601 UTC.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

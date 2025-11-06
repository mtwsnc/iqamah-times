export default function ApiDocumentation() {
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      padding: '2rem', 
      maxWidth: '900px', 
      margin: '0 auto',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.6'
    }}>
{`PRAYER TIMES API DOCUMENTATION
================================

Access prayer times (Adhan and Iqamah) for MTWS through our REST API endpoints.


ENDPOINTS
=========

GET /api/all
------------
Get all prayer times for the day

Example Request:
  /api/all

Example Response:
  {
    "adhan": {
      "fajr": "5:30",
      "shurooq": "6:45",
      "dhuhr": "1:15",
      "asr": "4:30",
      "maghrib": "7:45",
      "isha": "9:00"
    },
    "iqamah": {
      "fajr": "6:00 AM",
      "dhuhr": "1:30 PM",
      "asr": "5:00 PM",
      "maghrib": "7:50 PM",
      "isha": "9:15 PM"
    },
    "metadata": {
      "date": "2025-11-06T14:00:00.000Z",
      "hijri": "الأربعاء 4 جمادى الأولى 1447",
      "weekday": "Wed"
    }
  }


GET /api/fajr
-------------
Fajr prayer times

Example Request:
  /api/fajr

Example Response:
  {
    "prayer": "fajr",
    "adhan": "5:30",
    "iqamah": "6:00 AM",
    "date": "2025-11-06T14:00:00.000Z"
  }


GET /api/shurooq
----------------
Shurooq (Sunrise) time - ADHAN ONLY, NO IQAMAH

Example Request:
  /api/shurooq

Example Response:
  {
    "prayer": "shurooq",
    "adhan": "6:45",
    "date": "2025-11-06T14:00:00.000Z"
  }


GET /api/dhuhr
--------------
Dhuhr prayer times

Example Request:
  /api/dhuhr

Example Response:
  {
    "prayer": "dhuhr",
    "adhan": "1:15",
    "iqamah": "1:30 PM",
    "date": "2025-11-06T14:00:00.000Z"
  }


GET /api/asr
------------
Asr prayer times

Example Request:
  /api/asr

Example Response:
  {
    "prayer": "asr",
    "adhan": "4:30",
    "iqamah": "5:00 PM",
    "date": "2025-11-06T14:00:00.000Z"
  }


GET /api/maghrib
----------------
Maghrib prayer times

Example Request:
  /api/maghrib

Example Response:
  {
    "prayer": "maghrib",
    "adhan": "7:45",
    "iqamah": "7:50 PM",
    "date": "2025-11-06T14:00:00.000Z"
  }


GET /api/isha
-------------
Isha prayer times

Example Request:
  /api/isha

Example Response:
  {
    "prayer": "isha",
    "adhan": "9:00",
    "iqamah": "9:15 PM",
    "date": "2025-11-06T14:00:00.000Z"
  }


QUERY PARAMETERS
================

date (optional)
  Specify a date in ISO format (YYYY-MM-DD)
  If not provided, returns times for today
  
  Example:
    /api/fajr?date=2025-11-15


IMPORTANT NOTES
===============

• Shurooq endpoint only returns Adhan time (no Iqamah)
• All other prayer endpoints return both Adhan and Iqamah times
• Times are based on MTWS (Muslim Theological and Welfare Society) schedule
• All responses include ISO 8601 formatted date
• All endpoints return JSON format
`}
    </pre>
  );
}

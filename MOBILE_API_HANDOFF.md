# Mobile API Handoff

This document is the API-side implementation handoff for the Expo mobile app in [`mtwsnc/iqamah-mobile`](https://github.com/mtwsnc/iqamah-mobile).

## Ownership

The mobile app is a client. This Next.js repository owns the official MTWS data contract and provider integrations.

The API must not implement Travel Mode. Travel Mode runs on-device using location and the `adhan` library so user coordinates never leave the phone.

## Endpoint

Add:

```text
GET /api/v1/today
GET /api/v1/today?date=YYYY-MM-DD
```

Rules:

- The MTWS timezone is always `America/New_York`.
- Without `date`, resolve “today” in the MTWS timezone, not the request device timezone.
- With `date`, interpret the value as a Durham local calendar date.
- Do not accept latitude/longitude or a mode parameter on this official endpoint.
- Existing API routes may remain temporarily while the website migrates.

## Response contract

Use one time value shape everywhere:

```ts
interface TimeValue {
  time: string // local MTWS time, HH:mm
  at: string // absolute ISO timestamp in UTC
}
```

Response shape:

```ts
interface TodayResponse {
  date: string
  timezone: "America/New_York"
  weekday: string
  hijri: {
    day: number
    month: string
    monthArabic: string
    year: number
    formatted: string
    formattedArabic: string
  }
  adhan: {
    fajr: TimeValue
    sunrise: TimeValue
    dhuhr: TimeValue
    asr: TimeValue
    maghrib: TimeValue
    isha: TimeValue
  }
  iqamah: {
    fajr: TimeValue
    dhuhr: TimeValue
    asr: TimeValue
    maghrib: TimeValue
    isha: TimeValue
  }
  jumuah: TimeValue
  meta: {
    isApproximate: boolean
    generatedAt: string
  }
}
```

`jumuah` is always included, even on non-Friday dates. The app controls whether and how it is displayed.

## Current code to refactor

[`lib/prayerTimesUtils.ts`](/Users/abumusa/dev/iqamah-times/lib/prayerTimesUtils.ts) currently mixes server provider calls, client-safe formatting, date parsing, and fallback behavior.

Split responsibilities so client components do not own provider fetching:

```text
lib/
├── prayer-time.ts
└── server/
    ├── fetch-adhan-times.ts
    ├── fetch-iqamah-times.ts
    ├── fetch-hijri-date.ts
    └── build-today-response.ts

app/api/v1/today/route.ts
```

The route should only parse the request, resolve the Durham date, call the server fetchers, build the response, and return consistent errors.

## Required behavior

1. Fetch adhan data from the existing Aladhan integration using the explicit Durham date.
2. Fetch iqamah data on the server; pass the requested date into day selection instead of using the server/device `new Date()` implicitly.
3. Normalize every provider time to `HH:mm`.
4. Generate an absolute UTC `at` timestamp for every adhan, iqamah, and Jumuah value using `America/New_York`.
5. Include English and Arabic Hijri fields from the Hijri response.
6. Keep official Jumuah at the configured MTWS value (`13:00` unless the source changes).
7. Preserve approximate/fallback behavior and expose it through `meta.isApproximate`.
8. Keep provider secrets and provider URLs server-side.

## Website migration order

1. Add `/api/v1/today` without removing existing routes.
2. Verify the endpoint for today, a supplied date, Friday, DST dates, and provider failure.
3. Migrate the website and fullscreen page to the new contract.
4. Confirm the website still displays official MTWS values.
5. Remove duplicated legacy routes only after mobile is consuming the versioned endpoint.

## API-side non-goals

- Do not add location-based calculations to Next.js.
- Do not add the `adhan` mobile dependency to this repository.
- Do not implement widgets, Live Activities, push notifications, or user accounts in this phase.
- Do not change the website’s visual design as part of the API work.

## Verification checklist

- `GET /api/v1/today` uses today in Durham.
- `GET /api/v1/today?date=YYYY-MM-DD` is deterministic.
- Returned `at` values cross DST correctly.
- Jumuah is present on every response.
- Provider failure does not silently produce official-looking data.
- Existing website routes remain functional during migration.

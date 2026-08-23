# MTWS Expo Mobile App Plan

Status: planning only. No mobile code has been implemented yet.

Last updated: 2026-08-23

## Product boundary

- Keep the existing Next.js website as a long-term product.
- Keep Next.js as the official MTWS API/backend.
- Build a separate Expo/React Native mobile client for iOS and Android.
- The mobile app must not call Aladhan or the iqamah provider directly.
- The repository currently contains the website and an Android APK, but no Android source project to port.

## Repository layout

Use separate repositories:

- `mtwsnc/iqamah-times`: existing Next.js website and official API.
- New repo: `mtwsnc/iqamah-mobile`: Expo iOS/Android app. Created as a public empty repository with default branch `main`.

The mobile repository should consume the versioned HTTPS API and should not import source files from the website repository. This keeps Expo tooling, native build configuration, and Alex’s handoff independent from the website while preserving a clear API contract between them.

## Collaboration

- GitHub invitation sent to `@liuhalex` for the `mtwsnc` organization.
- Invitation is pending acceptance.
- After acceptance, grant repository write access; the current `All` organization team is pull-only.
- Continue planning before scaffolding or installing dependencies.

## API boundary

The mobile app should consume one stable endpoint:

```text
GET /api/v1/today
GET /api/v1/today?date=YYYY-MM-DD
```

The optional date is interpreted in the MTWS timezone, not the device timezone.

The API is the source of truth for official MTWS mode. Existing endpoints remain temporarily so the website does not break during migration.

## Response contract

The response should include:

- `date`: `YYYY-MM-DD` in Durham
- `timezone`: `America/New_York`
- `weekday`
- English and Arabic Hijri fields
- Adhan times
- Official MTWS iqamah times
- `jumuah` on every response, even when it is not Friday
- `meta.isApproximate`
- `meta.generatedAt`

All display times use local `HH:mm` values. Each event also needs an absolute `at` timestamp for countdown calculations and DST-safe behavior.

Example event shape:

```json
{
  "time": "05:12",
  "at": "2026-08-23T09:12:00.000Z"
}
```

## Server reorganization

The current `lib/prayerTimesUtils.ts` mixes provider requests, parsing, formatting, and client-safe helpers.

Proposed separation:

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

The route should only parse the request, resolve the Durham date, call the server fetchers, build the contract, and return consistent errors.

## Local/travel mode

Local mode belongs entirely to the Expo app:

```text
Expo app → device location → local adhan calculation
                         → approximate iqamah calculation
```

- Do not send user coordinates to the Next.js website.
- Request foreground location only while the app is in use.
- Do not use background location tracking.
- Request location so the app can suggest Travel Mode automatically.
- If permission is denied, keep official MTWS mode available.
- Keep manual mode buried in developer settings for testing.
- Store the last successful coordinates and timestamp locally.
- Use cached location immediately on app open, then request a fresh foreground fix.
- If a fresh fix fails, keep the current mode and use the cached location.
- Show when the cached location was last updated.
- Never switch modes automatically using stale location data.

First-launch location UX:

- Show an in-app explanation before the system permission dialog.
- Explain that location is read only while the app is open and is not sent to the website.
- If granted, load MTWS mode and evaluate distance.
- If the user is more than 100 miles away, show the Travel Mode prompt.
- If denied, continue in MTWS mode without repeatedly prompting on every launch.

Local persistence for v1 uses `AsyncStorage` behind a small `LocalStore` module. Store last-known location, timestamps, mode decisions, and cached schedules. If widgets later require iOS App Group storage, replace the storage implementation behind this boundary rather than changing business logic.

Local adhan calculations use the `adhan` JavaScript library with `CalculationMethod.NorthAmerica()` (ISNA) as the default.

Local iqamah offsets:

```text
Fajr:    +30 minutes
Dhuhr:   +30 minutes
Asr:     +10 minutes
Maghrib: +5 minutes
Isha:    +10 minutes
```

Add the offset first, then round the final iqamah time to the nearest five minutes. Mark all local iqamah values as approximate.

Jumuah behavior:

- MTWS/home mode shows the regular `JUMUAH` card with the official MTWS time.
- Travel Mode shows `JUMUAH @ MTWS` with the official MTWS time; it does not invent a local Jumuah time.

## Automatic mode suggestion

Use MTWS coordinates from the current app (`35.994, -78.8986`) as the distance reference.

- More than 100 miles away: ask whether to switch to Travel Mode.
- If Travel Mode is active, keep it active until the user is within 50 miles.
- Within 50 miles: automatically return to MTWS mode.
- Between 50 and 100 miles: keep the current mode unchanged.
- If the user declines Travel Mode, suppress repeat prompts until the 200-mile threshold.
- More than 200 miles away: switch to Travel Mode with a clear explanation.
- This hysteresis prevents GPS variation from flipping modes repeatedly.

Suggested prompt:

> You appear to be more than 100 miles from MTWS. Would you like to switch to Travel Mode? Travel Mode calculates adhan times for your current location and estimates iqamah using approximate offsets.

If Travel Mode is forced, provide a visible `Use MTWS Times` escape hatch for unusual cases without exposing general manual mode in normal settings.

## Widgets and Live Activities

Widgets and Live Activities are follow-up work, not part of the first release.

The app should still store the current calculated schedule in an extension-friendly local format so future extensions can read it without requesting location themselves.

- iOS widget and Live Activity can consume the cached schedule.
- The app refreshes location and recalculates when opened or manually refreshed.
- No background location is required for the initial widget/Live Activity design.
- Android widget support will require a separate native integration later.

## Initial release scope

The first milestone is an installable Expo app on iOS and Android that:

1. Shows official MTWS prayer and iqamah times.
2. Requests foreground location and suggests Travel Mode when more than 100 miles away.
3. Calculates local adhan times on-device using ISNA.
4. Estimates local iqamah times using the agreed offsets.
5. Shows countdowns using absolute event timestamps.
6. Handles loading, errors, fallback data, Friday Jumuah, DST, and the 50-mile return threshold.

## Mobile navigation

This is a planning suggestion, not a visual or navigation specification. Alex can redesign the screen hierarchy, navigation, layout, typography, and interaction patterns as long as the MTWS brand and functional requirements remain intact.

Suggested v1 information architecture:

```text
Today screen
├── Current mode/status banner
├── Gregorian and Hijri dates
├── Countdown
├── Prayer cards
└── Jumuah card

Settings screen
└── Developer/testing controls only for now
```

The app must communicate the active mode and whether iqamah values are approximate, but the visual treatment is open to Alex’s design decisions.

## Open decisions

- Decide when to migrate the website from existing endpoints to `/api/v1/today`.

## References

- [Mobile API handoff](MOBILE_API_HANDOFF.md)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo Widgets](https://docs.expo.dev/versions/latest/sdk/widgets/)
- [Expo config plugins](https://docs.expo.dev/config-plugins/introduction/)
- [Apple ActivityKit](https://developer.apple.com/documentation/ActivityKit)
- [Adhan JS](https://www.npmjs.com/package/adhan)
- [Adhan calculation methods](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md)

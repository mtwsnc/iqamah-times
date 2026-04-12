# Iqamah Times Email Ingestion Plan

## Architecture

```
Mailing list email
  → Cloudflare Email Worker
    → forwards parsed payload to POST /api/ingest-iqamah
      → parse PDF attachment
        → extract times (regex, format-aware)
          → upsert to Supabase (existing project)
            → /api/iqamah-times reads latest row
```

---

## Known PDF Formats

Three formats have been observed — the parser must handle all of them:

**Regular** — single time per prayer:
```
Salaatul Fajr      6:10 AM
Salaatul Magrib    7:50 PM
```

**Maghrib split** — arbitrary day boundary:
```
Salaatul Magrib    M-Th    7:55 PM
                   F-Sun   8:00 PM

Salaatul Magrib    M-W     7:35 PM
                   Th-Sun  7:40 PM
```

**Full column split** — DST weeks, every prayer has two columns, Maghrib may also be split within:
```
                   Mon-Sat    Sunday*
Salaatul Fajr      6:00 AM    7:00 AM
Salaatul Magrib    M-Th 6:20 PM    7:25 PM
                   F-Sa 6:25 PM
Salaatul Ishaa     7:55 PM    8:55 PM
```

---

## Ingest API Route — `POST /api/ingest-iqamah`

1. Verify shared secret header (set in both the Worker and Vercel env)
2. Receive PDF attachment as base64 from the Worker
3. Run `pdf-parse` to extract raw text
4. Detect format from text
5. Parse into a per-day schedule object
6. Upsert into Supabase on `week_start`

**Parsing principles — layout-agnostic:**
- Match prayer names loosely by keyword, not exact string (`fajr`, `thuhr`/`dhuhr`/`zuhr`, `asr`, `maghr`/`maghrib`, `isha`/`ishaa`) — case-insensitive
- Never rely on column position, whitespace alignment, or indentation
- Extract times by pattern (`\d{1,2}:\d{2}\s*(AM|PM)`) — find all time tokens on a line, not by offset
- Extract day ranges by pattern (`M-Th`, `F-Sun`, `Th-Sun`, `Mon-Sat`, `Sunday`, etc.) — case-insensitive, partial match
- Ignore footnotes, asterisks, and annotation lines (`*Daylight Saving Time`, etc.)

**Format detection — based on content, not structure:**
- If any line contains two time values → two-column mode (e.g. DST week)
- Else if any prayer line (or the line after it) contains a day range token → split mode
- Else → regular mode

If parsing fails for any reason: log the raw text, return 200 to the Worker (so it doesn't retry), keep the last good row intact.

---

## PDF Parsing — Per-Day Schedule

Since the split boundary is arbitrary (M-Th, M-W, F-Sa, Th-Sun, etc.) and DST weeks can change every prayer, store a full per-day schedule. The parser maps each named range to individual days:

```
M / Mon         → mon
T / Tue         → tue
W / Wed         → wed
Th / Thu        → thu
F / Fri         → fri
Sa / Sat        → sat
Sun             → sun
```

Output shape:
```json
{
  "mon": { "fajr": "6:00 AM", "dhuhr": "12:45 PM", "asr": "4:00 PM", "maghrib": "6:20 PM", "isha": "7:55 PM" },
  "tue": { "fajr": "6:00 AM", "dhuhr": "12:45 PM", "asr": "4:00 PM", "maghrib": "6:20 PM", "isha": "7:55 PM" },
  ...
  "sun": { "fajr": "7:00 AM", "dhuhr": "1:45 PM",  "asr": "5:00 PM", "maghrib": "7:25 PM", "isha": "8:55 PM" }
}
```

---

## Cloudflare Email Worker Setup

- Domain DNS already on Cloudflare
- Create an Email Worker in the Cloudflare dashboard
- Set up an email routing rule: emails to `iqamah@yourdomain.com` → Worker
- Worker receives the raw email (MIME), extracts the PDF attachment, POSTs to `/api/ingest-iqamah` with a shared secret header
- No third-party service, no signup, fully free

**Env vars on the Worker:**
```
INGEST_SECRET=your-shared-secret
INGEST_URL=https://yourdomain.com/api/ingest-iqamah
```

---

## Database — Supabase (existing project)

```sql
CREATE TABLE iqamah_schedule (
  id         SERIAL PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  week_end   DATE NOT NULL,
  schedule   JSONB NOT NULL,
  parsed_at  TIMESTAMPTZ DEFAULT now()
);
```

On each new email, upsert on `week_start`. Latest row wins.

**Env vars to add to Vercel:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
INGEST_SECRET=your-shared-secret
```

---

## Update `fetchIqamahTimes()`

Query Supabase for the latest row, pick the right day from `schedule` based on `date.getDay()`:

```
0 → sun  1 → mon  2 → tue  3 → wed  4 → thu  5 → fri  6 → sat
```

---

## Edge Cases

- **Email late** — serve previous week's row, no expiry
- **DST week** — full two-column format, per-day schema handles it
- **Arbitrary Maghrib split** — any day boundary, mapped to individual days
- **Parse failure** — log raw text, keep last good row, return 200 to Worker
- **Duplicate email** — upsert on `week_start`, idempotent
- **Week is Mon–Sun** — use `week_start` (Monday) as anchor

---

## Costs

**Cloudflare Email Workers** — ~4 emails/month → Free
**Supabase** — 1 table in existing project → Free (no extra cost)
**pdf-parse** — npm package → Free
**Vercel** — 1 new API route → Free (existing deploy)

**Total: $0/month**

---

## Checklist

- [ ] Run migration in existing Supabase project
- [ ] Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `INGEST_SECRET` to Vercel env vars
- [ ] Set up Cloudflare Email Worker + routing rule for `iqamah@yourdomain.com`
- [ ] Build `/api/ingest-iqamah` route
- [ ] Update `fetchIqamahTimes()` to read from Supabase
- [ ] Add `iqamah@yourdomain.com` to the mailing list
- [ ] Test with each of the 3 PDF formats

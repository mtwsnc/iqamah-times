[![Netlify Status](https://api.netlify.com/api/v1/badges/81a4f446-6af6-4cd4-9fd8-f8be989583d4/deploy-status)](https://app.netlify.com/sites/mtws-iqamah/deploys)

# MTWS Iqāmah Times - Next.js

A modern Next.js application for displaying prayer times for Masjid Tawheed Was-Sunnah in Durham, NC.

## Features

- 🕌 Real-time prayer times display with countdown
- 📅 Hijri date integration
- 📱 Responsive design for all devices
- 🔔 Iqamah times from external API
- 📲 Android app download support
- 🎨 Beautiful UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/iqamah-times.git
cd iqamah-times
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
iqamah-times/
├── app/
│   ├── api/              # API routes
│   │   ├── prayer-times/ # Prayer times endpoint
│   │   ├── iqamah-times/ # Iqamah times endpoint
│   │   └── hijri-date/   # Hijri date endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   └── PrayerTimesDisplay.tsx  # Main prayer times component
├── lib/
│   ├── prayerTimes.ts    # Prayer times utilities
│   └── prayerTimesData.ts # Static prayer times data
├── types/
│   └── prayer.ts         # TypeScript types
└── public/               # Static assets

```

## API Routes

The application provides the following API endpoints:

### GET /api/prayer-times
Fetches prayer times for a specific date.

**Query Parameters:**
- `date` (optional): Date in ISO format (defaults to current date)

**Response:**
```json
{
  "day": 15,
  "hijri": "17/11",
  "weekday": "Thu",
  "fajr": "4:49",
  "sunrise": "6:10",
  "dhuhr": "1:12",
  "asr": "5:00",
  "maghrib": "8:14",
  "isha": "9:36"
}
```

### GET /api/iqamah-times
Fetches iqamah times from the external API.

**Response:**
```json
{
  "fajr": "5:45 AM",
  "dhuhr": "1:45 PM",
  "asr": "5:15 PM",
  "maghrib": "8:10 PM",
  "isha": "9:35 PM",
  "jumuah": "1:30 PM"
}
```

### GET /api/hijri-date
Fetches the Hijri date for a specific Gregorian date.

**Query Parameters:**
- `date` (optional): Date in ISO format (defaults to current date)

**Response:**
```json
{
  "hijriDate": "الأربعاء 2 ذو القعدة 1446"
}
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Netlify. The build settings are:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Framework**: Next.js

## Updating Prayer Times

Prayer times are currently stored in `lib/prayerTimesData.ts`. To add new months:

1. Update the `PRAYER_TIMES_DATA` object with new month data
2. Follow the existing format for consistency
3. Commit and deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please contact Masjid Tawheed Was-Sunnah:
- Website: [mtws.one](https://mtws.one)
- Website: [mtws.org](https://mtws.org)
- Address: 3714 South Alston Avenue, Durham, NC, USA

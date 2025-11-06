export default function ApiDocumentation() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">Prayer Times API Documentation</h1>
          <p className="text-gray-600 text-lg mb-6">
            Access prayer times (Adhan and Iqamah) for MTWS through our REST API endpoints.
          </p>
        </div>

        {/* All Prayer Times */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-mono text-sm font-semibold">GET</span>
            <h2 className="text-2xl font-bold text-gray-800">/api/all</h2>
          </div>
          <p className="text-gray-600 mb-4">Get all prayer times for the day</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500 mb-2">Example Request:</p>
            <code className="text-sm text-emerald-700 break-all">{baseUrl}/api/all</code>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Response:</p>
            <pre className="text-xs overflow-x-auto">
{`{
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
}`}
            </pre>
          </div>
        </div>

        {/* Individual Prayer Endpoints */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Individual Prayer Endpoints</h2>
          
          {[
            { name: 'Fajr', endpoint: '/api/fajr', hasIqamah: true },
            { name: 'Shurooq (Sunrise)', endpoint: '/api/shurooq', hasIqamah: false },
            { name: 'Dhuhr', endpoint: '/api/dhuhr', hasIqamah: true },
            { name: 'Asr', endpoint: '/api/asr', hasIqamah: true },
            { name: 'Maghrib', endpoint: '/api/maghrib', hasIqamah: true },
            { name: 'Isha', endpoint: '/api/isha', hasIqamah: true },
          ].map((prayer) => (
            <div key={prayer.endpoint} className="mb-6 last:mb-0 border-b last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-mono text-sm font-semibold">GET</span>
                <h3 className="text-xl font-semibold text-gray-800">{prayer.endpoint}</h3>
              </div>
              <p className="text-gray-600 mb-3">{prayer.name} prayer times</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="text-sm text-gray-500 mb-2">Example Request:</p>
                <code className="text-sm text-emerald-700 break-all">{baseUrl}{prayer.endpoint}</code>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Response:</p>
                <pre className="text-xs overflow-x-auto">
{prayer.hasIqamah ? `{
  "prayer": "${prayer.endpoint.replace('/api/', '')}",
  "adhan": "5:30",
  "iqamah": "6:00 AM",
  "date": "2025-11-06T14:00:00.000Z"
}` : `{
  "prayer": "shurooq",
  "adhan": "6:45",
  "date": "2025-11-06T14:00:00.000Z"
}`}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Query Parameters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Query Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">date</code>
                <span className="text-sm text-gray-500">(optional)</span>
              </div>
              <p className="text-gray-600 ml-2">
                Specify a date in ISO format (YYYY-MM-DD). If not provided, returns times for today.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mt-2 ml-2">
                <p className="text-sm text-gray-500 mb-1">Example:</p>
                <code className="text-sm text-emerald-700 break-all">{baseUrl}/api/fajr?date=2025-11-15</code>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Important Notes</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span><strong>Shurooq</strong> endpoint only returns Adhan time (no Iqamah)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>All other prayer endpoints return both Adhan and Iqamah times</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Times are based on MTWS (Muslim Theological and Welfare Society) schedule</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>All responses include ISO 8601 formatted date</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

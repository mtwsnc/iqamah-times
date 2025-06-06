// API URL for fetching prayer times
const apiUrl = 'https://northerly-robin-8705.dataplicity.io/mtws-iqaamah-times/all';

// Prayer names mapping
const PRAYER_NAMES = {
    FAJR: 'Fajr',
    SUNRISE: 'Shuruq',
    DHUHR: 'Dhuhr',
    ASR: 'Asr',
    MAGHRIB: 'Maghrib',
    ISHA: 'Isha'
};

// Sample prayer times (hardcoded for testing)
const SAMPLE_PRAYER_TIMES = {
    fajr: { time: '5:45 AM', iqamah: '5:45 AM' },
    sunrise: { time: '6:25 AM', iqamah: '' },
    dhuhr: { time: '1:45 PM', iqamah: '1:45 PM' },
    asr: { time: '5:15 PM', iqamah: '5:15 PM' },
    maghrib: { time: '8:10 PM', iqamah: '8:10 PM' },
    isha: { time: '9:35 PM', iqamah: '9:35 PM' },
    jumuah: { time: '1:00 PM', iqamah: '1:30 PM' }
};

// Debug mode flag
let isDebugMode = false;

// Admin mode flag
let isAdminMode = false;

// For testing - use a specific date
const TEST_DATE = new Date(2023, 4, 15); // May 15, 2023

// Get the current date
const CURRENT_DATE = new Date();

// Store Iqamah times fetched from API
let iqamahTimes = null;

// Store prayer times loaded from markdown files
let loadedPrayerTimes = {};

// Cache to store loaded markdown content
const markdownCache = {};

// May and June prayer times from markdown files
const MAY_PRAYER_TIMES = [
    { day: 1, hijri: "3/11", weekday: "Thu", fajr: "5:06", sunrise: "6:23", dhuhr: "1:13", asr: "4:59", maghrib: "8:03", isha: "9:21" },
    { day: 2, hijri: "4/11", weekday: "Fri", fajr: "5:04", sunrise: "6:22", dhuhr: "1:13", asr: "4:59", maghrib: "8:04", isha: "9:22" },
    { day: 3, hijri: "5/11", weekday: "Sat", fajr: "5:03", sunrise: "6:21", dhuhr: "1:13", asr: "4:59", maghrib: "8:04", isha: "9:23" },
    { day: 4, hijri: "6/11", weekday: "Sun", fajr: "5:02", sunrise: "6:20", dhuhr: "1:13", asr: "4:59", maghrib: "8:05", isha: "9:24" },
    { day: 5, hijri: "7/11", weekday: "Mon", fajr: "5:01", sunrise: "6:19", dhuhr: "1:13", asr: "4:59", maghrib: "8:06", isha: "9:25" },
    { day: 6, hijri: "8/11", weekday: "Tue", fajr: "4:59", sunrise: "6:18", dhuhr: "1:13", asr: "4:59", maghrib: "8:07", isha: "9:26" },
    { day: 7, hijri: "9/11", weekday: "Wed", fajr: "4:58", sunrise: "6:17", dhuhr: "1:13", asr: "4:59", maghrib: "8:08", isha: "9:27" },
    { day: 8, hijri: "10/11", weekday: "Thu", fajr: "4:57", sunrise: "6:16", dhuhr: "1:13", asr: "4:59", maghrib: "8:09", isha: "9:29" },
    { day: 9, hijri: "11/11", weekday: "Fri", fajr: "4:56", sunrise: "6:15", dhuhr: "1:13", asr: "5:00", maghrib: "8:10", isha: "9:30" },
    { day: 10, hijri: "12/11", weekday: "Sat", fajr: "4:54", sunrise: "6:14", dhuhr: "1:13", asr: "5:00", maghrib: "8:10", isha: "9:31" },
    { day: 11, hijri: "13/11", weekday: "Sun", fajr: "4:53", sunrise: "6:13", dhuhr: "1:13", asr: "5:00", maghrib: "8:11", isha: "9:32" },
    { day: 12, hijri: "14/11", weekday: "Mon", fajr: "4:52", sunrise: "6:12", dhuhr: "1:12", asr: "5:00", maghrib: "8:12", isha: "9:33" },
    { day: 13, hijri: "15/11", weekday: "Tue", fajr: "4:51", sunrise: "6:12", dhuhr: "1:12", asr: "5:00", maghrib: "8:13", isha: "9:34" },
    { day: 14, hijri: "16/11", weekday: "Wed", fajr: "4:50", sunrise: "6:11", dhuhr: "1:12", asr: "5:00", maghrib: "8:14", isha: "9:35" },
    { day: 15, hijri: "17/11", weekday: "Thu", fajr: "4:49", sunrise: "6:10", dhuhr: "1:12", asr: "5:00", maghrib: "8:14", isha: "9:36" },
    { day: 16, hijri: "18/11", weekday: "Fri", fajr: "4:48", sunrise: "6:09", dhuhr: "1:12", asr: "5:01", maghrib: "8:15", isha: "9:37" },
    { day: 17, hijri: "19/11", weekday: "Sat", fajr: "4:47", sunrise: "6:08", dhuhr: "1:12", asr: "5:01", maghrib: "8:16", isha: "9:38" },
    { day: 18, hijri: "20/11", weekday: "Sun", fajr: "4:46", sunrise: "6:08", dhuhr: "1:13", asr: "5:01", maghrib: "8:17", isha: "9:39" },
    { day: 19, hijri: "21/11", weekday: "Mon", fajr: "4:45", sunrise: "6:07", dhuhr: "1:13", asr: "5:01", maghrib: "8:18", isha: "9:41" },
    { day: 20, hijri: "22/11", weekday: "Tue", fajr: "4:44", sunrise: "6:06", dhuhr: "1:13", asr: "5:01", maghrib: "8:18", isha: "9:42" },
    { day: 21, hijri: "23/11", weekday: "Wed", fajr: "4:43", sunrise: "6:06", dhuhr: "1:13", asr: "5:01", maghrib: "8:19", isha: "9:43" },
    { day: 22, hijri: "24/11", weekday: "Thu", fajr: "4:42", sunrise: "6:05", dhuhr: "1:13", asr: "5:01", maghrib: "8:20", isha: "9:44" },
    { day: 23, hijri: "25/11", weekday: "Fri", fajr: "4:41", sunrise: "6:04", dhuhr: "1:13", asr: "5:02", maghrib: "8:21", isha: "9:45" },
    { day: 24, hijri: "26/11", weekday: "Sat", fajr: "4:40", sunrise: "6:04", dhuhr: "1:13", asr: "5:02", maghrib: "8:22", isha: "9:46" },
    { day: 25, hijri: "27/11", weekday: "Sun", fajr: "4:39", sunrise: "6:03", dhuhr: "1:13", asr: "5:02", maghrib: "8:22", isha: "9:47" },
    { day: 26, hijri: "28/11", weekday: "Mon", fajr: "4:39", sunrise: "6:03", dhuhr: "1:13", asr: "5:02", maghrib: "8:23", isha: "9:48" },
    { day: 27, hijri: "29/11", weekday: "Tue", fajr: "4:38", sunrise: "6:02", dhuhr: "1:13", asr: "5:02", maghrib: "8:24", isha: "9:49" },
    { day: 28, hijri: "1/12", weekday: "Wed", fajr: "4:37", sunrise: "6:02", dhuhr: "1:13", asr: "5:03", maghrib: "8:24", isha: "9:49" },
    { day: 29, hijri: "2/12", weekday: "Thu", fajr: "4:37", sunrise: "6:01", dhuhr: "1:13", asr: "5:03", maghrib: "8:25", isha: "9:50" },
    { day: 30, hijri: "3/12", weekday: "Fri", fajr: "4:36", sunrise: "6:01", dhuhr: "1:14", asr: "5:03", maghrib: "8:26", isha: "9:51" },
    { day: 31, hijri: "4/12", weekday: "Sat", fajr: "4:35", sunrise: "6:00", dhuhr: "1:14", asr: "5:03", maghrib: "8:26", isha: "9:52" }
];

const JUNE_PRAYER_TIMES = [
    { day: 1, hijri: "5/12", weekday: "Sun", fajr: "4:35", sunrise: "6:00", dhuhr: "1:14", asr: "5:03", maghrib: "8:27", isha: "9:53" },
    { day: 2, hijri: "6/12", weekday: "Mon", fajr: "4:34", sunrise: "6:00", dhuhr: "1:14", asr: "5:04", maghrib: "8:28", isha: "9:54" },
    { day: 3, hijri: "7/12", weekday: "Tue", fajr: "4:34", sunrise: "5:59", dhuhr: "1:14", asr: "5:04", maghrib: "8:28", isha: "9:55" },
    { day: 4, hijri: "8/12", weekday: "Wed", fajr: "4:33", sunrise: "5:59", dhuhr: "1:14", asr: "5:04", maghrib: "8:29", isha: "9:55" },
    { day: 5, hijri: "9/12", weekday: "Thu", fajr: "4:33", sunrise: "5:59", dhuhr: "1:15", asr: "5:04", maghrib: "8:30", isha: "9:56" },
    { day: 6, hijri: "10/12", weekday: "Fri", fajr: "4:33", sunrise: "5:59", dhuhr: "1:15", asr: "5:04", maghrib: "8:30", isha: "9:57" },
    { day: 7, hijri: "11/12", weekday: "Sat", fajr: "4:32", sunrise: "5:58", dhuhr: "1:15", asr: "5:05", maghrib: "8:31", isha: "9:58" },
    { day: 8, hijri: "12/12", weekday: "Sun", fajr: "4:32", sunrise: "5:58", dhuhr: "1:15", asr: "5:05", maghrib: "8:31", isha: "9:58" },
    { day: 9, hijri: "13/12", weekday: "Mon", fajr: "4:32", sunrise: "5:58", dhuhr: "1:15", asr: "5:05", maghrib: "8:32", isha: "9:59" },
    { day: 10, hijri: "14/12", weekday: "Tue", fajr: "4:31", sunrise: "5:58", dhuhr: "1:15", asr: "5:05", maghrib: "8:32", isha: "10:00" },
    { day: 11, hijri: "15/12", weekday: "Wed", fajr: "4:31", sunrise: "5:58", dhuhr: "1:16", asr: "5:05", maghrib: "8:33", isha: "10:00" },
    { day: 12, hijri: "16/12", weekday: "Thu", fajr: "4:31", sunrise: "5:58", dhuhr: "1:16", asr: "5:06", maghrib: "8:33", isha: "10:01" },
    { day: 13, hijri: "17/12", weekday: "Fri", fajr: "4:31", sunrise: "5:58", dhuhr: "1:16", asr: "5:06", maghrib: "8:33", isha: "10:01" },
    { day: 14, hijri: "18/12", weekday: "Sat", fajr: "4:31", sunrise: "5:58", dhuhr: "1:16", asr: "5:06", maghrib: "8:34", isha: "10:02" },
    { day: 15, hijri: "19/12", weekday: "Sun", fajr: "4:31", sunrise: "5:58", dhuhr: "1:17", asr: "5:06", maghrib: "8:34", isha: "10:02" },
    { day: 16, hijri: "20/12", weekday: "Mon", fajr: "4:31", sunrise: "5:58", dhuhr: "1:17", asr: "5:07", maghrib: "8:35", isha: "10:03" },
    { day: 17, hijri: "21/12", weekday: "Tue", fajr: "4:31", sunrise: "5:58", dhuhr: "1:17", asr: "5:07", maghrib: "8:35", isha: "10:03" },
    { day: 18, hijri: "22/12", weekday: "Wed", fajr: "4:31", sunrise: "5:58", dhuhr: "1:17", asr: "5:07", maghrib: "8:35", isha: "10:03" },
    { day: 19, hijri: "23/12", weekday: "Thu", fajr: "4:31", sunrise: "5:58", dhuhr: "1:17", asr: "5:07", maghrib: "8:36", isha: "10:04" },
    { day: 20, hijri: "24/12", weekday: "Fri", fajr: "4:31", sunrise: "5:58", dhuhr: "1:18", asr: "5:07", maghrib: "8:36", isha: "10:04" },
    { day: 21, hijri: "25/12", weekday: "Sat", fajr: "4:32", sunrise: "5:59", dhuhr: "1:18", asr: "5:08", maghrib: "8:36", isha: "10:04" },
    { day: 22, hijri: "26/12", weekday: "Sun", fajr: "4:32", sunrise: "5:59", dhuhr: "1:18", asr: "5:08", maghrib: "8:36", isha: "10:04" },
    { day: 23, hijri: "27/12", weekday: "Mon", fajr: "4:32", sunrise: "5:59", dhuhr: "1:18", asr: "5:08", maghrib: "8:36", isha: "10:04" },
    { day: 24, hijri: "28/12", weekday: "Tue", fajr: "4:32", sunrise: "5:59", dhuhr: "1:18", asr: "5:08", maghrib: "8:37", isha: "10:05" },
    { day: 25, hijri: "29/12", weekday: "Wed", fajr: "4:33", sunrise: "6:00", dhuhr: "1:19", asr: "5:08", maghrib: "8:37", isha: "10:05" },
    { day: 26, hijri: "30/12", weekday: "Thu", fajr: "4:33", sunrise: "6:00", dhuhr: "1:19", asr: "5:09", maghrib: "8:37", isha: "10:05" },
    { day: 27, hijri: "1/1", weekday: "Fri", fajr: "4:34", sunrise: "6:00", dhuhr: "1:19", asr: "5:09", maghrib: "8:37", isha: "10:05" },
    { day: 28, hijri: "2/1", weekday: "Sat", fajr: "4:34", sunrise: "6:01", dhuhr: "1:19", asr: "5:09", maghrib: "8:37", isha: "10:05" },
    { day: 29, hijri: "3/1", weekday: "Sun", fajr: "4:34", sunrise: "6:01", dhuhr: "1:20", asr: "5:09", maghrib: "8:37", isha: "10:05" },
    { day: 30, hijri: "4/1", weekday: "Mon", fajr: "4:35", sunrise: "6:01", dhuhr: "1:20", asr: "5:09", maghrib: "8:37", isha: "10:04" }
];

// Debug hooks for testing
const debugHooks = {
    // Set custom date for testing
    setDate: function (year, month, day, hours = 0, minutes = 0) {
        const customDate = new Date(year, month - 1, day, hours, minutes);
        window.TESTING_DATE = customDate;
        console.log(`Debug: Set custom date to ${customDate.toLocaleString()}`);
        refreshWithCustomDate();
        return customDate;
    },

    // Set time to 5 minutes before a specific prayer
    setTimeBeforePrayer: function (prayerName, minutesBefore = 5) {
        // Use an async immediately-invoked function
        (async function () {
            const prayerData = await getPrayerTimesForDate(window.TESTING_DATE || CURRENT_DATE);
            const lowerPrayerName = prayerName.toLowerCase();

            if (!prayerData[lowerPrayerName]) {
                console.error(`Debug: Invalid prayer name: ${prayerName}`);
                return;
            }

            const prayerDate = createTimeDate(window.TESTING_DATE || CURRENT_DATE, prayerData[lowerPrayerName], lowerPrayerName);
            prayerDate.setMinutes(prayerDate.getMinutes() - minutesBefore);
            window.TESTING_DATE = prayerDate;
            console.log(`Debug: Set time to ${minutesBefore} minutes before ${prayerName}: ${prayerDate.toLocaleString()}`);
            refreshWithCustomDate();
            return prayerDate;
        })();
    },

    // Set custom prayer times for testing
    setPrayerTimes: function (customTimes) {
        window.CUSTOM_PRAYER_TIMES = customTimes;
        console.log('Debug: Set custom prayer times:', customTimes);
        refreshWithCustomDate();
        return customTimes;
    },

    // Reset debug mode (return to normal operation)
    reset: function () {
        window.TESTING_DATE = null;
        window.CUSTOM_PRAYER_TIMES = null;
        console.log('Debug: Reset to normal operation');
        window.location.reload();
    },

    // Test countdown with custom minutes
    testCountdown: function (minutes) {
        const milliseconds = minutes * 60 * 1000;
        console.log(`Debug: Testing countdown with ${minutes} minutes`);
        startCountdown(milliseconds, false);
        return milliseconds;
    },

    // Force highlight a specific prayer card
    highlightPrayer: function (prayerName) {
        resetPrayerCardStyles();
        const prayerCard = document.getElementById(`${prayerName.toLowerCase()}-card`);
        if (prayerCard) {
            prayerCard.classList.add('active');
            console.log(`Debug: Highlighted prayer card: ${prayerName}`);
        } else {
            console.error(`Debug: Prayer card not found: ${prayerName}`);
        }
    }
};

// Admin documentation HTML
const adminDocsHTML = `
<div id="admin-documentation" class="bg-white text-black p-6 my-4 rounded-lg shadow-lg max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-masjid-accent mb-4">Admin Documentation</h2>
    
    <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Updating Prayer Times</h3>
        <p class="mb-2">Prayer times are retrieved from two sources:</p>
        <ul class="list-disc pl-6 mb-4">
            <li class="mb-1"><strong>Adhan times:</strong> Stored in month-specific markdown files (may.md, june.md, etc.)</li>
            <li class="mb-1"><strong>Iqamah times:</strong> Retrieved from the API at <code class="bg-gray-100 px-1 rounded">${apiUrl}</code></li>
        </ul>
        <p class="mb-2"><strong>To update Adhan times:</strong></p>
        <ol class="list-decimal pl-6 mb-4">
            <li class="mb-1">Create or edit markdown files named after each month (e.g., <code>january.md</code>, <code>february.md</code>)</li>
            <li class="mb-1">Follow the table format: | Day | Hijri | Weekday | Fajr | Sunrise | Dhuhr | Asr | Maghrib | Isha |</li>
            <li class="mb-1">The system will automatically load the appropriate month file based on the current date</li>
            <li class="mb-1">Files are reloaded each time the page is refreshed</li>
        </ol>
        <p class="mb-2"><strong>To update Iqamah times:</strong></p>
        <ol class="list-decimal pl-6">
            <li class="mb-1">Access the API server and update the Iqamah times data</li>
            <li class="mb-1">The API returns times based on the day of the week</li>
            <li class="mb-1">The format should be an array of times: [Fajr, Dhuhr, Asr, Maghrib, Isha]</li>
        </ol>
    </div>
    
    <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">How the System Works</h3>
        <p class="mb-2">The application follows this workflow:</p>
        <ol class="list-decimal pl-6">
            <li class="mb-1">Loads prayer times from month files based on current date</li>
            <li class="mb-1">Fetches Iqamah times from the API</li>
            <li class="mb-1">Calculates which prayer is next</li>
            <li class="mb-1">Displays countdown to the next prayer time</li>
            <li class="mb-1">Highlights the card for the next prayer</li>
            <li class="mb-1">Automatically refreshes when the next prayer time is reached</li>
        </ol>
    </div>
    
    <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Fullscreen Mode</h3>
        <p class="mb-2">To use fullscreen mode:</p>
        <ol class="list-decimal pl-6">
            <li class="mb-1">Click the "Enter Fullscreen Mode" button at the bottom of the page</li>
            <li class="mb-1">Or navigate directly to <code class="bg-gray-100 px-1 rounded">fullscreen.html</code></li>
            <li class="mb-1">Press F11 in most browsers to enable browser fullscreen</li>
            <li class="mb-1">Ideal for displaying on mosque screens or digital signage</li>
        </ol>
    </div>
    
    <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Debug Hooks (Console)</h3>
        <p class="mb-2">Use these JavaScript console commands for testing:</p>
        <div class="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
            <div><span class="text-blue-600">window</span>.debug.setDate(<span class="text-green-600">2023, 5, 15</span>); <span class="text-gray-500">// Set custom date (year, month, day)</span></div>
            <div><span class="text-blue-600">window</span>.debug.setTimeBeforePrayer(<span class="text-green-600">'asr', 5</span>); <span class="text-gray-500">// Set time 5 min before Asr</span></div>
            <div><span class="text-blue-600">window</span>.debug.testCountdown(<span class="text-green-600">10</span>); <span class="text-gray-500">// Test countdown with 10 minutes</span></div>
            <div><span class="text-blue-600">window</span>.debug.highlightPrayer(<span class="text-green-600">'maghrib'</span>); <span class="text-gray-500">// Highlight Maghrib prayer card</span></div>
            <div><span class="text-blue-600">window</span>.debug.reset(); <span class="text-gray-500">// Reset to normal operation</span></div>
        </div>
    </div>
    
    <button onclick="hideAdminDocs()" class="bg-masjid-accent text-white py-2 px-4 rounded hover:bg-opacity-90 focus:outline-none">
        Close Documentation
    </button>
</div>
`;

// Check for URL parameters to enable debug/admin mode
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for debug mode
    if (urlParams.has('debug')) {
        isDebugMode = true;
        console.log('Debug mode enabled');
    }

    // Check for admin mode
    if (urlParams.has('admin') && urlParams.get('admin') === 'true') {
        const street = urlParams.get('street');
        if (street && street.toLowerCase().includes('south-alston')) {
            isAdminMode = true;
            console.log('Admin mode enabled');
            setTimeout(showAdminDocs, 500); // Show admin docs after a short delay
        }
    }
}

// Show admin documentation 
function showAdminDocs() {
    // Create container for admin docs if it doesn't exist
    let adminDocsContainer = document.getElementById('admin-documentation-container');
    if (!adminDocsContainer) {
        adminDocsContainer = document.createElement('div');
        adminDocsContainer.id = 'admin-documentation-container';

        // Find a good place to insert the docs (after the prayer cards)
        const container = document.querySelector('.max-w-4xl.mx-auto');
        if (container) {
            container.parentNode.insertBefore(adminDocsContainer, container.nextSibling);
        } else {
            document.querySelector('main').appendChild(adminDocsContainer);
        }
    }

    // Insert admin documentation
    adminDocsContainer.innerHTML = adminDocsHTML;

    // Show admin notice
    showAdminNotice('Admin mode enabled. Documentation is displayed below.');
}

// Hide admin documentation
function hideAdminDocs() {
    const adminDocsContainer = document.getElementById('admin-documentation-container');
    if (adminDocsContainer) {
        adminDocsContainer.innerHTML = '';
    }
}

// Refresh the UI with a custom date
function refreshWithCustomDate() {
    try {
        const date = window.TESTING_DATE || CURRENT_DATE;

        // Use an async function to handle the async getPrayerTimesForDate
        (async function () {
            let prayerData;

            if (window.CUSTOM_PRAYER_TIMES) {
                prayerData = window.CUSTOM_PRAYER_TIMES;
            } else {
                prayerData = await getPrayerTimesForDate(date);
            }

            updatePrayerTimesUI(prayerData);
            updateNextPrayer(prayerData);

            if (isDebugMode) {
                showAdminNotice(`DEBUG MODE: Using date ${date.toLocaleString()}`);
            }
        })();
    } catch (error) {
        console.error('Error refreshing with custom date:', error);
    }
}

// Function to parse markdown table into prayer times data
async function parseMarkdownTable(markdown) {
    if (!markdown) return [];

    // Split the markdown by lines
    const lines = markdown.split('\n');

    // Skip the header rows (first two lines)
    const dataLines = lines.slice(2);

    const prayerTimes = [];

    // Process each line
    for (const line of dataLines) {
        if (!line.trim() || !line.includes('|')) continue;

        // Split the line by | and remove empty entries
        const columns = line.split('|')
            .map(col => col.trim())
            .filter(col => col);

        // Skip if we don't have enough columns
        if (columns.length < 8) continue;

        // Parse the values (removing ** markdown bold if present)
        const day = parseInt(columns[0].replace(/\*\*/g, '').trim());
        const hijri = columns[1].replace(/\*\*/g, '').trim();
        const weekday = columns[2].replace(/\*\*/g, '').trim();
        const fajr = columns[3].replace(/\*\*/g, '').trim();
        const sunrise = columns[4].replace(/\*\*/g, '').trim();
        const dhuhr = columns[5].replace(/\*\*/g, '').trim();
        const asr = columns[6].replace(/\*\*/g, '').trim();
        const maghrib = columns[7].replace(/\*\*/g, '').trim();
        const isha = columns[8].replace(/\*\*/g, '').trim();

        // Create a prayer times object
        prayerTimes.push({
            day,
            hijri,
            weekday,
            fajr,
            sunrise,
            dhuhr,
            asr,
            maghrib,
            isha
        });
    }

    return prayerTimes;
}

// Function to fetch markdown file for a specific month
async function fetchMonthData(month, year) {
    // Get month name in lowercase
    const monthNames = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    const monthName = monthNames[month - 1];
    const cacheKey = `${monthName}-${year}`;

    // Check if we have this month cached
    if (markdownCache[cacheKey]) {
        return markdownCache[cacheKey];
    }

    try {
        // Try to fetch the markdown file
        const response = await fetch(`${monthName}.md`);

        if (!response.ok) {
            console.warn(`No markdown file found for ${monthName} ${year}`);
            return null;
        }

        const markdownContent = await response.text();
        const parsedData = await parseMarkdownTable(markdownContent);

        // Cache the parsed data
        markdownCache[cacheKey] = parsedData;
        console.log(`Loaded prayer times for ${monthName} ${year}`);

        return parsedData;
    } catch (error) {
        console.error(`Error loading ${monthName}.md:`, error);
        return null;
    }
}

// Load prayer times for a specific month
async function loadPrayerTimesForMonth(month, year) {
    const monthKey = `${year}-${month}`;

    // Check if we already have loaded this month
    if (loadedPrayerTimes[monthKey]) {
        return loadedPrayerTimes[monthKey];
    }

    // Fetch the month data
    const data = await fetchMonthData(month, year);

    if (data) {
        loadedPrayerTimes[monthKey] = data;
        return data;
    }

    return null;
}

// Preload prayer times for current and next month
async function preloadPrayerTimes() {
    const currentMonth = CURRENT_DATE.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = CURRENT_DATE.getFullYear();

    // Preload current month
    await loadPrayerTimesForMonth(currentMonth, currentYear);

    // Preload next month
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
    }

    await loadPrayerTimesForMonth(nextMonth, nextYear);

    // Check if current month is loaded
    const currentMonthKey = `${currentYear}-${currentMonth}`;
    if (!loadedPrayerTimes[currentMonthKey]) {
        // Show admin notice if current month data is missing
        showAdminNotice(`Prayer times for ${getMonthName(currentMonth)} ${currentYear} are not available. Please upload the data for this month.`);
    }
}

// Function to fetch Iqamah times from the API
async function fetchIqamahTimes() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Iqamah times:', data);

        // Get current day of week
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[CURRENT_DATE.getDay()];

        // Extract times for current day
        const todayTimes = data[currentDay];

        if (!todayTimes || !Array.isArray(todayTimes) || todayTimes.length < 5) {
            console.error('Invalid data format for today\'s Iqamah times');
            return null;
        }

        // Convert API response to our format
        // The API returns an array of times in order: Fajr, Dhuhr, Asr, Maghrib, Isha
        const iqamahData = {
            fajr: todayTimes[0],
            dhuhr: todayTimes[1],
            asr: todayTimes[2],
            maghrib: todayTimes[3],
            isha: todayTimes[4],
            // For Jumuah, we'll keep using default
            jumuah: '1:30 PM'
        };

        return iqamahData;
    } catch (error) {
        console.error('Error fetching Iqamah times:', error);
        // Return null on error to indicate we should use fallback times
        return null;
    }
}

// Function to get day's prayer times based on date
async function getPrayerTimesForDate(date) {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();

    // Try to use dynamically loaded data first
    const monthKey = `${year}-${month}`;
    let monthData = loadedPrayerTimes[monthKey];

    // If month data doesn't exist yet, try to load it
    if (!monthData) {
        monthData = await loadPrayerTimesForMonth(month, year);
    }

    // If we still don't have data, show a notice and use fallback
    if (!monthData) {
        console.warn(`Prayer data for month ${month}/${year} is not available`);

        // Show admin notice on the page
        showAdminNotice(`Prayer times for ${getMonthName(month)} ${year} are not available. Please upload the data for this month.`);

        // Use fallback data: first try current month's first day if available
        const currentMonthKey = `${CURRENT_DATE.getFullYear()}-${CURRENT_DATE.getMonth() + 1}`;
        if (loadedPrayerTimes[currentMonthKey] && loadedPrayerTimes[currentMonthKey].length > 0) {
            return loadedPrayerTimes[currentMonthKey][0];
        }

        // If no loaded data is available, use sample data
        return {
            day: day,
            hijri: "N/A",
            weekday: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
            fajr: "5:00",
            sunrise: "6:30",
            dhuhr: "1:15",
            asr: "5:00",
            maghrib: "8:00",
            isha: "9:30"
        };
    }

    // Find the day in the month data
    const dayData = monthData.find(entry => entry.day === day);

    if (!dayData) {
        console.warn(`No data for day ${day} in month ${month}/${year}, using a default day`);

        // Default to the first available day
        return monthData[0];
    }

    return dayData;
}

// Helper function to show an admin notice on the page
function showAdminNotice(message) {
    // Check if the static notice exists
    const staticNotice = document.getElementById('static-admin-notice');

    // If there's a static notice, update its message instead of creating a new one
    if (staticNotice) {
        // Find the span in the static notice
        const span = staticNotice.querySelector('span');
        if (span) {
            span.innerHTML = `<strong>ADMIN NOTICE:</strong> ${message}`;
            staticNotice.style.display = 'block';
            return;
        }
    }

    // If no static notice, create a dynamic one
    let noticeElement = document.getElementById('admin-notice');

    if (!noticeElement) {
        noticeElement = document.createElement('div');
        noticeElement.id = 'admin-notice';
        noticeElement.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 fixed top-0 left-0 right-0 z-50';
        noticeElement.style.zIndex = '9999'; // Ensure it's on top
        noticeElement.style.padding = '1rem';
        noticeElement.style.backgroundColor = '#FEE2E2';
        noticeElement.style.borderLeftWidth = '4px';
        noticeElement.style.borderLeftColor = '#EF4444';
        noticeElement.style.color = '#B91C1C';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.className = 'float-right font-bold text-xl';
        closeButton.style.float = 'right';
        closeButton.style.fontSize = '1.5rem';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.marginLeft = '1rem';
        closeButton.onclick = function () {
            noticeElement.style.display = 'none';
        };

        noticeElement.appendChild(closeButton);

        // Find a good place to insert the notice
        const container = document.querySelector('.page-content');
        if (container) {
            container.insertBefore(noticeElement, container.firstChild);
        } else {
            document.body.insertBefore(noticeElement, document.body.firstChild);
        }
    }

    // Add message text
    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = `<strong>ADMIN NOTICE:</strong> ${message}`;

    // Clear any existing message content
    while (noticeElement.childNodes.length > 1) {
        if (noticeElement.lastChild !== noticeElement.firstChild) {
            noticeElement.removeChild(noticeElement.lastChild);
        }
    }

    noticeElement.appendChild(messageSpan);
    noticeElement.style.display = 'block';
}

// Helper function to get month name
function getMonthName(monthNumber) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return monthNames[monthNumber - 1] || `Month ${monthNumber}`;
}

// Function to format time to 12-hour format
function formatTo12Hour(time24h, prayerName) {
    const [hours, minutes] = time24h.split(':').map(Number);

    // Determine if prayer should be PM based on name or time
    let isPM = hours >= 12;
    if (prayerName && ['dhuhr', 'asr', 'maghrib', 'isha'].includes(prayerName.toLowerCase())) {
        isPM = true;
    }

    const period = isPM ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12

    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Function to calculate Iqamah time (for demonstration)
function calculateIqamahTime(prayerTime) {
    // For this example, we'll use the same time as Adhan
    // In a real implementation, you might have specific Iqamah times or logic
    return prayerTime;
}

// Function to update the UI with current prayer times
function updatePrayerTimesUI(prayerData) {
    // Safety check - ensure we have a valid prayerData object
    if (!prayerData) {
        console.error('Invalid prayer data provided to updatePrayerTimesUI');
        return;
    }

    // Format dates for display
    let gregorianDate;

    if (window.TESTING_DATE) {
        // If in debug mode with a test date, use that
        gregorianDate = window.TESTING_DATE.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        // Otherwise use the current date
        gregorianDate = CURRENT_DATE.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Safely set element text content
    const setTextContent = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with ID "${id}" not found`);
        }
    };

    // Update date displays
    setTextContent('gregorian-date', gregorianDate);

    // Update the hidden Hijri date for compatibility
    setTextContent('hijri-date', `${prayerData.weekday} ${prayerData.hijri}`);

    // Update prayer times with proper format handling
    try {
        // Fajr
        setTextContent('fajr-time', formatTo12Hour(prayerData.fajr, 'fajr'));
        setTextContent('fajr-iqamah', iqamahTimes && iqamahTimes.fajr
            ? iqamahTimes.fajr  // API already returns in 12h format with AM/PM
            : formatTo12Hour(prayerData.fajr, 'fajr'));

        // Sunrise
        setTextContent('sunrise-time', formatTo12Hour(prayerData.sunrise, 'sunrise'));

        // Dhuhr
        setTextContent('dhuhr-time', formatTo12Hour(prayerData.dhuhr, 'dhuhr'));
        setTextContent('dhuhr-iqamah', iqamahTimes && iqamahTimes.dhuhr
            ? iqamahTimes.dhuhr
            : formatTo12Hour(prayerData.dhuhr, 'dhuhr'));

        // Asr
        setTextContent('asr-time', formatTo12Hour(prayerData.asr, 'asr'));
        setTextContent('asr-iqamah', iqamahTimes && iqamahTimes.asr
            ? iqamahTimes.asr
            : formatTo12Hour(prayerData.asr, 'asr'));

        // Maghrib
        setTextContent('maghrib-time', formatTo12Hour(prayerData.maghrib, 'maghrib'));
        setTextContent('maghrib-iqamah', iqamahTimes && iqamahTimes.maghrib
            ? iqamahTimes.maghrib
            : formatTo12Hour(prayerData.maghrib, 'maghrib'));

        // Isha
        setTextContent('isha-time', formatTo12Hour(prayerData.isha, 'isha'));
        setTextContent('isha-iqamah', iqamahTimes && iqamahTimes.isha
            ? iqamahTimes.isha
            : formatTo12Hour(prayerData.isha, 'isha'));

        // For Jumuah, use API data if available, otherwise use defaults
        setTextContent('jumuah-time', "1:00 PM");
        setTextContent('jumuah-iqamah', "1:00 PM");
    } catch (error) {
        console.error('Error updating prayer time UI elements:', error);
    }

    // Determine which prayer is next and update UI
    updateNextPrayer(prayerData);
}

// Function to determine the next prayer and update UI
function updateNextPrayer(prayerData) {
    // Safety check for prayerData
    if (!prayerData) {
        console.error('Invalid prayer data provided to updateNextPrayer');
        return;
    }

    try {
        const now = window.TESTING_DATE || new Date(); // Use test date if available

        // Convert 24h times to Date objects for comparison
        const prayerTimes = [
            { name: 'FAJR', time: createTimeDate(now, prayerData.fajr, 'fajr'), iqamahTime: createIqamahTimeDate(now, 'fajr') },
            { name: 'DHUHR', time: createTimeDate(now, prayerData.dhuhr, 'dhuhr'), iqamahTime: createIqamahTimeDate(now, 'dhuhr') },
            { name: 'ASR', time: createTimeDate(now, prayerData.asr, 'asr'), iqamahTime: createIqamahTimeDate(now, 'asr') },
            { name: 'MAGHRIB', time: createTimeDate(now, prayerData.maghrib, 'maghrib'), iqamahTime: createIqamahTimeDate(now, 'maghrib') },
            { name: 'ISHA', time: createTimeDate(now, prayerData.isha, 'isha'), iqamahTime: createIqamahTimeDate(now, 'isha') }
        ];

        // Variables to track next events
        let nextPrayer = null;
        let isIqamahCountdown = false;

        // First check if we're between Adhan and Iqamah for any prayer
        for (const prayer of prayerTimes) {
            if (prayer.time <= now && prayer.iqamahTime > now) {
                nextPrayer = prayer;
                isIqamahCountdown = true;
                break;
            }
        }

        // If not between Adhan and Iqamah, find the next Adhan time
        if (!nextPrayer) {
            for (const prayer of prayerTimes) {
                if (prayer.time > now) {
                    nextPrayer = prayer;
                    isIqamahCountdown = false;
                    break;
                }
            }
        }

        // If no next prayer found, it means all prayers for today have passed
        // So the next prayer is Fajr tomorrow
        if (!nextPrayer) {
            nextPrayer = {
                name: 'FAJR',
                time: prayerTimes[0].time,
                iqamahTime: prayerTimes[0].iqamahTime
            };
            nextPrayer.time.setDate(nextPrayer.time.getDate() + 1);
            nextPrayer.iqamahTime.setDate(nextPrayer.iqamahTime.getDate() + 1);
            isIqamahCountdown = false;
        }

        // Safely set element text content
        const setTextContent = (id, text) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            } else {
                console.warn(`Element with ID "${id}" not found in updateNextPrayer`);
            }
        };

        // Update the UI with next prayer info
        setTextContent('next-prayer-name', nextPrayer.name);

        // Update countdown label based on whether we're counting down to Adhan or Iqamah
        if (isIqamahCountdown) {
            setTextContent('countdown-label', 'IQAMAH at MTWS IN:');
        } else {
            setTextContent('countdown-label', 'The prayer of ' + nextPrayer.name + ' is in');
        }

        // Reset all prayer card styles
        resetPrayerCardStyles();

        // Highlight the next prayer card
        const nextPrayerCardId = `${nextPrayer.name.toLowerCase()}-card`;
        const nextPrayerCard = document.getElementById(nextPrayerCardId);
        if (nextPrayerCard) {
            nextPrayerCard.classList.add('active');
        }

        // Calculate time until next event (either Adhan or Iqamah)
        const targetTime = isIqamahCountdown ? nextPrayer.iqamahTime : nextPrayer.time;
        const timeDiff = targetTime - now;
        startCountdown(timeDiff, isIqamahCountdown);
    } catch (error) {
        console.error('Error in updateNextPrayer:', error);
        // Try to display zeros in the countdown as a fallback
        initializeCountdown();
    }
}

// Helper function to create a Date object from a 24h time string
function createTimeDate(baseDate, timeStr, prayerName) {
    // Ensure we're working with a string
    if (!timeStr || typeof timeStr !== 'string') {
        console.error("Invalid time string for", prayerName, ":", timeStr);
        return new Date(baseDate); // Return current date as fallback
    }

    // Handle both formats: "5:45" and "5:45 AM/PM"
    let hours, minutes, isPM = false;

    if (timeStr.includes(' ')) {
        // Format: "5:45 AM/PM"
        const [timeOnly, period] = timeStr.split(' ');
        [hours, minutes] = timeOnly.split(':').map(Number);
        isPM = period.toUpperCase() === 'PM';
    } else {
        // Format: "5:45" (24-hour)
        [hours, minutes] = timeStr.split(':').map(Number);

        // For prayers that are typically in the afternoon/evening
        if (hours < 12 && ['dhuhr', 'asr', 'maghrib', 'isha'].includes(prayerName?.toLowerCase())) {
            isPM = true;
        }
    }

    // Adjust hours for PM times
    if (isPM && hours < 12) {
        hours += 12;
    } else if (!isPM && hours === 12) {
        // 12 AM should be 0 hours
        hours = 0;
    }

    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Helper function to create a Date object for Iqamah time
function createIqamahTimeDate(baseDate, prayerName) {
    // If we have API Iqamah times, use those
    if (iqamahTimes && iqamahTimes[prayerName.toLowerCase()]) {
        const iqamahTimeStr = iqamahTimes[prayerName.toLowerCase()];

        // Check if we have a valid time string
        if (!iqamahTimeStr || typeof iqamahTimeStr !== 'string') {
            console.error("Invalid Iqamah time for", prayerName, ":", iqamahTimeStr);
            // Fallback to using the Adhan time
            const prayerData = getPrayerTimesForDate(baseDate);
            return createTimeDate(baseDate, prayerData[prayerName.toLowerCase()], prayerName.toLowerCase());
        }

        // Handle time string with AM/PM format
        return createTimeDate(baseDate, iqamahTimeStr, prayerName);
    }

    // Fallback to using the Adhan time if no Iqamah time is available
    const prayerData = getPrayerTimesForDate(baseDate);
    return createTimeDate(baseDate, prayerData[prayerName.toLowerCase()], prayerName.toLowerCase());
}

// Function to reset all prayer card styles
function resetPrayerCardStyles() {
    const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (const prayer of prayers) {
        const card = document.getElementById(`${prayer}-card`);
        if (card) {
            card.classList.remove('active');
        }
    }
}

// Function to start countdown to the next prayer or Iqamah
function startCountdown(milliseconds, isIqamahCountdown) {
    // Safety check for negative milliseconds
    if (milliseconds < 0) {
        console.error("Negative milliseconds in countdown:", milliseconds);
        milliseconds = 0;
        // Force refresh after a short delay
        setTimeout(() => window.location.reload(), 3000);
        return;
    }

    // Set initial countdown values
    updateCountdownDisplay(milliseconds);

    // Clear any existing interval
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    // Start the countdown
    window.countdownInterval = setInterval(() => {
        milliseconds -= 1000;
        if (milliseconds <= 0) {
            clearInterval(window.countdownInterval);
            // Refresh the page to get the new next prayer/iqamah
            window.location.reload();
            return;
        }
        updateCountdownDisplay(milliseconds);
    }, 1000);
}

// Helper function to update the countdown display
function updateCountdownDisplay(milliseconds) {
    // Safety check for negative milliseconds
    if (milliseconds < 0) milliseconds = 0;

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');

    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Initialize countdown with zeros in case of errors
function initializeCountdown() {
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');

    if (hoursElement) hoursElement.textContent = '00';
    if (minutesElement) minutesElement.textContent = '00';
    if (secondsElement) secondsElement.textContent = '00';
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    // First check URL parameters for debug/admin mode
    checkUrlParams();

    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize countdown display with zeros in case of errors
    initializeCountdown();

    // Expose admin notice function to window for console access
    window.setAdminNotice = function (message) {
        showAdminNotice(message);
    };

    // Expose debug hooks to window for console access
    window.debug = debugHooks;

    try {
        // Preload prayer times for current and next month
        await preloadPrayerTimes();

        // Get prayer times for the current or test date
        const dateToUse = window.TESTING_DATE || CURRENT_DATE;
        const prayerData = await getPrayerTimesForDate(dateToUse);

        // Fetch Iqamah times from API
        iqamahTimes = await fetchIqamahTimes();

        // Update UI with prayer times and Iqamah times
        updatePrayerTimesUI(prayerData);

        // Make sure the countdown starts properly by calling updateNextPrayer explicitly
        if (prayerData) {
            updateNextPrayer(prayerData);
        }

        // If in debug mode, show a notice
        if (isDebugMode) {
            showAdminNotice('Debug mode enabled. Use window.debug functions in console for testing.');
        }
    } catch (error) {
        console.error('Error initializing prayer times:', error);

        // Fallback in case of error - use sample data
        const fallbackData = {
            day: CURRENT_DATE.getDate(),
            hijri: "N/A",
            weekday: CURRENT_DATE.toLocaleDateString('en-US', { weekday: 'short' }),
            fajr: "5:00",
            sunrise: "6:30",
            dhuhr: "1:15",
            asr: "5:00",
            maghrib: "8:00",
            isha: "9:30"
        };

        updatePrayerTimesUI(fallbackData);
        updateNextPrayer(fallbackData);
    }
}); 
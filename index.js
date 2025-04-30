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

// For testing - use a specific date
const TEST_DATE = new Date(2023, 4, 15); // May 15, 2023

// Get the current date
const CURRENT_DATE = new Date();

// Store Iqamah times fetched from API
let iqamahTimes = null;

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
function getPrayerTimesForDate(date) {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    // Get the right month's data
    const monthData = month === 5 ? MAY_PRAYER_TIMES : month === 6 ? JUNE_PRAYER_TIMES : null;

    if (!monthData) {
        console.error('Only May and June data is available');
        // Default to first day of May if month not available
        return MAY_PRAYER_TIMES[0];
    }

    // Find the day in the month data
    const dayData = monthData.find(entry => entry.day === day);

    if (!dayData) {
        console.error(`No data for day ${day} in month ${month}`);
        return monthData[0]; // Default to first day if day not found
    }

    return dayData;
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
    // Format dates for display
    const gregorianDate = CURRENT_DATE.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('gregorian-date').textContent = gregorianDate;

    // Update the hidden Hijri date for compatibility
    const hijriDateElement = document.getElementById('hijri-date');
    if (hijriDateElement) {
        hijriDateElement.textContent = `${prayerData.weekday} ${prayerData.hijri}`;
    }

    // Update prayer times with proper format handling

    // Fajr
    document.getElementById('fajr-time').textContent = formatTo12Hour(prayerData.fajr, 'fajr');
    document.getElementById('fajr-iqamah').textContent = iqamahTimes && iqamahTimes.fajr
        ? iqamahTimes.fajr  // API already returns in 12h format with AM/PM
        : formatTo12Hour(prayerData.fajr, 'fajr');

    // Sunrise
    document.getElementById('sunrise-time').textContent = formatTo12Hour(prayerData.sunrise, 'sunrise');

    // Dhuhr
    document.getElementById('dhuhr-time').textContent = formatTo12Hour(prayerData.dhuhr, 'dhuhr');
    document.getElementById('dhuhr-iqamah').textContent = iqamahTimes && iqamahTimes.dhuhr
        ? iqamahTimes.dhuhr
        : formatTo12Hour(prayerData.dhuhr, 'dhuhr');

    // Asr
    document.getElementById('asr-time').textContent = formatTo12Hour(prayerData.asr, 'asr');
    document.getElementById('asr-iqamah').textContent = iqamahTimes && iqamahTimes.asr
        ? iqamahTimes.asr
        : formatTo12Hour(prayerData.asr, 'asr');

    // Maghrib
    document.getElementById('maghrib-time').textContent = formatTo12Hour(prayerData.maghrib, 'maghrib');
    document.getElementById('maghrib-iqamah').textContent = iqamahTimes && iqamahTimes.maghrib
        ? iqamahTimes.maghrib
        : formatTo12Hour(prayerData.maghrib, 'maghrib');

    // Isha
    document.getElementById('isha-time').textContent = formatTo12Hour(prayerData.isha, 'isha');
    document.getElementById('isha-iqamah').textContent = iqamahTimes && iqamahTimes.isha
        ? iqamahTimes.isha
        : formatTo12Hour(prayerData.isha, 'isha');

    // For Jumuah, use API data if available, otherwise use defaults
    document.getElementById('jumuah-time').textContent = "1:00 PM";
    document.getElementById('jumuah-iqamah').textContent = iqamahTimes && iqamahTimes.jumuah
        ? iqamahTimes.jumuah
        : "1:30 PM";

    // Determine which prayer is next and update UI
    updateNextPrayer(prayerData);
}

// Function to determine the next prayer and update UI
function updateNextPrayer(prayerData) {
    const now = new Date(); // Use current date and time

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

    // Update the UI with next prayer info
    const nextPrayerNameElement = document.getElementById('next-prayer-name');
    if (nextPrayerNameElement) {
        nextPrayerNameElement.textContent = nextPrayer.name;
    }

    // Update countdown label based on whether we're counting down to Adhan or Iqamah
    const countdownLabel = document.getElementById('countdown-label');
    if (countdownLabel) {
        if (isIqamahCountdown) {
            countdownLabel.textContent = 'IQAMAH at MTWS IN:';
        } else {
            countdownLabel.textContent = 'The prayer of ' + nextPrayer.name + ' is in';
        }
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
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize countdown display with zeros in case of errors
    initializeCountdown();

    try {
        // Get prayer times for the current date
        const prayerData = getPrayerTimesForDate(CURRENT_DATE);

        // Fetch Iqamah times from API
        iqamahTimes = await fetchIqamahTimes();

        // Update UI with prayer times and Iqamah times
        updatePrayerTimesUI(prayerData);

        // Make sure the countdown starts properly by calling updateNextPrayer explicitly
        if (prayerData) {
            updateNextPrayer(prayerData);
        }
    } catch (error) {
        console.error('Error initializing prayer times:', error);

        // Fallback in case of error - use sample data
        updatePrayerTimesUI(MAY_PRAYER_TIMES[0]);
        updateNextPrayer(MAY_PRAYER_TIMES[0]);
    }
}); 
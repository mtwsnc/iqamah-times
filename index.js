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

// For testing - update countdown timer
function updateCountdown() {
    const hours = document.getElementById('countdown-hours');
    const minutes = document.getElementById('countdown-minutes');
    const seconds = document.getElementById('countdown-seconds');

    // Start a countdown from the initial values
    let h = parseInt(hours.textContent);
    let m = parseInt(minutes.textContent);
    let s = parseInt(seconds.textContent);

    const countdownInterval = setInterval(() => {
        // Decrease seconds
        s--;

        // Adjust minutes and hours as needed
        if (s < 0) {
            s = 59;
            m--;

            if (m < 0) {
                m = 59;
                h--;

                if (h < 0) {
                    // Reset countdown when it reaches zero
                    clearInterval(countdownInterval);
                    setTimeout(() => location.reload(), 1000); // Reload after 1 second
                    return;
                }
            }
        }

        // Update the display
        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');
    }, 1000);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Start the countdown
    updateCountdown();
}); 
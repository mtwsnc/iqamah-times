// const fetch = require("node-fetch");

const apiUrl = 'https://northerly-robin-8705.dataplicity.io/mtws-iqaamah-times/all';
const API_URL = apiUrl
let data = {};

// Prayer names mapping
const PRAYER_NAMES = {
  FAJR: 'Fajr',
  SUNRISE: 'Shuruq',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha'
};

// Arabic month names
const ARABIC_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

// Arabic day names
const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

// Arabic numerals
const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// Function to convert western numbers to Arabic numerals
function toArabicNumerals(num) {
  return num.toString().split('').map(digit => ARABIC_NUMERALS[parseInt(digit)] || digit).join('');
}

// Function to convert 24-hour time format to 12-hour format with AM/PM
function convertTime24to12(time) {
  if (!time) return '';

  const parts = time.split(':');
  let hours = parseInt(parts[0]);
  const minutes = parts[1];

  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  return `${hours}:${minutes} ${meridiem}`;
}

// Function to convert 12-hour time format to 24-hour format
function convertTime12to24(time12h) {
  if (!time12h) return '';

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

// Function to fetch prayer times from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Process the data to ensure consistent format
    Object.keys(data).forEach((day) => {
      for (let i = 1; i <= 5; i++) {
        const time = data[day][i - 1];
        let temp = time.includes('M') ? convertTime12to24(time.length < 8 ? "0" + time : time) : time;
        data[day][i - 1] = temp;
      }
    });

    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

// Function to get today's day name
function getCurrentDay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
}

// Function to convert Gregorian date to Hijri date
function getHijriDate(date) {
  try {
    // Check if HijriConverter is available from the CDN
    if (typeof HijriConverter === 'undefined') {
      console.error('HijriConverter is not available');
      return 'Loading Hijri date...';
    }

    // Get the date components
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Convert to Hijri using the library
    const hijriDate = HijriConverter.gregorianToHijri(year, month, day);

    // Format the Hijri date in Arabic
    const hijriDay = ARABIC_DAYS[date.getDay()];
    const hijriDayNum = toArabicNumerals(hijriDate.hd);
    const hijriMonth = ARABIC_MONTHS[hijriDate.hm - 1];
    const hijriYear = toArabicNumerals(hijriDate.hy);

    return `${hijriDay} ${hijriDayNum} ${hijriMonth} ${hijriYear}`;
  } catch (error) {
    console.error('Error converting to Hijri date:', error);
    return 'Error loading Hijri date';
  }
}

// Function to update the date displays
function updateDateDisplays() {
  const today = new Date();

  // Update Gregorian date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('gregorian-date').textContent = today.toLocaleDateString('en-US', options);

  // Update Hijri date
  document.getElementById('hijri-date').textContent = getHijriDate(today);
}

// Function to display prayer times in the cards
function displayPrayerTimes(prayerData) {
  const today = getCurrentDay();

  if (!prayerData || !prayerData[today]) {
    console.error('No prayer data available for today');
    return;
  }

  // Get today's prayer times
  const times = prayerData[today];

  // Display prayer times in the respective cards
  // We're assuming the order is: Fajr, Dhuhr, Asr, Maghrib, Isha
  document.getElementById('fajr-time').textContent = convertTime24to12(times[0]);
  document.getElementById('dhuhr-time').textContent = convertTime24to12(times[1]);
  document.getElementById('asr-time').textContent = convertTime24to12(times[2]);
  document.getElementById('maghrib-time').textContent = convertTime24to12(times[3]);
  document.getElementById('isha-time').textContent = convertTime24to12(times[4]);

  // For now, we'll use placeholder values for Sunrise, Iqamah times, and Jumuah
  document.getElementById('sunrise-time').textContent = '6:25 AM';

  // Set Iqamah times (placeholders for now)
  document.getElementById('fajr-iqamah').textContent = 'IQAMAH ' + convertTime24to12(times[0]);
  document.getElementById('dhuhr-iqamah').textContent = 'IQAMAH ' + convertTime24to12(times[1]);
  document.getElementById('asr-iqamah').textContent = 'IQAMAH ' + convertTime24to12(times[2]);
  document.getElementById('maghrib-iqamah').textContent = 'IQAMAH ' + convertTime24to12(times[3]);
  document.getElementById('isha-iqamah').textContent = 'IQAMAH ' + convertTime24to12(times[4]);

  // Set Jumuah times (placeholder)
  document.getElementById('jumuah-time').textContent = '1:00 PM';
  document.getElementById('jumuah-iqamah').textContent = 'IQAMAH 1:30 PM';

  // Update next prayer info and start countdown
  updateNextPrayer(times);
}

// Function to determine the next prayer and update UI
function updateNextPrayer(times) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeString = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

  // Prayer times in 24-hour format
  const prayerTimes = [
    { name: 'FAJR', time: times[0] },
    { name: 'DHUHR', time: times[1] },
    { name: 'ASR', time: times[2] },
    { name: 'MAGHRIB', time: times[3] },
    { name: 'ISHA', time: times[4] }
  ];

  // Find the next prayer
  let nextPrayer = null;
  for (const prayer of prayerTimes) {
    if (prayer.time > currentTimeString) {
      nextPrayer = prayer;
      break;
    }
  }

  // If no next prayer found, it means all prayers for today have passed
  // So the next prayer is Fajr tomorrow
  if (!nextPrayer) {
    nextPrayer = { name: 'FAJR', time: times[0] };
    // Adjust for next day
  }

  // Update the UI with next prayer info
  document.getElementById('next-prayer-name').textContent = nextPrayer.name;

  // Highlight the next prayer card
  resetPrayerCardStyles();
  const nextPrayerCardId = `${nextPrayer.name.toLowerCase()}-card`;
  const nextPrayerCard = document.getElementById(nextPrayerCardId);
  if (nextPrayerCard) {
    nextPrayerCard.classList.remove('bg-white');
    nextPrayerCard.classList.add('bg-masjid-green');
    // Update header text color
    const header = nextPrayerCard.querySelector('div:first-child');
    if (header) {
      header.classList.remove('bg-masjid-light', 'text-masjid-accent');
      header.classList.add('bg-white', 'text-masjid-accent');
    }
    // Update time text color
    const timeElement = nextPrayerCard.querySelector('.text-masjid-dark');
    if (timeElement) {
      timeElement.classList.remove('text-masjid-dark');
      timeElement.classList.add('text-white');
    }
    // Update iqamah text color
    const iqamahElement = nextPrayerCard.querySelector('.text-gray-600');
    if (iqamahElement) {
      iqamahElement.classList.remove('text-gray-600');
      iqamahElement.classList.add('text-white', 'opacity-80');
    }
  }

  // Start countdown to the next prayer
  startCountdown(nextPrayer.time);
}

// Function to reset all prayer card styles
function resetPrayerCardStyles() {
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (const prayer of prayers) {
    const card = document.getElementById(`${prayer}-card`);
    if (card) {
      card.classList.remove('bg-masjid-green');
      card.classList.add('bg-white');

      // Reset header
      const header = card.querySelector('div:first-child');
      if (header) {
        header.classList.remove('bg-white', 'text-masjid-green');
        header.classList.add('bg-masjid-light', 'text-masjid-accent');
      }

      // Reset time
      const timeElement = card.querySelector('.text-white');
      if (timeElement) {
        timeElement.classList.remove('text-white');
        timeElement.classList.add('text-masjid-dark');
      }

      // Reset iqamah
      const iqamahElement = card.querySelector('.opacity-80');
      if (iqamahElement) {
        iqamahElement.classList.remove('text-white', 'opacity-80');
        iqamahElement.classList.add('text-gray-600');
      }
    }
  }
}

// Function to start countdown to the next prayer
function startCountdown(prayerTime) {
  // Parse prayer time into hours and minutes
  const [hours, minutes] = prayerTime.split(':').map(Number);

  // Update the countdown every second
  const countdownInterval = setInterval(() => {
    const now = new Date();
    const prayerDate = new Date();

    prayerDate.setHours(hours, minutes, 0, 0);

    // If prayer time is earlier than current time, it's for tomorrow
    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    // Calculate the time difference in milliseconds
    const diff = prayerDate - now;

    // If we've reached the prayer time
    if (diff <= 0) {
      clearInterval(countdownInterval);
      // Refresh the page to update next prayer
      setTimeout(() => location.reload(), 60000); // Reload after 1 minute
      return;
    }

    // Convert milliseconds to hours, minutes, seconds
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const displayHours = totalHours.toString().padStart(2, '0');
    const displayMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    const displaySeconds = (totalSeconds % 60).toString().padStart(2, '0');

    // Update the countdown display
    document.getElementById('countdown-hours').textContent = displayHours;
    document.getElementById('countdown-minutes').textContent = displayMinutes;
    document.getElementById('countdown-seconds').textContent = displaySeconds;
  }, 1000);
}

// Main function to initialize the page
async function main() {
  // Update date displays
  updateDateDisplays();

  // Set up an interval to update the date display every minute
  setInterval(updateDateDisplays, 60000);

  // Fetch and display prayer times
  const data = await fetchData();
  displayPrayerTimes(data);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);
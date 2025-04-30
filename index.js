// const fetch = require("node-fetch");

const apiUrl = 'https://northerly-robin-8705.dataplicity.io/mtws-iqaamah-times/all';
const API_URL = apiUrl
let data = {};

function convertTime24to12(time) {
  const parts = time.split(':');
  let hours = parseInt(parts[0]);
  const minutes = parts[1];

  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  return `${hours}:${minutes} ${meridiem}`;
}

function convertTime12to24(time12h) {
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

// Function to fetch the data from the API
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

// Function to display the data in the HTML table
function displayData(data) {
  if (!data) return;

  Object.keys(data).forEach((day) => {
    for (let i = 1; i <= 5; i++) {
      const time24 = data[day][i - 1];
      const time12 = convertTime24to12(time24);

      const displayElement = document.getElementById(`${day.toLowerCase()}-${i}-display`);
      if (displayElement) {
        displayElement.textContent = time12;
      }
    }
  });
}

// Main function to initialize the page
async function main() {
  // Fetch and display prayer times
  const data = await fetchData();
  displayData(data);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);
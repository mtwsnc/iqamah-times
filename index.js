// const fetch = require("node-fetch");

const apiUrl = 'https://northerly-robin-8705.dataplicity.io/mtws-iqaamah-times/all';
const API_URL = apiUrl
let data = {};

function convertTime24to12(time) {
  var parts = time.split(':');
  var hours = parseInt(parts[0]);
  var minutes = parts[1];

  if(hours >= 12){
    var newhours = parseInt(hours) - 12;
    var meridiem = "PM";
  }else{
    var newhours = parseInt(hours);
    var meridiem = "AM";
  }

  if(newhours == 0) newhours = "12";
  var newtime = newhours + ":" + minutes + " " + meridiem;

  return newtime;
}


const convertTime12to24 = (time12h) => {
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
    Object.keys(data).forEach((day) => {
      for (let i = 1; i <= 5; i++) {
        const time = data[day][i - 1];
        let temp = convertTime12to24(time.length<8?"0"+time:time);
        data[day][i-1] = temp;
      }
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to display the data in the HTML table
function displayData(data) {
  Object.keys(data).forEach((day) => {
    for (let i = 1; i <= 5; i++) {
      const time = data[day][i - 1];
      let elem = document.querySelector(`#${day.toLowerCase()}-${i}`);
      elem.value = time;
    }
  });
}

async function refreshPage(data){
  data = await fetchData();
  displayData(data);
}

// Function to get the updated data from the HTML table
function getFormData() {
  let formData = {};
  Object.keys(data).forEach((day) => {
    formData[day] = [];
    for (let i = 1; i <= 5; i++) {
      const time = document.querySelector(`#${day.toLowerCase()}-${i}`).value ;
      formData[day].push(time);
    }
  });
  return formData;
}

async function putData(formData){
  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to update the data in the API
async function updateData(formData) {
  Object.keys(formData).forEach((day) => {
    for (let i = 1; i <= 5; i++) {
      const time = formData[day][i - 1];
      let temp = convertTime24to12(time);
      formData[day][i-1] = temp;
    }
  });
  formData["__passcode__"] = document.getElementById("password-box").value;
  return await putData(formData);
}

// Function to handle the form submission
async function handleSubmit(event) {
  event.preventDefault();
  const formData = getFormData();
  const updatedData = await updateData(formData);
  if (updatedData.status  == 200) {
    document.getElementById('message').textContent = 'Data saved successfully.';
  } else if (updatedData.status  == 400) {
  document.getElementById('message').textContent = 'Incorrect Password.';
  } else {
    document.getElementById('message').textContent = 'Failed to save data.';
  }
}

async function handleRestore(event) {
  event.preventDefault();
  const formData = {
    "__passcode__":document.getElementById("password-box").value,
    "__refresh__":true
  };
  const updatedData = await putData(formData);
  if (updatedData.status  == 200) {
    document.getElementById('message').textContent = 'Successfully restored.';
  } else if (updatedData.status  == 400) {
  document.getElementById('message').textContent = 'Incorrect Password.';
  } else {
    document.getElementById('message').textContent = 'Failed to restore.';
  }
  await refreshPage();
}

// Main function to fetch the data and initialize the page
async function main() {
  data = await fetchData();
  displayData(data);
  // console.log(getFormData());
  document.getElementById('save-button').addEventListener('click', handleSubmit);
  document.getElementById('refresh-button').addEventListener('click', refreshPage);
  document.getElementById('restore-button').addEventListener('click', handleRestore);
}

main();
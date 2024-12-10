
const apiKey = 'ef1b5869006346f2331bb755b0a31344';
const errorMessage = document.getElementById('error');
const successMessage = document.getElementById('success');
const unitMessage = document.getElementById('unitMessage');
const search = document.getElementById('searchBar');
let tempUnit = localStorage.getItem('tempUnit') === 'C';
const toggleUnitsButton = document.getElementById('toggleUnits'); 



async function getWeather(city) {
  try {
    const data = await fetchWeatherData(city);
    const hourlyData = await fetchHourlyForecast(city);
    const fiveDayData = await fetchFiveDayForecast(city);

    applyLightMode(); // This is a function to reapply dark mode to the new content.
    updateWeatherDisplay(data);
    updateHourlyForecast(hourlyData);
    updateFiveDayForecast(fiveDayData);

  } catch (error) {
    errorMessage.innerHTML = 'There was an error fetching weather data <br> Please try again.';
    errorMessage.style.top = '20px';
    errorMessage.style.opacity = '1';
    setInterval(() => errorMessage.style.top = '-100px', 7000);
  }
}


document.getElementById('toggleUnits').addEventListener('click', toggleUnits);

function toggleUnits() {
  const city = document.getElementById('location').textContent;
  isMetric = !isMetric;
  localStorage.setItem('units', isMetric ? 'metric' : 'imperial');
  getWeather(city);
  console.log(city);
}


function toggleTempUnit() {

  const units = localStorage.getItem('units');

  if (units === 'metric') {
    localStorage.setItem('tempUnit', 'F');
     
  } else {
    localStorage.setItem('tempUnit', 'C');
  }

  toggleUnitsButton.addEventListener('click', toggleTempUnit);

} toggleTempUnit();


toggleUnitsButton.addEventListener('click', function() {
  const units = localStorage.getItem('units');
  if (units === 'metric') {
    unitMessage.innerHTML = '<h2><sup>o</sup>F</h2>&nbsp;&nbsp;&nbsp;Units changed to Fahrenheit';
    unitMessage.style.top = '25px';
    unitMessage.style.opacity = '1';
    setInterval(() => unitMessage.style.top = '-100px', 2000);
     
  } else {
    unitMessage.innerHTML = '<h2><sup>o</sup>C</h2>&nbsp;&nbsp;&nbsp;Units changed to Celcius';
    unitMessage.style.top = '25px';
    unitMessage.style.opacity = '1';
    setInterval(() => unitMessage.style.top = '-100px', 2000);
  }
});


async function getWeatherByCoordinates(lat, lon) {
  try {
    const data = await fetchWeatherDataByCoordinates(lat, lon);
    updateWeatherDisplay(data);
    applyLightMode(); // This is a function to reapply dark mode to the new content.

    const city = data.location.name;
    const hourlyData = await fetchHourlyForecast(city);
    updateHourlyForecast(hourlyData);

    const fiveDayData = await fetchFiveDayForecast(city);
    updateFiveDayForecast(fiveDayData);
  } catch (error) {
    errorMessage.innerHTML = 'There was an error fetching weather data. <br> Please try again.';
    errorMessage.style.top = '20px';
    errorMessage.style.opacity = '1';
    setInterval(() => errorMessage.style.top = '-100px', 7000);
  }
}


function handleSearch() {
  const city = document.getElementById('searchBar').value;
  if (city) {
    getWeather(city);
  } else {
    errorMessage.innerHTML = 'Please enter a city name.';
    errorMessage.style.backgroundColor = 'rgb(139, 139, 139)';
    errorMessage.style.top = '20px';
    errorMessage.style.opacity = '1';
    setInterval(() => errorMessage.style.top = '-100px', 7000);
  }
}

function handleSaveCity() {
  const city = document.getElementById('location').textContent;
  saveCity(city);
  successMessage.innerHTML = '<img src="Images/icons/check.svg" alt="Check">' + city + 'has been saved successfuly';
  successMessage.style.backgroundColor = 'rgb(66, 195, 66)';
  successMessage.style.bottom = '20px';
  successMessage.style.opacity = '1';
  setInterval(() => successMessage.style.bottom = '-200px', 3000);
}


function askForDefaultCity() {
  const city = prompt('Please enter your default city:');
  if (city) {
    setDefaultCity(city);
    getWeather(city);
  }
}







document.addEventListener('DOMContentLoaded', () => {
  applyLightMode(); // This is a function to reapply dark mode to the new content.
  const defaultCity = getDefaultCity();
  if (defaultCity) {
    getWeather(defaultCity);
    handleViewSavedCities();
  } else {
    askForDefaultCity();
  }

  document.getElementById('home-button').addEventListener('click', () => window.location.reload());
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  document.getElementById('saveCityButton').addEventListener('click', handleSaveCity);
  document.getElementById('viewSavedCitiesBtn').addEventListener('click', handleViewSavedCities);

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
  }, () => {
    errorMessage.innerHTML = 'Geolocation is not supported or is blocked <br> Default city will be used insted.';
    errorMessage.style.top = '20px';
    errorMessage.style.backgroundColor = 'rgb(139, 139, 139)';
    errorMessage.style.opacity = '1';
    setInterval(() => errorMessage.style.top = '-100px', 7000);
  });
});




function formatCurrentDay(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'long' }; // This will give you the full name of the day
  return date.toLocaleDateString(undefined, options);
}

function formatCurrentTime(dateString) {
  const date = new Date(dateString);
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString(undefined, options);
}



function updateWeatherDisplay(data) {
  const { location, current } = data;
  const temperatureUnit = localStorage.getItem('tempUnit');

  document.getElementById('currentWeather').innerHTML = `
      <div class="current-weather-tile">
      <img src="Images/background.jpg" alt="" class="current-background">
        <div class="current-day">
          <p id="day">${formatCurrentDay(current.last_updated)}</p>
        </div>

        <div class="current-temperature">
          <div class="temp-unit">
            <p id="temperature">${Math.round(current.temp_c)}°</p>
            <span id="tempUnit">${temperatureUnit}</span>
          </div>
          <div id="current-icon"><i class="fas ${getWeatherIcon(current.condition.icon)}"></i></div>
        </div>

        <div class="current-temp">
          <p class="current-condition" id="description">${current.condition.text}</p>
          <p class="current-condition" id="humidity">Humidity: ${Math.round(current.humidity)}%</p>
          <div class="current-wind-speed">Wind Speed: ${Math.round(current.wind_kph)} km/h <img src="Images/icons/Cycle.svg" class="wind-icon" style="animation-duration: ${10 / (current.wind_kph || 1)}s;"/></div>
        </div>
        <div class="current-time-container">
          <p class="current-time" id="time">${formatCurrentTime(current.last_updated)}</p>
          <div class="city current-city" id="location">${location.name}, ${location.country} <img src="Images/icons/globe.svg" alt="Icon"/></div>
        </div>
      </div>
  `;
  applyLightMode(); // This is a function to reapply dark mode to the new content.
  updateCurrentWeatherBackground(current.condition.text); // Call the new function. 
}




function updateCurrentWeatherBackground(condition) {
  const container = document.querySelector('.current-weather-tile');
  let backgroundColor = '';
  let textColor = '';

  switch (condition.toLowerCase()) {
    case 'clear sky':
      backgroundColor = 'rgba(247, 247, 247, 0.6)';
      textColor = 'black';
      break;
    case 'scattered clouds':
      backgroundColor = 'rgba(198, 198, 198, 0.6)';
      textColor = 'black';
      break;
    case 'few clouds':
      backgroundColor = 'rgba(198, 198, 198, 0.6)';
      textColor = 'black';
      break;
    case 'broken clouds':
      backgroundColor = 'rgba(198, 198, 198, 0.6)';
      textColor = 'black';
      break;
    case 'overcast clouds':
      backgroundColor = 'rgba(198, 198, 198, 0.6)';
      textColor = 'black';
      break;
    case 'mist':
      backgroundColor = 'rgba(208, 208, 208, 0.6)';
      textColor = 'black';
      break;
    case 'light rain':
      backgroundColor = 'rgba(77, 77, 77, 0.6)';
      textColor = 'white';
      break;
    case 'moderate rain':
      backgroundColor = 'rgba(57, 57, 57, 0.6)';
      textColor = 'white';
      break;
    case 'heavy rain':
      backgroundColor = 'rgba(37, 37, 37, 0.6)';
      textColor = 'white';
      break;
    case 'light snow':
      backgroundColor = 'rgba(239, 239, 239, 0.6)';
      textColor = 'rgb(247, 247, 247)';
      break;
    case 'heavy snow':
      backgroundColor = 'rgba(239, 239, 239, 0.6)';
      textColor = 'black';
      break;
    case 'thunderstorm':
      backgroundColor = 'rgba(47, 0, 0, 0.7)';
      textColor = 'white';
      break;
    default:
      backgroundColor = '';
      textColor = 'white';
      break;
  }

  container.style.backgroundColor = backgroundColor;
  container.style.color = textColor;
}  


function updateHourlyForecast(data) {
  const hourlyForecast = document.getElementById('hourlyForecast');
  const temperatureUnit = localStorage.getItem('tempUnit');
  hourlyForecast.innerHTML = '';
  data.forEach(hour => {
    hourlyForecast.innerHTML += `

          <div class="hour-tile">
          <h5>${hour.time.split(' ')[1]} hrs</h5>
          <br>
          <i class="fas weather-icon ${getWeatherIcon(hour.condition.icon)}"></i>
          <br>
          <br>
          <div class="temp-unit">
            <h2>${Math.round(hour.temp_c)}°</h2>
            <h2>${temperatureUnit}<h2>
          </div>
          <p>${hour.condition.text}</p>
          <div class="hour-humidity">${Math.round(hour.wind_speed)} km/h <img src="Images/icons/Cycle.svg" class="word-icon" style="animation-duration: ${10 / (hour.wind_kph || 1)}s;"/></div>
          <div class="hour-humidity"><img src="Images/icons/Drop.svg" alt="" class="word-icon">${Math.round(hour.humidity)}%</div>
        </div>
      `;
  });
}





function updateFiveDayForecast({ city, dailyData }) {
  const fiveDayForecast = document.getElementById('fiveDayForecast');
  const temperatureUnit = localStorage.getItem('tempUnit');
  fiveDayForecast.innerHTML = '';
  dailyData.forEach(day => {
    const date = new Date(day.date);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    fiveDayForecast.innerHTML += `
          
          <div class="weather-tile">
          <br>
          <h3 id="day">${dayOfWeek}</h3>
            <br>
            <h5 class="current-time">${formatCurrentTime(day.date)}</h5>
            <br>
            <div class="weather-icon"><i class="fas weather-condition-icon ${getWeatherIcon(day.day.condition.icon)}"></i></i></div>
            <br>
            <div class="temp-unit">
              <h1>${Math.round(day.day.avgtemp_c)}°</h1>
              <h1>${temperatureUnit}<h1>
            </div>
            <p>${day.day.condition.text}</p>
            <div class="hour-humidity">${Math.round(day.day.maxwind_kph)} km/h <img src="Images/icons/Cycle.svg" class="word-icon" style="animation-duration: ${10 / (day.day.maxwind_kph || 1)}s;"/></div>
            <div class="hour-humidity"><img src="Images/icons/Drop.svg" alt="" class="word-icon">${Math.round(day.day.avghumidity) || 'N/A'}%</div>
            <br>
            <p class="city">${city}</p>
          </div>
      `;
  });
}



// Helper functions
function formatDateTime(dateTime) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleDateString('en-US', options);
}


function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem('savedCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('savedCities', JSON.stringify(cities));
  }
}

function getSavedCities() {
  return JSON.parse(localStorage.getItem('savedCities')) || [];
}

function handleViewSavedCities() {
  const cities = getSavedCities();
  const savedCitiesContainer = document.getElementById('savedCitiesContainer');
  savedCitiesContainer.innerHTML = '';
  cities.forEach(city => {
    savedCitiesContainer.innerHTML += `
      <div class="saved-city-link-container">
        <a href="#" onclick="getWeather('${city}')">${city}</a>
      </div>
    `;
  });
  savedCitiesContainer.classList.toggle('hidden');
}


function setDefaultCity(city) {
  localStorage.setItem('defaultCity', city);
}

function getDefaultCity() {
  return localStorage.getItem('defaultCity');
}

function getWeatherIcon(iconCode) {
  // Map OpenWeatherMap icon codes to Font Awesome icons
  const iconMap = {
    '01d': 'fa-sun', '01n': 'fa-moon',
    '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
    '03d': 'fa-cloud', '03n': 'fa-cloud',
    '04d': 'fa-cloud-meatball', '04n': 'fa-cloud-meatball',
    '09d': 'fa-cloud-showers-heavy', '09n': 'fa-cloud-showers-heavy',
    '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
    '11d': 'fa-bolt', '11n': 'fa-bolt',
    '13d': 'fa-snowflake', '13n': 'fa-snowflake',
    '50d': 'fa-smog', '50n': 'fa-smog'
  };
  return iconMap[iconCode] || 'fa-question';
}





document.getElementById('searchBox').addEventListener('input', function () {
  let query = this.value;
  if (query.length > 2) {
    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=30&appid=9ff7a2e1a4fb2c4b8b21639890b04d7b`)
      .then(response => response.json())
      .then(data => {
        displaySuggestions(data.list);
      });
  }
});

function displaySuggestions(locations) {
  let suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';
  locations.forEach(location => {
    let div = document.createElement('div');
    div.textContent = `${location.name}, ${location.sys.country}`;
    div.addEventListener('click', function () {
      document.getElementById('searchBox').value = this.textContent;
      document.getElementById('suggestions').innerHTML = '';
      document.getElementById('searchButton').click();
    });
    suggestions.appendChild(div);
  });
}




// Existing code...

// Function to handle the search button click event
function handleSearch() {
  const city = document.getElementById('searchBox').value;
  if (city) {
    getWeather(city);
  } else {
    errorMessage.innerHTML = 'Please enter a city name.';
    errorMessage.style.backgroundColor = 'rgb(139, 139, 139)';
    errorMessage.style.top = '20px';
    errorMessage.style.opacity = '1';
    setInterval(() => errorMessage.style.top = '-100px', 7000);
  }
}

//event listener for the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);

document.getElementById('searchBox').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const city = document.getElementById('searchBox').value;
    if (city) {
      getWeather(city);
    } else {
      errorMessage.innerHTML = 'Please enter a city name.';
      errorMessage.style.top = '20px';
      errorMessage.style.backgroundColor = 'rgb(139, 139, 139)';
      errorMessage.style.opacity = '1';
      setInterval(() => errorMessage.style.top = '-100px', 7000);
    }
  }
});














// Function to toggle dark mode
function toggleLightMode() {
  const mainContent = document.querySelector('.main-weather-container');
  const body = document.querySelector('body');
  const bottomContainer = document.querySelector('.bottom-container');
  const currentTile = document.querySelector('.current-weather-tile');
  const searchBar = document.querySelector('.search-bar');
  const sideBar = document.getElementById('sideBar');
  const hideSearchBar = document.getElementById('hideSearchbar');
  const dropdownBarContainer = document.querySelector('.dropdown-bar-container');
  const footer = document.querySelector('.footer');
  const aboutUs = document.querySelectorAll('.about-us');
  const contactUs = document.querySelectorAll('.contact-us');
  const bottomTitles = document.querySelectorAll('.bottom-title');
  const dropdownBars = document.querySelectorAll('.dropdown-bar');
  const themeMessage = document.getElementById('themeMessage');

  mainContent.classList.toggle('light-mode');
  body.classList.toggle('light-mode');
  bottomContainer.classList.toggle('light-mode');
  currentTile.classList.toggle('light-mode');
  searchBar.classList.toggle('light-mode');
  sideBar.classList.toggle('light-mode');
  dropdownBarContainer.classList.toggle('light-mode');
  hideSearchBar.classList.toggle('light-mode');
  footer.classList.toggle('light-mode');



  dropdownBars.forEach(dropdownBar => {
    dropdownBar.classList.toggle('light-mode');
  });

  bottomTitles.forEach(bottomTitle => {
    bottomTitle.classList.toggle('light-mode');
  });

  contactUs.forEach(contactU => {
    contactU.classList.toggle('light-mode');
  });

  aboutUs.forEach(aboutU => {
    aboutU.classList.toggle('light-mode');
  });



  // Save the current theme to localStorage
  if (mainContent.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }

}

// Event listener for the theme toggle button

document.getElementById('toggle-theme').addEventListener('click', function () {
  if (sideBar.classList.contains('light-mode')) {
    themeMessage.innerHTML = '<img src="Images/icons/light mode bulb.svg" alt="Check"> Light mode enabled';
    themeMessage.style.backgroundColor = 'white';
    themeMessage.style.color = 'black';
    themeMessage.style.right = '-95px';
    themeMessage.style.opacity = '1';
    setInterval(() => themeMessage.style.right = '-700px', 5000);
  } else {
    themeMessage.innerHTML = '<img src="Images/icons/dark mode bulb.svg" alt="Check"> Dark mode enabled';
    themeMessage.style.backgroundColor = 'rgb(56, 56, 56)';
    themeMessage.style.color = 'white';
    themeMessage.style.right = '-95px';
    themeMessage.style.opacity = '1';
    setInterval(() => themeMessage.style.right = '-700px', 5000);
  }
  toggleLightMode();
});


// Load the saved theme from localStorage
window.addEventListener('load', function () {
  const savedTheme = localStorage.getItem('theme');
  const content = document.querySelector('.main-weather-container');

  if (savedTheme === 'light') {
    const themeMessage = document.getElementById('themeMessage');
    content.classList.add('light-mode');
    document.querySelector('body').classList.add('light-mode');
    document.querySelector('.bottom-container').classList.add('light-mode');
    document.querySelector('.current-weather-tile').classList.add('light-mode');
    document.querySelector('.search-bar').classList.add('light-mode');
    document.getElementById('hideSearchbar').classList.add('light-mode');
    document.getElementById('sideBar').classList.add('light-mode');
    document.querySelector('.dropdown-bar-container').classList.add('light-mode');
    document.querySelector('.footer').classList.add('light-mode');

    themeMessage.innerHTML = '<img src="Images/icons/dark mode bulb.svg" alt="Check"> Dark mode detected';
    themeMessage.style.backgroundColor = 'rgb(56, 56, 56)';
    themeMessage.style.color = 'white';
    themeMessage.style.right = '-95px';
    themeMessage.style.opacity = '1';
    setInterval(() => themeMessage.style.right = '-700px', 4000);


    document.querySelectorAll('.dropdown-bar').forEach(dropdownBar => {
      dropdownBar.classList.add('light-mode');
    });
    document.querySelectorAll('.bottom-title').forEach(bottomTitle => {
      bottomTitle.classList.add('light-mode');
    });
    document.querySelectorAll('.contact-us').forEach(contactU => {
      contactU.classList.add('light-mode');
    });
    document.querySelectorAll('.about-us').forEach(aboutU => {
      aboutU.classList.add('light-mode');
    })

  } else {
    themeMessage.innerHTML = '<img src="Images/icons/light mode bulb.svg" alt="Check"> Light mode detected';
    themeMessage.style.backgroundColor = 'white';
    themeMessage.style.color = 'black';
    themeMessage.style.right = '-95px';
    themeMessage.style.opacity = '1';
    setInterval(() => themeMessage.style.right = '-700px', 4000);
  }
});


// Function to reapply dark mode to the main weather tile
function applyLightMode() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.querySelector('.main-weather-container').classList.add('light-mode');
  }

}

// This is to apply dark mode when the page loads
applyLightMode();



window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.link1')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.link2')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.link3')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.link4')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.link5')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});



window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.button1')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.button2')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.button3')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.button4')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

window.addEventListener('scroll', function () {
  const footerIcons = document.querySelector('.button5')
  if (window.scrollY > 900) {
    footerIcons.style.animationPlayState = 'running';
  }
});

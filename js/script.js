const API_KEY = '7a31f406b496d7d110540063fea1172a';
document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '7a31f406b496d7d110540063fea1172a';  // Replace with your OpenWeather API key
    const search = document.getElementById('search');
    const current = document.getElementById('current-weather');
    const hourly = document.getElementById('hourly-list');
    const daily = document.getElementById('five-day-list');
    const suggestionsBox = document.getElementById('suggestions');
    const errorMessage = document.getElementById('error');
    const mainContainer = document.getElementById('weather-container');
    const themeToggle = document.getElementById('theme-switch');
    const settingsModal = document.getElementById('settings-modal');
    const themeSelect = document.getElementById('theme-select');
    const unitSelect = document.getElementById('unit-select');
    const locationInput = document.getElementById('location-input');
    const geolocationCheckbox = document.getElementById('geolocation-select');

    let isMetric = localStorage.getItem('units') === 'metric';
    let theme = localStorage.getItem('theme') || 'light';
    const defaultCity = localStorage.getItem('defaultCity') || 'Lusaka';

    // Initialize with default city or current location
    initialize(defaultCity);

    // Event listeners
    search.addEventListener('keydown', handleSearchKeydown); // Added for Enter key
    document.getElementById('search-button').addEventListener('click', handleSearchButtonClick); // Added for button click
    document.getElementById('use-geolocation').addEventListener('click', useCurrentLocation);
    document.getElementById('unit-toggle').addEventListener('click', toggleUnits);
    themeToggle.addEventListener('change', toggleTheme);
    document.getElementById('settings-button').addEventListener('click', () => settingsModal.style.display = 'block');
    document.getElementById('close-settings').addEventListener('click', () => settingsModal.style.display = 'none');
    document.getElementById('save-settings').addEventListener('click', saveSettings);



    function initialize(city) {
        applyTheme();
        if (navigator.geolocation && geolocationCheckbox.checked) {
            navigator.geolocation.getCurrentPosition(
                position => fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude),
                () => updateWeather(city)
            );
        } else {
            updateWeather(city);
        }
    }


    // Handle Enter key press in the search input field
    function handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            handleSearchButtonClick();  // Trigger the search button click behavior
        }
    }

    // Handle the click on the search button
    function handleSearchButtonClick() {
        const city = search.value;
        if (city) {
            updateWeather(city); // Trigger weather update when search button is clicked
            suggestionsBox.style.display = 'none'; // Hide suggestions after search
        }
    }

    // Display the city suggestions
function displaySuggestions(cities) {
    console.log(cities); // Log the city data to inspect it
    suggestionsBox.innerHTML = cities.map(city => `
      <li class="suggestion" data-city="${city.name}"><img src="images/icons/Location black.svg"> ${city.name}, ${city.sys.country}</li>
  `).join('');
    suggestionsBox.style.display = 'block';

    // Add event listener to each suggestion item
    document.querySelectorAll('.suggestion').forEach(suggestion => {
        suggestion.addEventListener('click', function () {
            search.value = this.getAttribute('data-city');
            suggestionsBox.style.display = 'none';  // Hide suggestions after selection
            updateWeather(search.value); // Trigger weather update with the selected city
        });
    });
}

// Handle the search input to display suggestions
function handleSearchInput() {
    const city = search.value;
    if (city.length > 0) {
        fetch(`https://api.openweathermap.org/data/2.5/find?q=${city}&type=like&sort=population&cnt=30&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => displaySuggestions(data.list))
            .catch(error => console.error('Error:', error));
    } else {
        suggestionsBox.style.display = 'none';  // Hide suggestions if input is too short
    }
}

// Add event listener to input field
search.addEventListener('input', handleSearchInput);

    

    function updateWeather(city) {
        if (!city) return; 
        fetchWeatherData(city)
            .then(data => {
                updateCurrentWeather(data);
                fetchForecastData(city).then(forecastData => {
                    updateHourlyForecast(forecastData.list.slice(0, 14));
                    updateDailyForecast(forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5));
                    mainContainer.style.display = 'block';
                });
            })
    }

    function useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
            });
        } else {
            errorMessage.innerHTML = 'Geolocation is not supported on this browser <br> Default city will be used insted.'
            errorMessage.style.top = '20px';
            errorMessage.style.opacity = '1';
            setInterval(() => errorMessage.style.top = '-100px', 7000);
        }
    }

    function fetchWeatherData(city) {
        const units = isMetric ? 'metric' : 'imperial';
        return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`)
            .then(response => response.json());
    }

    function fetchForecastData(city) {
        const units = isMetric ? 'metric' : 'imperial';
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`)
            .then(response => response.json());
    }

    function fetchWeatherByCoordinates(lat, lon) {
        const units = isMetric ? 'metric' : 'imperial';

 
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
            .then(response => response.json())
            .then(data => {
                updateCurrentWeather(data);
                fetchForecastByCoordinates(lat, lon).then(forecastData => {
                    updateHourlyForecast(forecastData.list.slice(0, 6));
                    updateDailyForecast(forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5));

                });
            })
    }

    function fetchForecastByCoordinates(lat, lon) {
        const units = isMetric ? 'metric' : 'imperial';
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
            .then(response => response.json());
    }

    function updateCurrentWeather(data) {
        const iconClass = getIconClass(data.weather[0].main);
        current.innerHTML = `
          <div class="current-left">
              <h3 class="current-location">${data.name}, ${data.sys.country}</h3>  <!-- Showing country code -->
              <p class="current-day">${new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p class="current-time">${new Date().toLocaleTimeString()}</p>
              <p class="current-condition">${data.weather[0].description}</p>
              <p class="current-humidity">Humidity: ${data.main.humidity}%</p>
              <p class="current-wind-speed"><i class="fas fa-wind"></i> ${data.wind.speed} ${isMetric ? 'm/s' : 'mph'}</p>
          </div>
          <div class="current-right">
              <i class="fas ${iconClass} fa-5x"></i>
              <p class="current-temperature">${data.main.temp}°${isMetric ? 'C' : 'F'}</p>
          </div>
      `;
    }

    function updateHourlyForecast(data) {
        hourly.innerHTML = data.map(item => {
            const iconClass = getIconClass(item.weather[0].main);
            return `
              <div class="hour-tile">
                  <h5 class="time">${new Date(item.dt_txt).getHours()}:00</h5>
                  <br>
                  <i class="fas ${iconClass} fa-2x"></i>
                  <br>
                  <br>
                  <h3 class="hourly-temperature">${item.main.temp}°${isMetric ? 'C' : 'F'}</3>
              </div>
          `;
        }).join('');
    }

    function updateDailyForecast(data) {
        daily.innerHTML = data.map(item => {
            const iconClass = getIconClass(item.weather[0].main);
            const dayName = getDayName(item.dt_txt);
            return `
              <div class="hour-tile">
                  <h5 class="time">${dayName}</h5>
                  <br>
                  <h3 class="hourly-temperature">${item.main.temp}°${isMetric ? 'C' : 'F'}</h3>
                  <br>
                  <div class="daily-condition">
                      <i class="fas ${iconClass} fa-2x"></i>
                      <h5 class="condition">${item.weather[0].description}</h5>
                  </div>
                  <br>
              </div>
          `;
        }).join('');
    }

    function getIconClass(condition) {
        switch (condition.toLowerCase()) {
            case 'clear':
                return 'fa-sun';
            case 'clouds':
                return 'fa-cloud';
            case 'rain':
                return 'fa-cloud-showers-heavy';
            case 'snow':
                return 'fa-snowflake';
            case 'thunderstorm':
                return 'fa-bolt';
            default:
                return 'fa-smog';
        }
    }

    function getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }


    function toggleUnits() {
        isMetric = !isMetric;
        localStorage.setItem('units', isMetric ? 'metric' : 'imperial');
        updateWeather(search.value || defaultCity);
    }

    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme();
    }

    function applyTheme() {
        document.body.classList.toggle('dark', theme === 'dark');
        document.body.classList.toggle('light', theme === 'light');
    }

    function saveSettings() {
        localStorage.setItem('theme', themeSelect.value);
        localStorage.setItem('units', unitSelect.value);
        localStorage.setItem('defaultCity', locationInput.value);
        localStorage.setItem('geolocation', geolocationCheckbox.checked ? 'on' : 'off');
        settingsModal.style.display = 'none';
        initialize(locationInput.value);
    }
});

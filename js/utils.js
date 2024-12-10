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



document.addEventListener('DOMContentLoaded', function () {
  let sidebar = document.getElementById('sidebar');
  let mainContent = document.getElementById('sideBar');

  let startX;

  document.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
  });

  document.addEventListener('touchmove', function (e) {
      let touch = e.touches[0];
      let change = touch.clientX - startX;

      if (change > 170) { // Swipe right
          sidebar.classList.add('active');

      } else if (change < -70) { // Swipe left
          sidebar.classList.remove('active');

      }
  });
});


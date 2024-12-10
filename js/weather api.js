
let isMetric = localStorage.getItem('units') === 'metric';



async function fetchWeatherDataByCoordinates(lat, lon) {
  try {
    const units = isMetric ? 'imperial' : 'metric';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`);
    const data = await response.json();
     console.log(data); // Log the raw data to see the structure

    return {
      location: {
        name: data.name,
        country: data.sys.country
      },
      current: {
        temp_c: data.main.temp,
        humidity: data.main.humidity,
        wind_kph: data.wind.speed * 3.6,  // Convert m/s to km/h
        condition: {
          text: data.weather[0].description,
          icon: data.weather[0].icon
        },
        last_updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
 


async function fetchWeatherData(city) {
  try {
    const units = isMetric ? 'imperial' : 'metric';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
    const data = await response.json();
    console.log(data); // Log the raw data to see the structure

    return {
      location: {
        name: data.name,
        country: data.sys.country
      },
      current: {
        temp_c: data.main.temp,
        humidity: data.main.humidity,
        wind_kph: data.wind.speed * 3.6,  // Convert m/s to km/h
        condition: {
          text: data.weather[0].description,
          icon: data.weather[0].icon
        },
        last_updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}


async function fetchFiveDayForecast(city) {
  try {
    const units = isMetric ? 'imperial' : 'metric';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
    const data = await response.json();
    const dailyData = [];
    data.list.forEach(hour => {
      const date = hour.dt_txt.split(' ')[0];
      if (!dailyData.find(d => d.date === date)) {
        dailyData.push({
          date: date,
          day: {
            avgtemp_c: hour.main.temp,
            maxwind_kph: hour.wind.speed * 3.6, // Convert m/s to km/h
            avghumidity: hour.main.humidity,
            condition: {
              text: hour.weather[0].description,
              icon: hour.weather[0].icon
            }
          }
        });
      }
    });
    return { city, dailyData: dailyData.slice(1, 5) };
  } catch (error) {
    console.error('Error fetching five-day forecast:', error);
    throw error;
  }
}


async function fetchHourlyForecast(city) {
  try {
    const units = isMetric ? 'imperial' : 'metric';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
    const data = await response.json();
    return data.list.slice(0, 6).map(hour => ({
      time: hour.dt_txt,
      temp_c: hour.main.temp,
      humidity: hour.main.humidity, // Add humidity
      wind_speed: hour.wind.speed,  // Add wind speed (in m/s)
      condition: {
        text: hour.weather[0].description,
        icon: hour.weather[0].icon
      },
      is_day: hour.sys.pod === 'd'
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
}
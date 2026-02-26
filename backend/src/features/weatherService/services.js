import axios from 'axios';

class WeatherService {
  constructor() {
    this.baseURL = process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1';
  }

  async getCurrentWeather(lat, lon, unit = 'celsius') {
    try {
      const temperatureUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit';
      
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          temperature_unit: temperatureUnit,
          timezone: 'auto'
        },
        timeout: 5000 // 5 second timeout
      });

      return this.formatCurrentWeather(response.data);
    } catch (error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
  }

  async getForecast(lat, lon, days = 5, unit = 'celsius') {
    try {
      const temperatureUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit';
      
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max'],
          temperature_unit: temperatureUnit,
          timezone: 'auto',
          forecast_days: days
        },
        timeout: 5000
      });

      return this.formatForecast(response.data);
    } catch (error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
  }

  async searchCity(query) {
    try {
      // Using Open-Meteo geocoding API
      const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: query,
          count: 5,
          language: 'en',
          format: 'json'
        }
      });

      return this.formatCityResults(response.data);
    } catch (error) {
      throw new Error(`Geocoding API error: ${error.message}`);
    }
  }

  formatCurrentWeather(data) {
    const weather = data.current_weather;
    
    return {
      temperature: weather.temperature,
      unit: data.current_weather_units?.temperature || '°C',
      windspeed: weather.windspeed,
      winddirection: weather.winddirection,
      weatherCode: weather.weathercode,
      time: weather.time
    };
  }

  formatForecast(data) {
    const daily = data.daily;
    const forecast = [];
    
    for (let i = 0; i < daily.time.length; i++) {
      forecast.push({
        date: daily.time[i],
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        precipitationProbability: daily.precipitation_probability_max[i],
        weatherCode: daily.weathercode[i]
      });
    }
    
    return forecast;
  }

  formatCityResults(data) {
    if (!data.results) return [];
    
    return data.results.map(city => ({
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
      timezone: city.timezone
    }));
  }

  // Weather code to description mapping
  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
  }
}

const weatherServices = new WeatherService();
export default weatherServices;
// frontend/src/components/weather/WeatherCard.jsx
import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ city, onRemove }) => {
  if (city.error) {
    return (
      <div className="weather-card error">
        <h3>{city.cityName}, {city.country}</h3>
        <p className="error-message">Failed to load weather data</p>
        <button onClick={() => onRemove(city.cityId)} className="remove-btn">
          Remove
        </button>
      </div>
    );
  }

  const getWeatherIcon = (code) => {
    // Simple weather icon mapping
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  };

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h3>{city.cityName}, {city.country}</h3>
        <button onClick={() => onRemove(city.cityId)} className="remove-btn">
          ×
        </button>
      </div>

      <div className="weather-main">
        <span className="weather-icon">{getWeatherIcon(city.current.weatherCode)}</span>
        <span className="temperature">
          {city.current.temperature}°{city.current.unit}
        </span>
      </div>

      <p className="weather-description">{city.description}</p>

      <div className="weather-details">
        <div className="detail">
          <span>Wind</span>
          <span>{city.current.windspeed} km/h</span>
        </div>
      </div>

      <div className="forecast-preview">
        <h4>5-Day Forecast</h4>
        <div className="forecast-mini">
          {city.forecast.slice(0, 3).map((day, index) => (
            <div key={index} className="forecast-day">
              <span>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span>{getWeatherIcon(day.weatherCode)}</span>
              <span>{day.maxTemp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
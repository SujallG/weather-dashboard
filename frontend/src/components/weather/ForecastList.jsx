// frontend/src/components/weather/ForecastList.jsx
import React from 'react';
import './ForecastList.css';

const ForecastList = ({ forecast }) => {
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="forecast-list">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-icon">{getWeatherIcon(day.weatherCode)}</div>
            <div className="forecast-temp">
              <span className="max-temp">{day.maxTemp}°</span>
              <span className="min-temp">{day.minTemp}°</span>
            </div>
            <div className="forecast-precip">
              Rain: {day.precipitationProbability}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
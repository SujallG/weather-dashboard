// frontend/src/components/weather/CityList.jsx
import React from 'react';
import WeatherCard from './WeatherCard';
import './CityList.css';

const CityList = ({ cities, onRemoveCity }) => {
  if (!cities || cities.length === 0) {
    return (
      <div className="empty-state">
        <p>No cities added yet. Search for a city to get started!</p>
      </div>
    );
  }

  return (
    <div className="city-list">
      {cities.map((city) => (
        <WeatherCard
          key={city.cityId}
          city={city}
          onRemove={onRemoveCity}
        />
      ))}
    </div>
  );
};

export default CityList;
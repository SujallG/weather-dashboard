// frontend/src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import CitySearch from '../components/weather/CitySearch';
import CityList from '../components/weather/CityList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const {
    weatherData,
    weatherLoading,
    weatherError,
    addCity,
    removeCity,
  } = useWeather();

  const [addingCity, setAddingCity] = useState(false);

  const handleAddCity = async (cityData) => {
    setAddingCity(true);
    try {
      await addCity.mutateAsync(cityData);
    } catch (error) {
      console.error('Failed to add city:', error);
    } finally {
      setAddingCity(false);
    }
  };

  const handleRemoveCity = async (cityId) => {
    try {
      await removeCity.mutateAsync(cityId);
    } catch (error) {
      console.error('Failed to remove city:', error);
    }
  };

  if (weatherLoading) {
    return <LoadingSpinner />;
  }

  if (weatherError) {
    return (
      <div className="error-container">
        <p>Failed to load weather data. Please try again.</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Weather Dashboard</h1>
        <div className="add-city-section">
          <CitySearch onCitySelect={handleAddCity} />
          {addingCity && (
            <div className="adding-city-indicator">
              <span className="spinner-small"></span>
              Adding city...
            </div>
          )}
        </div>
      </div>

      {weatherData.length === 0 ? (
        <div className="empty-state">
          <h3>No cities added yet</h3>
          <p>Search for a city above to add it to your dashboard</p>
        </div>
      ) : (
        <CityList
          cities={weatherData}
          onRemoveCity={handleRemoveCity}
        />
      )}
    </div>
  );
};

export default Dashboard;
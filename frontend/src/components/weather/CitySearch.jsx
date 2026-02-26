// frontend/src/components/weather/CitySearch.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService } from '../../services/weatherService';
import './CitySearch.css';

const CitySearch = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeout = useRef(null);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const response = await weatherService.searchCities(searchQuery);
      setResults(response.cities || []);
    } catch (err) {
      setError('Failed to search cities');
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for debounced search
    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleCitySelect = (city) => {
    onCitySelect({
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setQuery('');
    setResults([]);
  };

  return (
    <div className="city-search">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="search-input"
        />
        {isSearching && <div className="search-spinner">🔍</div>}
      </div>

      {error && <div className="search-error">{error}</div>}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((city, index) => (
            <div
              key={`${city.name}-${city.country}-${city.latitude}-${index}`}
              className="search-result-item"
              onClick={() => handleCitySelect(city)}
            >
              <span className="city-name">{city.name}</span>
              <span className="city-country">{city.country}</span>
              {city.population && (
                <span className="city-population">
                  Pop: {city.population.toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
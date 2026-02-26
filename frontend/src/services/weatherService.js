// frontend/src/services/weatherService.js
import api from './api';

export const weatherService = {
  async getUserWeather() {
    try {
      const response = await api.get('/weather/my-weather');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async searchCities(query) {
    try {
      const response = await api.get(`/weather/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async addCity(cityData) {
    try {
      const response = await api.post('/weather/cities', cityData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async removeCity(cityId) {
    try {
      const response = await api.delete(`/weather/cities/${cityId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async reorderCities(cityOrders) {
    try {
      const response = await api.post('/weather/cities/reorder', { cityOrders });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'Weather service error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Cannot connect to weather service. Please check your connection.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500
      };
    }
  }
};
import cityRepository from './repo.js';
import weatherService from './services.js';

class WeatherController {
  async getUserCitiesWeather(req, res, next) {
    try {
      const cities = await cityRepository.findByUserId(req.user.userId);
      
      if (cities.length === 0) {
        return res.json({ weather: [] });
      }

      const unit = req.user.preferences?.temperatureUnit || 'celsius';
      
      // Fetch weather for all cities
      const weatherPromises = cities.map(async (city) => {
        try {
          const current = await weatherService.getCurrentWeather(
            city.latitude,
            city.longitude,
            unit
          );
          
          const forecast = await weatherService.getForecast(
            city.latitude,
            city.longitude,
            5,
            unit
          );

          return {
            cityId: city._id,
            cityName: city.name,
            country: city.country,
            current,
            forecast,
            description: weatherService.getWeatherDescription(current.weatherCode)
          };
        } catch (error) {
          // Return partial data for failed cities
          return {
            cityId: city._id,
            cityName: city.name,
            country: city.country,
            error: 'Failed to fetch weather data'
          };
        }
      });

      const weatherData = await Promise.all(weatherPromises);

      res.json({ weather: weatherData });
    } catch (error) {
      next(error);
    }
  }

  async addCity(req, res, next) {
    try {
      const { name, country, latitude, longitude } = req.body;

      // Check if city already exists for user
      const existingCity = await cityRepository.findByIdAndUser(
        req.body.cityId,
        req.user.userId
      );

      if (existingCity) {
        return res.status(409).json({ message: 'City already added' });
      }

      const city = await cityRepository.create({
        userId: req.user.userId,
        name,
        country,
        latitude,
        longitude
      });

      res.status(201).json({
        message: 'City added successfully',
        city
      });
    } catch (error) {
      next(error);
    }
  }

  async removeCity(req, res, next) {
    try {
      const { cityId } = req.params;

      const city = await cityRepository.delete(cityId, req.user.userId);

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      res.json({
        message: 'City removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async searchCities(req, res, next) {
    try {
      const { query } = req.query;

      if (!query || query.length < 2) {
        return res.json({ cities: [] });
      }

      const cities = await weatherService.searchCity(query);

      res.json({ cities });
    } catch (error) {
      next(error);
    }
  }

  async reorderCities(req, res, next) {
    try {
      const { cityOrders } = req.body;

      await cityRepository.updateDisplayOrder(req.user.userId, cityOrders);

      res.json({
        message: 'Cities reordered successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

const weatherController = new WeatherController();
export default weatherController;
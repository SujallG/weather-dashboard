// frontend/src/hooks/useWeather.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';
import toast from 'react-hot-toast';

export const useWeather = () => {
  const queryClient = useQueryClient();

  // Query for fetching weather data
  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ['weather'],
    queryFn: () => weatherService.getUserWeather(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: (error) => {
      toast.error('Failed to load weather data');
    }
  });

  // Search cities function (not a mutation, just a regular function)
  const searchCities = async (query) => {
    try {
      const response = await weatherService.searchCities(query);
      return response;
    } catch (error) {
      toast.error('Failed to search cities');
      throw error;
    }
  };

  // Add city mutation
  const addCity = useMutation({
    mutationFn: (cityData) => weatherService.addCity(cityData),
    onSuccess: () => {
      queryClient.invalidateQueries(['weather']);
      toast.success('City added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add city');
    },
  });

  // Remove city mutation
  const removeCity = useMutation({
    mutationFn: (cityId) => weatherService.removeCity(cityId),
    onSuccess: () => {
      queryClient.invalidateQueries(['weather']);
      toast.success('City removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove city');
    },
  });

  return {
    weatherData: weatherData?.weather || [],
    weatherLoading,
    weatherError,
    refetchWeather,
    searchCities, 
    addCity,
    removeCity,
  };
};
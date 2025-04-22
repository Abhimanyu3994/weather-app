import { WeatherData } from '../types';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.error('OpenWeatherMap API key is missing. Please check your .env file.');
      throw new Error('OpenWeatherMap API key is not configured');
    }

    console.log('Using API key:', OPENWEATHER_API_KEY); // For debugging

    const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    console.log('Request URL:', url); // For debugging

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Weather API error response:', errorData);
      throw new Error(`Weather API request failed with status ${response.status}: ${errorData?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.main || !data.weather || !data.weather[0]) {
      console.error('Invalid weather data structure:', data);
      throw new Error('Invalid weather data received from API');
    }

    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default weather data in case of error
    return {
      temperature: 0,
      description: 'Weather data unavailable',
      icon: '01d' // Default clear sky icon
    };
  }
}; 
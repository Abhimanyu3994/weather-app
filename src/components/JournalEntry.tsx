import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MOOD_OPTIONS } from '../constants/moods';
import { getWeatherData } from '../services/weatherService';
import { saveEntry } from '../services/journalService';
import { JournalEntry as JournalEntryType, WeatherData } from '../types';

const JournalEntry: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const weatherData = await getWeatherData(latitude, longitude);
              setWeather(weatherData);
              setIsLoading(false);
            },
            (error) => {
              setError('Unable to retrieve your location');
              console.error(error);
              setIsLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser');
          setIsLoading(false);
        }
      } catch (error) {
        setError('Failed to fetch weather data');
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    const newEntry: JournalEntryType = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: selectedMood as any,
      notes,
      weather: weather as WeatherData
    };

    saveEntry(newEntry);
    setSuccess('Entry saved successfully!');
    setSelectedMood('');
    setNotes('');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Journal Entry</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {formatDisplayDate(selectedDate)}
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          {isLoading ? (
            <div className="text-gray-600">Loading weather data...</div>
          ) : weather ? (
            <div className="flex items-center text-gray-600">
              <img
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="w-10 h-10 mr-2"
              />
              <span>{weather.temperature}°C - {weather.description}</span>
            </div>
          ) : (
            <div className="text-gray-600">Weather data unavailable</div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-4">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.type}
                  type="button"
                  onClick={() => setSelectedMood(mood.type)}
                  className={`p-4 rounded-lg text-2xl transition-all ${
                    selectedMood === mood.type
                      ? `bg-${mood.color}-100 border-2 border-${mood.color}-500`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Write your thoughts here..."
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="mb-4 text-green-500 text-sm">{success}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default JournalEntry; 
import React, { useState } from 'react';
import { format } from 'date-fns';
import { getAllEntries } from '../services/journalService';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';

const AllEntries: React.FC = () => {
  const [entries] = useState<JournalEntry[]>(getAllEntries());
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getMoodEmoji = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.type === mood);
    return moodOption ? moodOption.emoji : '';
  };

  const getMoodColor = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.type === mood);
    return moodOption ? moodOption.color : 'gray';
  };

  const handleMoodChange = (mood: string) => {
    setIsTransitioning(true);
    setSelectedMood(mood);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const filteredEntries = selectedMood
    ? entries.filter(entry => entry.mood === selectedMood)
    : entries;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Entries</h1>
      
      <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Mood
          </label>
          <div className="grid grid-cols-5 gap-4">
            <button
              onClick={() => handleMoodChange('')}
              className={`p-4 rounded-lg text-2xl transition-all duration-300 transform hover:scale-110 ${
                !selectedMood
                  ? 'bg-orange-100 border-2 border-orange-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.type}
                onClick={() => handleMoodChange(mood.type)}
                className={`p-4 rounded-lg text-2xl transition-all duration-300 transform hover:scale-110 ${
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

        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No entries found
            </div>
          ) : (
            filteredEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => {
                const moodColor = getMoodColor(entry.mood);
                return (
                  <div
                    key={entry.id}
                    className={`border rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-${moodColor}-50 to-${moodColor}-100 hover:from-${moodColor}-100 hover:to-${moodColor}-200 border-${moodColor}-200`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {getMoodEmoji(entry.mood)}
                        </span>
                        <span className="font-semibold capitalize">{entry.mood}</span>
                      </div>
                      <span className="text-gray-500">
                        {format(new Date(entry.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    
                    {entry.weather && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <img
                          src={`http://openweathermap.org/img/wn/${entry.weather.icon}@2x.png`}
                          alt={entry.weather.description}
                          className="w-8 h-8 mr-2"
                        />
                        <span>
                          {entry.weather.temperature}°C - {entry.weather.description}
                        </span>
                      </div>
                    )}
                    
                    {entry.notes && (
                      <p className="text-gray-700">{entry.notes}</p>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEntries; 
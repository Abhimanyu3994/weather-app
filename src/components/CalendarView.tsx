import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, isSameMonth, isSameDay, addDays } from 'date-fns';
import { getAllEntries, getEntriesByDate } from '../services/journalService';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';

const eachDayOfInterval = ({ start, end }: { start: Date; end: Date }): Date[] => {
  const days: Date[] = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
};

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const entries = getAllEntries();

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const dateString = format(day, 'yyyy-MM-dd');
    const dayEntries = getEntriesByDate(dateString);
    setSelectedEntry(dayEntries[0] || null);
  };

  const getMoodEmoji = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.type === mood);
    return moodOption ? moodOption.emoji : '';
  };

  const getEntryForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entries.find(entry => entry.date === dateString);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Calendar View</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            Previous
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day: Date) => {
            const entry = getEntryForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={`p-4 rounded-lg text-center ${
                  isSameMonth(day, currentDate)
                    ? 'hover:bg-gray-100'
                    : 'text-gray-400'
                } ${
                  isSelected
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : ''
                }`}
              >
                <div className="text-sm mb-1">{format(day, 'd')}</div>
                {entry && (
                  <div className="text-2xl">
                    {getMoodEmoji(entry.mood)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedEntry && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {format(new Date(selectedEntry.date), 'MMMM d, yyyy')}
            </h3>
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">
                {getMoodEmoji(selectedEntry.mood)}
              </span>
              <span className="capitalize">{selectedEntry.mood}</span>
            </div>
            {selectedEntry.weather && (
              <div className="flex items-center text-gray-600 mb-2">
                <img
                  src={`http://openweathermap.org/img/wn/${selectedEntry.weather.icon}@2x.png`}
                  alt={selectedEntry.weather.description}
                  className="w-8 h-8 mr-2"
                />
                <span>
                  {selectedEntry.weather.temperature}°C - {selectedEntry.weather.description}
                </span>
              </div>
            )}
            {selectedEntry.notes && (
              <p className="text-gray-700">{selectedEntry.notes}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView; 
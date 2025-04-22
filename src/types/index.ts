export type Mood = 'happy' | 'sad' | 'angry' | 'calm' | 'anxious';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  notes: string;
  weather: WeatherData;
}

export interface MoodOption {
  type: Mood;
  emoji: string;
  color: string;
} 
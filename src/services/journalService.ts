import { JournalEntry } from '../types';

const STORAGE_KEY = 'moodJournalEntries';

export const saveEntry = (entry: JournalEntry): void => {
  const entries = getAllEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const getAllEntries = (): JournalEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const getEntriesByDate = (date: string): JournalEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => entry.date === date);
};

export const getEntriesByMood = (mood: string): JournalEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => entry.mood === mood);
}; 
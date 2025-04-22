import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JournalEntry from './components/JournalEntry';
import CalendarView from './components/CalendarView';
import Navbar from './components/Navbar';
import AllEntries from './components/AllEntries';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<JournalEntry />} />
            <Route path="/entries" element={<AllEntries />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

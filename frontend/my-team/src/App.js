import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DiabetesPage from './components/DiabetesPage';
import KidneyPage from './components/KidneyPage';
import CardioPage from './components/CardioPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cardio" element={<CardioPage />} />
        <Route path="/diabetes" element={<DiabetesPage />} />
        <Route path="/kidney" element={<KidneyPage />} />
      </Routes>
    </Router>
  );
}

export default App;

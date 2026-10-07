import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import KartuNama from './components/KartuNama/KartuNama';
import PublicCard from './components/PublicCard/PublicCard';
import ScanQR from './components/ScanQR/ScanQR';
import JanjiTemu from './components/JanjiTemu/JanjiTemu';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/card/:id" element={<PublicCard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/kartu-nama" element={<KartuNama />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/janji-temu/:id" element={<JanjiTemu />} />
      </Routes>
    </Router>
  );
}

export default App;

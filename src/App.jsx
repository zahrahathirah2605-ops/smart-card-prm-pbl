import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import KartuNama from './components/KartuNama/KartuNama';
import PublicCard from './components/PublicCard/PublicCard';
import ScanQR from './components/ScanQR/ScanQR';
import JanjiTemu from './components/JanjiTemu/JanjiTemu';
import RiwayatPRM from './components/RiwayatPRM/RiwayatPRM';

// Admin Components
import AdminHome from './components/Admin/AdminHome';
import AdminPengguna from './components/Admin/AdminPengguna';
import AdminAktivitas from './components/Admin/AdminAktivitas';
import AdminTambahPengguna from './components/Admin/AdminTambahPengguna';

import KelolaPRM from './components/KelolaPRM/KelolaPRM';
import KontakRelasi from './components/KontakRelasi/KontakRelasi';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public & User Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/card/:id" element={<PublicCard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/kartu-nama" element={<KartuNama />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/janji-temu/:id" element={<JanjiTemu />} />
        <Route path="/riwayat-prm" element={<RiwayatPRM />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/pengguna" element={<AdminPengguna />} />
        <Route path="/admin/aktivitas" element={<AdminAktivitas />} />
        <Route path="/admin/tambah-pengguna" element={<AdminTambahPengguna />} />
        <Route path="/kelola-prm" element={<KelolaPRM />} />
        <Route path="/kontak-relasi" element={<KontakRelasi />} />
      </Routes>
    </Router>
  );
}

export default App;
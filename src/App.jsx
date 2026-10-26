import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import KartuNama from './components/KartuNama/KartuNama';
import PublicCard from './components/PublicCard/PublicCard';
import ScanQR from './components/ScanQR/ScanQR';
import JanjiTemu from './components/JanjiTemu/JanjiTemu';
import JadwalPertemuan from './components/JanjiTemu/JadwalPertemuan';
import RiwayatPRM from './components/RiwayatPRM/RiwayatPRM';

// Admin Components
import AdminHome from './components/Admin/AdminHome';
import AdminPengguna from './components/Admin/AdminPengguna';
import AdminAktivitas from './components/Admin/AdminAktivitas';
import AdminTambahPengguna from './components/Admin/AdminTambahPengguna';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import KelolaPRM from './components/KelolaPRM/KelolaPRM';
import KontakRelasi from './components/KontakRelasi/KontakRelasi';
import TambahKontakEksternal from './components/KontakRelasi/TambahKontakEksternal';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Visitor Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/card/:id" element={<PublicCard />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/janji-temu/:id" element={<JanjiTemu />} />

        {/* Protected User Routes (Require Authentication) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kartu-nama"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <KartuNama />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jadwal-prm"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <JadwalPertemuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-prm"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <RiwayatPRM />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-prm"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <KelolaPRM />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kontak-relasi"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <KontakRelasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kontak-relasi/eksternal/create"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <TambahKontakEksternal />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pengguna"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPengguna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/aktivitas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAktivitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tambah-pengguna"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTambahPengguna />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
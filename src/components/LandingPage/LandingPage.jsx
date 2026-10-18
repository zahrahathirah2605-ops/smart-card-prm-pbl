import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../Navbar/PublicNavbar';
import Footer from '../Footer/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Public Navbar (no internal routes) */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Decorative Gradient Elements */}
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow secondary"></div>
        <div className="hero-bg-pattern-grid"></div>

        <div className="hero-content">
          <div className="badge">
            <span className="badge-pulse"></span>
            Official Campus PRM & Smart Card Ecosystem
          </div>
          <h1 className="hero-title">
            Membuka Jaringan Profesional dengan<br /> 
            <span className="highlight-text">Smart Business Card Polibatam</span>
          </h1>
          <p className="hero-subtitle">
            Platform kartu nama pintar dan manajemen hubungan kemitraan internal civitas akademika Politeknik Negeri Batam. Hubungkan kontak secara instan, unduh kartu nama digital PDF, dan jadwalkan pertemuan (PRM) secara resmi.
          </p>

          <div className="landing-action-container">
            <div className="landing-scan-box">
              <span className="landing-scan-title">Pindai Kartu Digital Pengunjung</span>
              <p className="landing-scan-hint">Scan QR Code pada kartu fisik atau layar untuk langsung menyimpan kontak dan buat janji temu</p>
              <button className="scan-btn-main" onClick={() => navigate('/scan')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>Buka Kamera & Scan QR</span>
              </button>
            </div>

            <div className="landing-features-preview">
              <div className="feature-mini-pill">
                <span className="feat-icon">⚡</span>
                <div>
                  <strong>Akses Cepat Pengunjung</strong>
                  <p>Tanpa perlu registrasi untuk melihat kartu & vCard</p>
                </div>
              </div>
              <div className="feature-mini-pill">
                <span className="feat-icon">📅</span>
                <div>
                  <strong>Jadwal Janji Temu (PRM)</strong>
                  <p>Ajukan pertemuan formal langsung ke pemilik kartu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

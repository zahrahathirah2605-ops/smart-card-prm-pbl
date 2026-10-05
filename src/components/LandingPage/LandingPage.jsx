import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-container">
            <div className="logo-mark"></div>
            <span className="logo-text">SmartCard</span>
          </div>
          <nav className="navbar-links">
            <button className="nav-btn masuk-btn" onClick={() => navigate('/login')}>Masuk</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Decorative Elements */}
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow secondary"></div>

        <div className="hero-content">
          <div className="badge">Platform PRM & Business Card</div>
          <h1 className="hero-title">
            Selamat datang di<br /> 
            <span className="highlight-text">website kami</span>
          </h1>
          <p className="hero-subtitle">
            Bangun relasi bisnis yang lebih kuat dengan smart business card modern. 
            Kelola kontak dan jaringan Anda dalam satu platform cerdas.
          </p>

          <div className="hero-actions">
            <button className="scan-btn primary-btn" onClick={() => navigate('/card/123')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="camera-icon">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              Scan QR Code
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

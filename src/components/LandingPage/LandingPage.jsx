import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo-poltek-putih.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-container" onClick={() => navigate('/')}>
            <img
              src={logoImg}
              alt="Politeknik Negeri Batam"
              style={{
                height: '46px',
                width: 'auto',
                maxWidth: '260px',
                objectFit: 'contain',
                display: 'block',
                cursor: 'pointer'
              }}
            />
          </div>
          <nav className="navbar-links">
            <button className="nav-btn masuk-btn" onClick={() => navigate('/login')}>Sign In</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Decorative Elements */}
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow secondary"></div>

        <div className="hero-content">
          <div className="badge">PRM & Smart Digital Card Platform</div>
          <h1 className="hero-title">
            Elevate your networking with<br /> 
            <span className="highlight-text">Smart Business Cards</span>
          </h1>
          <p className="hero-subtitle">
            Strengthen professional relationships with modern digital business cards. 
            Seamlessly share contact credentials, download PDF cards, and manage PRM appointments in one platform.
          </p>

          <div className="landing-scan-section">
            <p className="landing-scan-label">Scan Kartu disini</p>
            <button className="scan-btn-main" onClick={() => navigate('/scan')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Scan QR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

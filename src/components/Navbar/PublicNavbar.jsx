import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo-poltek-putih.png';
import './PublicNavbar.css';

const PublicNavbar = ({ hideScanAction = false }) => {
  const navigate = useNavigate();

  return (
    <header className="public-navbar">
      <div className="public-navbar-container">
        <div className="public-nav-brand" onClick={() => navigate('/')}>
          <img
            src={logoImg}
            alt="Politeknik Negeri Batam"
            className="public-nav-logo-img"
          />
          <div className="public-nav-brand-text">
            <span className="brand-poltek-title">POLITEKNIK NEGERI BATAM</span>
            <span className="brand-poltek-sub">Smart Business Card & PRM</span>
          </div>
        </div>

        <nav className="public-nav-actions">
          {!hideScanAction && (
            <button
              type="button"
              className="public-nav-btn public-nav-scan"
              onClick={() => navigate('/scan')}
              title="Pindai Kartu Nama Digital"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <span>Scan QR</span>
            </button>
          )}

          <button
            type="button"
            className="public-nav-btn public-nav-login"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;

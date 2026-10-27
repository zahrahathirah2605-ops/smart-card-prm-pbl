import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../Navbar/PublicNavbar';
import Footer from '../Footer/Footer';
import './LandingPage.css';
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Public Navbar (no duplicate scan action since hero has prominent scan box) */}
      <PublicNavbar hideScanAction={true} />

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
            Unlock Professional Networks with<br />
            <span className="highlight-text">Polibatam Smart Business Card</span>
          </h1>
          <p className="hero-subtitle">
            Smart business card and partner relationship management platform for Politeknik Negeri Batam. Connect contacts instantly, download digital card badges, and schedule formal meetings (PRM).
          </p>

          <div className="landing-action-container">
            <div className="landing-scan-box">
              <span className="landing-scan-title">Scan Visitor Digital Card</span>
              <p className="landing-scan-hint">Scan the QR code on a physical card or screen to immediately save contact and book appointments</p>
              <button className="scan-btn-main" onClick={() => navigate('/scan')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>Open Camera & Scan QR</span>
              </button>
            </div>

            <div className="landing-features-preview">
              <div className="feature-mini-pill">
                <span className="feat-icon">⚡</span>
                <div>
                  <strong>Quick Visitor Access</strong>
                  <p>No registration required to view cards & vCard</p>
                </div>
              </div>
              <div className="feature-mini-pill">
                <span className="feat-icon">📅</span>
                <div>
                  <strong>Schedule Meetings (PRM)</strong>
                  <p>Request formal appointments directly with the cardholder</p>
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
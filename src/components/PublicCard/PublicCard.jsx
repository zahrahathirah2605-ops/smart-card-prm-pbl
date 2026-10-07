import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PublicCard.css';

const PublicCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="public-card-page">
      {/* Navbar */}
      <header className="card-navbar">
        <div className="navbar-content">
          <div className="logo" onClick={() => navigate('/')}>Logo</div>
          <button className="login-link" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="card-main-content">
        <h1 className="page-title">Kartu Nama Digital</h1>
        <p className="page-subtitle">
          Profil pengguna terdaftar setelah berhasil scan QR kartu nama digital.
        </p>

        <div className="card-grid">
          {/* Left Column */}
          <div className="left-column">
            <div className="profile-image-card">
              <div className="image-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>

            <div className="info-fields">
              <input type="text" value="Nama Lengkap" readOnly className="info-input" />
              <input type="text" value="Instansi/Perusahaan" readOnly className="info-input" />
              <input type="text" value="Jabatan" readOnly className="info-input" />
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <input type="text" value="Telepon" readOnly className="contact-input" />
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <input type="text" value="Email" readOnly className="contact-input" />
              </div>
              <div className="contact-item">
                <span className="contact-icon">📸</span>
                <input type="text" value="Instagram" readOnly className="contact-input" />
              </div>
              <div className="contact-item">
                <span className="contact-icon">💼</span>
                <input type="text" value="LinkedIn" readOnly className="contact-input" />
              </div>
            </div>

            <div className="portfolio-section">
              <h3 className="portfolio-title">Portofolio jika ada</h3>
              <div className="portfolio-placeholder">
                Placeholder konten portofolio
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => navigate(`/janji-temu/${id}`)}>Janji Temu</button>
              <button className="btn btn-outline">Simpan Kontak</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;


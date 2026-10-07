import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrmOpen, setIsPrmOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="home-container">
      <nav className="navbar-solid">
        <div className="logo">Logo</div>
        <div className="nav-links">
          <a href="#" className="active">Beranda</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/kartu-nama'); }}>Kartu Nama</a>

          {/* PRM Dropdown */}
          <div className="prm-dropdown-container">
            <a
              href="#"
              className="prm-link"
              onClick={(e) => { e.preventDefault(); setIsPrmOpen(!isPrmOpen); }}
            >
              PRM
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </a>
            {isPrmOpen && (
              <div className="prm-menu">
                <button className="prm-item" onClick={() => navigate('/prm/ajukan')}>Ajukan PRM</button>
                <button className="prm-item" onClick={() => navigate('/prm/kelola')}>Kelola PRM</button>
                <button className="prm-item" onClick={() => navigate('/prm/riwayat')}>Riwayat PRM</button>
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <button className="menu-icon-btn" onClick={toggleDropdown}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Profile
                </button>
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  Kontak Relasi
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Left: Business Card Preview */}
          <div className="solid-card business-card">
            <h2 className="bc-title">Kartu Nama Saya</h2>
            <p className="bc-subtitle">Informasi profil pengguna terdaftar</p>

            <div className="bc-fields">
              <div className="bc-field">
                <label className="bc-label">Nama Lengkap</label>
                <div className="bc-value">Aprillia Bunga Lestari</div>
              </div>
              <div className="bc-field">
                <label className="bc-label">Jurusan</label>
                <div className="bc-value">Mahasiswa Teknik Informatika</div>
              </div>
              <div className="bc-field">
                <label className="bc-label">Nomor Telepon</label>
                <div className="bc-value">08123478010</div>
              </div>
              <div className="bc-field">
                <label className="bc-label">Email</label>
                <div className="bc-value">bungaa.123@gmail</div>
              </div>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="solid-card qr-card">
            <h3 className="qr-title">QR Code</h3>
            <p className="qr-subtitle">Gunakan QR ini untuk membagikan profil Anda</p>
            <div className="qr-wrapper">
              <svg className="qr-svg" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" />
                <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" />
                <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" />
                <rect x="40" y="10" width="10" height="10" />
                <rect x="55" y="10" width="10" height="10" />
                <rect x="40" y="25" width="25" height="10" />
                <rect x="10" y="40" width="10" height="20" />
                <rect x="25" y="40" width="40" height="10" />
                <rect x="70" y="40" width="20" height="10" />
                <rect x="50" y="55" width="15" height="15" />
                <rect x="75" y="55" width="15" height="35" />
                <rect x="40" y="75" width="30" height="15" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scan Section */}
        <div className="scan-section">
          <p className="scan-label">Scan Kartu disini</p>
          <button className="scan-btn-main" onClick={() => navigate('/scan')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Scan QR
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;

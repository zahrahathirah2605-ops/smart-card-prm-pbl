import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        <div className="logo">SmartCard</div>
        <div className="nav-links">
          <a href="#" className="active">Beranda</a>
          <a href="#">Kartu Nama</a>
          <a href="#">PRM</a>
          
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
        <div className="dashboard-header">
          <h1>Selamat Datang, <span>John Doe</span></h1>
          <p>Kelola kartu nama digital dan relasi bisnis Anda di sini.</p>
        </div>

        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="solid-card profile-card">
            <div className="card-header-bg"></div>
            <div className="profile-avatar-large">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
            </div>
            
            <div className="profile-info">
              <h2>John Doe</h2>
              <p className="role">Mahasiswa Teknik Informatika</p>
              
              <div className="contact-list">
                <div className="contact-item">
                  <span className="icon">📧</span>
                  <p>john.doe@test.com</p>
                </div>
                <div className="contact-item">
                  <span className="icon">📱</span>
                  <p>+62 812 3456 7890</p>
                </div>
                <div className="contact-item">
                  <span className="icon">🌐</span>
                  <p>www.johndoe.dev</p>
                </div>
              </div>
              
              <button className="edit-btn">Edit Profil</button>
            </div>
          </div>

          <div className="right-column">
            {/* QR Card */}
            <div className="solid-card qr-card">
              <h3>Bagikan Kartu Nama</h3>
              <p>Scan QR code di bawah ini untuk menyimpan kontak secara instan.</p>
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
              <button className="download-btn">Unduh QR Code</button>
            </div>

            {/* Scan Action */}
            <div className="solid-card action-card">
              <div className="action-content">
                <h3>Scan Kartu Relasi</h3>
                <p>Pindai kartu nama digital orang lain untuk menambahkannya ke koneksi Anda.</p>
                <button className="scan-btn-glow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  Mulai Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

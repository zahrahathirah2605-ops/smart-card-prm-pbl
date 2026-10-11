import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo-poltek-putih.png';
import './Navbar.css';

const Navbar = ({ active = 'home' }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrmOpen, setIsPrmOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="navbar-solid">
      <div className="logo" onClick={() => navigate('/home')}>
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

      <div className="nav-links">
        <a
          href="#"
          className={active === 'home' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); navigate('/home'); }}
        >
          Beranda
        </a>

        <a
          href="#"
          className={active === 'card' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); navigate('/kartu-nama'); }}
        >
          Kartu Nama
        </a>

        {/* PRM Dropdown */}
        <div className="prm-dropdown-container">
          <a
            href="#"
            className={`prm-link ${active === 'prm' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setIsPrmOpen(!isPrmOpen); }}
          >
            PRM
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          {isPrmOpen && (
            <div className="prm-menu">
              <button
                className="prm-item"
                onClick={() => { setIsPrmOpen(false); navigate('/janji-temu/default'); }}
              >
                Ajukan PRM
              </button>
              <button
                className="prm-item"
                onClick={() => { setIsPrmOpen(false); navigate('/kelola-prm'); }}
              >
                Kelola PRM
              </button>
              <button
                className="prm-item"
                onClick={() => { setIsPrmOpen(false); navigate('/riwayat-prm'); }}
              >
                Riwayat PRM
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Menu Dropdown (3 horizontal lines) */}
        <div className="dropdown-container">
          <button
            className="menu-icon-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Menu Akun"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* 1. Profile */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/kartu-nama'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </button>

              {/* 2. Kontak Relasi */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/riwayat-prm'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Kontak Relasi</span>
              </button>

              {/* 3. Tambah Kontak Eksternal */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/scan'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Tambah Kontak Eksternal</span>
              </button>

              {/* 4. Keluar */}
              <button className="dropdown-item logout" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

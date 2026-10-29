import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo-poltek-putih.png';
import './Navbar.css';

const Navbar = ({ active = 'home' }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrmOpen, setIsPrmOpen] = useState(false);

  const prmDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (prmDropdownRef.current && !prmDropdownRef.current.contains(event.target)) {
        setIsPrmOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smart_card_logged_role');
    navigate('/');
  };

  return (
    <nav className="navbar-solid">
      <div className="logo" onClick={() => navigate('/home')}>
        <img
          src={logoImg}
          alt="Politeknik Negeri Batam"
          className="navbar-brand-logo"
        />
        <div className="navbar-brand-text">
          <span className="navbar-poltek-title">POLITEKNIK NEGERI BATAM</span>
          <span className="navbar-poltek-sub">Smart Card & PRM</span>
        </div>
      </div>

      <div className="nav-links">
        <a
          href="#"
          className={active === 'home' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); navigate('/home'); }}
        >
          Home
        </a>

        <a
          href="#"
          className={active === 'card' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); navigate('/kartu-nama'); }}
        >
          Business Card
        </a>

        {/* PRM Dropdown */}
        <div className="prm-dropdown-container" ref={prmDropdownRef}>
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
                onClick={() => { setIsPrmOpen(false); navigate('/jadwal-prm'); }}
              >
                Meeting Schedule
              </button>
              <button
                className="prm-item"
                onClick={() => { setIsPrmOpen(false); navigate('/kelola-prm'); }}
              >
                Manage PRM
              </button>
              <button
                className="prm-item"
                onClick={() => { setIsPrmOpen(false); navigate('/riwayat-prm'); }}
              >
                PRM History
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Menu Dropdown (3 horizontal lines) */}
        <div className="dropdown-container" ref={userDropdownRef}>
          <button
            className={`menu-icon-btn ${isDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Account Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* Mobile Only: Navigation Links */}
              <div className="mobile-nav-section">
                <button
                  className={`dropdown-item ${active === 'home' ? 'active-item' : ''}`}
                  onClick={() => { setIsDropdownOpen(false); navigate('/home'); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>Home</span>
                </button>

                <button
                  className={`dropdown-item ${active === 'card' ? 'active-item' : ''}`}
                  onClick={() => { setIsDropdownOpen(false); navigate('/kartu-nama'); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span>Business Card</span>
                </button>

                <div className="mobile-submenu-title">PRM Features</div>
                <button
                  className="dropdown-item mobile-sub-item"
                  onClick={() => { setIsDropdownOpen(false); navigate('/jadwal-prm'); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Meeting Schedule</span>
                </button>
                <button
                  className="dropdown-item mobile-sub-item"
                  onClick={() => { setIsDropdownOpen(false); navigate('/kelola-prm'); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>Manage PRM</span>
                </button>
                <button
                  className="dropdown-item mobile-sub-item"
                  onClick={() => { setIsDropdownOpen(false); navigate('/riwayat-prm'); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>PRM History</span>
                </button>

                <div className="mobile-divider" />
              </div>

              {/* 1. Profile (Dedicated Profile Page) */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>My Profile</span>
              </button>

              {/* 2. Kontak Relasi */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/kontak-relasi'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Relationship Contacts</span>
              </button>

              {/* 3. Tambah Kontak Eksternal */}
              <button
                className="dropdown-item"
                onClick={() => { setIsDropdownOpen(false); navigate('/kontak-relasi/eksternal/create'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Add External Contact</span>
              </button>

              {/* 4. Logout */}
              <button className="dropdown-item logout" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
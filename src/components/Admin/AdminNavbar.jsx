import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminProfileModal from './AdminProfileModal';
import './AdminNavbar.css';

const AdminNavbar = ({ active = 'beranda' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
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
    navigate('/login');
  };

  const handleOpenProfile = () => {
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <nav className="admin-navbar">
        {/* Left: Logo */}
        <div className="admin-nav-logo" onClick={() => navigate('/admin')}>
          <img
            src="/src/assets/logo-poltek-putih.png"
            alt="Politeknik Negeri Batam"
            className="admin-logo-img"
          />
          <div className="admin-brand-text">
            <span className="admin-brand-title">POLITEKNIK NEGERI BATAM</span>
            <span className="admin-brand-sub">Internal Administrator Portal</span>
          </div>
        </div>

        {/* Right: Navigation Links & Hamburger Dropdown */}
        <div className="admin-nav-right">
          <div className="admin-nav-links">
            <button
              className={`admin-nav-link ${active === 'beranda' || location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => navigate('/admin')}
            >
              Dashboard
            </button>

            <button
              className={`admin-nav-link ${active === 'pengguna' || location.pathname === '/admin/pengguna' ? 'active' : ''}`}
              onClick={() => navigate('/admin/pengguna')}
            >
              Users
            </button>

            <button
              className={`admin-nav-link ${active === 'aktivitas' || location.pathname === '/admin/aktivitas' ? 'active' : ''}`}
              onClick={() => navigate('/admin/aktivitas')}
            >
              Activities
            </button>
          </div>

          {/* Hamburger Menu Circular Button */}
          <div className="admin-dropdown-container" ref={adminDropdownRef}>
            <button
              className={`admin-menu-circle-btn ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Menu Admin"
              aria-label="Menu Admin"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Dropdown Menu matching exact mock-up */}
            {isDropdownOpen && (
              <div className="admin-dropdown-menu">
                {/* 1. Profile */}
                <button
                  className="admin-dropdown-item"
                  onClick={handleOpenProfile}
                >
                  <svg
                    className="dropdown-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#12417D"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="dropdown-label">Profile</span>
                </button>

                <div className="admin-dropdown-divider" />

                {/* 2. Logout */}
                <button
                  className="admin-dropdown-item"
                  onClick={handleLogout}
                >
                  <svg
                    className="dropdown-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="dropdown-label" style={{ color: '#dc2626' }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Admin Profile Modal */}
      {isProfileModalOpen && (
        <AdminProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </>
  );
};

export default AdminNavbar;
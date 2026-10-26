import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo-poltek-putih.png';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const loggedRole = localStorage.getItem('smart_card_logged_role');

  const handleBrandClick = () => {
    if (loggedRole) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <footer className="global-footer">
      <div className="footer-glow-circle"></div>
      <div className="footer-main-container">
        {/* Brand & Campus Info */}
        <div className="footer-col footer-col-brand">
          <div className="footer-logo-row" onClick={handleBrandClick}>
            <img
              src={logoImg}
              alt="Politeknik Negeri Batam"
              className="footer-logo-img"
            />
            <div className="footer-brand-title">
              <h4>POLITEKNIK NEGERI BATAM</h4>
              <span>Smart Business Card & PRM Platform</span>
            </div>
          </div>
          <p className="footer-brand-desc">
            Sistem Informasi Kartu Nama Cerdas & Partner Relationship Management internal internal kampus untuk mendukung profesionalisme, kolaborasi, dan kemitraan civitas akademika.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h5 className="footer-col-title">Navigasi Cepat</h5>
          <ul className="footer-nav-list">
            <li><button type="button" onClick={() => navigate('/')}>Beranda Publik</button></li>
            <li><button type="button" onClick={() => navigate('/scan')}>Scan Kartu QR</button></li>
            <li><button type="button" onClick={() => navigate('/login')}>Login Sistem</button></li>
          </ul>
        </div>

        {/* Contact Campus Info */}
        <div className="footer-col">
          <h5 className="footer-col-title">Kampus & Alamat</h5>
          <div className="footer-address-box">
            <p><strong>Politeknik Negeri Batam</strong></p>
            <p>Jl. Ahmad Yani, Batam Kota, Kota Batam, Kepulauan Riau 29461</p>
            <p className="footer-contact-row">
              <span>📧 prm@polibatam.ac.id</span>
              <span>🌐 www.polibatam.ac.id</span>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Politeknik Negeri Batam. All Rights Reserved. Smart Business Card PRM System.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
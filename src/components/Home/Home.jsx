import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DigitalCardBadge from '../KartuNama/DigitalCardBadge';
import { getUserCard, exportCardToPDF } from '../../utils/cardStorage';
import './Home.css';

const Home = () => {
  const [card, setCard] = useState(() => getUserCard());
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCard(getUserCard());
  }, []);

  const resolvedCardId = card.id || (card.namaLengkap ? card.namaLengkap.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'aprillia-bunga');
  const cardUrl = `${window.location.origin}/card/${resolvedCardId}`;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await exportCardToPDF('home-business-card', card);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar sesuai Beranda asli */}
      <Navbar active="home" />

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Sisi Kiri: Kartu Nama Digital Standar Profesional */}
          <div className="solid-card business-card-display">
            <div className="bc-header-row">
              <div>
                <h2 className="bc-title">My Digital Card</h2>
                <p className="bc-subtitle">Registered user profile & business badge</p>
              </div>
              <button
                className="btn-edit-card-link"
                onClick={() => navigate('/kartu-nama')}
              >
                Edit Card
              </button>
            </div>

            {/* Kartu Nama Digital Visual Standar */}
            <div className="digital-card-showcase-box">
              <DigitalCardBadge
                card={card}
                qrUrl={cardUrl}
                elementId="home-business-card"
              />
            </div>

            {/* Tombol Aksi Kartu */}
            <div className="card-quick-actions">
              <button
                className="btn-pdf-download"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                title="Download digital business card in PDF format"
              >
                {isExporting ? '⏳ Exporting PDF...' : '📄 Download PDF Card'}
              </button>

              <button
                className="btn-preview-link"
                onClick={() => navigate(`/card/${card.id}`)}
              >
                Preview Digital Card ↗
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Detail Informasi Profil */}
          <div className="solid-card profile-info-card">
            <h3 className="pi-title">Profile Overview</h3>
            <p className="pi-subtitle">Account information displayed on your smart card</p>

            <div className="pi-fields">
              <div className="pi-field">
                <label className="pi-label">Full Name</label>
                <div className="pi-value">{card.namaLengkap || 'Aprillia Bunga Lestari'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Department & Campus</label>
                <div className="pi-value">{card.jabatan || 'Student'} - {card.instansi || 'Politeknik Negeri Batam'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Phone Number</label>
                <div className="pi-value">{card.telepon || '08123478010'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Email Address</label>
                <div className="pi-value">{card.email || 'smart.card@gmail.com'}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => navigate('/jadwal-prm')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--primary, #12417D)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📅 View PRM Schedule Calendar →
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1.5px solid var(--primary, #12417D)',
                  background: 'transparent',
                  color: 'var(--primary, #12417D)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Manage Full Profile Account →
              </button>
            </div>
          </div>
        </div>

        {/* Section Scan QR DI BAWAH BERANDA Sesuai Permintaan */}
        <div className="scan-section">
          <p className="scan-label">Scan Business Card Here</p>
          <button className="scan-btn-main" onClick={() => navigate('/scan')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Scan QR
          </button>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default Home;
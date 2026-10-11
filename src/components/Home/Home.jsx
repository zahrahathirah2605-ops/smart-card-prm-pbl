import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
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

  const cardUrl = `${window.location.origin}/card/${card.id || 'aprillia-bunga'}`;

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
                <h2 className="bc-title">Kartu Nama Saya</h2>
                <p className="bc-subtitle">Informasi profil pengguna terdaftar</p>
              </div>
              <button
                className="btn-edit-card-link"
                onClick={() => navigate('/kartu-nama')}
              >
                Edit Kartu
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
                title="Unduh kartu nama digital dalam format PDF"
              >
                {isExporting ? '⏳ Mengunduh PDF...' : '📄 Download Kartu (PDF)'}
              </button>

              <button
                className="btn-preview-link"
                onClick={() => navigate(`/card/${card.id}`)}
              >
                Pratinjau Kartu Digital ↗
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Detail Informasi Profil */}
          <div className="solid-card profile-info-card">
            <h3 className="pi-title">Detail Profil</h3>
            <p className="pi-subtitle">Data akun yang ditampilkan pada smart business card</p>

            <div className="pi-fields">
              <div className="pi-field">
                <label className="pi-label">Nama Lengkap</label>
                <div className="pi-value">{card.namaLengkap || 'Aprillia Bunga Lestari'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Jurusan / Instansi</label>
                <div className="pi-value">{card.jabatan || 'Mahasiswa'} - {card.instansi || 'Politeknik Negeri Batam'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Nomor Telepon</label>
                <div className="pi-value">{card.telepon || '08123478010'}</div>
              </div>

              <div className="pi-field">
                <label className="pi-label">Email</label>
                <div className="pi-value">{card.email || 'bungaa.123@gmail.com'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Scan QR DI BAWAH BERANDA Sesuai Permintaan */}
        <div className="scan-section">
          <p className="scan-label">Scan Kartu disini</p>
          <button className="scan-btn-main" onClick={() => navigate('/scan')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

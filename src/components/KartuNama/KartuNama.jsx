import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './KartuNama.css';

const KartuNama = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrmOpen, setIsPrmOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    instansi: '',
    jabatan: '',
    telepon: '',
    email: '',
    instagram: '',
    linkedin: '',
    portofolio: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save card data logic here
    navigate('/home');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="kartu-nama-page">
      {/* Navbar */}
      <nav className="kn-navbar">
        <div className="kn-logo" onClick={() => navigate('/home')}>Logo</div>
        <div className="kn-nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Beranda</a>
          <a href="#" className="active">Kartu Nama</a>
          <div className="kn-prm-dropdown">
            <a
              href="#"
              className="kn-prm-link"
              onClick={(e) => { e.preventDefault(); setIsPrmOpen(!isPrmOpen); }}
            >
              PRM
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </a>
            {isPrmOpen && (
              <div className="kn-prm-menu">
                <button className="kn-prm-item" onClick={() => navigate('/prm/ajukan')}>Ajukan PRM</button>
                <button className="kn-prm-item" onClick={() => navigate('/prm/kelola')}>Kelola PRM</button>
                <button className="kn-prm-item" onClick={() => navigate('/prm/riwayat')}>Riwayat PRM</button>
              </div>
            )}
          </div>

          <div className="kn-menu-container">
            <button className="kn-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            {isMenuOpen && (
              <div className="kn-dropdown-menu">
                <button className="kn-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Profile
                </button>
                <button className="kn-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  Kontak Relasi
                </button>
                <button className="kn-dropdown-item logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="kn-main">
        <div className="kn-content-grid">
          {/* Left: Photo Upload */}
          <div className="kn-photo-section">
            <div className="kn-photo-card">
              <h3 className="kn-photo-title">Foto Profil</h3>
              <p className="kn-photo-desc">Tambahkan foto profil untuk kartu nama Anda</p>
              <div className="kn-photo-preview" onClick={handlePhotoClick}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="kn-photo-img" />
                ) : (
                  <div className="kn-photo-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button className="kn-add-photo-btn" onClick={handlePhotoClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Tambahkan Foto
              </button>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="kn-form-section">
            <h2 className="kn-form-title">Kartu Nama Saya</h2>
            <p className="kn-form-subtitle">Informasi profil pengguna terdaftar</p>

            <form onSubmit={handleSubmit} className="kn-form">
              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    className="kn-input"
                    placeholder="Nama pengguna"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Instansi/Perusahaan</label>
                  <input
                    type="text"
                    name="instansi"
                    className="kn-input"
                    placeholder="Instansi pengguna"
                    value={formData.instansi}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Jabatan</label>
                  <input
                    type="text"
                    name="jabatan"
                    className="kn-input"
                    placeholder="Jabatan pengguna"
                    value={formData.jabatan}
                    onChange={handleChange}
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Telepon</label>
                  <input
                    type="text"
                    name="telepon"
                    className="kn-input"
                    placeholder="Nomor telepon pengguna"
                    value={formData.telepon}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="kn-input"
                    placeholder="Email pengguna"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    className="kn-input"
                    placeholder="Profil Instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    className="kn-input"
                    placeholder="Profil LinkedIn"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Portofolio (opsional)</label>
                  <input
                    type="text"
                    name="portofolio"
                    className="kn-input"
                    placeholder="Tautan portofolio"
                    value={formData.portofolio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-submit-wrapper">
                <button type="submit" className="kn-submit-btn">
                  Simpan Kartu Nama Anda
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KartuNama;

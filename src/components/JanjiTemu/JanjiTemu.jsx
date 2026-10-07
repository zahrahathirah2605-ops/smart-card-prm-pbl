import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './JanjiTemu.css';

const JanjiTemu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    perusahaan: '',
    jabatan: '',
    email: '',
    telepon: '',
    tanggal: '',
    jam: '',
    alasan: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitted(true);
  };

  return (
    <div className="jt-page">
      {/* Navbar */}
      <header className="jt-navbar">
        <div className="jt-navbar-content">
          <div className="jt-logo" onClick={() => navigate('/')}>Logo</div>
          <button className="jt-login-link" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      {/* Main */}
      <main className="jt-main">
        {/* Back link */}
        <button className="jt-back-link" onClick={() => navigate(`/card/${id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Kembali ke kartu nama
        </button>

        {/* Page Header */}
        <div className="jt-page-header">
          <h1 className="jt-title">Ajukan Janji Temu</h1>
          <p className="jt-subtitle">
            Terhubung lebih lanjut dengan pemilik kartu nama. Isi data diri dan waktu pertemuan yang Anda inginkan.
          </p>
        </div>

        {/* Success message */}
        {isSubmitted ? (
          <div className="jt-success-card">
            <div className="jt-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="jt-success-title">Pengajuan Terkirim!</h2>
            <p className="jt-success-desc">
              Pengajuan janji temu Anda telah berhasil dikirim. Pemilik kartu nama akan meninjau permintaan Anda. 
              Hasil pengajuan akan diinformasikan melalui email.
            </p>
            <button className="jt-success-btn" onClick={() => navigate(`/card/${id}`)}>
              Kembali ke Kartu Nama
            </button>
          </div>
        ) : (
          <div className="jt-content-grid">
            {/* Left: Info Panel */}
            <div className="jt-info-panel">
              <div className="jt-info-card">
                <div className="jt-info-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="jt-info-title">Awali pertemuan dengan mudah.</h3>
                <p className="jt-info-desc">
                  Ajukan waktu pertemuan langsung dari kartu nama digital, tanpa perlu masuk atau membuat akun.
                </p>
              </div>

              {/* Steps */}
              <div className="jt-steps">
                <div className="jt-step">
                  <div className="jt-step-number">1</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Isi Formulir</h4>
                    <p className="jt-step-desc">Lengkapi data diri, jadwal, dan tujuan pertemuan Anda.</p>
                  </div>
                </div>
                <div className="jt-step">
                  <div className="jt-step-number">2</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Pengajuan ditinjau</h4>
                    <p className="jt-step-desc">Pemilik kartu nama akan meninjau dan memproses permintaan Anda.</p>
                  </div>
                </div>
                <div className="jt-step">
                  <div className="jt-step-number">3</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Periksa email</h4>
                    <p className="jt-step-desc">Hasil pengajuan janji temu akan diinformasikan melalui email.</p>
                  </div>
                </div>
              </div>

              <div className="jt-info-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <polyline points="9 11 12 14 22 4"></polyline>
                </svg>
                <span>Jadwal yang Anda pilih merupakan saran dan janji temu yang terkonﬁrmasi.</span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="jt-form-panel">
              <form onSubmit={handleSubmit} className="jt-form">
                {/* Data Diri Section */}
                <div className="jt-section">
                  <div className="jt-section-header">
                    <h3 className="jt-section-title">Data diri Anda</h3>
                    <span className="jt-required-note">* Wajib diisi</span>
                  </div>
                  <p className="jt-section-desc">Cantumkan informasi/kontak yang aktif.</p>

                  <div className="jt-field-full">
                    <label className="jt-label">Nama lengkap <span className="jt-required">*</span></label>
                    <input
                      type="text"
                      name="namaLengkap"
                      className="jt-input"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Perusahaan/Instansi <span className="jt-required">*</span></label>
                      <input
                        type="text"
                        name="perusahaan"
                        className="jt-input"
                        placeholder="Nama perusahaan atau instansi"
                        value={formData.perusahaan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Jabatan <span className="jt-required">*</span></label>
                      <input
                        type="text"
                        name="jabatan"
                        className="jt-input"
                        placeholder="Jabatan Anda"
                        value={formData.jabatan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Email <span className="jt-required">*</span></label>
                      <div className="jt-input-icon-wrapper">
                        <input
                          type="email"
                          name="email"
                          className="jt-input"
                          placeholder="nama@contoh.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Nomor telepon <span className="jt-required">*</span></label>
                      <div className="jt-input-icon-wrapper">
                        <svg className="jt-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <input
                          type="tel"
                          name="telepon"
                          className="jt-input jt-input-with-icon"
                          placeholder="081x xxxx xxxx"
                          value={formData.telepon}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rencana Pertemuan Section */}
                <div className="jt-section">
                  <h3 className="jt-section-title">Rencana pertemuan</h3>
                  <p className="jt-section-desc">Pilih jadwal dan cantumkan tujuan Anda bertemu.</p>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Tanggal temu <span className="jt-required">*</span></label>
                      <input
                        type="date"
                        name="tanggal"
                        className="jt-input"
                        placeholder="Pilih tanggal"
                        value={formData.tanggal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Jam <span className="jt-required">*</span></label>
                      <input
                        type="time"
                        name="jam"
                        className="jt-input"
                        placeholder="Pilih jam"
                        value={formData.jam}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="jt-timezone-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Waktu pertemuan menggunakan WIB (UTC+7).</span>
                  </div>

                  <div className="jt-field-full">
                    <label className="jt-label">Alasan ingin bertemu <span className="jt-required">*</span></label>
                    <textarea
                      name="alasan"
                      className="jt-textarea"
                      placeholder="Jelaskan tujuan atau topik yang ingin Anda diskusikan..."
                      rows="4"
                      value={formData.alasan}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Email Notice */}
                <div className="jt-email-notice">
                  <div className="jt-email-notice-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="jt-email-notice-text">
                    <strong>Hasil pengajuan akan diinformasikan melalui email.</strong>
                    <span> Pastikan alamat email Anda benar agar tidak melewatkan balasan dari pemilik kartu nama.</span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="jt-terms">
                  <label className="jt-checkbox-label">
                    <input
                      type="checkbox"
                      className="jt-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className="jt-checkbox-custom"></span>
                    <span className="jt-checkbox-text">
                      Data Anda hanya digunakan untuk keperluan pengajuan janji temu ini saja.
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="jt-submit-wrapper">
                  <button 
                    type="submit" 
                    className={`jt-submit-btn ${!agreeTerms ? 'jt-submit-disabled' : ''}`}
                    disabled={!agreeTerms}
                  >
                    Kirim Pengajuan
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="jt-footer">
        <div className="jt-footer-content">
          <span className="jt-footer-brand">Kartu Nama Digital</span>
          <span className="jt-footer-text">Bangun relasi, mudah dan cepat.</span>
        </div>
      </footer>
    </div>
  );
};

export default JanjiTemu;

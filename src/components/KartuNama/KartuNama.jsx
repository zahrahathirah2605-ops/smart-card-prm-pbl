import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DigitalCardBadge from './DigitalCardBadge';
import { getUserCard, saveUserCard, exportCardToPDF } from '../../utils/cardStorage';
import './KartuNama.css';

const KartuNama = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    instansi: '',
    jabatan: '',
    telepon: '',
    email: '',
    instagram: '',
    linkedin: '',
    portofolio: '',
    bio: '',
  });

  const [cardId, setCardId] = useState('aprillia-bunga');

  useEffect(() => {
    const existing = getUserCard();
    if (existing) {
      setCardId(existing.id || 'aprillia-bunga');
      setFormData({
        namaLengkap: existing.namaLengkap || '',
        instansi: existing.instansi || '',
        jabatan: existing.jabatan || '',
        telepon: existing.telepon || '',
        email: existing.email || '',
        instagram: existing.instagram || '',
        linkedin: existing.linkedin || '',
        portofolio: existing.portofolio || '',
        bio: existing.bio || '',
      });
      if (existing.photoUrl) {
        setPhotoPreview(existing.photoUrl);
      }
    }
  }, []);

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

  // Dynamically derive card ID from name so new accounts have unique QR codes
  const computedCardId = (formData.namaLengkap && formData.namaLengkap.trim())
    ? (formData.namaLengkap.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || cardId)
    : cardId;

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = saveUserCard({
      ...formData,
      id: computedCardId,
      photoUrl: photoPreview || ''
    });
    if (saved?.id) {
      setCardId(saved.id);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const currentPreviewCard = {
    ...formData,
    photoUrl: photoPreview || '',
    id: computedCardId
  };

  const cardUrl = `${window.location.origin}/card/${computedCardId}`;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await exportCardToPDF('edit-card-preview-target', currentPreviewCard);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="kartu-nama-page">
      {/* Unified Consistent Navbar */}
      <Navbar active="card" />

      {/* Main Content */}
      <main className="kn-main">
        {/* Real-time Digital Card Preview on Top */}
        <div className="kn-top-preview-section">
          <div className="preview-header-meta">
            <div>
              <h2 className="kn-section-title">Live Digital Card Preview</h2>
              <p className="kn-section-subtitle">Real-time appearance as partners will see when scanning your QR code</p>
            </div>
            <div className="preview-top-actions">
              <button
                className="btn-download-pdf-top"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                title="Download this business card as standard PDF"
              >
                {isExporting ? '⏳ Exporting...' : '📄 Download PDF Card'}
              </button>
            </div>
          </div>

          <div className="live-card-wrapper">
            <DigitalCardBadge
              card={currentPreviewCard}
              qrUrl={cardUrl}
              elementId="edit-card-preview-target"
            />
          </div>
        </div>

        {/* Form and Photo Upload Editor */}
        <div className="kn-content-grid">
          {/* Left: Photo Upload */}
          <div className="kn-photo-section">
            <div className="kn-photo-card">
              <h3 className="kn-photo-title">Profile Photo</h3>
              <p className="kn-photo-desc">Upload a high-resolution portrait for your business card</p>
              
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
              <button type="button" className="kn-add-photo-btn" onClick={handlePhotoClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="kn-form-section">
            <h2 className="kn-form-title">Edit Card Credentials</h2>
            <p className="kn-form-subtitle">Update your personal and organizational details</p>

            <form onSubmit={handleSubmit} className="kn-form">
              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Full Name *</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    className="kn-input"
                    placeholder="e.g. Aprillia Bunga Lestari"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Organization / Company *</label>
                  <input
                    type="text"
                    name="instansi"
                    className="kn-input"
                    placeholder="e.g. Politeknik Negeri Batam"
                    value={formData.instansi}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Position / Job Title *</label>
                  <input
                    type="text"
                    name="jabatan"
                    className="kn-input"
                    placeholder="e.g. Informatics Engineering Student"
                    value={formData.jabatan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    name="telepon"
                    className="kn-input"
                    placeholder="e.g. +62 812-3478-010"
                    value={formData.telepon}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="kn-input"
                    placeholder="e.g. bungaa.123@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Instagram Username</label>
                  <input
                    type="text"
                    name="instagram"
                    className="kn-input"
                    placeholder="e.g. aprilliabunga"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-form-row">
                <div className="kn-form-group">
                  <label className="kn-label">LinkedIn Handle / Profile</label>
                  <input
                    type="text"
                    name="linkedin"
                    className="kn-input"
                    placeholder="e.g. aprillia-bunga-lestari"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div className="kn-form-group">
                  <label className="kn-label">Portfolio / Website URL</label>
                  <input
                    type="text"
                    name="portofolio"
                    className="kn-input"
                    placeholder="e.g. https://github.com/aprilliabunga"
                    value={formData.portofolio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="kn-form-group">
                <label className="kn-label">Bio / Profile Summary</label>
                <textarea
                  name="bio"
                  className="kn-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Short bio or description displayed on your card..."
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              {saveSuccess && (
                <div className="save-success-banner">
                  ✓ Business card updated successfully! Changes are live on your QR Code and Digital Badge.
                </div>
              )}

              <div className="kn-submit-wrapper">
                <button type="submit" className="kn-submit-btn">
                   💾 Save Card Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default KartuNama;

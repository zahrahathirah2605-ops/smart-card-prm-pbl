import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './TambahKontakEksternal.css';

const STORAGE_KEY_RELATION_CONTACTS = 'smart_card_relation_contacts';

const TambahKontakEksternal = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    instansi: '',
    jabatan: '',
    telepon: '',
    email: '',
    catatan_pertemuan: '',
    foto_kartu: null,
    foto_nama_file: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Handle Text Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if ((name === 'telepon' || name === 'email') && (errors.telepon || errors.email || errors.kontak_gabungan)) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.telepon;
        delete updated.email;
        delete updated.kontak_gabungan;
        return updated;
      });
    }
  };

  // Handle Photo Selection
  const handlePhotoChange = (e) => {
    setPhotoError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Invalid image format. Only JPG or PNG are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setPhotoError('Image size exceeds 2MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        foto_kartu: reader.result,
        foto_nama_file: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setPhotoError('');
    setFormData((prev) => ({
      ...prev,
      foto_kartu: null,
      foto_nama_file: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validasi Form
  const validateForm = () => {
    const newErrors = {};

    // 1. nama_lengkap: required, string, max 100
    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = 'Full name is required.';
    } else if (formData.nama_lengkap.trim().length > 100) {
      newErrors.nama_lengkap = 'Full name must not exceed 100 characters.';
    }

    // 2. instansi: nullable, max 100
    if (formData.instansi && formData.instansi.trim().length > 100) {
      newErrors.instansi = 'Organization must not exceed 100 characters.';
    }

    // 3. jabatan: nullable, max 100
    if (formData.jabatan && formData.jabatan.trim().length > 100) {
      newErrors.jabatan = 'Job title must not exceed 100 characters.';
    }

    // 4 & 5. Telepon & Email: minimal salah satu harus terisi
    const telTrimmed = formData.telepon.trim();
    const emailTrimmed = formData.email.trim();

    if (!telTrimmed && !emailTrimmed) {
      newErrors.kontak_gabungan = 'Please provide at least one contact method: Phone or Email.';
    }

    if (telTrimmed) {
      if (telTrimmed.length > 20) {
        newErrors.telepon = 'Phone number must not exceed 20 characters.';
      } else {
        const phoneRegex = /^[+]?[\d\s-]+$/;
        if (!phoneRegex.test(telTrimmed)) {
          newErrors.telepon = 'Invalid phone number format (use digits, +, spaces, or hyphens).';
        }
      }
    }

    if (emailTrimmed) {
      if (emailTrimmed.length > 100) {
        newErrors.email = 'Email must not exceed 100 characters.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
          newErrors.email = 'Invalid email address format.';
        }
      }
    }

    // 6. catatan_pertemuan: nullable, max 500
    if (formData.catatan_pertemuan && formData.catatan_pertemuan.length > 500) {
      newErrors.catatan_pertemuan = 'Meeting notes must not exceed 500 characters.';
    }

    if (photoError) {
      newErrors.foto_kartu = photoError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const rawContacts = localStorage.getItem(STORAGE_KEY_RELATION_CONTACTS);
        let contactsList = [];
        if (rawContacts) {
          try {
            contactsList = JSON.parse(rawContacts);
          } catch (_e) {
            contactsList = [];
          }
        }

        const newContactRecord = {
          id: `ext-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          nama: formData.nama_lengkap.trim(),
          nama_lengkap: formData.nama_lengkap.trim(),
          instansi: formData.instansi.trim() || 'External Partner',
          jabatan: formData.jabatan.trim() || 'Partner',
          kontak: formData.telepon.trim() || '-',
          telepon: formData.telepon.trim(),
          email: formData.email.trim(),
          catatan: formData.catatan_pertemuan.trim(),
          catatan_pertemuan: formData.catatan_pertemuan.trim(),
          foto_kartu: formData.foto_kartu || null,
          foto_nama_file: formData.foto_nama_file || '',
          tipe: 'eksternal',
          kategori: 'External Partner',
          isSaved: true,
          asal: 'External Physical Card',
          createdAt: new Date().toISOString()
        };

        const updatedList = [newContactRecord, ...contactsList];
        localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(updatedList));

        navigate('/kontak-relasi', {
          state: {
            successMessage: `External contact "${newContactRecord.nama}" was successfully saved to Relationship Contacts.`
          }
        });
      } catch (err) {
        console.error('Failed to save external contact:', err);
        setErrors({ general: 'An error occurred while saving contact. Please try again.' });
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="external-contact-page-container">
      <Navbar active="kartu-nama" />

      <main className="external-contact-main">
        {/* Tombol Navigasi Kembali */}
        <div className="external-nav-back-row">
          <button
            type="button"
            className="btn-back-relation"
            onClick={() => navigate('/kontak-relasi')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Relationship Contacts</span>
          </button>
        </div>

        {/* Header Judul & Subjudul */}
        <div className="external-header-section">
          <h1 className="external-page-title">Add External Contact</h1>
          <p className="external-page-subtitle">
            Manually enter details from a physical business card to save acquaintances into Relationship Contacts.
          </p>
          <div className="external-note-badge">
            <span className="note-icon">ℹ️</span>
            <span>External contacts do not need an account. This entry does not create an internal campus profile.</span>
          </div>
        </div>

        {errors.general && (
          <div className="external-alert-error">
            <span>{errors.general}</span>
            <button type="button" onClick={() => setErrors((prev) => ({ ...prev, general: null }))}>✕</button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="external-form-container"
          encType="multipart/form-data"
          noValidate
        >
          <div className="external-cards-grid">
            {/* Kolom Kiri: Foto Kartu Nama (Opsional) */}
            <div className="external-card card-left">
              <div className="card-header-inner">
                <h3 className="card-section-title">Business Card Photo</h3>
                <span className="card-optional-tag">Optional</span>
              </div>

              <div
                className={`photo-upload-zone ${photoPreview ? 'has-preview' : ''} ${photoError ? 'has-error' : ''}`}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                {photoPreview ? (
                  <div className="photo-preview-wrapper">
                    <img
                      src={photoPreview}
                      alt="Physical Business Card Preview"
                      className="photo-preview-img"
                    />
                    <div
                      className="photo-preview-overlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPhotoModal(true);
                      }}
                      title="Click to zoom image"
                    >
                      <span>🔍 Click to Zoom</span>
                    </div>
                  </div>
                ) : (
                  <div className="photo-placeholder-box">
                    <div className="photo-icon-circle">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <span className="photo-placeholder-text">Attach photo of physical card</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                name="foto_kartu"
                id="foto_kartu"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />

              <div className="photo-action-buttons">
                <button
                  type="button"
                  className="btn-upload-photo"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {photoPreview && (
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={handleRemovePhoto}
                    title="Remove card photo"
                  >
                    Remove
                  </button>
                )}
              </div>

              {photoError && (
                <div className="field-error-msg">
                  ⚠️ {photoError}
                </div>
              )}

              <div className="photo-helper-texts">
                <p className="helper-item">
                  <span className="bullet">•</span>
                  <span>JPG or PNG format. Ensure text on card is legible.</span>
                </p>
                <p className="helper-item">
                  <span className="bullet">•</span>
                  <span>This image serves as an attachment, not a profile avatar.</span>
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Identitas & Kontak */}
            <div className="external-card card-right">
              <div className="card-header-inner">
                <h3 className="card-section-title">Identity & Contact</h3>
              </div>
              <p className="card-header-note">
                <span className="required-star">*</span> Required. Other details can be completed if available.
              </p>

              <div className="form-fields-stack">
                {/* 1. Nama Lengkap */}
                <div className="form-group full-width">
                  <label htmlFor="nama_lengkap" className="form-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    className={`form-input ${errors.nama_lengkap ? 'input-error' : ''}`}
                    placeholder="Enter full name"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                  {errors.nama_lengkap && (
                    <div className="field-error-msg">⚠️ {errors.nama_lengkap}</div>
                  )}
                </div>

                {/* 2 & 3. Instansi & Jabatan */}
                <div className="form-row-two-cols">
                  <div className="form-group">
                    <label htmlFor="instansi" className="form-label">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      id="instansi"
                      name="instansi"
                      className={`form-input ${errors.instansi ? 'input-error' : ''}`}
                      placeholder="Enter organization or company"
                      value={formData.instansi}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                    {errors.instansi && (
                      <div className="field-error-msg">⚠️ {errors.instansi}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="jabatan" className="form-label">
                      Job Title / Position
                    </label>
                    <input
                      type="text"
                      id="jabatan"
                      name="jabatan"
                      className={`form-input ${errors.jabatan ? 'input-error' : ''}`}
                      placeholder="Enter job title"
                      value={formData.jabatan}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                    {errors.jabatan && (
                      <div className="field-error-msg">⚠️ {errors.jabatan}</div>
                    )}
                  </div>
                </div>

                {/* 4 & 5. Telepon & Email */}
                <div className="form-row-two-cols">
                  <div className="form-group">
                    <label htmlFor="telepon" className="form-label">
                      Phone Number
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </span>
                      <input
                        type="tel"
                        id="telepon"
                        name="telepon"
                        className={`form-input with-left-icon ${errors.telepon || errors.kontak_gabungan ? 'input-error' : ''}`}
                        placeholder="+62 812-xxxx-xxxx"
                        value={formData.telepon}
                        onChange={handleInputChange}
                        maxLength={20}
                      />
                    </div>
                    {errors.telepon && (
                      <div className="field-error-msg">⚠️ {errors.telepon}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-input with-left-icon ${errors.email || errors.kontak_gabungan ? 'input-error' : ''}`}
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        maxLength={100}
                      />
                    </div>
                    {errors.email && (
                      <div className="field-error-msg">⚠️ {errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Helper text di bawah baris Telepon/Email */}
                <div className="contact-helper-row">
                  <span className="helper-text-hint">
                    💡 Please provide at least one contact method: Phone or Email.
                  </span>
                  {errors.kontak_gabungan && (
                    <div className="field-error-msg" style={{ marginTop: '0.35rem' }}>
                      ⚠️ {errors.kontak_gabungan}
                    </div>
                  )}
                </div>

                {/* 6. Catatan Pertemuan */}
                <div className="form-group full-width">
                  <div className="label-with-counter">
                    <label htmlFor="catatan_pertemuan" className="form-label">
                      Meeting Notes <span className="label-optional">(optional)</span>
                    </label>
                    <span className="char-counter">
                      {formData.catatan_pertemuan.length}/500
                    </span>
                  </div>
                  <textarea
                    id="catatan_pertemuan"
                    name="catatan_pertemuan"
                    rows="4"
                    className={`form-textarea ${errors.catatan_pertemuan ? 'input-error' : ''}`}
                    placeholder="E.g., Met at exhibition, discussed potential internship MoU..."
                    value={formData.catatan_pertemuan}
                    onChange={handleInputChange}
                    maxLength={500}
                  />
                  {errors.catatan_pertemuan && (
                    <div className="field-error-msg">⚠️ {errors.catatan_pertemuan}</div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Batal & Simpan Kontak */}
              <div className="form-action-footer">
                <button
                  type="button"
                  className="btn-cancel-external"
                  onClick={() => navigate('/kontak-relasi')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-submit-external"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-icon"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Contact</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Modal Preview Gambar Memperbesar Foto Kartu */}
      {showPhotoModal && photoPreview && (
        <div className="image-zoom-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="image-zoom-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-zoom-header">
              <span className="image-zoom-title">Physical Business Card Attachment</span>
              <button
                type="button"
                className="image-zoom-close"
                onClick={() => setShowPhotoModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="image-zoom-body">
              <img src={photoPreview} alt="Physical Business Card" className="image-zoom-img" />
            </div>
            <div className="image-zoom-footer">
              <button
                type="button"
                className="btn-close-zoom"
                onClick={() => setShowPhotoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TambahKontakEksternal;
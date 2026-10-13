import React, { useState } from 'react';
import { getAdminProfile, updateAdminProfile } from '../../utils/adminStorage';
import './AdminProfileModal.css';

const AdminProfileModal = ({ onClose }) => {
  const [profile, setProfile] = useState(() => getAdminProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAdminProfile(profile);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-header-left">
            <div className="admin-avatar-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="admin-modal-title">Profil Administrator</h3>
              <p className="admin-modal-sub">Kelola akun dan otorisasi akses sistem</p>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        {savedSuccess && (
          <div className="admin-modal-alert">
            ✓ Perubahan profil administrator berhasil disimpan!
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-profile-form">
          <div className="form-group-modal">
            <label>Nama Administrator</label>
            <input
              type="text"
              value={profile.nama}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
              required
            />
          </div>

          <div className="form-group-modal">
            <label>Email Akses Admin</label>
            <input
              type="email"
              value={profile.email}
              disabled
              title="Email default sistem admin"
            />
            <span className="input-hint">Email sistem resmi untuk login hak akses administrator</span>
          </div>

          <div className="modal-row-grid">
            <div className="form-group-modal">
              <label>Jabatan / Peran</label>
              <input
                type="text"
                value={profile.jabatan}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, jabatan: e.target.value })}
              />
            </div>
            <div className="form-group-modal">
              <label>Nomor Telepon</label>
              <input
                type="text"
                value={profile.telepon}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, telepon: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group-modal">
            <label>Instansi / Organisasi</label>
            <input
              type="text"
              value={profile.instansi}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, instansi: e.target.value })}
            />
          </div>

          <div className="admin-modal-actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => {
                    setProfile(getAdminProfile());
                    setIsEditing(false);
                  }}
                >
                  Batal
                </button>
                <button type="submit" className="btn-modal-save">
                  Simpan Perubahan
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={onClose}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn-modal-save"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profil
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileModal;

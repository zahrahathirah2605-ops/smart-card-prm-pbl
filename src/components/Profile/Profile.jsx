import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getUserCard, saveUserCard } from '../../utils/cardStorage';
import { changeUserPassword } from '../../utils/adminStorage';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getUserCard());
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nimNik: '',
    instansi: '',
    jabatan: '',
    telepon: '',
    linkedin: '',
    bio: ''
  });

  // State untuk Ubah Kata Sandi
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    const current = getUserCard();
    setProfile(current);
    setFormData({
      namaLengkap: current.namaLengkap || '',
      email: current.email || '',
      nimNik: current.nimNik || '',
      instansi: current.instansi || 'Politeknik Negeri Batam',
      jabatan: current.jabatan || '',
      telepon: current.telepon || '',
      linkedin: current.linkedin || '',
      bio: current.bio || ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = saveUserCard({
      ...profile,
      ...formData
    });
    setProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!passwordData.oldPassword) {
      setPasswordMsg({ type: 'error', text: 'Masukkan kata sandi lama (NIM/NIK default atau password saat ini).' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Kata sandi baru minimal harus 6 karakter.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      const result = changeUserPassword(profile.email, passwordData.oldPassword, passwordData.newPassword);
      setIsChangingPass(false);
      if (result.success) {
        setPasswordMsg({ type: 'success', text: result.message });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordMsg({ type: '', text: '' });
        }, 2500);
      } else {
        setPasswordMsg({ type: 'error', text: result.message });
      }
    }, 500);
  };

  return (
    <div className="user-profile-page">
      <Navbar active="profile" />

      <main className="profile-main-wrap">
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {profile.namaLengkap ? profile.namaLengkap.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-header-info">
            <span className="profile-role-badge">Registered Campus User</span>
            <h1 className="profile-name-title">{profile.namaLengkap || 'User Profile'}</h1>
            <p className="profile-instansi-text">{profile.instansi || 'Politeknik Negeri Batam'}</p>
          </div>
          <div className="profile-header-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-primary-profile"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile Info
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary-profile"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="btn-outline-profile"
              onClick={() => navigate('/kartu-nama')}
            >
              💼 Manage Business Card →
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="profile-alert-toast">
            ✓ Your profile details have been successfully updated!
          </div>
        )}

        <div className="profile-details-grid">
          {/* Identity & Account Information */}
          <div className="profile-section-card">
            <h2 className="profile-section-title">Account & Campus Credentials</h2>
            <p className="profile-section-desc">Official identity details registered within Politeknik Negeri Batam</p>

            <form onSubmit={handleSave} className="profile-form">
              <div className="profile-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>Registered Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  title="Registered email cannot be modified"
                />
                <span className="field-hint">Primary campus identity & login email</span>
              </div>

              <div className="profile-row-inputs">
                <div className="profile-input-group">
                  <label>NIM / NIK / NIP (Password Access)</label>
                  <input
                    type="text"
                    name="nimNik"
                    value={formData.nimNik}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. 3312401050"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Campus Institution</label>
                  <input
                    type="text"
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="profile-row-inputs">
                <div className="profile-input-group">
                  <label>Role / Position</label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. Informatics Engineering Student"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. +62 812-3478-010"
                  />
                </div>
              </div>

              <div className="profile-input-group">
                <label>About & Professional Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Share a short bio about your expertise and academic background..."
                />
              </div>

              {isEditing && (
                <div className="profile-form-footer">
                  <button type="submit" className="btn-save-profile">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Quick Shortcuts & PRM Summary */}
          <div className="profile-sidebar-column">
            <div className="profile-section-card quick-card-box">
              <h3 className="sidebar-card-title">Digital Business Card</h3>
              <p className="sidebar-card-desc">Your verified card is ready for networking and appointments.</p>
              <div className="mini-card-preview">
                <div className="mini-card-header">
                  <strong>{profile.namaLengkap}</strong>
                  <span>{profile.jabatan || 'Member'}</span>
                </div>
                <div className="mini-card-campus">{profile.instansi}</div>
              </div>
              <button
                type="button"
                className="btn-full-action"
                onClick={() => navigate(`/card/${profile.id}`)}
              >
                View Public Digital Card ↗
              </button>
            </div>

            <div className="profile-section-card">
              <h3 className="sidebar-card-title">PRM Relations</h3>
              <p className="sidebar-card-desc">Manage appointment requests and verified connections.</p>
              <div className="profile-quick-links">
                <button type="button" onClick={() => navigate('/kelola-prm')}>
                  📅 Manage PRM Appointments →
                </button>
                <button type="button" onClick={() => navigate('/kontak-relasi')}>
                  👥 View Relationship Contacts →
                </button>
                <button type="button" onClick={() => navigate('/riwayat-prm')}>
                  📜 Appointment History →
                </button>
              </div>
            </div>

            {/* Security / Change Password Card */}
            <div className="profile-section-card">
              <h3 className="sidebar-card-title">🔐 Keamanan Akun</h3>
              <p className="sidebar-card-desc">
                Saat pertama kali didaftarkan oleh admin, kata sandi Anda adalah NIM/NIK. Anda dapat mengganti kata sandi mandiri di sini.
              </p>
              <button
                type="button"
                className="btn-full-action"
                style={{ background: '#0284c7', borderColor: '#0284c7', color: '#fff' }}
                onClick={() => {
                  setPasswordMsg({ type: '', text: '' });
                  setIsPasswordModalOpen(true);
                }}
              >
                🔑 Ubah Kata Sandi
              </button>
            </div>
          </div>
        </div>

        {/* Modal Ubah Kata Sandi */}
        {isPasswordModalOpen && (
          <div className="prm-modal-overlay" onClick={() => !isChangingPass && setIsPasswordModalOpen(false)}>
            <div className="prm-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="prm-modal-header">
                <div className="prm-modal-title-row">
                  <span className="prm-modal-badge accept">Keamanan</span>
                  <h3 className="prm-modal-heading">Ubah Kata Sandi Akun</h3>
                </div>
                <button
                  className="prm-modal-close-btn"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isChangingPass}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="prm-modal-body">
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    Akun: <strong>{profile.email}</strong> ({profile.namaLengkap})
                  </p>

                  {passwordMsg.text && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      background: passwordMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      color: passwordMsg.type === 'success' ? '#166534' : '#991b1b',
                      border: `1px solid ${passwordMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                      {passwordMsg.type === 'success' ? '✓ ' : '⚠️ '}
                      {passwordMsg.text}
                    </div>
                  )}

                  <div className="prm-input-group">
                    <label className="prm-input-label">
                      Kata Sandi Lama <span className="prm-required">* (NIM/NIK atau password saat ini)</span>
                    </label>
                    <input
                      type="password"
                      className="prm-text-input"
                      placeholder="Masukkan NIM/NIK atau kata sandi lama"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      disabled={isChangingPass}
                      required
                    />
                  </div>

                  <div className="prm-input-group">
                    <label className="prm-input-label">
                      Kata Sandi Baru <span className="prm-required">* (Minimal 6 karakter)</span>
                    </label>
                    <input
                      type="password"
                      className="prm-text-input"
                      placeholder="Buat kata sandi baru yang aman"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      disabled={isChangingPass}
                      required
                    />
                  </div>

                  <div className="prm-input-group">
                    <label className="prm-input-label">
                      Konfirmasi Kata Sandi Baru <span className="prm-required">*</span>
                    </label>
                    <input
                      type="password"
                      className="prm-text-input"
                      placeholder="Ulangi kata sandi baru"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      disabled={isChangingPass}
                      required
                    />
                  </div>
                </div>

                <div className="prm-modal-footer">
                  <button
                    type="button"
                    className="prm-modal-cancel-btn"
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={isChangingPass}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="prm-modal-submit-btn accept"
                    disabled={isChangingPass}
                  >
                    {isChangingPass ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

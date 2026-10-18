import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getUserCard, saveUserCard } from '../../utils/cardStorage';
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

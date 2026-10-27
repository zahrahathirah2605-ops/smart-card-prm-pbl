import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../Footer/Footer';
import { addAdminUser } from '../../utils/adminStorage';
import './AdminPengguna.css';

const AdminTambahPengguna = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nimNik: '',
    role: 'Pengguna',
    instansi: 'Politeknik Negeri Batam',
    jabatan: '',
    telepon: '',
    status: 'Aktif'
  });

  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.namaLengkap || !formData.nimNik) {
      showToast('Full Name, Email, and NIM/NIK are required (NIM/NIK is used as password)!', 'error');
      return;
    }

    const payload = {
      ...formData,
      namaLengkap: formData.namaLengkap.trim(),
      nimNik: formData.nimNik.trim(),
      instansi: formData.instansi.trim() || 'Politeknik Negeri Batam',
      jabatan: formData.jabatan.trim() || 'Academic Staff',
      telepon: formData.telepon.trim() || '-'
    };

    const created = addAdminUser(payload);
    if (created) {
      showToast(`User account for ${created.namaLengkap} (${created.email}) added successfully and is ready to log in!`, 'success');
      setTimeout(() => {
        navigate('/admin/pengguna');
      }, 1200);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminNavbar active="pengguna" />

      <main className="admin-main-wrap">
        {/* Toast Notification */}
        {notification && (
          <div className={`admin-toast-banner ${notification.type}`}>
            <span>{notification.type === 'success' ? '✓' : '⚠️'} {notification.message}</span>
          </div>
        )}

        {/* Centered Wrapper Box */}
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {/* Back Button / Breadcrumb */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              onClick={() => navigate('/admin/pengguna')}
              style={{ background: 'none', border: 'none', color: '#12417D', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontSize: '0.95rem' }}
            >
              ← Back to users list
            </button>
          </div>

          {/* Header Title */}
          <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h1 className="admin-page-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#12417D' }}>Add User</h1>
              <p className="admin-page-desc" style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Add a new user account by providing user details and access role.
              </p>
            </div>
          </div>

          {/* Centered Form Card */}
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Full Name */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Full Name <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Rizky, S.T."
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* User Email */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  User Email (for Login) <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter user email (e.g. rizky@polibatam.ac.id)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* NIM/NIK */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  NIM / NIK <span style={{ color: '#ff5733' }}>* (Used as Login Password)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter NIM or NIK (e.g. 3312401050)"
                  value={formData.nimNik}
                  onChange={(e) => setFormData({ ...formData, nimNik: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #0284c7', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f0f9ff' }}
                />
                <span style={{ fontSize: '0.78rem', color: '#0369a1' }}>
                  🔒 Users will use this NIM/NIK number as their initial password when logging in.
                </span>
              </div>

              {/* Institution */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Campus Institution <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Pre-filled campus internal)</span>
                </label>
                <input
                  type="text"
                  value={formData.instansi}
                  onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f8fafc', color: '#0f172a', fontWeight: 600 }}
                />
              </div>

              {/* Position & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Position / Department <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lecturer / Student"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Phone / WhatsApp Number <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +62 812-3456-7890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Access Role <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="Pengguna">Registered User</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              {/* Form Footer & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ color: '#ff5733' }}>*</span> Required
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/pengguna')}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.75rem 1.8rem', borderRadius: '10px', border: 'none', background: '#12417D', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    + Add User
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminTambahPengguna;
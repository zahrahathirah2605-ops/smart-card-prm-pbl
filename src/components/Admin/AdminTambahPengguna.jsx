import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
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
    jabatan: 'Mahasiswa / Staf',
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
    if (!formData.email || !formData.nimNik) {
      showToast('User email and NIM/NIK are required!', 'error');
      return;
    }

    const payload = {
      ...formData,
      namaLengkap: formData.namaLengkap || `User ${formData.nimNik}`
    };

    const created = addAdminUser(payload);
    if (created) {
      showToast(`User account ${created.email} successfully added!`, 'success');
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
                Add a new user account by filling in the identity and user role.
              </p>
            </div>
          </div>

          {/* Centered Form Card */}
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* User Email */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  User email <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value, namaLengkap: e.target.value.split('@')[0] })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* NIM/NIK */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  NIM/NIK <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter NIM or NIK"
                  value={formData.nimNik}
                  onChange={(e) => setFormData({ ...formData, nimNik: e.target.value, jabatan: `ID: ${e.target.value}` })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Role */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Role <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="Pengguna">User</option>
                  <option value="Admin">Admin</option>
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
    </div>
  );
};

export default AdminTambahPengguna;
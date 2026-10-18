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
      showToast('Nama Lengkap, Email, dan NIM/NIK wajib diisi (NIM/NIK digunakan untuk kata sandi)!', 'error');
      return;
    }

    const payload = {
      ...formData,
      namaLengkap: formData.namaLengkap.trim(),
      nimNik: formData.nimNik.trim(),
      instansi: formData.instansi.trim() || 'Politeknik Negeri Batam',
      jabatan: formData.jabatan.trim() || 'Civitas Akademika',
      telepon: formData.telepon.trim() || '-'
    };

    const created = addAdminUser(payload);
    if (created) {
      showToast(`Akun pengguna ${created.namaLengkap} (${created.email}) berhasil ditambahkan dan siap digunakan untuk login!`, 'success');
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
              ← Kembali ke daftar pengguna
            </button>
          </div>

          {/* Header Title */}
          <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h1 className="admin-page-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#12417D' }}>Tambah Pengguna</h1>
              <p className="admin-page-desc" style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Tambahkan akun pengguna baru dengan mengisi identitas dan role pengguna.
              </p>
            </div>
          </div>

          {/* Centered Form Card */}
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Nama Lengkap */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Nama Lengkap <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Rizky, S.T."
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* User Email */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Email Pengguna (untuk Login) <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email pengguna (misal: rizky@polibatam.ac.id)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* NIM/NIK - WAJIB KARENA DIGUNAKAN SEBAGAI PASSWORD LOGIN */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  NIM / NIK <span style={{ color: '#ff5733' }}>* (Digunakan sebagai Kata Sandi Login)</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan NIM atau NIK (misal: 3312401050)"
                  value={formData.nimNik}
                  onChange={(e) => setFormData({ ...formData, nimNik: e.target.value })}
                  required
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #0284c7', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f0f9ff' }}
                />
                <span style={{ fontSize: '0.78rem', color: '#0369a1' }}>
                  🔒 Pengguna akan menggunakan nomor NIM/NIK ini sebagai password saat login ke sistem.
                </span>
              </div>

              {/* Instansi (Otomatis Politeknik Negeri Batam) */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Instansi Kampus <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Otomatis terisi internal kampus)</span>
                </label>
                <input
                  type="text"
                  value={formData.instansi}
                  onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f8fafc', color: '#0f172a', fontWeight: 600 }}
                />
              </div>

              {/* Jabatan & Telepon (Opsional) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Jabatan / Jurusan <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dosen / Mahasiswa"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Nomor Telepon / WhatsApp <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: +62 812-3456-7890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="form-group-modal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  Role Hak Akses <span style={{ color: '#ff5733' }}>*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="Pengguna">Pengguna Terdaftar</option>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminTambahPengguna;
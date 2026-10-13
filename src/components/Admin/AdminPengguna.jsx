import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import {
  getAdminUsers,
  addAdminUser,
  toggleUserStatus,
  updateAdminUser,
  deleteAdminUser
} from '../../utils/adminStorage';
import './AdminPengguna.css';

const AdminPengguna = () => {
  const [users, setUsers] = useState(() => getAdminUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Aktif' | 'Nonaktif'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadUsers = () => {
    setUsers(getAdminUsers());
  };

  useEffect(() => {
    const handleStorageChange = () => loadUsers();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Toggle user active / inactive status (FR-13)
  const handleToggleStatus = (user) => {
    const updated = toggleUserStatus(user.id);
    if (updated) {
      loadUsers();
      const statusText = updated.status === 'Aktif' ? 'diaktifkan kembali' : 'dinonaktifkan';
      showToast(`Akses akun untuk ${updated.namaLengkap} berhasil ${statusText}!`, updated.status === 'Aktif' ? 'success' : 'warning');
    }
  };

  // Handle Add User Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.email) {
      showToast('Nama lengkap dan email wajib diisi!', 'error');
      return;
    }

    const created = addAdminUser(formData);
    if (created) {
      loadUsers();
      setIsAddModalOpen(false);
      setFormData({
        namaLengkap: '',
        email: '',
        instansi: 'Politeknik Negeri Batam',
        jabatan: '',
        telepon: '',
        status: 'Aktif'
      });
      showToast(`Pengguna baru ${created.namaLengkap} berhasil ditambahkan!`, 'success');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = updateAdminUser(editingUser.id, editingUser);
    if (updated) {
      loadUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
      showToast(`Data pengguna ${updated.namaLengkap} berhasil diperbarui!`, 'success');
    }
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${user.namaLengkap}?`)) {
      deleteAdminUser(user.id);
      loadUsers();
      showToast(`Akun ${user.namaLengkap} telah dihapus dari sistem.`, 'warning');
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === 'ALL' || u.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const totalAktif = users.filter((u) => u.status === 'Aktif').length;
  const totalNonaktif = users.filter((u) => u.status === 'Nonaktif').length;

  return (
    <div className="admin-page-container">
      <AdminNavbar active="pengguna" />

      <main className="admin-main-wrap">
        {/* Toast Notification */}
        {notification && (
          <div className={`admin-toast-banner ${notification.type}`}>
            <span>{notification.type === 'success' ? '✓' : '⚠️'} {notification.message}</span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Header Row */}
        <div className="admin-page-header">
          <div>
            <div className="badge-tag">Kebutuhan Fungsional FR-13</div>
            <h1 className="admin-page-title">Kelola Pengguna Terdaftar</h1>
            <p className="admin-page-desc">
              Kelola akun pengguna internal Politeknik Negeri Batam, tambahkan akun baru, serta atur izin akses (mengaktifkan atau menonaktifkan akun).
            </p>
          </div>

          <button className="btn-add-user-primary" onClick={() => setIsAddModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tambah Pengguna
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="admin-metrics-row">
          <div className="metric-box total">
            <div className="metric-num">{users.length}</div>
            <div className="metric-label">Total Pengguna Terdaftar</div>
          </div>
          <div className="metric-box active">
            <div className="metric-num">{totalAktif}</div>
            <div className="metric-label">Akun Aktif (Dapat Login)</div>
          </div>
          <div className="metric-box inactive">
            <div className="metric-num">{totalNonaktif}</div>
            <div className="metric-label">Akun Dinonaktifkan (Diblokir)</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="admin-filter-bar">
          <div className="admin-search-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, instansi, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter-pills">
            <button
              className={`pill-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              Semua ({users.length})
            </button>
            <button
              className={`pill-btn ${filterStatus === 'Aktif' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Aktif')}
            >
              Aktif ({totalAktif})
            </button>
            <button
              className={`pill-btn ${filterStatus === 'Nonaktif' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Nonaktif')}
            >
              Nonaktif ({totalNonaktif})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pengguna</th>
                <th>Kontak & Email</th>
                <th>Instansi & Jabatan</th>
                <th>Tgl Terdaftar</th>
                <th>Status Akun (FR-13)</th>
                <th style={{ textAlign: 'center' }}>Kelola Akses</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty-state">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={user.status === 'Nonaktif' ? 'row-inactive' : ''}>
                    <td>
                      <span className="user-id-badge">{user.id}</span>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <div className={`user-avatar-circle ${user.status === 'Aktif' ? 'active' : 'inactive'}`}>
                          {user.namaLengkap.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-full-name">{user.namaLengkap}</div>
                          <div className="user-role-tag">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email-text">{user.email}</div>
                      <div className="user-phone-text">{user.telepon}</div>
                    </td>
                    <td>
                      <div className="user-instansi-text">{user.instansi}</div>
                      <div className="user-jabatan-text">{user.jabatan}</div>
                    </td>
                    <td>
                      <div className="user-date-text">{user.tanggalDibuat}</div>
                    </td>
                    <td>
                      <span className={`status-badge-pill ${user.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}`}>
                        <span className="dot" />
                        {user.status === 'Aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        {/* Toggle Status Button (FR-13: mengaktifkan / menonaktifkan) */}
                        <button
                          className={`btn-action-toggle ${user.status === 'Aktif' ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'Aktif' ? 'Nonaktifkan Akun Pengguna' : 'Aktifkan Kembali Akun Pengguna'}
                        >
                          {user.status === 'Aktif' ? (
                            <>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                              </svg>
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              Aktifkan
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          className="btn-action-icon edit"
                          onClick={() => handleOpenEdit(user)}
                          title="Edit Data Pengguna"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn-action-icon delete"
                          onClick={() => handleDeleteUser(user)}
                          title="Hapus Akun Pengguna"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Tambah Pengguna Baru */}
        {isAddModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Tambah Pengguna Terdaftar Baru</h3>
                  <p className="admin-modal-sub">Daftarkan akun pengguna internal baru ke platform SmartCard PRM</p>
                </div>
                <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleAddSubmit} className="admin-profile-form">
                <div className="form-group-modal">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Muhammad Farhan"
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label>Email Pengguna (Untuk Login) *</label>
                  <input
                    type="email"
                    placeholder="farhan@polibatam.ac.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Instansi / Kampus</label>
                    <input
                      type="text"
                      placeholder="Politeknik Negeri Batam"
                      value={formData.instansi}
                      onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Jabatan / Program Studi</label>
                    <input
                      type="text"
                      placeholder="Teknik Multimedia & Jaringan"
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+62 812-xxxx-xxxx"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Status Akun Awal</label>
                    <select
                      className="form-select-modal"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Aktif">Aktif (Dapat Login Langsung)</option>
                      <option value="Nonaktif">Nonaktif (Akses Ditangguhkan)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-modal-save">
                    Tambah Pengguna
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Data Pengguna */}
        {isEditModalOpen && editingUser && (
          <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Edit Data Pengguna ({editingUser.id})</h3>
                  <p className="admin-modal-sub">Perbarui informasi profil atau status pengguna terdaftar</p>
                </div>
                <button className="admin-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleEditSubmit} className="admin-profile-form">
                <div className="form-group-modal">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    value={editingUser.namaLengkap}
                    onChange={(e) => setEditingUser({ ...editingUser, namaLengkap: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label>Email Pengguna</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Instansi</label>
                    <input
                      type="text"
                      value={editingUser.instansi}
                      onChange={(e) => setEditingUser({ ...editingUser, instansi: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Jabatan</label>
                    <input
                      type="text"
                      value={editingUser.jabatan}
                      onChange={(e) => setEditingUser({ ...editingUser, jabatan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Nomor Telepon</label>
                    <input
                      type="text"
                      value={editingUser.telepon}
                      onChange={(e) => setEditingUser({ ...editingUser, telepon: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Status Akun</label>
                    <select
                      className="form-select-modal"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-modal-save">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPengguna;

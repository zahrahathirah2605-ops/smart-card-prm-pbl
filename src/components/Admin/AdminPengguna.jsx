import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../Footer/Footer';
import {
  getAdminUsers,
  toggleUserStatus,
  updateAdminUser,
  deleteAdminUser
} from '../../utils/adminStorage';
import './AdminPengguna.css';

const AdminPengguna = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getAdminUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Active' | 'Inactive'
  
  // State to toggle between Table and Add User Form
  const [isAdding, setIsAdding] = useState(false);

  // Form state for Add User
  const [addFormData, setAddFormData] = useState({
    namaLengkap: '',
    email: '',
    nimNik: '',
    role: 'Pengguna',
    instansi: 'Politeknik Negeri Batam',
    jabatan: '',
    telepon: '',
    status: 'Aktif'
  });

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
      const statusText = updated.status === 'Aktif' ? 'reactivated' : 'deactivated';
      showToast(`Account access for ${updated.namaLengkap} has been successfully ${statusText}!`, updated.status === 'Aktif' ? 'success' : 'warning');
    }
  };

  // Handle Submit Add User
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.email || !addFormData.namaLengkap || !addFormData.nimNik) {
      showToast('Full Name, Email, and NIM/NIK are required (NIM/NIK is used to log in)!', 'error');
      return;
    }

    const payload = {
      ...addFormData,
      namaLengkap: addFormData.namaLengkap.trim(),
      nimNik: addFormData.nimNik.trim(),
      instansi: addFormData.instansi.trim() || 'Politeknik Negeri Batam',
      jabatan: addFormData.jabatan.trim() || 'Academic Staff',
      telepon: addFormData.telepon.trim() || '-'
    };

    const created = addAdminUser(payload);
    if (created) {
      loadUsers();
      setIsAdding(false);
      setAddFormData({
        namaLengkap: '',
        email: '',
        nimNik: '',
        role: 'Pengguna',
        instansi: 'Politeknik Negeri Batam',
        jabatan: '',
        telepon: '',
        status: 'Aktif'
      });
      showToast(`Account ${created.namaLengkap} (${created.email}) added successfully and is ready to log in!`, 'success');
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
      showToast(`User data for ${updated.namaLengkap} updated successfully!`, 'success');
    }
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete the account for ${user.namaLengkap}?`)) {
      deleteAdminUser(user.id);
      loadUsers();
      showToast(`Account ${user.namaLengkap} has been removed from the system.`, 'warning');
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
      filterStatus === 'ALL' ||
      (filterStatus === 'Active' && u.status === 'Aktif') ||
      (filterStatus === 'Inactive' && u.status === 'Nonaktif');

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

        {/* CONDITION 1: IF IN ADD USER MODE */}
        {isAdding ? (
          <div>
            {/* Back Button to Users List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setIsAdding(false)}
                style={{ background: 'none', border: 'none', color: '#12417D', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontSize: '0.95rem' }}
              >
                ← Back to users list
              </button>
            </div>

            {/* Header Form Add User */}
            <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h1 className="admin-page-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#12417D' }}>Add User</h1>
                <p className="admin-page-desc" style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Add a new account by providing user identity and role.
                </p>
              </div>
            </div>

            {/* Card Form */}
            <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', maxWidth: '850px' }}>
              <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Full Name <span style={{ color: '#ff5733' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Rizky, S.T."
                    value={addFormData.namaLengkap}
                    onChange={(e) => setAddFormData({ ...addFormData, namaLengkap: e.target.value })}
                    required
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                {/* User Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    User Email (for Login) <span style={{ color: '#ff5733' }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter user email (e.g. rizky@polibatam.ac.id)"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    required
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                {/* NIM / NIK */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    NIM / NIK <span style={{ color: '#ff5733' }}>* (Used as Login Password)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter NIM or NIK (e.g. 3312401050)"
                    value={addFormData.nimNik}
                    onChange={(e) => setAddFormData({ ...addFormData, nimNik: e.target.value })}
                    required
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #0284c7', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f0f9ff' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#0369a1' }}>
                    🔒 Users will use this NIM/NIK number as their initial password when logging in.
                  </span>
                </div>

                {/* Institution */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Campus Institution <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Pre-filled campus internal)</span>
                  </label>
                  <input
                    type="text"
                    value={addFormData.instansi}
                    onChange={(e) => setAddFormData({ ...addFormData, instansi: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#f8fafc', color: '#0f172a', fontWeight: 600 }}
                  />
                </div>

                {/* Position & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                      Position / Department <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Informatics Lecturer / Student"
                      value={addFormData.jabatan}
                      onChange={(e) => setAddFormData({ ...addFormData, jabatan: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                      Phone / WhatsApp Number <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +62 812-3456-7890"
                      value={addFormData.telepon}
                      onChange={(e) => setAddFormData({ ...addFormData, telepon: e.target.value })}
                      style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Role */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    Access Role <span style={{ color: '#ff5733' }}>*</span>
                  </label>
                  <select
                    value={addFormData.role}
                    onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                    style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="Pengguna">Registered User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                {/* Footer Form & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <span style={{ color: '#ff5733' }}>*</span> Required
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
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
        ) : (
          /* CONDITION 2: MAIN REGISTERED USERS PAGE */
          <div>
            {/* Header Row */}
            <div className="admin-page-header">
              <div>
                <div className="badge-tag">Functional Requirement FR-13</div>
                <h1 className="admin-page-title">Manage Registered Users</h1>
                <p className="admin-page-desc">
                  Manage Politeknik Negeri Batam internal user accounts, add new accounts, and configure access permissions (activate or deactivate accounts).
                </p>
              </div>

              {/* Add User Navigation Button */}
              <button 
                className="btn-add-user-primary" 
                onClick={() => navigate('/admin/tambah-pengguna')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add User
              </button>
            </div>

            {/* Summary Metric Cards */}
            <div className="admin-metrics-row">
              <div className="metric-box total">
                <div className="metric-num">{users.length}</div>
                <div className="metric-label">Total Registered Users</div>
              </div>
              <div className="metric-box active">
                <div className="metric-num">{totalAktif}</div>
                <div className="metric-label">Active Accounts (Can Login)</div>
              </div>
              <div className="metric-box inactive">
                <div className="metric-num">{totalNonaktif}</div>
                <div className="metric-label">Deactivated Accounts</div>
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
                  placeholder="Search by name, email, institution, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="status-filter-pills">
                <button
                  className={`pill-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALL')}
                >
                  All ({users.length})
                </button>
                <button
                  className={`pill-btn ${filterStatus === 'Active' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('Active')}
                >
                  Active ({totalAktif})
                </button>
                <button
                  className={`pill-btn ${filterStatus === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('Inactive')}
                >
                  Inactive ({totalNonaktif})
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Name</th>
                    <th>Contact & Email</th>
                    <th>Institution & Position</th>
                    <th>Registered Date</th>
                    <th>Account Status (FR-13)</th>
                    <th style={{ textAlign: 'center' }}>Manage Access</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="table-empty-state">
                        No users match the search criteria.
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
                              {user.namaLengkap ? user.namaLengkap.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="user-full-name">{user.namaLengkap}</div>
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                                <span className="user-role-tag">{user.role === 'Pengguna' ? 'User' : user.role}</span>
                                {user.nimNik && (
                                  <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#0d3b75', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                                    NIM: {user.nimNik}
                                  </span>
                                )}
                              </div>
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
                            {user.status === 'Aktif' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            {/* Toggle Status Button (FR-13) */}
                            <button
                              className={`btn-action-toggle ${user.status === 'Aktif' ? 'btn-deactivate' : 'btn-activate'}`}
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === 'Aktif' ? 'Deactivate User Account' : 'Reactivate User Account'}
                            >
                              {user.status === 'Aktif' ? (
                                <>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                  </svg>
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                  </svg>
                                  Activate
                                </>
                              )}
                            </button>

                            {/* View Card & QR Link */}
                            <button
                              className="btn-action-icon view-card"
                              onClick={() => navigate(`/card/${user.cardId || user.namaLengkap.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`)}
                              title="Open Digital Business Card & QR"
                              style={{ color: '#0d3b75' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                              </svg>
                            </button>

                            {/* Edit Button */}
                            <button
                              className="btn-action-icon edit"
                              onClick={() => handleOpenEdit(user)}
                              title="Edit User Information"
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
                              title="Delete User Account"
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
          </div>
        )}

        {/* Modal: Edit User Data */}
        {isEditModalOpen && editingUser && (
          <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Edit User Data ({editingUser.id})</h3>
                  <p className="admin-modal-sub">Update profile information or status of registered user</p>
                </div>
                <button className="admin-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleEditSubmit} className="admin-profile-form">
                <div className="form-group-modal">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editingUser.namaLengkap}
                    onChange={(e) => setEditingUser({ ...editingUser, namaLengkap: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label>User Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label>NIM / NIK (Login Password)</label>
                  <input
                    type="text"
                    value={editingUser.nimNik || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, nimNik: e.target.value })}
                    placeholder="e.g. 3312401001 or NIK"
                    required
                  />
                  <small style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                    This NIM/NIK is required and used as the account login password.
                  </small>
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={editingUser.instansi}
                      onChange={(e) => setEditingUser({ ...editingUser, instansi: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Position</label>
                    <input
                      type="text"
                      value={editingUser.jabatan}
                      onChange={(e) => setEditingUser({ ...editingUser, jabatan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-row-grid">
                  <div className="form-group-modal">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={editingUser.telepon}
                      onChange={(e) => setEditingUser({ ...editingUser, telepon: e.target.value })}
                    />
                  </div>
                  <div className="form-group-modal">
                    <label>Account Status</label>
                    <select
                      className="form-select-modal"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="Aktif">Active</option>
                      <option value="Nonaktif">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPengguna;
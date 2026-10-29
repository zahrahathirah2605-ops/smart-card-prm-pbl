import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../Footer/Footer';
import {
  getActivityLogs,
  addActivityLog,
  getAdminStatistics,
  getAdminUsers
} from '../../utils/adminStorage';
import { QRCodeSVG } from 'qrcode.react';
import './AdminAktivitas.css';

const AdminAktivitas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'cards' ? 'cards' : 'logs';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [logs, setLogs] = useState(() => getActivityLogs());
  const [users, setUsers] = useState(() => getAdminUsers());
  const [stats, setStats] = useState(() => getAdminStatistics());

  const [searchLog, setSearchLog] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const loadAllData = () => {
    setLogs(getActivityLogs());
    setUsers(getAdminUsers());
    setStats(getAdminStatistics());
  };

  useEffect(() => {
    const handleStorageChange = () => loadAllData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Simulate new user activity event
  const handleSimulateActivity = () => {
    const sampleEvents = [
      {
        aktor: 'Aprillia Bunga Lestari',
        email: 'smart.card@gmail.com',
        kategori: 'Business Card',
        aksi: 'Shared digital business card via QR Code to a new partner',
        status: 'Sukses',
        statusClass: 'log-success'
      },
      {
        aktor: 'Budi Santoso, M.Kom',
        email: 'budi.santoso@inovasidigital.id',
        kategori: 'Authentication',
        aksi: 'Logged in to registered user dashboard profile',
        status: 'Sukses',
        statusClass: 'log-success'
      },
      {
        aktor: 'Siti Rahma, S.T., M.Sc',
        email: 'siti.rahma@polibatam.ac.id',
        kategori: 'PRM Interaction',
        aksi: 'Accepted PBL research meeting appointment request',
        status: 'Sukses',
        statusClass: 'log-success'
      }
    ];

    const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    addActivityLog(randomEvent);
    loadAllData();
    showNotification(`New activity from ${randomEvent.aktor} logged to the system!`);
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    const header = ['ID', 'Time', 'Actor', 'Email', 'Category', 'Activity', 'Status'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.aktor}"`,
      `"${l.email}"`,
      `"${l.kategori}"`,
      `"${l.aksi.replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Activity_Logs_SmartCard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Activity logs CSV file downloaded successfully!');
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.aktor.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.email.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.aksi.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.id.toLowerCase().includes(searchLog.toLowerCase());

    const matchCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'Business Card' && (log.kategori === 'Kartu Nama' || log.kategori === 'Business Card')) ||
      (categoryFilter === 'Authentication' && (log.kategori === 'Autentikasi' || log.kategori === 'Authentication')) ||
      (categoryFilter === 'PRM Interaction' && (log.kategori === 'PRM Interaksi' || log.kategori === 'PRM Interaction')) ||
      (categoryFilter === 'Account Access' && (log.kategori === 'Akses Akun' || log.kategori === 'Account Access')) ||
      log.kategori === categoryFilter;

    return matchSearch && matchCategory;
  });

  return (
    <div className="admin-page-container">
      <AdminNavbar active="aktivitas" />

      <main className="admin-main-wrap">
        {/* Toast */}
        {toastMessage && (
          <div className="admin-toast-banner success">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage('')}>✕</button>
          </div>
        )}

        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <div className="badge-tag">Functional Requirement FR-14</div>
            <h1 className="admin-page-title">Centralized Monitoring & Statistics</h1>
            <p className="admin-page-desc">
              Monitor digital business cards, internal user activity logs, and centralized application usage statistics.
            </p>
          </div>

          <div className="header-action-group">
            <button className="btn-secondary-audit" onClick={handleSimulateActivity}>
              ⚡ Simulate Activity
            </button>
            <button className="btn-primary-audit" onClick={handleExportCSV}>
              📥 Export CSV Log
            </button>
          </div>
        </div>

        {/* FR-14: Centralized Statistics Overview */}
        <div className="kpi-stats-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Total Activity Logs</span>
              <div className="kpi-value">{stats.totalAktivitas}</div>
              <span className="kpi-sub green">↑ Real-time tracking</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Active Registered Users</span>
              <div className="kpi-value">{stats.penggunaAktif} / {stats.totalPengguna}</div>
              <span className="kpi-sub">{stats.penggunaNonaktif} Deactivated</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div className="kpi-content">
              <span className="kpi-title">Recorded Digital Cards</span>
              <div className="kpi-value">{users.length}</div>
              <span className="kpi-sub green">Cloud QR Synchronized</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div className="kpi-content">
              <span className="kpi-title">PRM Appointments & Interactions</span>
              <div className="kpi-value">{stats.totalInteraksiPRM}</div>
              <span className="kpi-sub">Partner relations meetings</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tab-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Activity Audit Logs ({logs.length})
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Digital Business Cards Monitoring ({users.length})
          </button>
        </div>

        {/* TAB 1: REKAM JEJAK AKTIVITAS */}
        {activeTab === 'logs' && (
          <div className="logs-section">
            {/* Filter Logs */}
            <div className="admin-filter-bar">
              <div className="admin-search-field">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search activity by user name, email, or action..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                />
              </div>

              <div className="status-filter-pills">
                <button
                  className={`pill-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('ALL')}
                >
                  All Categories
                </button>
                <button
                  className={`pill-btn ${categoryFilter === 'Business Card' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('Business Card')}
                >
                  Business Card
                </button>
                <button
                  className={`pill-btn ${categoryFilter === 'Account Access' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('Account Access')}
                >
                  Account Access
                </button>
                <button
                  className={`pill-btn ${categoryFilter === 'Authentication' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('Authentication')}
                >
                  Authentication
                </button>
                <button
                  className={`pill-btn ${categoryFilter === 'PRM Interaction' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('PRM Interaction')}
                >
                  PRM Interaction
                </button>
              </div>
            </div>

            {/* Table of Activity Logs */}
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Time</th>
                    <th>Actor / User</th>
                    <th>Category</th>
                    <th>Completed Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="table-empty-state">
                        No activity found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className="log-id-badge">{log.id}</span>
                        </td>
                        <td>
                          <div className="log-timestamp">{log.timestamp}</div>
                        </td>
                        <td>
                          <div className="log-actor-name">{log.aktor}</div>
                          <div className="log-actor-email">{log.email}</div>
                        </td>
                        <td>
                          <span className="log-category-pill">
                            {log.kategori === 'Kartu Nama' ? 'Business Card' :
                             log.kategori === 'Autentikasi' ? 'Authentication' :
                             log.kategori === 'PRM Interaksi' ? 'PRM Interaction' :
                             log.kategori === 'Akses Akun' ? 'Account Access' : log.kategori}
                          </span>
                        </td>
                        <td>
                          <div className="log-action-text">
                            {log.aksi === 'Memperbarui data kartu nama digital & bio profil' ? 'Updated digital business card data and bio profile' :
                             log.aksi === 'Mengonfirmasi janji temu PRM dengan mitra industri' ? 'Confirmed PRM appointment with industry partner' :
                             log.aksi.startsWith('Menonaktifkan akses akun') ? log.aksi.replace('Menonaktifkan akses akun', 'Deactivated account access for') :
                             log.aksi === 'Login berhasil ke platform SmartCard PRM' ? 'Successfully logged in to SmartCard PRM platform' :
                             log.aksi === 'Mengunduh format PDF kartu nama digital untuk cetak' ? 'Downloaded digital business card PDF format for printing' :
                             log.aksi.startsWith('Menambahkan akun pengguna baru') ? log.aksi.replace('Menambahkan akun pengguna baru', 'Added new user account') :
                             log.aksi}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge-pill ${log.status === 'Sukses' ? 'badge-aktif' : 'badge-nonaktif'}`}>
                            <span className="dot" />
                            {log.status === 'Sukses' ? 'Success' : log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL BUSINESS CARD MONITORING */}
        {activeTab === 'cards' && (
          <div className="cards-monitoring-section">
            <div className="cards-monitoring-grid">
              {users.map((u) => {
                const cardUrl = `${window.location.origin}/card/${u.cardId || 'aprillia-bunga'}`;
                return (
                  <div key={u.id} className="card-monitor-box">
                    <div className="card-monitor-header">
                      <span className={`status-badge-pill ${u.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}`}>
                        <span className="dot" />
                        Account {u.status === 'Aktif' ? 'Active' : 'Inactive'}
                      </span>
                      <span className="card-id-label">{u.id}</span>
                    </div>

                    {/* Digital Card Preview Box */}
                    <div className="card-visual-preview">
                      <div className="preview-top-stripe"></div>
                      <div className="preview-body">
                        <div className="preview-avatar">
                          {u.namaLengkap.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="preview-name">{u.namaLengkap}</h4>
                        <p className="preview-role">{u.jabatan}</p>
                        <p className="preview-org">{u.instansi}</p>

                        <div className="preview-contacts">
                          <span>📧 {u.email}</span>
                          <span>📞 {u.telepon}</span>
                        </div>
                      </div>

                      {/* QR Code Container */}
                      <div className="preview-qr-row">
                        <div className="qr-wrapper-mini">
                          <QRCodeSVG value={cardUrl} size={64} level="M" />
                        </div>
                        <div className="qr-info">
                          <span className="qr-title">Digital QR Badge</span>
                          <span className="qr-desc">Scannable by guests & PRM partners</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="card-monitor-actions">
                      <button
                        className="btn-open-public-card"
                        onClick={() => navigate(`/card/${u.cardId || 'aprillia-bunga'}`)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View Public Card
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminAktivitas;
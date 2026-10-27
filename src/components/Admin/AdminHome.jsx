import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Footer from '../Footer/Footer';
import { getAdminStatistics, getActivityLogs } from '../../utils/adminStorage';
import './AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getAdminStatistics());
  const [recentLogs, setRecentLogs] = useState(() => getActivityLogs().slice(0, 3));

  useEffect(() => {
    const handleStorageChange = () => {
      setStats(getAdminStatistics());
      setRecentLogs(getActivityLogs().slice(0, 3));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="admin-home-wrapper">
      {/* Navbar exactly as shown in screenshot */}
      <AdminNavbar active="beranda" />

      {/* Main Container */}
      <main className="admin-home-content">
        {/* Welcome Section */}
        <section className="admin-welcome-hero">
          <div className="welcome-badge">Administrator Dashboard</div>
          <h1 className="admin-welcome-title">Welcome back, Administrator!</h1>
          <p className="admin-welcome-subtitle">
            Manage registered smart cards and monitor user activity logs
          </p>
        </section>

        {/* Feature Hub Cards for FR-13 & FR-14 */}
        <section className="admin-feature-cards">
          {/* Card 1: FR-13 Kelola Pengguna */}
          <div className="admin-card-action" onClick={() => navigate('/admin/pengguna')}>
            <div className="card-top-header">
              <div className="card-icon-box users-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="card-fr-tag">FR-13</span>
            </div>

            <h3 className="card-title">Manage Registered Users</h3>
            <p className="card-desc">
              Add new users, edit account details, and manage access authorization (activate or deactivate internal accounts).
            </p>

            <div className="card-stat-pill-row">
              <span className="stat-pill success">
                <strong>{stats.penggunaAktif}</strong> Active Accounts
              </span>
              {stats.penggunaNonaktif > 0 && (
                <span className="stat-pill warning">
                  <strong>{stats.penggunaNonaktif}</strong> Inactive
                </span>
              )}
            </div>

            <div className="card-action-footer">
              <span>Open User Management</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 2: FR-14 Pantau Aktivitas Terpusat */}
          <div className="admin-card-action" onClick={() => navigate('/admin/aktivitas')}>
            <div className="card-top-header">
              <div className="card-icon-box activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <span className="card-fr-tag">FR-14</span>
            </div>

            <h3 className="card-title">Activity Logs & Security Audit</h3>
            <p className="card-desc">
              Monitor real-time system activities, audit logs, authentication records, and user operations centrally.
            </p>

            <div className="card-stat-pill-row">
              <span className="stat-pill primary">
                <strong>{stats.totalAktivitas}</strong> Total Activity Logs
              </span>
              <span className="stat-pill neutral">Live Audit</span>
            </div>

            <div className="card-action-footer">
              <span>Open Activity Logs</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 3: FR-14 Data Kartu Nama Digital */}
          <div className="admin-card-action" onClick={() => navigate('/admin/aktivitas?tab=cards')}>
            <div className="card-top-header">
              <div className="card-icon-box cards-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <span className="card-fr-tag">FR-14</span>
            </div>

            <h3 className="card-title">Digital Business Cards Data</h3>
            <p className="card-desc">
              Monitor digital card directory of faculty, students, and staff across Politeknik Negeri Batam.
            </p>

            <div className="card-stat-pill-row">
              <span className="stat-pill primary">
                <strong>{stats.totalKartuDigital}</strong> Registered Cards
              </span>
              <span className="stat-pill success">Active QR</span>
            </div>

            <div className="card-action-footer">
              <span>View Cards Directory</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </section>

        {/* Live Audit Snapshot Bar */}
        <section className="admin-live-summary-box">
          <div className="live-summary-header">
            <div>
              <h4 className="live-title">Recent System Activities</h4>
              <p className="live-subtitle">Real-time registered user operations and authentications</p>
            </div>
            <button className="btn-view-all-logs" onClick={() => navigate('/admin/aktivitas')}>
              View All Logs →
            </button>
          </div>

          <div className="live-summary-list">
            {recentLogs.map((log) => (
              <div key={log.id} className="live-log-item">
                <div className="live-log-bullet" />
                <div className="live-log-info">
                  <div className="live-log-top">
                    <span className="live-log-actor">{log.aktor}</span>
                    <span className="live-log-category">{log.kategori}</span>
                    <span className="live-log-time">{log.timestamp}</span>
                  </div>
                  <div className="live-log-action">{log.aksi}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminHome;
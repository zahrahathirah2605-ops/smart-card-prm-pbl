import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import "../RiwayatPRM/RiwayatPRM.css"; 
import './KelolaPRM.css';

const KelolaPRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy untuk permintaan masuk yang perlu ditinjau
  const [kelolaData, setKelolaData] = useState([
    { id: '01', permintaan: 'Technical consultation request for core architecture', pengaju: 'Alex Turner', date: 'Oct 14, 2026', status: 'Pending Confirmation' },
    { id: '02', permintaan: 'Project partnership discussion and scoping', pengaju: 'Jessica Wong', date: 'Oct 13, 2026', status: 'Pending Confirmation' },
    { id: '03', permintaan: 'Quarterly review meeting proposal', pengaju: 'Michael Brown', date: 'Oct 11, 2026', status: 'Pending Confirmation' },
    { id: '04', permintaan: 'Business growth synergy appointment', pengaju: 'Sarah Connor', date: 'Oct 09, 2026', status: 'Pending Confirmation' },
  ]);

  const handleAction = (id, actionType) => {
    // Logika ketika tombol Terima / Tolak diklik
    setKelolaData(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: actionType === 'accept' ? 'Accepted' : 'Declined',
          statusClass: actionType === 'accept' ? 'status-selesai' : 'status-ditolak'
        };
      }
      return item;
    }));
  };

  const filteredData = kelolaData.filter(item => {
    return item.permintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.pengaju.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten */}
      <Navbar active="prm" />

      {/* Konten Utama Halaman Kelola PRM */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Manage PRM - Incoming Requests</h1>
            <p className="prm-main-desc">Review and manage incoming partner relationship requests.</p>
          </div>
        </div>

        {/* Search Bar dengan Icon Filter di Kanan */}
        <div className="prm-filter-bar-full">
        <div className="prm-search-box-kelola">
            <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            </span>
            <input
            type="text"
            placeholder="Search incoming requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="filter-icon-btn" title="Filter requests">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            </button>
        </div>
        </div>

        {/* Tabel Data Kelola PRM */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Request</th>
                <th style={{ width: '25%' }}>Status</th>
                <th style={{ width: '30%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.permintaan}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>From: {item.pengaju} | Date: {item.date}</div>
                    </td>
                    <td>
                      <span className={`prm-status-badge ${item.statusClass || 'status-ulang'}`}>
                        {item.status}
                      </span>
                    </td>
               <td style={{ textAlign: 'right' }}>
  {item.status === 'Pending Confirmation' ? (
    <div className="prm-action-btns">
      <button 
        className="btn-accept"
        onClick={() => handleAction(item.id, 'accept')}
      >
        Accept
      </button>
      <button 
        className="btn-reject"
        onClick={() => handleAction(item.id, 'reject')}
      >
        Reject
      </button>
    </div>
  ) : (
    <span className="text-processed">Processed</span>
  )}
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="prm-empty-row">
                    No incoming requests match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default KelolaPRM;
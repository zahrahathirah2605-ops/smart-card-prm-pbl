import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments } from '../../utils/cardStorage';
import './RiwayatPRM.css';

const RiwayatPRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riwayatData, setRiwayatData] = useState([]);

  // Default seed PRM history items in English
  const initialDummyData = [
    { id: '01', permintaan: 'Project consultation & technical scoping', tujuan: 'Budi Santoso (CTO)', date: 'Oct 12, 2026', status: 'Completed', statusClass: 'status-selesai' },
    { id: '02', permintaan: 'Strategic business collaboration session', tujuan: 'Siti Rahma', date: 'Oct 10, 2026', status: 'Completed', statusClass: 'status-selesai' },
    { id: '03', permintaan: 'Partnership agreement meeting', tujuan: 'Ahmad Fauzi', date: 'Oct 08, 2026', status: 'Cancelled', statusClass: 'status-dibatalkan' },
    { id: '04', permintaan: 'Media coverage interview request', tujuan: 'Dewi Lestari', date: 'Oct 05, 2026', status: 'Declined', statusClass: 'status-ditolak' },
    { id: '05', permintaan: 'Quarterly evaluation appointment', tujuan: 'Joko Widodo', date: 'Oct 01, 2026', status: 'Completed', statusClass: 'status-selesai' },
    { id: '06', permintaan: 'Schedule follow-up conference', tujuan: 'Rina Melati', date: 'Sep 28, 2026', status: 'Rescheduled', statusClass: 'status-ulang' },
    { id: '07', permintaan: 'New solution demo and product pitch', tujuan: 'Hendra Gunawan', date: 'Sep 25, 2026', status: 'Cancelled', statusClass: 'status-dibatalkan' },
  ];

  useEffect(() => {
    const userSubmitted = getStoredAppointments();
    setRiwayatData([...userSubmitted, ...initialDummyData]);
  }, []);

  const filteredData = riwayatData.filter(item => {
    return item.permintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.tujuan.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="riwayat-page-container">
      {/* Consistent Navbar */}
      <Navbar active="prm" />

      {/* Main PRM Content */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">PRM Appointments History</h1>
            <p className="prm-main-desc">Manage, track, and monitor partner relationship meeting requests.</p>
          </div>
          <button className="btn-prm-new" onClick={() => navigate('/scan')}>
            📷 Scan New Card
          </button>
        </div>

        {/* Search Bar */}
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
              placeholder="Search by topic, partner name, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* PRM Records Table */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Ref No.</th>
                <th style={{ width: '38%' }}>Meeting Objective</th>
                <th style={{ width: '25%' }}>Meeting Host / Partner</th>
                <th style={{ width: '12%' }}>Date</th>
                <th style={{ width: '13%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="font-semibold text-gray-700">{item.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.permintaan}</div>
                      {item.jam && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Time: {item.jam}</div>}
                    </td>
                    <td>{item.tujuan}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={`prm-status-badge ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="prm-empty-row">
                    No PRM appointment records match your criteria.
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

export default RiwayatPRM;
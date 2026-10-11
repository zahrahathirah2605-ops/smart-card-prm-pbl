import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './KontakRelasi.css';

const KontakRelasi = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy untuk daftar kontak relasi yang tersimpan
  const [kontakData, setKontakData] = useState([
    { id: '1', nama: 'Budi Santoso', instansi: 'PT Teknologi Nusantara', kontak: '+62 812-3456-7890', isSaved: true },
    { id: '2', nama: 'Siti Rahma', instansi: 'Universitas Batam', kontak: '+62 853-9876-5432', isSaved: true },
    { id: '3', nama: 'Ahmad Fauzi', instansi: 'CV Digital Kreasi', kontak: '+62 813-1122-3344', isSaved: true },
    { id: '4', nama: 'Dewi Lestari', instansi: 'PT Media Solusi Utama', kontak: '+62 878-5566-7788', isSaved: true },
    { id: '5', nama: 'Hendra Gunawan', instansi: 'Global Tech Corp', kontak: '+62 821-4433-2211', isSaved: true },
    { id: '6', nama: 'Rina Melati', instansi: 'Creative Hub Batam', kontak: '+62 852-6677-8899', isSaved: true },
    { id: '7', nama: 'Joko Widodo', instansi: 'PT Inovasi Mandiri', kontak: '+62 811-9988-7766', isSaved: true },
  ]);

  const filteredKontak = kontakData.filter(item => {
    return item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.kontak.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten */}
      <Navbar active="kartu-nama" />

      {/* Konten Utama Kontak Relasi */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Relation Contacts</h1>
            <p className="prm-main-desc">Directory of saved business relationship contacts.</p>
          </div>
          <button 
            className="btn-prm-new" 
            onClick={() => navigate('/scan')}
          >
            + Add Contact
          </button>
        </div>

        {/* Bar Pencarian Full Width dengan Filter */}
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
              placeholder="Search by name or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="filter-icon-btn" title="Filter contacts">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabel Kontak Relasi */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Name</th>
                <th style={{ width: '30%' }}>Institution</th>
                <th style={{ width: '30%' }}>Contact</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Saved</th>
              </tr>
            </thead>
            <tbody>
              {filteredKontak.length > 0 ? (
                filteredKontak.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#12417D' }}>{item.nama}</td>
                    <td>{item.instansi}</td>
                    <td style={{ color: '#64748b' }}>{item.kontak}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="bookmark-icon-wrapper" title="Saved contact">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff5733" stroke="#ff5733" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="prm-empty-row">
                    No relationship contacts match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default KontakRelasi;
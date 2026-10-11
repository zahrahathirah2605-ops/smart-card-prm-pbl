import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RiwayatPRM.css';

const RiwayatPRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrmOpen, setIsPrmOpen] = useState(false);

  // Data dummy lengkap untuk riwayat PRM
  const riwayatData = [
    { id: '01', permintaan: 'Pengajuan janji temu konsultasi proyek', tujuan: 'Budi Santoso', date: '12 Oct 2026', status: 'Selesai', statusClass: 'status-selesai' },
    { id: '02', permintaan: 'Pengajuan diskusi kolaborasi bisnis', tujuan: 'Siti Rahma', date: '10 Oct 2026', status: 'Selesai', statusClass: 'status-selesai' },
    { id: '03', permintaan: 'Pengajuan pertemuan partnership', tujuan: 'Ahmad Fauzi', date: '08 Oct 2026', status: 'Dibatalkan', statusClass: 'status-dibatalkan' },
    { id: '04', permintaan: 'Pengajuan interview media', tujuan: 'Dewi Lestari', date: '05 Oct 2026', status: 'Ditolak', statusClass: 'status-ditolak' },
    { id: '05', permintaan: 'Pengajuan janji temu evaluasi', tujuan: 'Joko Widodo', date: '01 Oct 2026', status: 'Selesai', statusClass: 'status-selesai' },
    { id: '06', permintaan: 'Pengajuan penjadwalan ulang meeting', tujuan: 'Rina Melati', date: '28 Sep 2026', status: 'Buat Pertemuan Ulang', statusClass: 'status-ulang' },
    { id: '07', permintaan: 'Pengajuan presentasi produk baru', tujuan: 'Hendra Gunawan', date: '25 Sep 2026', status: 'Dibatalkan', statusClass: 'status-dibatalkan' },
  ];

  const filteredData = riwayatData.filter(item => {
    return item.permintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.tujuan.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten seperti KartuNama */}
      <nav className="kn-navbar">
        <div className="kn-logo" onClick={() => navigate('/home')}>Logo</div>
        <div className="kn-nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Beranda</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/kartu-nama'); }}>Kartu Nama</a>
          
          <div className="kn-prm-dropdown">
            <a
              href="#"
              className="kn-prm-link active"
              onClick={(e) => { e.preventDefault(); setIsPrmOpen(!isPrmOpen); }}
            >
              PRM
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </a>
            {isPrmOpen && (
                <div className="kn-prm-menu">
                <button className="kn-prm-item" onClick={() => { setIsPrmOpen(false); navigate('/prm/ajukan'); }}>Ajukan PRM</button>
                <button className="kn-prm-item" onClick={() => { setIsPrmOpen(false); navigate('/prm/kelola'); }}>Kelola PRM</button>
                <button className="kn-prm-item" onClick={() => { setIsPrmOpen(false); navigate('/riwayat-prm'); }}>Riwayat PRM</button>
                </div>
            )}
          </div>

          <div className="kn-menu-container">
            <button className="kn-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            {isMenuOpen && (
              <div className="kn-dropdown-menu">
                <button className="kn-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Profile
                </button>
                <button className="kn-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  Kontak Relasi
                </button>
                <button className="kn-dropdown-item logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Konten Utama Halaman Riwayat PRM */}
      <main className="prm-main-content">
        <div className="prm-title-section">
          <h1>Riwayat PRM</h1>
          <p>Daftar riwayat permintaan PRM Anda</p>
        </div>

        {/* Bar Pencarian Full Width */}
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
              placeholder="Cari riwayat PRM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="filter-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>No.</th>
                <th style={{ width: '38%' }}>Permintaan</th>
                <th style={{ width: '25%' }}>Tujuan pertemuan</th>
                <th style={{ width: '10%' }}>Tanggal</th>
                <th style={{ width: '15%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="font-semibold text-gray-700">{item.id}</td>
                    <td>{item.permintaan}</td>
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
                    Tidak ada riwayat PRM yang ditemukan.
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

export default RiwayatPRM;
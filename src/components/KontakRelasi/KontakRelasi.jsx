import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DetailModal from '../Common/DetailModal';
import Pagination from '../Common/Pagination';
import './KontakRelasi.css';

const STORAGE_KEY_RELATION_CONTACTS = 'smart_card_relation_contacts';

const KontakRelasi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [kontakData, setKontakData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [previewZoomPhoto, setPreviewZoomPhoto] = useState(null);

  // Modal Detail State (Popup rincian kontak relasi yang diklik)
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination State (Max 15 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // Form state untuk penambahan kontak pihak eksternal secara manual
  const [newContact, setNewContact] = useState({
    nama: '',
    instansi: '',
    jabatan: '',
    email: '',
    kontak: '',
    kategori: 'Mitra Industri / Eksternal',
    catatan: ''
  });

  // Default seed data kontak relasi yang eksplisit tersimpan
  const initialContacts = [
    { id: 'rel-1', nama: 'Budi Santoso', instansi: 'PT Teknologi Nusantara', jabatan: 'Tech Lead', email: 'budi.santoso@tekno.id', kontak: '+62 812-3456-7890', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-2', nama: 'Siti Rahma', instansi: 'Universitas Batam', jabatan: 'Dosen Rekanan', email: 'siti.rahma@uniba.ac.id', kontak: '+62 853-9876-5432', kategori: 'Akademisi / Riset', isSaved: true, asal: 'Manual' },
    { id: 'rel-3', nama: 'Ahmad Fauzi', instansi: 'CV Digital Kreasi', jabatan: 'Project Manager', email: 'ahmad@digitalkreasi.com', kontak: '+62 813-1122-3344', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-4', nama: 'Dewi Lestari', instansi: 'PT Media Solusi Utama', jabatan: 'HR Director', email: 'dewi.l@mediasolusi.com', kontak: '+62 878-5566-7788', kategori: 'Mitra Magang / Rekrutmen', isSaved: true, asal: 'Manual' },
    { id: 'rel-5', nama: 'Hendra Gunawan', instansi: 'Global Tech Corp', jabatan: 'Principal Architect', email: 'hendra.g@globaltech.com', kontak: '+62 821-4433-2211', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-6', nama: 'Jessica Wong', instansi: 'Nusantara Ventures', jabatan: 'Investment Partner', email: 'jessica.w@nuventures.id', kontak: '+62 812-9988-7766', kategori: 'Mitra Investasi', isSaved: true, asal: 'Manual' },
    { id: 'rel-7', nama: 'Alex Turner', instansi: 'TechNova Global', jabatan: 'VP of Engineering', email: 'alex.turner@technova.com', kontak: '+62 813-4455-6677', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-8', nama: 'Sarah Connor', instansi: 'Cyberdyne Systems', jabatan: 'Security Lead', email: 'sarah.c@cyberdyne.org', kontak: '+62 855-6677-8899', kategori: 'Keamanan Siber', isSaved: true, asal: 'Manual' },
    { id: 'rel-9', nama: 'Michael Brown', instansi: 'Inovasi Digital', jabatan: 'Senior Solution Consultant', email: 'm.brown@inovasi.id', kontak: '+62 811-2233-4455', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-10', nama: 'Rian Pratama', instansi: 'Batam Times Media', jabatan: 'Chief Editor', email: 'rian.pratama@batamtimes.co.id', kontak: '+62 819-3344-5566', kategori: 'Media & Publikasi', isSaved: true, asal: 'Manual' },
    { id: 'rel-11', nama: 'Faisal Basri', instansi: 'Cyber Defense Indonesia', jabatan: 'Principal Consultant', email: 'faisal.b@cyberdefense.id', kontak: '+62 818-7788-9900', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-12', nama: 'Maya Indah', instansi: 'TransDigital Solusi', jabatan: 'Operations Manager', email: 'maya.indah@transdigital.co.id', kontak: '+62 852-1122-3344', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-13', nama: 'Bayu Nugroho', instansi: 'HardwareTech Solusi', jabatan: 'Hardware Engineer', email: 'bayu.n@hardwaretech.id', kontak: '+62 877-6655-4433', kategori: 'Vendor & Suplier', isSaved: true, asal: 'Manual' },
    { id: 'rel-14', nama: 'Prof. Kevin Hart', instansi: 'Singapore Tech Alliance', jabatan: 'Visiting Professor', email: 'kevin.hart@mitrauniv.sg', kontak: '+65 9123 4567', kategori: 'Akademisi Internasional', isSaved: true, asal: 'Manual' },
    { id: 'rel-15', nama: 'Doni Pratama', instansi: 'Ikatan Alumni Polibatam', jabatan: 'Ketua Divisi Kemitraan', email: 'doni.pratama@alumnipolibatam.org', kontak: '+62 812-5566-7788', kategori: 'Alumni Kampus', isSaved: true, asal: 'Manual' },
    { id: 'rel-16', nama: 'Kurnia Setiawan', instansi: 'Batam Startup Center', jabatan: 'Program Director', email: 'kurnia@batamincubator.id', kontak: '+62 813-8899-0011', kategori: 'Inkubator Bisnis', isSaved: true, asal: 'Manual' },
    { id: 'rel-17', nama: 'Nadia Salsabila', instansi: 'Event Nusantara Organizer', jabatan: 'Event Director', email: 'nadia.s@eventnusantara.com', kontak: '+62 821-3322-1100', kategori: 'Mitra Event & Promosi', isSaved: true, asal: 'Manual' },
    { id: 'rel-18', nama: 'Dr. Ilham Habibie', instansi: 'Konsorsium Riset Vokasi', jabatan: 'Peneliti Utama', email: 'ilham.habibie@risetvokasi.id', kontak: '+62 811-9900-1122', kategori: 'Akademisi / Riset', isSaved: true, asal: 'Manual' }
  ];

  // Inisialisasi: HANYA muat kontak yang tersimpan eksplisit oleh pengguna
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_RELATION_CONTACTS);
    let contacts = [];
    if (raw) {
      try {
        contacts = JSON.parse(raw);
      } catch (_e) {
        contacts = initialContacts;
      }
    } else {
      contacts = initialContacts;
      localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(contacts));
    }

    setKontakData(contacts);

    // Tangkap Flash Message dari redirect navigasi (mis. setelah simpan kontak eksternal)
    if (location.state && location.state.successMessage) {
      setAlertMsg({
        type: 'success',
        text: location.state.successMessage
      });
      // Bersihkan state agar tidak muncul ulang saat refresh
      window.history.replaceState({}, document.title);
      setTimeout(() => setAlertMsg(null), 4500);
    }
  }, [location.state]);

  const saveContactsToStorage = (updated) => {
    setKontakData(updated);
    localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(updated));
  };

  const handleDeleteContact = (id, nama, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Hapus kontak relasi "${nama}" dari daftar?`)) {
      const updated = kontakData.filter(c => c.id !== id);
      saveContactsToStorage(updated);
      if (selectedDetail && selectedDetail.id === id) {
        setIsDetailOpen(false);
      }
      setAlertMsg({ type: 'success', text: `Kontak "${nama}" berhasil dihapus dari direktori relasi.` });
      setTimeout(() => setAlertMsg(null), 3500);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newContact.nama.trim()) {
      alert('Nama kontak relasi wajib diisi.');
      return;
    }

    const created = {
      id: `manual-${Date.now()}`,
      nama: newContact.nama.trim(),
      instansi: newContact.instansi.trim() || 'Pihak Eksternal',
      jabatan: newContact.jabatan.trim() || 'Partner',
      email: newContact.email.trim(),
      kontak: newContact.kontak.trim() || '-',
      kategori: newContact.kategori,
      catatan: newContact.catatan.trim(),
      isSaved: true,
      asal: 'Manual'
    };

    const updated = [created, ...kontakData];
    saveContactsToStorage(updated);
    setIsAddModalOpen(false);
    setNewContact({
      nama: '',
      instansi: '',
      jabatan: '',
      email: '',
      kontak: '',
      kategori: 'Mitra Industri / Eksternal',
      catatan: ''
    });

    setAlertMsg({ type: 'success', text: `Kontak relasi "${created.nama}" berhasil disimpan ke direktori!` });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const filteredKontak = kontakData.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      item.nama.toLowerCase().includes(q) ||
      (item.instansi && item.instansi.toLowerCase().includes(q)) ||
      (item.kontak && item.kontak.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.kategori && item.kategori.toLowerCase().includes(q))
    );
  });

  // Paginasi: hitung subset data (maks 15 per halaman)
  const totalItems = filteredKontak.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedKontak = filteredKontak.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (item) => {
    setSelectedDetail(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten */}
      <Navbar active="kartu-nama" />

      {/* Konten Utama Kontak Relasi */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Kontak Relasi (Professional Contacts)</h1>
            <p className="prm-main-desc">
              Hanya menampilkan daftar relasi profesional dan mitra eksternal yang sudah tersimpan secara eksplisit oleh Anda. Klik baris untuk melihat kartu rincian lengkap.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-prm-new" 
              onClick={() => setIsAddModalOpen(true)}
              style={{ background: '#ff5733', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Tambah Kontak Relasi
            </button>
            <button 
              className="btn-prm-new" 
              onClick={() => navigate('/scan')}
              style={{ background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1' }}
              title="Scan kartu nama digital civitas kampus"
            >
              📷 Scan Kartu Internal
            </button>
          </div>
        </div>

        {/* Alert Notification Toast */}
        {alertMsg && (
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            background: alertMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: alertMsg.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${alertMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{alertMsg.text}</span>
            <button 
              onClick={() => setAlertMsg(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

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
              placeholder="Cari berdasarkan nama, perusahaan, nomor telepon, atau email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabel Kontak Relasi (Clickable Rows) */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Nama & Peran</th>
                <th style={{ width: '24%' }}>Perusahaan / Instansi</th>
                <th style={{ width: '26%' }}>Kontak & Email</th>
                <th style={{ width: '12%' }}>Kategori</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKontak.length > 0 ? (
                paginatedKontak.map((item) => (
                  <tr
                    key={item.id}
                    className="prm-clickable-row"
                    onClick={() => handleRowClick(item)}
                    title="Klik baris untuk melihat detail kontak relasi"
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                        {item.jabatan || 'Partner'} {item.asal === 'PRM History' && <span style={{ color: '#ff5733', fontWeight: 600 }}>• Dari PRM History</span>}
                      </div>
                      {item.catatan && (
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', fontStyle: 'italic' }}>
                          "{item.catatan}"
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{item.instansi}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem', color: '#334155' }}>
                        📱 {item.kontak}
                      </div>
                      {item.email && (
                        <div style={{ fontSize: '0.76rem', color: '#0284c7', marginTop: '2px' }}>
                          ✉️ <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>{item.email}</a>
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: item.asal === 'PRM History' ? '#fff1ee' : '#f1f5f9',
                        color: item.asal === 'PRM History' ? '#c2410c' : '#475569'
                      }}>
                        {item.kategori || 'Eksternal'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-delete-contact"
                        title="Hapus kontak dari daftar relasi"
                        onClick={(e) => handleDeleteContact(item.id, item.nama, e)}
                      >
                        Delete Contact
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="prm-empty-row">
                    Belum ada kontak relasi yang cocok dengan pencarian Anda. Klik tombol <strong>+ Tambah Kontak Relasi</strong> atau simpan dari Riwayat PRM untuk menambahkan mitra ke sini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Component (Max 15 items per page) */}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>

      {/* Modal Detail Kontak Relasi */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedDetail ? `Kartu Relasi: ${selectedDetail.nama}` : 'Detail Kontak Relasi'}
        badgeText={selectedDetail?.kategori || 'Kontak Relasi'}
        badgeType="info"
        actions={
          <>
            {selectedDetail && (
              <button
                type="button"
                className="btn-delete-contact modal-btn"
                onClick={() => handleDeleteContact(selectedDetail.id, selectedDetail.nama)}
              >
                Delete Contact
              </button>
            )}
            <button
              type="button"
              className="detail-modal-btn-close"
              onClick={() => setIsDetailOpen(false)}
            >
              Tutup
            </button>
          </>
        }
      >
        {selectedDetail && (
          <div className="modal-detail-grid">
            {/* Foto Kartu Nama Fisik (Jika Tersedia) */}
            {selectedDetail.foto_kartu ? (
              <div className="modal-field-box modal-detail-full" style={{ background: '#f8fafc', padding: '1rem' }}>
                <span className="modal-field-label">📸 Foto Kartu Nama Fisik</span>
                <div
                  className="modal-photo-preview-box"
                  style={{
                    position: 'relative',
                    marginTop: '0.5rem',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    maxHeight: '220px',
                    backgroundColor: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewZoomPhoto(selectedDetail.foto_kartu)}
                  title="Klik untuk memperbesar foto kartu nama"
                >
                  <img
                    src={selectedDetail.foto_kartu}
                    alt={`Foto Kartu ${selectedDetail.nama}`}
                    style={{ maxHeight: '220px', width: '100%', objectFit: 'contain' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    🔍 Klik untuk perbesar
                  </div>
                </div>
              </div>
            ) : selectedDetail.tipe === 'eksternal' ? (
              <div className="modal-field-box modal-detail-full" style={{ padding: '0.75rem 1rem' }}>
                <span className="modal-field-label">📸 Foto Kartu Nama Fisik</span>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  Tidak ada foto kartu nama
                </div>
              </div>
            ) : null}

            <div className="modal-field-box">
              <span className="modal-field-label">👤 Nama Lengkap</span>
              <div className="modal-field-value">{selectedDetail.nama}</div>
              <div className="modal-field-sub">💼 {selectedDetail.jabatan || 'Partner'}</div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">🏢 Instansi / Perusahaan</span>
              <div className="modal-field-value">{selectedDetail.instansi || '-'}</div>
              <div className="modal-field-sub">🏷️ {selectedDetail.kategori}</div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">✉️ Email Kontak</span>
              <div className="modal-field-value">
                {selectedDetail.email ? (
                  <a href={`mailto:${selectedDetail.email}`}>{selectedDetail.email}</a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">📱 Nomor Telepon / WA</span>
              <div className="modal-field-value">
                {selectedDetail.kontak && selectedDetail.kontak !== '-' ? (
                  <a href={`tel:${selectedDetail.kontak}`}>{selectedDetail.kontak}</a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className="modal-field-box modal-detail-full">
              <span className="modal-field-label">📥 Sumber Kontak</span>
              <div className="modal-field-value">
                {selectedDetail.asal === 'PRM History'
                  ? 'Tersimpan otomatis dari Riwayat Janji Temu PRM'
                  : selectedDetail.tipe === 'eksternal'
                  ? 'Tersimpan dari Kartu Nama Fisik Eksternal'
                  : 'Ditambahkan secara manual oleh Pengguna'}
              </div>
            </div>

            {(selectedDetail.catatan || selectedDetail.catatan_pertemuan) && (
              <div className="modal-field-box modal-detail-full">
                <span className="modal-field-label">📝 Catatan Pertemuan / Relasi</span>
                <div className="modal-quote-box">{selectedDetail.catatan || selectedDetail.catatan_pertemuan}</div>
              </div>
            )}
          </div>
        )}
      </DetailModal>

      {/* Modal Tambah Kontak Relasi Eksternal */}
      {isAddModalOpen && (
        <div className="prm-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="prm-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="prm-modal-header">
              <div className="prm-modal-title-row">
                <span className="prm-modal-badge accept">+ Relasi Baru</span>
                <h3 className="prm-modal-heading">Tambah Kontak Relasi Eksternal</h3>
              </div>
              <button className="prm-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="prm-modal-body">
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  Tambahkan informasi kontak relasi dari pihak luar (perusahaan, mitra industri, asosiasi, atau klien) yang pernah terhubung dengan Anda. Kontak ini akan tersimpan khusus dalam daftar relasi Anda.
                </p>

                <div className="prm-input-group">
                  <label className="prm-input-label">
                    Nama Lengkap / Kontak *
                  </label>
                  <input
                    type="text"
                    className="prm-textarea-reason"
                    style={{ minHeight: 'auto', padding: '0.65rem 0.85rem' }}
                    placeholder="Contoh: Dr. Budi Santoso, M.Kom"
                    value={newContact.nama}
                    onChange={(e) => setNewContact({ ...newContact, nama: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Instansi / Perusahaan</label>
                    <input
                      type="text"
                      className="prm-textarea-reason"
                      style={{ minHeight: 'auto', padding: '0.65rem 0.85rem' }}
                      placeholder="Contoh: PT Inovasi Digital"
                      value={newContact.instansi}
                      onChange={(e) => setNewContact({ ...newContact, instansi: e.target.value })}
                    />
                  </div>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Jabatan / Posisi</label>
                    <input
                      type="text"
                      className="prm-textarea-reason"
                      style={{ minHeight: 'auto', padding: '0.65rem 0.85rem' }}
                      placeholder="Contoh: Managing Director"
                      value={newContact.jabatan}
                      onChange={(e) => setNewContact({ ...newContact, jabatan: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Email Kontak</label>
                    <input
                      type="email"
                      className="prm-textarea-reason"
                      style={{ minHeight: 'auto', padding: '0.65rem 0.85rem' }}
                      placeholder="budi@domain.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    />
                  </div>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Nomor HP / WhatsApp</label>
                    <input
                      type="text"
                      className="prm-textarea-reason"
                      style={{ minHeight: 'auto', padding: '0.65rem 0.85rem' }}
                      placeholder="+62 812-xxxx-xxxx"
                      value={newContact.kontak}
                      onChange={(e) => setNewContact({ ...newContact, kontak: e.target.value })}
                    />
                  </div>
                </div>

                <div className="prm-input-group">
                  <label className="prm-input-label">Kategori Relasi</label>
                  <select
                    className="prm-textarea-reason"
                    style={{ minHeight: 'auto', padding: '0.65rem 0.85rem', cursor: 'pointer' }}
                    value={newContact.kategori}
                    onChange={(e) => setNewContact({ ...newContact, kategori: e.target.value })}
                  >
                    <option value="Mitra Industri / Eksternal">Mitra Industri / Eksternal</option>
                    <option value="Akademisi / Riset">Akademisi / Riset</option>
                    <option value="Mitra Magang / Rekrutmen">Mitra Magang / Rekrutmen</option>
                    <option value="Alumni Kampus">Alumni Kampus</option>
                    <option value="Klien / Konsultan">Klien / Konsultan</option>
                  </select>
                </div>

                <div className="prm-input-group">
                  <label className="prm-input-label">Catatan Tambahan (Opsional)</label>
                  <textarea
                    className="prm-textarea-reason"
                    style={{ minHeight: '65px' }}
                    placeholder="Contoh: Bertemu di seminar industri 2026, tertarik kolaborasi riset web."
                    value={newContact.catatan}
                    onChange={(e) => setNewContact({ ...newContact, catatan: e.target.value })}
                  />
                </div>
              </div>

              <div className="prm-modal-footer">
                <button
                  type="button"
                  className="prm-modal-cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="prm-modal-submit-btn accept"
                >
                  Simpan Kontak Relasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Zoom Foto Kartu Nama Fisik */}
      {previewZoomPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem',
            boxSizing: 'border-box'
          }}
          onClick={() => setPreviewZoomPhoto(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Foto Kartu Nama Fisik: {selectedDetail?.nama}
              </span>
              <button
                type="button"
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
                onClick={() => setPreviewZoomPhoto(null)}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: '1rem',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0f172a'
              }}
            >
              <img
                src={previewZoomPhoto}
                alt="Foto Kartu Nama Fisik"
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
            <div
              style={{
                padding: '0.85rem 1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                background: '#f8fafc'
              }}
            >
              <button
                type="button"
                className="detail-modal-btn-close"
                onClick={() => setPreviewZoomPhoto(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default KontakRelasi;
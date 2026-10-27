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
  const [sourceFilter, setSourceFilter] = useState('ALL'); // 'ALL' | 'PRM_HISTORY' | 'EXTERNAL_CONTACT'
  const [kontakData, setKontakData] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [previewZoomPhoto, setPreviewZoomPhoto] = useState(null);

  // Modal Detail State (Popup rincian kontak relasi yang diklik)
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination State (Max 15 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // Default seed data kontak relasi (English categories)
  const initialContacts = [
    { id: 'rel-1', nama: 'Budi Santoso', instansi: 'PT Teknologi Nusantara', jabatan: 'Tech Lead', email: 'budi.santoso@tekno.id', kontak: '+62 812-3456-7890', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-2', nama: 'Siti Rahma', instansi: 'Universitas Batam', jabatan: 'Dosen Rekanan', email: 'siti.rahma@uniba.ac.id', kontak: '+62 853-9876-5432', kategori: 'Academic & Research Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-3', nama: 'Ahmad Fauzi', instansi: 'CV Digital Kreasi', jabatan: 'Project Manager', email: 'ahmad@digitalkreasi.com', kontak: '+62 813-1122-3344', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-4', nama: 'Dewi Lestari', instansi: 'PT Media Solusi Utama', jabatan: 'HR Director', email: 'dewi.l@mediasolusi.com', kontak: '+62 878-5566-7788', kategori: 'Internship & Recruitment Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-5', nama: 'Hendra Gunawan', instansi: 'Global Tech Corp', jabatan: 'Principal Architect', email: 'hendra.g@globaltech.com', kontak: '+62 821-4433-2211', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-6', nama: 'Jessica Wong', instansi: 'Nusantara Ventures', jabatan: 'Investment Partner', email: 'jessica.w@nuventures.id', kontak: '+62 812-9988-7766', kategori: 'Investment & Funding Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-7', nama: 'Alex Turner', instansi: 'TechNova Global', jabatan: 'VP of Engineering', email: 'alex.turner@technova.com', kontak: '+62 813-4455-6677', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-8', nama: 'Sarah Connor', instansi: 'Cyberdyne Systems', jabatan: 'Security Lead', email: 'sarah.c@cyberdyne.org', kontak: '+62 855-6677-8899', kategori: 'Cybersecurity Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-9', nama: 'Michael Brown', instansi: 'Inovasi Digital', jabatan: 'Senior Solution Consultant', email: 'm.brown@inovasi.id', kontak: '+62 811-2233-4455', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-10', nama: 'Rian Pratama', instansi: 'Batam Times Media', jabatan: 'Chief Editor', email: 'rian.pratama@batamtimes.co.id', kontak: '+62 819-3344-5566', kategori: 'Media & Publications', isSaved: true, asal: 'PRM History' },
    { id: 'rel-11', nama: 'Faisal Basri', instansi: 'Cyber Defense Indonesia', jabatan: 'Principal Consultant', email: 'faisal.b@cyberdefense.id', kontak: '+62 818-7788-9900', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-12', nama: 'Maya Indah', instansi: 'TransDigital Solusi', jabatan: 'Operations Manager', email: 'maya.indah@transdigital.co.id', kontak: '+62 852-1122-3344', kategori: 'Industry & Enterprise Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-13', nama: 'Bayu Nugroho', instansi: 'HardwareTech Solusi', jabatan: 'Hardware Engineer', email: 'bayu.n@hardwaretech.id', kontak: '+62 877-6655-4433', kategori: 'Vendor & Supplier', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-14', nama: 'Prof. Kevin Hart', instansi: 'Singapore Tech Alliance', jabatan: 'Visiting Professor', email: 'kevin.hart@mitrauniv.sg', kontak: '+65 9123 4567', kategori: 'International Academic Partner', isSaved: true, asal: 'PRM History' },
    { id: 'rel-15', nama: 'Doni Pratama', instansi: 'Ikatan Alumni Polibatam', jabatan: 'Ketua Divisi Kemitraan', email: 'doni.pratama@alumnipolibatam.org', kontak: '+62 812-5566-7788', kategori: 'Campus Alumni Network', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-16', nama: 'Kurnia Setiawan', instansi: 'Batam Startup Center', jabatan: 'Program Director', email: 'kurnia@batamincubator.id', kontak: '+62 813-8899-0011', kategori: 'Business Incubator', isSaved: true, asal: 'PRM History' },
    { id: 'rel-17', nama: 'Nadia Salsabila', instansi: 'Event Nusantara Organizer', jabatan: 'Event Director', email: 'nadia.s@eventnusantara.com', kontak: '+62 821-3322-1100', kategori: 'Event & Promotion Partner', isSaved: true, asal: 'External Physical Card' },
    { id: 'rel-18', nama: 'Dr. Ilham Habibie', instansi: 'Konsorsium Riset Vokasi', jabatan: 'Peneliti Utama', email: 'ilham.habibie@risetvokasi.id', kontak: '+62 811-9900-1122', kategori: 'Academic & Research Partner', isSaved: true, asal: 'PRM History' }
  ];

  // Helper normalization to map English categories and source types
  const normalizeContact = (contact) => {
    let asal = contact.asal;
    if (!asal) {
      if (contact.tipe === 'eksternal' || contact.foto_kartu) {
        asal = 'External Physical Card';
      } else {
        asal = 'PRM History';
      }
    } else if (asal === 'Manual') {
      asal = 'External Physical Card';
    }

    // Map Indonesian category names to English if present
    let kategori = contact.kategori || 'External Partner';
    const categoryMap = {
      'Mitra Industri / Eksternal': 'Industry & Enterprise Partner',
      'Akademisi / Riset': 'Academic & Research Partner',
      'Mitra Magang / Rekrutmen': 'Internship & Recruitment Partner',
      'Mitra Investasi': 'Investment & Funding Partner',
      'Keamanan Siber': 'Cybersecurity Partner',
      'Media & Publikasi': 'Media & Publications',
      'Vendor & Suplier': 'Vendor & Supplier',
      'Akademisi Internasional': 'International Academic Partner',
      'Alumni Kampus': 'Campus Alumni Network',
      'Inkubator Bisnis': 'Business Incubator',
      'Mitra Event & Promosi': 'Event & Promotion Partner'
    };

    if (categoryMap[kategori]) {
      kategori = categoryMap[kategori];
    }

    return {
      ...contact,
      asal,
      kategori
    };
  };

  // Inisialisasi: muat kontak dan normalisasi data kategori ke Bahasa Inggris
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_RELATION_CONTACTS);
    let contacts = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        contacts = parsed.map(normalizeContact);
      } catch (_e) {
        contacts = initialContacts;
      }
    } else {
      contacts = initialContacts;
      localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(contacts));
    }

    setKontakData(contacts);

    if (location.state && location.state.successMessage) {
      setAlertMsg({
        type: 'success',
        text: location.state.successMessage
      });
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
    if (window.confirm(`Delete relationship contact "${nama}" from directory?`)) {
      const updated = kontakData.filter(c => c.id !== id);
      saveContactsToStorage(updated);
      if (selectedDetail && selectedDetail.id === id) {
        setIsDetailOpen(false);
      }
      setAlertMsg({ type: 'success', text: `Contact "${nama}" was successfully removed from relationship directory.` });
      setTimeout(() => setAlertMsg(null), 3500);
    }
  };

  // Counts for filter pills
  const countPRM = kontakData.filter(c => c.asal === 'PRM History').length;
  const countExt = kontakData.filter(c => c.asal !== 'PRM History').length;

  const filteredKontak = kontakData.filter(item => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (
      item.nama.toLowerCase().includes(q) ||
      (item.instansi && item.instansi.toLowerCase().includes(q)) ||
      (item.kontak && item.kontak.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.kategori && item.kategori.toLowerCase().includes(q))
    );

    const matchSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'PRM_HISTORY' && item.asal === 'PRM History') ||
      (sourceFilter === 'EXTERNAL_CONTACT' && item.asal !== 'PRM History');

    return matchSearch && matchSource;
  });

  // Paginasi: hitung subset data (maks 15 per halaman)
  const totalItems = filteredKontak.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedKontak = filteredKontak.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSourceFilterChange = (filter) => {
    setSourceFilter(filter);
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

      {/* Main Content */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Relationship Contacts (Professional Directory)</h1>
            <p className="prm-main-desc">
              Displays your saved professional connections and external partners. Click any row to view full credentials and meeting notes.
            </p>
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

        {/* Filter & Search Bar with Dual Source Filters */}
        <div className="rel-filter-header-bar">
          <div className="prm-search-box-kelola">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, organization, phone number, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills based on 2 Sources: PRM History and External Contacts */}
          <div className="rel-filter-pills">
            <button
              type="button"
              className={`rel-pill-btn pill-all ${sourceFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => handleSourceFilterChange('ALL')}
            >
              All Contacts <span className="pill-count">{kontakData.length}</span>
            </button>
            <button
              type="button"
              className={`rel-pill-btn pill-prm ${sourceFilter === 'PRM_HISTORY' ? 'active' : ''}`}
              onClick={() => handleSourceFilterChange('PRM_HISTORY')}
            >
              📅 From PRM History <span className="pill-count">{countPRM}</span>
            </button>
            <button
              type="button"
              className={`rel-pill-btn pill-ext ${sourceFilter === 'EXTERNAL_CONTACT' ? 'active' : ''}`}
              onClick={() => handleSourceFilterChange('EXTERNAL_CONTACT')}
            >
              📇 External Card Contacts <span className="pill-count">{countExt}</span>
            </button>
          </div>
        </div>

        {/* Table of Relationship Contacts */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '27%' }}>Name & Role</th>
                <th style={{ width: '23%' }}>Organization / Campus</th>
                <th style={{ width: '24%' }}>Contact & Email</th>
                <th style={{ width: '16%' }}>Data Category</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKontak.length > 0 ? (
                paginatedKontak.map((item) => {
                  const isFromPRM = item.asal === 'PRM History';
                  return (
                    <tr
                      key={item.id}
                      className="prm-clickable-row"
                      onClick={() => handleRowClick(item)}
                      title="Click row to view relationship contact details"
                    >
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                          {item.nama}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          {item.jabatan || 'Partner'}
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
                        <span className={`rel-category-badge ${isFromPRM ? 'badge-prm-history' : 'badge-external-contact'}`}>
                          <span className="dot" />
                          {item.kategori || (isFromPRM ? 'PRM Meeting Partner' : 'External Partner')}
                        </span>
                        <div style={{ fontSize: '0.70rem', color: '#64748b', fontWeight: 500, marginTop: '3px' }}>
                          {isFromPRM ? 'PRM History' : 'External Contact'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn-delete-contact"
                          title="Delete contact from relationship directory"
                          onClick={(e) => handleDeleteContact(item.id, item.nama, e)}
                        >
                          Delete Contact
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="prm-empty-row">
                    No relationship contacts match your current filter. Click <strong>+ Add External Contact</strong> or save from PRM History to add contacts here.
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

      {/* Detail Modal: Relationship Contact */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedDetail ? `Contact Profile: ${selectedDetail.nama}` : 'Contact Details'}
        badgeText={selectedDetail?.kategori || 'Contact'}
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
              Close
            </button>
          </>
        }
      >
        {selectedDetail && (
          <div className="modal-detail-grid">
            {/* Physical Card Photo */}
            {selectedDetail.foto_kartu ? (
              <div className="modal-field-box modal-detail-full" style={{ background: '#f8fafc', padding: '1rem' }}>
                <span className="modal-field-label">📸 Physical Business Card Photo</span>
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
                  title="Click to expand card photo"
                >
                  <img
                    src={selectedDetail.foto_kartu}
                    alt={`Card Photo ${selectedDetail.nama}`}
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
                    🔍 Click to zoom
                  </div>
                </div>
              </div>
            ) : selectedDetail.tipe === 'eksternal' ? (
              <div className="modal-field-box modal-detail-full" style={{ padding: '0.75rem 1rem' }}>
                <span className="modal-field-label">📸 Physical Business Card Photo</span>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  No photo attached
                </div>
              </div>
            ) : null}

            <div className="modal-field-box">
              <span className="modal-field-label">👤 Full Name</span>
              <div className="modal-field-value">{selectedDetail.nama}</div>
              <div className="modal-field-sub">💼 {selectedDetail.jabatan || 'Partner'}</div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">🏢 Organization / Company</span>
              <div className="modal-field-value">{selectedDetail.instansi || '-'}</div>
              <div className="modal-field-sub">🏷️ {selectedDetail.kategori}</div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">✉️ Email Address</span>
              <div className="modal-field-value">
                {selectedDetail.email ? (
                  <a href={`mailto:${selectedDetail.email}`}>{selectedDetail.email}</a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">📱 Phone / WhatsApp</span>
              <div className="modal-field-value">
                {selectedDetail.kontak && selectedDetail.kontak !== '-' ? (
                  <a href={`tel:${selectedDetail.kontak}`}>{selectedDetail.kontak}</a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className="modal-field-box modal-detail-full">
              <span className="modal-field-label">📥 Contact Source</span>
              <div className="modal-field-value">
                {selectedDetail.asal === 'PRM History'
                  ? 'Saved automatically from PRM Appointment History'
                  : selectedDetail.tipe === 'eksternal'
                  ? 'Saved from External Physical Business Card'
                  : 'Added manually by User'}
              </div>
            </div>

            {(selectedDetail.catatan || selectedDetail.catatan_pertemuan) && (
              <div className="modal-field-box modal-detail-full">
                <span className="modal-field-label">📝 Meeting / Relationship Notes</span>
                <div className="modal-quote-box">{selectedDetail.catatan || selectedDetail.catatan_pertemuan}</div>
              </div>
            )}
          </div>
        )}
      </DetailModal>

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
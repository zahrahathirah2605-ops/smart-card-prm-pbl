import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments } from '../../utils/cardStorage';
import './KontakRelasi.css';

const STORAGE_KEY_RELATION_CONTACTS = 'smart_card_relation_contacts';

const KontakRelasi = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [kontakData, setKontakData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form state untuk penambahan kontak pihak eksternal
  const [newContact, setNewContact] = useState({
    nama: '',
    instansi: '',
    jabatan: '',
    email: '',
    kontak: '',
    kategori: 'Mitra Industri / Eksternal',
    catatan: ''
  });

  // Default seed data jika storage masih kosong
  const initialContacts = [
    { id: 'rel-1', nama: 'Budi Santoso', instansi: 'PT Teknologi Nusantara', jabatan: 'Tech Lead', email: 'budi.santoso@tekno.id', kontak: '+62 812-3456-7890', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-2', nama: 'Siti Rahma', instansi: 'Universitas Batam', jabatan: 'Dosen Rekanan', email: 'siti.rahma@uniba.ac.id', kontak: '+62 853-9876-5432', kategori: 'Akademisi / Riset', isSaved: true, asal: 'Manual' },
    { id: 'rel-3', nama: 'Ahmad Fauzi', instansi: 'CV Digital Kreasi', jabatan: 'Project Manager', email: 'ahmad@digitalkreasi.com', kontak: '+62 813-1122-3344', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' },
    { id: 'rel-4', nama: 'Dewi Lestari', instansi: 'PT Media Solusi Utama', jabatan: 'HR Director', email: 'dewi.l@mediasolusi.com', kontak: '+62 878-5566-7788', kategori: 'Mitra Magang / Rekrutmen', isSaved: true, asal: 'Manual' },
    { id: 'rel-5', nama: 'Hendra Gunawan', instansi: 'Global Tech Corp', jabatan: 'Principal Architect', email: 'hendra.g@globaltech.com', kontak: '+62 821-4433-2211', kategori: 'Mitra Industri / Eksternal', isSaved: true, asal: 'Manual' }
  ];

  // Inisialisasi dan sinkronisasi kontak
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

    // Periksa apakah ada pihak eksternal dari Pengajuan Janji Temu yang belum masuk ke kontak
    const storedAppointments = getStoredAppointments();
    if (storedAppointments && storedAppointments.length > 0) {
      const existingEmails = new Set(contacts.map(c => (c.email || '').toLowerCase()));
      const fromAppointments = [];

      storedAppointments.forEach(app => {
        const appEmail = (app.emailPemohon || '').trim().toLowerCase();
        if (appEmail && !existingEmails.has(appEmail) && app.pemohon) {
          fromAppointments.push({
            id: `prm-rel-${app.id || Date.now()}`,
            nama: app.pemohon,
            instansi: app.perusahaanPemohon || 'Pihak Eksternal',
            jabatan: app.jabatanPemohon || 'Partner PRM',
            email: app.emailPemohon,
            kontak: app.teleponPemohon || '-',
            kategori: 'Pengaju Janji Temu PRM',
            catatan: `Terhubung melalui permohonan janji temu: "${app.permintaan}"`,
            isSaved: true,
            asal: 'PRM System'
          });
          existingEmails.add(appEmail);
        }
      });

      if (fromAppointments.length > 0) {
        contacts = [...fromAppointments, ...contacts];
        localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(contacts));
      }
    }

    setKontakData(contacts);
  }, []);

  const saveContactsToStorage = (updated) => {
    setKontakData(updated);
    localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(updated));
  };

  const handleToggleBookmark = (id) => {
    const updated = kontakData.map(c => {
      if (c.id === id) {
        return { ...c, isSaved: !c.isSaved };
      }
      return c;
    });
    saveContactsToStorage(updated);
  };

  const handleDeleteContact = (id, nama) => {
    if (window.confirm(`Hapus kontak relasi "${nama}" dari daftar?`)) {
      const updated = kontakData.filter(c => c.id !== id);
      saveContactsToStorage(updated);
      setAlertMsg({ type: 'success', text: `Kontak "${nama}" berhasil dihapus.` });
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
              Direktori kontak relasi profesional dan mitra eksternal yang pernah berinteraksi atau terhubung dengan Anda.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Kontak Relasi */}
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
              {filteredKontak.length > 0 ? (
                filteredKontak.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                        {item.jabatan || 'Partner'} {item.asal === 'PRM System' && <span style={{ color: '#0284c7' }}>• PRM Applicant</span>}
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
                          ✉️ <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
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
                        background: item.asal === 'PRM System' ? '#e0f2fe' : '#f1f5f9',
                        color: item.asal === 'PRM System' ? '#0369a1' : '#475569'
                      }}>
                        {item.kategori || 'Eksternal'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <span 
                          className="bookmark-icon-wrapper" 
                          title={item.isSaved ? "Kontak di-bookmark (Tersimpan)" : "Bookmark kontak ini"}
                          onClick={() => handleToggleBookmark(item.id)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={item.isSaved ? "#ff5733" : "none"} stroke="#ff5733" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </span>
                        <button
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '1rem' }}
                          title="Hapus kontak"
                          onClick={() => handleDeleteContact(item.id, item.nama)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="prm-empty-row">
                    Belum ada kontak relasi yang cocok dengan pencarian Anda. Klik tombol <strong>+ Tambah Kontak Relasi</strong> untuk menambahkan relasi eksternal baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

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
                  Tambahkan informasi kontak relasi dari pihak luar (perusahaan, mitra industri, asosiasi, atau klien) yang pernah terhubung dengan Anda.
                </p>

                <div className="prm-input-group">
                  <label className="prm-input-label">
                    Nama Lengkap Relasi <span className="prm-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="prm-text-input"
                    placeholder="Contoh: Alexander Graham"
                    value={newContact.nama}
                    onChange={(e) => setNewContact({ ...newContact, nama: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Perusahaan / Instansi</label>
                    <input
                      type="text"
                      className="prm-text-input"
                      placeholder="Contoh: PT Inovasi Maju"
                      value={newContact.instansi}
                      onChange={(e) => setNewContact({ ...newContact, instansi: e.target.value })}
                    />
                  </div>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Jabatan / Posisi</label>
                    <input
                      type="text"
                      className="prm-text-input"
                      placeholder="Contoh: Senior Manager"
                      value={newContact.jabatan}
                      onChange={(e) => setNewContact({ ...newContact, jabatan: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Nomor WhatsApp / HP</label>
                    <input
                      type="tel"
                      className="prm-text-input"
                      placeholder="Contoh: +62 812-xxxx-xxxx"
                      value={newContact.kontak}
                      onChange={(e) => setNewContact({ ...newContact, kontak: e.target.value })}
                    />
                  </div>
                  <div className="prm-input-group">
                    <label className="prm-input-label">Email Relasi</label>
                    <input
                      type="email"
                      className="prm-text-input"
                      placeholder="Contoh: partner@perusahaan.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="prm-input-group">
                  <label className="prm-input-label">Kategori Relasi</label>
                  <select
                    className="prm-text-input"
                    value={newContact.kategori}
                    onChange={(e) => setNewContact({ ...newContact, kategori: e.target.value })}
                  >
                    <option value="Mitra Industri / Eksternal">Mitra Industri / Eksternal</option>
                    <option value="Akademisi / Riset">Akademisi / Riset</option>
                    <option value="Mitra Magang / Rekrutmen">Mitra Magang / Rekrutmen</option>
                    <option value="Klien / Vendor">Klien / Vendor</option>
                    <option value="Relasi Pribadi">Relasi Pribadi</option>
                  </select>
                </div>

                <div className="prm-input-group">
                  <label className="prm-input-label">Catatan Tambahan (Opsional)</label>
                  <textarea
                    className="prm-textarea"
                    rows="2"
                    placeholder="Contoh: Bertemu di acara pameran industri Batam, tertarik kerja sama PBL."
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

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default KontakRelasi;
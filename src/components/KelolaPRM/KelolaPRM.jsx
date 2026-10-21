import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments, updateAppointmentStatus, getUserCard } from '../../utils/cardStorage';
import "../RiwayatPRM/RiwayatPRM.css"; 
import './KelolaPRM.css';

const KelolaPRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [kelolaData, setKelolaData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Modal State untuk konfirmasi + alasan pengiriman email
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('accept'); // 'accept' | 'reject'
  const [reasonInput, setReasonInput] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(null);

  // Default mock incoming requests jika belum ada data pengajuan
  const defaultIncoming = [
    { 
      id: 'PRM-1001', 
      permintaan: 'Technical consultation request for core architecture', 
      pemohon: 'Alex Turner', 
      perusahaanPemohon: 'TechNova Global',
      emailPemohon: 'alex.turner@technova.com',
      date: 'Oct 14, 2026', 
      jam: '10.00 WIB',
      status: 'Pending Confirmation',
      statusClass: 'status-ulang'
    },
    { 
      id: 'PRM-1002', 
      permintaan: 'Project partnership discussion and scoping', 
      pemohon: 'Jessica Wong', 
      perusahaanPemohon: 'Nusantara Ventures',
      emailPemohon: 'jessica.w@nuventures.id',
      date: 'Oct 13, 2026', 
      jam: '14.00 WIB',
      status: 'Pending Confirmation',
      statusClass: 'status-ulang'
    },
    { 
      id: 'PRM-1003', 
      permintaan: 'Quarterly review meeting proposal', 
      pemohon: 'Michael Brown', 
      perusahaanPemohon: 'Inovasi Digital',
      emailPemohon: 'm.brown@inovasi.id',
      date: 'Oct 11, 2026', 
      jam: '09.30 WIB',
      status: 'Pending Confirmation',
      statusClass: 'status-ulang'
    },
    { 
      id: 'PRM-1004', 
      permintaan: 'Business growth synergy appointment', 
      pemohon: 'Sarah Connor', 
      perusahaanPemohon: 'Cyberdyne Systems',
      emailPemohon: 'sarah.c@cyberdyne.org',
      date: 'Oct 09, 2026', 
      jam: '15.00 WIB',
      status: 'Pending Confirmation',
      statusClass: 'status-ulang'
    },
  ];

  const loadData = () => {
    const userCard = getUserCard();
    setUserProfile(userCard);

    const stored = getStoredAppointments();
    if (stored && stored.length > 0) {
      // Gabungkan pengajuan dari form kartu nama dan default mock
      const existingIds = new Set(stored.map(s => s.id));
      const combined = [...stored, ...defaultIncoming.filter(d => !existingIds.has(d.id))];
      setKelolaData(combined);
    } else {
      setKelolaData(defaultIncoming);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openActionModal = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    if (type === 'accept') {
      setReasonInput('Pengajuan disetujui. Pertemuan akan dilaksanakan via Google Meet / Ruang Rapat Politeknik Negeri Batam.');
      setAdditionalNote('Tautan ruang meeting: https://meet.google.com/prm-meet-session');
    } else {
      setReasonInput('Mohon maaf, jadwal pada waktu tersebut bentrok dengan agenda prioritas internal. Silakan ajukan jadwal alternatif.');
      setAdditionalNote('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSendingEmail) return;
    setIsModalOpen(false);
    setSelectedItem(null);
    setReasonInput('');
    setAdditionalNote('');
  };

  const handleConfirmDecision = () => {
    if (!selectedItem) return;
    if (!reasonInput.trim()) {
      alert('Mohon isi alasan / catatan konfirmasi agar pihak eksternal dapat mengetahui detailnya.');
      return;
    }

    setIsSendingEmail(true);

    const statusText = actionType === 'accept' ? 'Accepted' : 'Declined';
    const statusLabelId = actionType === 'accept' ? 'Disetujui' : 'Ditolak';

    // Simulasikan pengiriman email otomatis ke email pihak eksternal
    setTimeout(() => {
      // Simpan ke storage jika item ada di stored appointments
      updateAppointmentStatus(selectedItem.id, statusText, reasonInput, additionalNote);

      // Update state tabel langsung
      setKelolaData(prev => prev.map(item => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            status: statusText,
            statusClass: actionType === 'accept' ? 'status-selesai' : 'status-ditolak',
            alasanRespon: reasonInput,
            catatanTambahan: additionalNote,
            emailNotifikasi: {
              sentTo: selectedItem.emailPemohon || 'external@partner.com',
              status: statusText,
              alasan: reasonInput,
              sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
          };
        }
        return item;
      }));

      setIsSendingEmail(false);
      setIsModalOpen(false);

      // Tampilkan banner notifikasi pengiriman email berhasil
      setNotificationBanner({
        type: actionType,
        email: selectedItem.emailPemohon || 'pihak eksternal',
        nama: selectedItem.pemohon || selectedItem.pengaju,
        status: statusLabelId,
        alasan: reasonInput
      });

      // Auto dismiss banner setelah 7 detik
      setTimeout(() => {
        setNotificationBanner(null);
      }, 7000);
    }, 1000);
  };

  const filteredData = kelolaData.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      (item.permintaan && item.permintaan.toLowerCase().includes(q)) ||
      (item.pemohon && item.pemohon.toLowerCase().includes(q)) ||
      (item.pengaju && item.pengaju.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten */}
      <Navbar active="prm" />

      {/* Konten Utama Halaman Kelola PRM */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Kelola Janji Temu PRM (Masuk)</h1>
            <p className="prm-main-desc">
              Tinjau pengajuan janji temu dari pihak eksternal. Sistem otomatis mengirimkan notifikasi email konfirmasi beserta alasan status.
            </p>
          </div>
        </div>

        {/* Banner Notifikasi Email Berhasil Terkirim */}
        {notificationBanner && (
          <div className={`prm-email-alert-banner ${notificationBanner.type === 'accept' ? 'success' : 'warning'}`}>
            <div className="prm-email-alert-icon">
              {notificationBanner.type === 'accept' ? '📧 ✅' : '📧 ⚠️'}
            </div>
            <div className="prm-email-alert-text">
              <strong>Notifikasi Email Otomatis Terkirim!</strong>
              <p>
                Email konfirmasi status <b>{notificationBanner.status}</b> telah otomatis dikirimkan ke <b>{notificationBanner.email}</b> ({notificationBanner.nama}) beserta alasan yang dicantumkan.
              </p>
              <div className="prm-email-alert-quote">"{notificationBanner.alasan}"</div>
            </div>
            <button className="prm-alert-close" onClick={() => setNotificationBanner(null)}>✕</button>
          </div>
        )}

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
              placeholder="Cari berdasarkan topik, nama pemohon, atau ID pengajuan..."
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
                <th style={{ width: '42%' }}>Detail Pengajuan & Pemohon</th>
                <th style={{ width: '18%' }}>Jadwal</th>
                <th style={{ width: '18%' }}>Status & Email Notifikasi</th>
                <th style={{ width: '22%', textAlign: 'right' }}>Aksi Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const namaPemohon = item.pemohon || item.pengaju || 'Pihak Eksternal';
                  const emailTujuan = item.emailPemohon || 'email.eksternal@domain.com';
                  const isPending = item.status === 'Pending Confirmation' || item.status === 'Menunggu Konfirmasi';

                  return (
                    <tr key={index}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.92rem' }}>
                          {item.permintaan}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                          👤 <b>{namaPemohon}</b> {item.perusahaanPemohon ? `(${item.perusahaanPemohon})` : ''}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#0284c7', marginTop: '2px' }}>
                          ✉️ {emailTujuan}
                        </div>
                        {item.alasanRespon && (
                          <div style={{ 
                            marginTop: '6px', 
                            fontSize: '0.75rem', 
                            background: '#f8fafc', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            borderLeft: '3px solid #64748b',
                            color: '#334155'
                          }}>
                            <strong>Alasan Status:</strong> "{item.alasanRespon}"
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.85rem' }}>
                          📅 {item.date || 'TBD'}
                        </div>
                        {item.jam && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            ⏰ {item.jam}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`prm-status-badge ${item.statusClass || 'status-ulang'}`}>
                          {item.status}
                        </span>
                        {item.emailNotifikasi && (
                          <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '4px', fontWeight: 500 }}>
                            ✓ Email otomatis terkirim
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isPending ? (
                          <div className="prm-action-btns">
                            <button 
                              className="btn-accept"
                              title="Setujui dan kirim email konfirmasi ke pihak eksternal"
                              onClick={() => openActionModal(item, 'accept')}
                            >
                              ✓ Setujui
                            </button>
                            <button 
                              className="btn-reject"
                              title="Tolak dan beri alasan ke pihak eksternal via email"
                              onClick={() => openActionModal(item, 'reject')}
                            >
                              ✕ Tolak
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                            <span className="text-processed">Selesai Diproses</span>
                            <button 
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ff5733',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                              onClick={() => openActionModal(item, item.status === 'Accepted' || item.status === 'Disetujui' ? 'accept' : 'reject')}
                            >
                              Lihat / Ubah Alasan
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="prm-empty-row">
                    Tidak ada pengajuan janji temu yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Dialog: Konfirmasi Status & Input Alasan Notifikasi Email */}
      {isModalOpen && selectedItem && (
        <div className="prm-modal-overlay" onClick={closeModal}>
          <div className="prm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="prm-modal-header">
              <div className="prm-modal-title-row">
                <span className={`prm-modal-badge ${actionType}`}>
                  {actionType === 'accept' ? 'Disetujui (Approved)' : 'Ditolak (Declined)'}
                </span>
                <h3 className="prm-modal-heading">
                  {actionType === 'accept' ? 'Konfirmasi Persetujuan Janji Temu' : 'Konfirmasi Penolakan Janji Temu'}
                </h3>
              </div>
              <button className="prm-modal-close-btn" onClick={closeModal} disabled={isSendingEmail}>✕</button>
            </div>

            <div className="prm-modal-body">
              {/* Ringkasan Pihak Eksternal & Pengajuan */}
              <div className="prm-recipient-card">
                <div className="prm-recipient-icon">✉️</div>
                <div className="prm-recipient-info">
                  <div className="prm-recipient-name">
                    Penerima Email: <strong>{selectedItem.pemohon || selectedItem.pengaju}</strong>
                  </div>
                  <div className="prm-recipient-email">
                    Alamat Tujuan: <code>{selectedItem.emailPemohon || 'email.eksternal@domain.com'}</code>
                  </div>
                  <div className="prm-recipient-sub">
                    Agenda: "{selectedItem.permintaan}" • Jadwal: {selectedItem.date || 'TBD'} ({selectedItem.jam || 'Jam fleksibel'})
                  </div>
                </div>
              </div>

              {/* Form Input Alasan */}
              <div className="prm-input-group">
                <label className="prm-input-label">
                  Alasan / Keterangan Status <span className="prm-required">* (Wajib diisi)</span>
                </label>
                <textarea
                  className="prm-textarea"
                  rows="3"
                  placeholder={
                    actionType === 'accept'
                      ? 'Contoh: Pengajuan diterima. Pertemuan diadakan daring melalui Google Meet.'
                      : 'Contoh: Mohon maaf, jadwal pada waktu tersebut bentrok dengan rapat internal. Silakan ajukan jadwal di hari lain.'
                  }
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  disabled={isSendingEmail}
                />
                <span className="prm-input-hint">
                  Alasan ini akan otomatis disertakan di dalam badan email notifikasi ke pihak eksternal agar mereka mengetahui keputusannya.
                </span>
              </div>

              {/* Input Catatan Tambahan / Link Meeting jika disetujui */}
              {actionType === 'accept' && (
                <div className="prm-input-group">
                  <label className="prm-input-label">Tautan Rapat / Lokasi Ruang Rapat</label>
                  <input
                    type="text"
                    className="prm-text-input"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx atau Ruang Rapat 204"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    disabled={isSendingEmail}
                  />
                </div>
              )}

              {/* Live Preview Email Notification */}
              <div className="prm-email-preview-box">
                <div className="prm-preview-header">
                  <span>📄 Preview Email Otomatis:</span>
                  <span className="prm-preview-to">To: {selectedItem.emailPemohon || 'external@partner.com'}</span>
                </div>
                <div className="prm-preview-content">
                  <p><strong>Subjek:</strong> [PRM Notifikasi] Konfirmasi Janji Temu: <b>{actionType === 'accept' ? 'DISETUJUI' : 'DITOLAK'}</b> - {userProfile?.namaLengkap || 'Smart Business Card PRM'}</p>
                  <hr style={{ borderColor: '#e2e8f0', margin: '8px 0' }} />
                  <p>Halo <b>{selectedItem.pemohon || selectedItem.pengaju}</b>,</p>
                  <p>
                    Pengajuan janji temu Anda mengenai "<em>{selectedItem.permintaan}</em>" telah{' '}
                    <strong style={{ color: actionType === 'accept' ? '#16a34a' : '#dc2626' }}>
                      {actionType === 'accept' ? 'DISETUJUI' : 'DITOLAK'}
                    </strong>.
                  </p>
                  <div className="prm-preview-reason-quote">
                    <strong>Alasan / Catatan dari Penyelenggara:</strong><br />
                    {reasonInput || '(Belum mengisi alasan)'}
                    {actionType === 'accept' && additionalNote && (
                      <div style={{ marginTop: '4px' }}><strong>Lokasi / Link:</strong> {additionalNote}</div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                    Sistem Otomatis Smart Business Card & PRM — Politeknik Negeri Batam
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="prm-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <button
                  type="button"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #ea4335',
                    color: '#ea4335',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Buka draf resmi di Gmail akun Anda untuk mengirim email nyata langsung"
                  onClick={() => {
                    const recipientEmail = selectedItem.emailPemohon || 'partner@eksternal.com';
                    const recipientName = selectedItem.pemohon || selectedItem.pengaju || 'Rekan Mitra';
                    const statusSubject = actionType === 'accept' ? 'DISETUJUI' : 'DITOLAK';
                    const subject = encodeURIComponent(`[PRM Notifikasi] Konfirmasi Janji Temu: ${statusSubject} - ${userProfile?.namaLengkap || 'Polibatam'}`);
                    const bodyText = encodeURIComponent(
`Halo ${recipientName},

Terima kasih telah mengajukan janji temu melalui Smart Business Card & PRM.
Kami menginformasikan bahwa permohonan pertemuan Anda mengenai "${selectedItem.permintaan}" telah: ${statusSubject}.

Alasan / Catatan Penyelenggara:
"${reasonInput || '(Pengajuan telah ditinjau)'}"
${actionType === 'accept' && additionalNote ? `\nLokasi / Link Rapat: ${additionalNote}` : ''}

Jadwal Pertemuan: ${selectedItem.date || 'Sesuai kesepakatan'} (${selectedItem.jam || 'Jam kerja'})
Penyelenggara: ${userProfile?.namaLengkap || 'Civitas Akademika'} (${userProfile?.instansi || 'Politeknik Negeri Batam'})

Hormat kami,
Sistem Smart Business Card & PRM`
                    );
                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${bodyText}`, '_blank');
                  }}
                >
                  ✉️ Buka Draft di Gmail Resmi
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="prm-modal-cancel-btn" 
                  onClick={closeModal}
                  disabled={isSendingEmail}
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  className={`prm-modal-submit-btn ${actionType}`}
                  onClick={handleConfirmDecision}
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>Mengirim Email Notifikasi...</>
                  ) : (
                    <>Kirim Notifikasi & {actionType === 'accept' ? 'Setujui' : 'Tolak'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default KelolaPRM;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DetailModal from '../Common/DetailModal';
import Pagination from '../Common/Pagination';
import { getStoredAppointments } from '../../utils/cardStorage';
import './RiwayatPRM.css';

const STORAGE_KEY_RELATION_CONTACTS = 'smart_card_relation_contacts';

const RiwayatPRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riwayatData, setRiwayatData] = useState([]);
  const [savedContactEmails, setSavedContactEmails] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // Modal Detail State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination State (Max 15 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // Default seed PRM history items
  const initialDummyData = [
    { 
      id: 'PRM-01', 
      permintaan: 'Project consultation & technical scoping', 
      tujuan: 'Budi Santoso (CTO)',
      pemohon: 'Aprillia Bunga Lestari',
      emailPemohon: 'smart.card@gmail.com',
      teleponPemohon: '+62 812-3478-010',
      instansiPemohon: 'Politeknik Negeri Batam',
      date: 'Oct 12, 2026', 
      jam: '09:00 WIB',
      lokasi: 'Ruang Rapat 301 Kampus Polibatam',
      alasanLengkap: 'Pembahasan arsitektur teknis dan keselarasan teknologi smart card dengan ekosistem digital mitra.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-02', 
      permintaan: 'Strategic business collaboration session', 
      tujuan: 'Siti Rahma, S.T., M.Sc',
      pemohon: 'Budi Santoso',
      emailPemohon: 'budi.santoso@inovasidigital.id',
      teleponPemohon: '+62 812-9876-5432',
      instansiPemohon: 'PT Inovasi Digital Nusantara',
      date: 'Oct 10, 2026', 
      jam: '14:00 WIB',
      lokasi: 'Daring (Google Meet)',
      alasanLengkap: 'Inisiasi kemitraan strategis riset dan pengembangan kurikulum industri berbasis teknologi web.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-03', 
      permintaan: 'Partnership agreement meeting', 
      tujuan: 'Ahmad Fauzi',
      pemohon: 'Dewi Lestari',
      emailPemohon: 'dewi.l@mediasolusi.com',
      teleponPemohon: '+62 878-5566-7788',
      instansiPemohon: 'PT Media Solusi Utama',
      date: 'Oct 08, 2026', 
      jam: '10:30 WIB',
      lokasi: 'Gedung Pusat Bisnis Polibatam',
      alasanLengkap: 'Finalisasi klausul MoU magang industri dan penyerapan lulusan mahasiswa vokasi.',
      status: 'Cancelled', 
      statusClass: 'status-dibatalkan' 
    },
    { 
      id: 'PRM-04', 
      permintaan: 'Media coverage interview request', 
      tujuan: 'Dewi Lestari',
      pemohon: 'Rian Pratama',
      emailPemohon: 'rian.pratama@batamtimes.co.id',
      teleponPemohon: '+62 819-3344-5566',
      instansiPemohon: 'Batam Times Media',
      date: 'Oct 05, 2026', 
      jam: '11:00 WIB',
      lokasi: 'Studio Liputan Polibatam TV',
      alasanLengkap: 'Wawancara pers seputar inovasi kartu bisnis pintar dan PRM karya mahasiswa.',
      status: 'Declined', 
      statusClass: 'status-ditolak' 
    },
    { 
      id: 'PRM-05', 
      permintaan: 'Quarterly evaluation appointment', 
      tujuan: 'Joko Widodo, M.T',
      pemohon: 'Hendra Gunawan',
      emailPemohon: 'hendra.g@globaltech.com',
      teleponPemohon: '+62 821-4433-2211',
      instansiPemohon: 'Global Tech Corp',
      date: 'Oct 01, 2026', 
      jam: '13:30 WIB',
      lokasi: 'Ruang Sidang Lantai 2',
      alasanLengkap: 'Evaluasi berkala progres integrasi API PRM dan performa sistem kartu digital.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-06', 
      permintaan: 'Schedule follow-up conference', 
      tujuan: 'Rina Melati',
      pemohon: 'Michael Brown',
      emailPemohon: 'm.brown@inovasi.id',
      teleponPemohon: '+62 811-2233-4455',
      instansiPemohon: 'Inovasi Digital',
      date: 'Sep 28, 2026', 
      jam: '15:00 WIB',
      lokasi: 'Daring (Zoom Conference)',
      alasanLengkap: 'Tindak lanjut pendistribusian kartu pintar untuk delegasi seminar internasional.',
      status: 'Rescheduled', 
      statusClass: 'status-ulang' 
    },
    { 
      id: 'PRM-07', 
      permintaan: 'New solution demo and product pitch', 
      tujuan: 'Hendra Gunawan',
      pemohon: 'Sarah Connor',
      emailPemohon: 'sarah.c@cyberdyne.org',
      teleponPemohon: '+62 855-6677-8899',
      instansiPemohon: 'Cyberdyne Systems',
      date: 'Sep 25, 2026', 
      jam: '10:00 WIB',
      lokasi: 'Auditorium Polibatam',
      alasanLengkap: 'Demonstrasi solusi otomasi pertukaran kontak nirkabel kepada pemangku kepentingan.',
      status: 'Cancelled', 
      statusClass: 'status-dibatalkan' 
    },
    { 
      id: 'PRM-08', 
      permintaan: 'MoU Industry Collaboration Review', 
      tujuan: 'Aprillia Bunga Lestari',
      pemohon: 'Jessica Wong',
      emailPemohon: 'jessica.w@nuventures.id',
      teleponPemohon: '+62 812-9988-7766',
      instansiPemohon: 'Nusantara Ventures',
      date: 'Sep 20, 2026', 
      jam: '14:30 WIB',
      lokasi: 'Daring (Google Meet)',
      alasanLengkap: 'Peninjauan kesiapan investasi pengembangan platform kartu nama kampus.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-09', 
      permintaan: 'Academic Internship Briefing', 
      tujuan: 'Siti Rahma',
      pemohon: 'Alex Turner',
      emailPemohon: 'alex.turner@technova.com',
      teleponPemohon: '+62 813-4455-6677',
      instansiPemohon: 'TechNova Global',
      date: 'Sep 15, 2026', 
      jam: '09:00 WIB',
      lokasi: 'Lab Komputer Rekayasa Perangkat Lunak',
      alasanLengkap: 'Penyusunan modul praktikum dan pembekalan mahasiswa magang industri 2026.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-10', 
      permintaan: 'Cybersecurity Architecture Audit', 
      tujuan: 'Budi Santoso',
      pemohon: 'Faisal Basri',
      emailPemohon: 'faisal.b@cyberdefense.id',
      teleponPemohon: '+62 818-7788-9900',
      instansiPemohon: 'Cyber Defense Indonesia',
      date: 'Sep 10, 2026', 
      jam: '10:30 WIB',
      lokasi: 'Data Center Kampus',
      alasanLengkap: 'Audit keamanan protokol penyimpanan kontak dan privasi vCard civitas akademika.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-11', 
      permintaan: 'Digital Transformation Sync', 
      tujuan: 'Aprillia Bunga Lestari',
      pemohon: 'Maya Indah',
      emailPemohon: 'maya.indah@transdigital.co.id',
      teleponPemohon: '+62 852-1122-3344',
      instansiPemohon: 'TransDigital Solusi',
      date: 'Sep 05, 2026', 
      jam: '13:00 WIB',
      lokasi: 'Ruang Rapat 204',
      alasanLengkap: 'Sinkronisasi peta jalan transformasi kartu mahasiswa menjadi kartu nama digital.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-12', 
      permintaan: 'Vendor Evaluation & Hardware Sourcing', 
      tujuan: 'Ahmad Fauzi',
      pemohon: 'Bayu Nugroho',
      emailPemohon: 'bayu.n@hardwaretech.id',
      teleponPemohon: '+62 877-6655-4433',
      instansiPemohon: 'HardwareTech Solusi',
      date: 'Aug 30, 2026', 
      jam: '15:30 WIB',
      lokasi: 'Ruang Pertemuan Rektorat',
      alasanLengkap: 'Uji kompatibilitas chip NFC fisik untuk disandingkan dengan QR code dinamis.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-13', 
      permintaan: 'Guest Lecture Scheduling', 
      tujuan: 'Siti Rahma',
      pemohon: 'Prof. Kevin Hart',
      emailPemohon: 'kevin.hart@mitrauniv.sg',
      teleponPemohon: '+65 9123 4567',
      instansiPemohon: 'Singapore Tech Alliance',
      date: 'Aug 25, 2026', 
      jam: '10:00 WIB',
      lokasi: 'Auditorium Gedung Utama',
      alasanLengkap: 'Kuliah tamu internasional mengenai penerapan Relationship Management di era AI.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-14', 
      permintaan: 'Alumni Network Partnership', 
      tujuan: 'Aprillia Bunga Lestari',
      pemohon: 'Doni Pratama',
      emailPemohon: 'doni.pratama@alumnipolibatam.org',
      teleponPemohon: '+62 812-5566-7788',
      instansiPemohon: 'Ikatan Alumni Polibatam',
      date: 'Aug 20, 2026', 
      jam: '16:00 WIB',
      lokasi: 'Alumni Lounge',
      alasanLengkap: 'Penyediaan akses smart card untuk ribuan jejaring alumni di industri strategis.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-15', 
      permintaan: 'Campus Startup Incubation Pitch', 
      tujuan: 'Budi Santoso',
      pemohon: 'Kurnia Setiawan',
      emailPemohon: 'kurnia@batamincubator.id',
      teleponPemohon: '+62 813-8899-0011',
      instansiPemohon: 'Batam Startup Center',
      date: 'Aug 15, 2026', 
      jam: '11:00 WIB',
      lokasi: 'Co-Working Space Perpustakaan',
      alasanLengkap: 'Pitching mentoring startup mahasiswa dalam pengembangan aplikasi kartu digital.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-16', 
      permintaan: 'Annual Partner Gathering Coordination', 
      tujuan: 'Dewi Lestari',
      pemohon: 'Nadia Salsabila',
      emailPemohon: 'nadia.s@eventnusantara.com',
      teleponPemohon: '+62 821-3322-1100',
      instansiPemohon: 'Event Nusantara Organizer',
      date: 'Aug 10, 2026', 
      jam: '14:00 WIB',
      lokasi: 'Grand Ballroom Batam Centre',
      alasanLengkap: 'Koordinasi teknis temu akbar mitra industri dan civitas akademika.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    },
    { 
      id: 'PRM-17', 
      permintaan: 'Research Grant Collaboration Scoping', 
      tujuan: 'Siti Rahma',
      pemohon: 'Dr. Ilham Habibie',
      emailPemohon: 'ilham.habibie@risetvokasi.id',
      teleponPemohon: '+62 811-9900-1122',
      instansiPemohon: 'Konsorsium Riset Vokasi',
      date: 'Aug 05, 2026', 
      jam: '09:30 WIB',
      lokasi: 'Ruang Sidang Senat',
      alasanLengkap: 'Pengajuan proposal hibah penelitian terapan sistem identitas digital kampus.',
      status: 'Completed', 
      statusClass: 'status-selesai' 
    }
  ];

  // Ambil daftar kontak relasi yang sudah tersimpan untuk sinkronisasi tombol "Simpan ke Kontak Relasi"
  const loadSavedContacts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RELATION_CONTACTS);
      if (raw) {
        const contacts = JSON.parse(raw);
        const emailSet = new Set(contacts.map(c => (c.email || '').toLowerCase().trim()));
        const nameSet = new Set(contacts.map(c => (c.nama || '').toLowerCase().trim()));
        setSavedContactEmails(new Set([...emailSet, ...nameSet]));
      }
    } catch (e) {
      console.warn('Error reading contacts for comparison:', e);
    }
  };

  useEffect(() => {
    const userSubmitted = getStoredAppointments();
    setRiwayatData([...userSubmitted, ...initialDummyData]);
    loadSavedContacts();
  }, []);

  // Filter pencarian
  const filteredData = riwayatData.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      (item.permintaan && item.permintaan.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.tujuan && item.tujuan.toLowerCase().includes(q)) ||
      (item.pemohon && item.pemohon.toLowerCase().includes(q))
    );
  });

  // Paginasi: hitung subset item untuk halaman aktif (maks 15)
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  // Reset ke halaman 1 saat pencarian berubah
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Buka Modal Detail saat baris diklik
  const handleRowClick = (item) => {
    setSelectedDetail(item);
    setIsDetailOpen(true);
  };

  // Cek apakah item sudah tersimpan di Kontak Relasi
  const isItemSavedInContacts = (item) => {
    const targetEmail = (item.emailPemohon || '').toLowerCase().trim();
    const targetName = (item.pemohon || item.tujuan || '').toLowerCase().trim();
    return savedContactEmails.has(targetEmail) || (targetName && savedContactEmails.has(targetName));
  };

  // Fitur "Simpan ke Kontak Relasi"
  const handleSaveToContacts = (item, e) => {
    if (e) e.stopPropagation();

    const loggedRole = localStorage.getItem('smart_card_logged_role');
    if (!loggedRole) {
      alert('Silakan login terlebih dahulu untuk menyimpan kontak ke daftar relasi Anda.');
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY_RELATION_CONTACTS);
      const currentList = raw ? JSON.parse(raw) : [];

      const candidateName = item.pemohon || item.tujuan || 'Mitra PRM';
      const candidateEmail = item.emailPemohon || '';
      const candidatePhone = item.teleponPemohon || '-';
      const candidateOrg = item.instansiPemohon || item.perusahaanPemohon || 'Pihak Eksternal / Mitra';
      const candidateRole = item.jabatanPemohon || 'Mitra Pertemuan PRM';

      // Cek duplikasi
      const duplicate = currentList.find(c => 
        (candidateEmail && c.email && c.email.toLowerCase() === candidateEmail.toLowerCase()) ||
        (c.nama && c.nama.toLowerCase() === candidateName.toLowerCase())
      );

      if (duplicate) {
        setToastMessage({
          type: 'info',
          text: `Kontak "${candidateName}" sudah ada di dalam Kontak Relasi Anda.`
        });
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      const newContact = {
        id: `prm-rel-${Date.now()}`,
        nama: candidateName,
        instansi: candidateOrg,
        jabatan: candidateRole,
        email: candidateEmail,
        kontak: candidatePhone,
        kategori: 'Mitra Janji Temu PRM',
        catatan: `Tersimpan dari Riwayat PRM [${item.id}]: "${item.permintaan}"`,
        isSaved: true,
        asal: 'PRM History'
      };

      const updated = [newContact, ...currentList];
      localStorage.setItem(STORAGE_KEY_RELATION_CONTACTS, JSON.stringify(updated));

      // Update state
      setSavedContactEmails(prev => new Set([...prev, candidateEmail.toLowerCase(), candidateName.toLowerCase()]));

      setToastMessage({
        type: 'success',
        text: `✓ Kontak "${candidateName}" (${candidateOrg}) berhasil disimpan ke Kontak Relasi!`
      });
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.error('Error saving contact:', err);
      alert('Gagal menyimpan kontak ke direktori relasi.');
    }
  };

  return (
    <div className="riwayat-page-container">
      {/* Consistent Navbar */}
      <Navbar active="prm" />

      {/* Main PRM Content */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Riwayat Janji Temu & Pertemuan PRM</h1>
            <p className="prm-main-desc">
              Kelola, pantau seluruh riwayat interaksi kemitraan, klik baris untuk melihat rincian detail, dan simpan kontak langsung ke relasi Anda.
            </p>
          </div>
          <button className="btn-prm-new" onClick={() => navigate('/scan')}>
            📷 Scan Kartu Baru
          </button>
        </div>

        {/* Toast Notifikasi Sukses Simpan Kontak */}
        {toastMessage && (
          <div className={`prm-inline-toast ${toastMessage.type}`}>
            <span>{toastMessage.text}</span>
            <button
              type="button"
              className="prm-toast-close"
              onClick={() => setToastMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

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
              placeholder="Cari berdasarkan topik, nama pemohon / mitra, atau No. Referensi..."
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

        {/* PRM Records Table (Clickable Rows) */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '11%' }}>No. Ref</th>
                <th style={{ width: '35%' }}>Agenda & Topik Pertemuan</th>
                <th style={{ width: '22%' }}>Mitra / Pemohon</th>
                <th style={{ width: '12%' }}>Jadwal</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi Relasi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const isSaved = isItemSavedInContacts(item);
                  const candidateName = item.pemohon || item.tujuan;

                  return (
                    <tr
                      key={item.id || index}
                      className="prm-clickable-row"
                      onClick={() => handleRowClick(item)}
                      title="Klik baris untuk melihat rincian detail"
                    >
                      <td className="font-semibold text-gray-700">
                        <span className="prm-ref-badge">{item.id}</span>
                      </td>
                      <td>
                        <div className="prm-row-title">{item.permintaan}</div>
                        {item.jam && (
                          <div className="prm-row-time">⏰ Pukul {item.jam}</div>
                        )}
                        {item.alasanRespon && (
                          <div className="prm-row-note">
                            💬 "{item.alasanRespon}"
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="prm-partner-name">{candidateName}</div>
                        {item.instansiPemohon && (
                          <div className="prm-partner-org">{item.instansiPemohon}</div>
                        )}
                        {item.emailPemohon && (
                          <div className="prm-partner-email">✉️ {item.emailPemohon}</div>
                        )}
                      </td>
                      <td>
                        <div className="prm-date-cell">📅 {item.date}</div>
                      </td>
                      <td>
                        <span className={`prm-status-badge ${item.statusClass || 'status-selesai'}`}>
                          {item.status}
                        </span>
                        {item.emailNotifikasi && (
                          <div className="prm-email-notif-label">
                            ✓ Email Notif
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={`btn-save-contact-action ${isSaved ? 'already-saved' : ''}`}
                          onClick={(e) => handleSaveToContacts(item, e)}
                          title={isSaved ? 'Sudah tersimpan di Kontak Relasi' : 'Simpan informasi kontak ke Kontak Relasi'}
                          disabled={isSaved}
                        >
                          {isSaved ? '✓ Tersimpan' : '+ Simpan Relasi'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="prm-empty-row">
                    Tidak ada riwayat janji temu PRM yang sesuai dengan kata kunci pencarian.
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

      {/* Modal Detail Riwayat PRM */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedDetail ? `Rincian Pertemuan: ${selectedDetail.id}` : 'Rincian Pertemuan'}
        badgeText={selectedDetail?.status}
        badgeType={
          selectedDetail?.status === 'Completed' || selectedDetail?.status === 'Disetujui'
            ? 'success'
            : selectedDetail?.status === 'Declined' || selectedDetail?.status === 'Ditolak'
            ? 'danger'
            : 'warning'
        }
        actions={
          <>
            {selectedDetail && (
              <button
                type="button"
                className={`btn-save-contact-modal ${isItemSavedInContacts(selectedDetail) ? 'already-saved' : ''}`}
                onClick={(e) => handleSaveToContacts(selectedDetail, e)}
                disabled={isItemSavedInContacts(selectedDetail)}
              >
                {isItemSavedInContacts(selectedDetail)
                  ? '✓ Sudah Ada di Kontak Relasi'
                  : '💾 Simpan ke Kontak Relasi'}
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
          <div>
            <div className="modal-detail-grid">
              <div className="modal-field-box modal-detail-full">
                <span className="modal-field-label">📌 Topik / Agenda Pertemuan</span>
                <div className="modal-field-value">{selectedDetail.permintaan}</div>
              </div>

              <div className="modal-field-box">
                <span className="modal-field-label">👤 Nama Mitra / Pemohon</span>
                <div className="modal-field-value">
                  {selectedDetail.pemohon || selectedDetail.tujuan}
                </div>
                {selectedDetail.instansiPemohon && (
                  <div className="modal-field-sub">🏢 {selectedDetail.instansiPemohon}</div>
                )}
              </div>

              <div className="modal-field-box">
                <span className="modal-field-label">📅 Waktu & Tanggal</span>
                <div className="modal-field-value">{selectedDetail.date}</div>
                {selectedDetail.jam && (
                  <div className="modal-field-sub">⏰ Pukul {selectedDetail.jam}</div>
                )}
              </div>

              <div className="modal-field-box">
                <span className="modal-field-label">✉️ Email Kontak</span>
                <div className="modal-field-value">
                  {selectedDetail.emailPemohon ? (
                    <a href={`mailto:${selectedDetail.emailPemohon}`}>
                      {selectedDetail.emailPemohon}
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
              </div>

              <div className="modal-field-box">
                <span className="modal-field-label">📱 Nomor Telepon / WA</span>
                <div className="modal-field-value">
                  {selectedDetail.teleponPemohon || '-'}
                </div>
              </div>

              {selectedDetail.lokasi && (
                <div className="modal-field-box modal-detail-full">
                  <span className="modal-field-label">📍 Lokasi Pertemuan</span>
                  <div className="modal-field-value">{selectedDetail.lokasi}</div>
                </div>
              )}

              {selectedDetail.alasanLengkap && (
                <div className="modal-field-box modal-detail-full">
                  <span className="modal-field-label">📝 Catatan / Alasan Permohonan</span>
                  <div className="modal-quote-box">{selectedDetail.alasanLengkap}</div>
                </div>
              )}

              {selectedDetail.alasanRespon && (
                <div className="modal-field-box modal-detail-full">
                  <span className="modal-field-label">💬 Catatan Keputusan / Alasan Status</span>
                  <div className="modal-quote-box">{selectedDetail.alasanRespon}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </DetailModal>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default RiwayatPRM;
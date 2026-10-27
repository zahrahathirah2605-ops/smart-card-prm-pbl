import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments, updateAppointmentStatus, getUserCard } from '../../utils/cardStorage';
import DetailModal from '../Common/DetailModal';
import Pagination from '../Common/Pagination';
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

  // Modal Detail State (Popup rincian pengajuan masuk)
  const [detailItem, setDetailItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination State (Max 15 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

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
      setReasonInput('Request accepted. The meeting will be held via Google Meet / Meeting Room at Politeknik Negeri Batam.');
      setAdditionalNote('Meeting room link: https://meet.google.com/prm-meet-session');
    } else {
      setReasonInput('Apologies, the requested schedule conflicts with prior campus commitments. Please propose an alternate date.');
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
      alert('Please provide a reason / confirmation note so external partners understand the decision.');
      return;
    }

    setIsSendingEmail(true);

    const statusText = actionType === 'accept' ? 'Accepted' : 'Declined';
    const statusLabelId = actionType === 'accept' ? 'Accepted' : 'Declined';

    // Simulate automated email transmission to external partner
    setTimeout(() => {
      // Save status update
      updateAppointmentStatus(selectedItem.id, statusText, reasonInput, additionalNote);

      // Update local table state
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
              sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          };
        }
        return item;
      }));

      setIsSendingEmail(false);
      setIsModalOpen(false);

      // Display email notification banner
      setNotificationBanner({
        type: actionType,
        email: selectedItem.emailPemohon || 'external partner',
        nama: selectedItem.pemohon || selectedItem.pengaju,
        status: statusLabelId,
        alasan: reasonInput
      });

      // Auto dismiss banner after 7s
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

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (item) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="riwayat-page-container">
      {/* Navbar Konsisten */}
      <Navbar active="prm" />

      {/* Konten Utama Halaman Kelola PRM */}
      <main className="prm-main-content">
        <div className="prm-header-row">
          <div>
            <h1 className="prm-main-title">Manage PRM Appointments (Incoming)</h1>
            <p className="prm-main-desc">
              Review meeting requests submitted by external partners. Click any row to inspect complete details, then accept or decline with automated email notification.
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
              <strong>Automated Email Notification Sent!</strong>
              <p>
                Status confirmation email for <b>{notificationBanner.status}</b> was sent to <b>{notificationBanner.email}</b> ({notificationBanner.nama}) along with your decision notes.
              </p>
              <div className="prm-email-alert-quote">"{notificationBanner.alasan}"</div>
            </div>
            <button className="prm-alert-close" onClick={() => setNotificationBanner(null)}>✕</button>
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
              placeholder="Search by topic, partner name, or request ID..."
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
        </div>

        {/* Tabel Data Kelola PRM */}
        <div className="prm-table-wrapper">
          <table className="prm-table">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Request Details & Partner</th>
                <th style={{ width: '18%' }}>Schedule</th>
                <th style={{ width: '18%' }}>Status & Email Notification</th>
                <th style={{ width: '22%', textAlign: 'right' }}>Decision Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const namaPemohon = item.pemohon || item.pengaju || 'External Partner';
                  const emailTujuan = item.emailPemohon || 'external@partner.com';
                  const isPending = item.status === 'Pending Confirmation' || item.status === 'Menunggu Konfirmasi';

                  return (
                    <tr
                      key={item.id || index}
                      className="prm-clickable-row"
                      onClick={() => handleRowClick(item)}
                      title="Click row to view full appointment details"
                    >
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
                            <strong>Decision Note:</strong> "{item.alasanRespon}"
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
                            ✓ Automated email delivered
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        {isPending ? (
                          <div className="prm-action-btns">
                            <button 
                              className="btn-accept"
                              title="Accept and transmit confirmation email to partner"
                              onClick={() => openActionModal(item, 'accept')}
                            >
                              ✓ Accept
                            </button>
                            <button 
                              className="btn-reject"
                              title="Decline and send reason note via email"
                              onClick={() => openActionModal(item, 'reject')}
                            >
                              ✕ Decline
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span className="text-processed">Processed</span>
                            <button 
                              type="button"
                              className="btn-view-reason-action"
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#12417D',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                              }}
                              onClick={() => openActionModal(item, item.status === 'Accepted' || item.status === 'Disetujui' ? 'accept' : 'reject')}
                            >
                              ✏️ View / Edit Reason
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
                    No appointment requests match your search criteria.
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

      {/* Detail Modal: Complete Appointment Overview */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={detailItem ? `Appointment Details: ${detailItem.id}` : 'Request Overview'}
        badgeText={detailItem?.status}
        badgeType={
          detailItem?.status === 'Accepted' || detailItem?.status === 'Disetujui'
            ? 'success'
            : detailItem?.status === 'Declined' || detailItem?.status === 'Ditolak'
            ? 'danger'
            : 'warning'
        }
        actions={
          <>
            {detailItem && (detailItem.status === 'Pending Confirmation' || detailItem.status === 'Menunggu Konfirmasi') && (
              <>
                <button
                  type="button"
                  className="btn-accept"
                  style={{ padding: '0.55rem 1.1rem' }}
                  onClick={() => {
                    setIsDetailOpen(false);
                    openActionModal(detailItem, 'accept');
                  }}
                >
                  ✓ Accept Request
                </button>
                <button
                  type="button"
                  className="btn-reject"
                  style={{ padding: '0.55rem 1.1rem' }}
                  onClick={() => {
                    setIsDetailOpen(false);
                    openActionModal(detailItem, 'reject');
                  }}
                >
                  ✕ Decline Request
                </button>
              </>
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
        {detailItem && (
          <div className="modal-detail-grid">
            <div className="modal-field-box modal-detail-full">
              <span className="modal-field-label">📌 Meeting Request / Topic</span>
              <div className="modal-field-value">{detailItem.permintaan}</div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">👤 Partner Name</span>
              <div className="modal-field-value">{detailItem.pemohon || detailItem.pengaju}</div>
              {detailItem.perusahaanPemohon && (
                <div className="modal-field-sub">🏢 {detailItem.perusahaanPemohon}</div>
              )}
              {detailItem.jabatanPemohon && (
                <div className="modal-field-sub">💼 {detailItem.jabatanPemohon}</div>
              )}
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">📅 Proposed Schedule</span>
              <div className="modal-field-value">{detailItem.date || 'TBD'}</div>
              {detailItem.jam && (
                <div className="modal-field-sub">⏰ At {detailItem.jam}</div>
              )}
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">✉️ Partner Email</span>
              <div className="modal-field-value">
                {detailItem.emailPemohon ? (
                  <a href={`mailto:${detailItem.emailPemohon}`}>
                    {detailItem.emailPemohon}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className="modal-field-box">
              <span className="modal-field-label">📱 Phone / WhatsApp</span>
              <div className="modal-field-value">{detailItem.teleponPemohon || '-'}</div>
            </div>

            {detailItem.alasanLengkap && (
              <div className="modal-field-box modal-detail-full">
                <span className="modal-field-label">📝 Meeting Agenda Description</span>
                <div className="modal-quote-box">{detailItem.alasanLengkap}</div>
              </div>
            )}

            {detailItem.alasanRespon && (
              <div className="modal-field-box modal-detail-full">
                <span className="modal-field-label">💬 Decision Note / Reason</span>
                <div className="modal-quote-box">{detailItem.alasanRespon}</div>
              </div>
            )}
          </div>
        )}
      </DetailModal>

      {/* Modal Dialog: Confirm Status & Email Notification Input */}
      {isModalOpen && selectedItem && (
        <div className="prm-modal-overlay" onClick={closeModal}>
          <div className="prm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="prm-modal-header">
              <div className="prm-modal-title-row">
                <span className={`prm-modal-badge ${actionType}`}>
                  {actionType === 'accept' ? 'Approved' : 'Declined'}
                </span>
                <h3 className="prm-modal-heading">
                  {actionType === 'accept' ? 'Confirm Appointment Approval' : 'Confirm Appointment Decline'}
                </h3>
              </div>
              <button className="prm-modal-close-btn" onClick={closeModal} disabled={isSendingEmail}>✕</button>
            </div>

            <div className="prm-modal-body">
              {/* Partner Overview */}
              <div className="prm-recipient-card">
                <div className="prm-recipient-icon">✉️</div>
                <div className="prm-recipient-info">
                  <div className="prm-recipient-name">
                    Email Recipient: <strong>{selectedItem.pemohon || selectedItem.pengaju}</strong>
                  </div>
                  <div className="prm-recipient-email">
                    Target Address: <code>{selectedItem.emailPemohon || 'external@partner.com'}</code>
                  </div>
                  <div className="prm-recipient-sub">
                    Agenda: "{selectedItem.permintaan}" • Schedule: {selectedItem.date || 'TBD'} ({selectedItem.jam || 'Flexible time'})
                  </div>
                </div>
              </div>

              {/* Form Input Reason */}
              <div className="prm-input-group">
                <label className="prm-input-label">
                  Decision Note / Reason <span className="prm-required">* (Required)</span>
                </label>
                <textarea
                  className="prm-textarea"
                  rows="3"
                  placeholder={
                    actionType === 'accept'
                      ? 'Example: Request accepted. The meeting will take place online via Google Meet.'
                      : 'Example: Apologies, this time slot conflicts with an internal meeting. Please propose an alternate date.'
                  }
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  disabled={isSendingEmail}
                />
                <span className="prm-input-hint">
                  This note will be automatically sent inside the notification email so partners understand the response.
                </span>
              </div>

              {/* Additional Meeting Note */}
              {actionType === 'accept' && (
                <div className="prm-input-group">
                  <label className="prm-input-label">Meeting Link / Room Location</label>
                  <input
                    type="text"
                    className="prm-text-input"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx or Polibatam Meeting Room 204"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    disabled={isSendingEmail}
                  />
                </div>
              )}

              {/* Live Preview Email Notification */}
              <div className="prm-email-preview-box">
                <div className="prm-preview-header">
                  <span>📄 Automated Email Preview:</span>
                  <span className="prm-preview-to">To: {selectedItem.emailPemohon || 'external@partner.com'}</span>
                </div>
                <div className="prm-preview-content">
                  <p><strong>Subject:</strong> [PRM Notification] Meeting Confirmation: <b>{actionType === 'accept' ? 'APPROVED' : 'DECLINED'}</b> - {userProfile?.namaLengkap || 'Smart Business Card PRM'}</p>
                  <hr style={{ borderColor: '#e2e8f0', margin: '8px 0' }} />
                  <p>Hello <b>{selectedItem.pemohon || selectedItem.pengaju}</b>,</p>
                  <p>
                    Your appointment request regarding "<em>{selectedItem.permintaan}</em>" has been{' '}
                    <strong style={{ color: actionType === 'accept' ? '#16a34a' : '#dc2626' }}>
                      {actionType === 'accept' ? 'APPROVED' : 'DECLINED'}
                    </strong>.
                  </p>
                  <div className="prm-preview-reason-quote">
                    <strong>Host Decision Note:</strong><br />
                    {reasonInput || '(No notes provided)'}
                    {actionType === 'accept' && additionalNote && (
                      <div style={{ marginTop: '4px' }}><strong>Location / Meeting Link:</strong> {additionalNote}</div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                    Politeknik Negeri Batam — Smart Business Card & PRM Platform
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
                  title="Open official Gmail draft to send a real email directly"
                  onClick={() => {
                    const recipientEmail = selectedItem.emailPemohon || 'partner@eksternal.com';
                    const recipientName = selectedItem.pemohon || selectedItem.pengaju || 'Partner';
                    const statusSubject = actionType === 'accept' ? 'APPROVED' : 'DECLINED';
                    const subject = encodeURIComponent(`[PRM Notification] Appointment Confirmation: ${statusSubject} - ${userProfile?.namaLengkap || 'Polibatam'}`);
                    const bodyText = encodeURIComponent(
`Hello ${recipientName},

Thank you for requesting an appointment through our Smart Business Card & PRM system.
We are writing to inform you that your meeting proposal regarding "${selectedItem.permintaan}" has been: ${statusSubject}.

Host Notes / Instructions:
"${reasonInput || '(Request has been reviewed)'}"
${actionType === 'accept' && additionalNote ? `\nLocation / Meeting Link: ${additionalNote}` : ''}

Proposed Time: ${selectedItem.date || 'To be scheduled'} (${selectedItem.jam || 'Working hours'})
Host: ${userProfile?.namaLengkap || 'Campus Member'} (${userProfile?.instansi || 'Politeknik Negeri Batam'})

Best regards,
Smart Business Card & PRM System`
                    );
                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${bodyText}`, '_blank');
                  }}
                >
                  ✉️ Open Draft in Gmail
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="prm-modal-cancel-btn" 
                  onClick={closeModal}
                  disabled={isSendingEmail}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={`prm-modal-submit-btn ${actionType}`}
                  onClick={handleConfirmDecision}
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>Sending Email...</>
                  ) : (
                    <>Send Notification & {actionType === 'accept' ? 'Accept' : 'Decline'}</>
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
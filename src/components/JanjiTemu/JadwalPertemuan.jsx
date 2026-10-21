import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './JadwalPertemuan.css';

const JadwalPertemuan = () => {
  const navigate = useNavigate();

  // State untuk tanggal yang dipilih (default: 12 Oktober 2026 seperti screenshot)
  const [selectedDate, setSelectedDate] = useState(12);
  const currentMonth = 'Oktober 2026';
  const todayDate = 7; // Lingkaran hari ini

  // Data jadwal pertemuan PRM
  const scheduledMeetings = {
    12: {
      dateNumber: 12,
      dayName: 'Senin',
      fullDateStr: 'Senin, 12 Oktober 2026',
      tag: 'Contoh jadwal',
      title: 'Pertemuan koordinasi PRM',
      waktu: '09.00–10.00 WIB',
      lokasi: 'Ruang rapat internal (contoh)',
      pengingat: '30 menit sebelumnya • 08.30 WIB',
      badgeLabel: '09.00 • PRM'
    },
    15: {
      dateNumber: 15,
      dayName: 'Kamis',
      fullDateStr: 'Kamis, 15 Oktober 2026',
      tag: 'Contoh jadwal',
      title: 'Tindak lanjut PRM',
      waktu: '14.00–15.00 WIB',
      lokasi: 'Daring (Google Meet / Zoom)',
      pengingat: '30 menit sebelumnya • 13.30 WIB',
      badgeLabel: '14.00 • PRM'
    }
  };

  // Agenda mendatang statis (sesuai screenshot)
  const upcomingAgendas = [
    {
      dayCode: 'SEN',
      dateNum: '12',
      monthCode: 'OKT',
      title: 'Koordinasi PRM',
      waktuLokasi: '09.00–10.00 WIB • Ruang rapat',
      pengingat: 'Pengingat: 30 menit sebelumnya',
      dateRef: 12
    },
    {
      dayCode: 'KAM',
      dateNum: '15',
      monthCode: 'OKT',
      title: 'Tindak lanjut PRM',
      waktuLokasi: '14.00–15.00 WIB • Daring',
      pengingat: 'Pengingat: 30 menit sebelumnya',
      dateRef: 15
    }
  ];

  // Matriks kalender Oktober 2026 (Senin s/d Minggu)
  // Baris 1: 28, 29, 30 (prev month), 1, 2, 3, 4
  // Baris 2: 5, 6, 7, 8, 9, 10, 11
  // Baris 3: 12, 13, 14, 15, 16, 17, 18
  // Baris 4: 19, 20, 21, 22, 23, 24, 25
  // Baris 5: 26, 27, 28, 29, 30, 31, 1 (next month)
  const calendarWeeks = [
    [
      { day: 28, isCurrentMonth: false },
      { day: 29, isCurrentMonth: false },
      { day: 30, isCurrentMonth: false },
      { day: 1, isCurrentMonth: true },
      { day: 2, isCurrentMonth: true },
      { day: 3, isCurrentMonth: true },
      { day: 4, isCurrentMonth: true },
    ],
    [
      { day: 5, isCurrentMonth: true },
      { day: 6, isCurrentMonth: true },
      { day: 7, isCurrentMonth: true, isToday: true },
      { day: 8, isCurrentMonth: true },
      { day: 9, isCurrentMonth: true },
      { day: 10, isCurrentMonth: true },
      { day: 11, isCurrentMonth: true },
    ],
    [
      { day: 12, isCurrentMonth: true, hasMeeting: true },
      { day: 13, isCurrentMonth: true },
      { day: 14, isCurrentMonth: true },
      { day: 15, isCurrentMonth: true, hasMeeting: true },
      { day: 16, isCurrentMonth: true },
      { day: 17, isCurrentMonth: true },
      { day: 18, isCurrentMonth: true },
    ],
    [
      { day: 19, isCurrentMonth: true },
      { day: 20, isCurrentMonth: true },
      { day: 21, isCurrentMonth: true },
      { day: 22, isCurrentMonth: true },
      { day: 23, isCurrentMonth: true },
      { day: 24, isCurrentMonth: true },
      { day: 25, isCurrentMonth: true },
    ],
    [
      { day: 26, isCurrentMonth: true },
      { day: 27, isCurrentMonth: true },
      { day: 28, isCurrentMonth: true },
      { day: 29, isCurrentMonth: true },
      { day: 30, isCurrentMonth: true },
      { day: 31, isCurrentMonth: true },
      { day: 1, isCurrentMonth: false },
    ]
  ];

  const currentMeetingDetail = scheduledMeetings[selectedDate];

  return (
    <div className="jadwal-page-wrapper">
      {/* Navbar User */}
      <Navbar active="prm" />

      <main className="jadwal-main-container">
        {/* Breadcrumb */}
        <div className="jadwal-breadcrumb">
          <span className="crumb-link" onClick={() => navigate('/home')}>PRM</span>
          <span className="crumb-sep">›</span>
          <span className="crumb-active">Jadwal Pertemuan</span>
        </div>

        {/* Page Title & Subtitle */}
        <h1 className="jadwal-title">Jadwal Pertemuan</h1>
        <p className="jadwal-subtitle">
          Lihat agenda mendatang dan pengingat pertemuan dalam satu kalender.
        </p>

        {/* Info Banner */}
        <div className="jadwal-notice-banner">
          <span className="notice-icon">ⓘ</span>
          <span className="notice-text">
            <strong>Contoh jadwal</strong> • Pertemuan pada 12 dan 15 Oktober 2026 hanya ilustrasi, bukan data pengguna.
          </span>
        </div>

        {/* 2-Column Layout */}
        <div className="jadwal-layout-grid">
          {/* Kolom Kiri: Kalender */}
          <div className="jadwal-card calendar-card">
            {/* Calendar Controls */}
            <div className="calendar-header-row">
              <div>
                <h2 className="calendar-month-title">{currentMonth}</h2>
                <span className="calendar-subtitle-count">2 contoh pertemuan mendatang</span>
              </div>
              <div className="calendar-btn-group">
                <button 
                  className="btn-cal-today" 
                  onClick={() => setSelectedDate(todayDate)}
                >
                  Hari ini
                </button>
                <button className="btn-cal-arrow" title="Bulan Sebelumnya">
                  ‹
                </button>
                <button className="btn-cal-arrow" title="Bulan Berikutnya">
                  ›
                </button>
              </div>
            </div>

            {/* Grid Kalender */}
            <div className="calendar-table">
              {/* Day names */}
              <div className="calendar-weekdays-row">
                <div>Senin</div>
                <div>Selasa</div>
                <div>Rabu</div>
                <div>Kamis</div>
                <div>Jumat</div>
                <div>Sabtu</div>
                <div>Minggu</div>
              </div>

              {/* Day cells */}
              <div className="calendar-days-grid">
                {calendarWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="calendar-week-row">
                    {week.map((item, dIdx) => {
                      const isSelected = item.isCurrentMonth && selectedDate === item.day;
                      const hasEvent = item.isCurrentMonth && item.hasMeeting;
                      const isToday = item.isCurrentMonth && item.isToday;

                      return (
                        <div
                          key={dIdx}
                          className={`calendar-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected-cell' : ''} ${hasEvent ? 'has-event' : ''}`}
                          onClick={() => {
                            if (item.isCurrentMonth) {
                              setSelectedDate(item.day);
                            }
                          }}
                        >
                          <div className="cell-top-bar">
                            <span className={`day-number ${isToday ? 'today-circle' : ''} ${isSelected ? 'selected-badge' : ''}`}>
                              {item.day}
                            </span>
                          </div>

                          {/* Meeting pill inside cell */}
                          {hasEvent && (
                            <div className="cell-event-pill">
                              <span className="event-dot"></span>
                              <span className="event-time">
                                {item.day === 12 ? '09.00 • PRM' : '14.00 • PRM'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend / Footer Kalender */}
            <div className="calendar-legend-row">
              <span className="legend-item">
                <span className="legend-dot event-dot-orange"></span>
                Contoh jadwal
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-orange"></span>
                Tanggal dipilih
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-blue"></span>
                Hari ini, 7 Oktober
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Detail Hari Dipilih & Agenda Mendatang */}
          <div className="jadwal-right-column">
            {/* Panel Detail Tanggal Dipilih */}
            <div className="jadwal-card detail-selected-card">
              <span className="section-label-muted">Tanggal dipilih</span>
              <h2 className="selected-date-heading">
                {selectedDate === 12
                  ? 'Senin, 12 Oktober 2026'
                  : selectedDate === 15
                  ? 'Kamis, 15 Oktober 2026'
                  : selectedDate === 7
                  ? 'Rabu, 7 Oktober 2026 (Hari ini)'
                  : `${selectedDate} Oktober 2026`}
              </h2>

              <div className="detail-separator"></div>

              {currentMeetingDetail ? (
                <div className="meeting-active-details">
                  <div className="detail-badge-pill">
                    {currentMeetingDetail.tag}
                  </div>
                  <h3 className="meeting-detail-title">{currentMeetingDetail.title}</h3>

                  <div className="detail-meta-list">
                    <div className="meta-item">
                      <span className="meta-icon">🕒</span>
                      <div>
                        <div className="meta-label">Waktu</div>
                        <div className="meta-value">{currentMeetingDetail.waktu}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <div>
                        <div className="meta-label">Lokasi</div>
                        <div className="meta-value">{currentMeetingDetail.lokasi}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🔔</span>
                      <div>
                        <div className="meta-label">Pengingat</div>
                        <div className="meta-value">{currentMeetingDetail.pengingat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="meeting-empty-state">
                  <span className="empty-icon">📅</span>
                  <p className="empty-text">
                    Tidak ada jadwal pertemuan khusus pada tanggal {selectedDate} Oktober 2026.
                  </p>
                  <p className="empty-sub">
                    Klik pada tanggal 12 atau 15 Oktober untuk melihat contoh agenda pertemuan PRM.
                  </p>
                </div>
              )}
            </div>

            {/* Panel Agenda Mendatang */}
            <div className="jadwal-card upcoming-card">
              <div className="upcoming-card-header">
                <h3 className="upcoming-title">Agenda mendatang</h3>
                <span className="upcoming-count">2 contoh</span>
              </div>

              <div className="upcoming-list">
                {upcomingAgendas.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`upcoming-item-box ${selectedDate === item.dateRef ? 'active-highlight' : ''}`}
                    onClick={() => setSelectedDate(item.dateRef)}
                  >
                    <div className="date-badge-box">
                      <span className="badge-day">{item.dayCode}</span>
                      <span className="badge-num">{item.dateNum}</span>
                      <span className="badge-month">{item.monthCode}</span>
                    </div>
                    <div className="upcoming-info-col">
                      <h4 className="upcoming-item-title">{item.title}</h4>
                      <p className="upcoming-item-time">{item.waktuLokasi}</p>
                      <span className="upcoming-reminder-text">{item.pengingat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Small sub-footer notes */}
        <div className="jadwal-sub-notice">
          <span>Pratinjau pengingat statis. Tidak mengirim notifikasi.</span>
          <span>Kartu nama digital • Internal</span>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default JadwalPertemuan;

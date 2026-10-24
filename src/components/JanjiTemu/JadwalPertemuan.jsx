import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments } from '../../utils/cardStorage';
import './JadwalPertemuan.css';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const JadwalPertemuan = () => {
  const navigate = useNavigate();

  // Inisialisasi Real-Time Current Date & Time
  const [realTime, setRealTime] = useState(new Date());

  // View state untuk kalender (Bulan & Tahun aktif)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth()); // 0-indexed

  // Tanggal yang dipilih (default: hari ini)
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  // Data pertemuan dari stored appointments & mock sample
  const [appointments, setAppointments] = useState([]);

  // Timer live clock (detik demi detik)
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambil appointments dari storage
  useEffect(() => {
    const stored = getStoredAppointments();
    setAppointments(stored || []);
  }, []);

  // Deteksi kondisi hari ini
  const isViewingCurrentMonth =
    viewYear === realTime.getFullYear() && viewMonth === realTime.getMonth();
  const currentTodayDate = realTime.getDate();

  // Generate opsi Tahun (misal: 2024 s/d 2030)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  // Navigasi Bulan / Tahun
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  // Bangun grid matriks kalender secara dinamis (Senin - Minggu)
  // Hari Senin = 0, Minggu = 6
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // Dalam standar Indonesia, minggu dimulai dari Senin:
  // Sun(0)->6, Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5
  const startDayOffset = (firstDayOfMonth + 6) % 7;

  const totalDaysCurrent = getDaysInMonth(viewYear, viewMonth);
  const totalDaysPrev = getDaysInMonth(viewYear, viewMonth - 1);

  const calendarGrid = [];
  let currentWeek = [];

  // 1. Hari-hari sisa bulan sebelumnya
  for (let i = startDayOffset - 1; i >= 0; i--) {
    currentWeek.push({
      day: totalDaysPrev - i,
      isCurrentMonth: false,
      monthOffset: -1
    });
  }

  // 2. Hari-hari bulan aktif
  for (let d = 1; d <= totalDaysCurrent; d++) {
    currentWeek.push({
      day: d,
      isCurrentMonth: true,
      monthOffset: 0
    });

    if (currentWeek.length === 7) {
      calendarGrid.push(currentWeek);
      currentWeek = [];
    }
  }

  // 3. Hari-hari awal bulan berikutnya hingga baris lengkap (kelipatan 7)
  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        day: nextDay,
        isCurrentMonth: false,
        monthOffset: 1
      });
      nextDay++;
    }
    calendarGrid.push(currentWeek);
  }

  // Pastikan kalender selalu memiliki 5 atau 6 baris rapi
  while (calendarGrid.length < 5) {
    const lastRow = calendarGrid[calendarGrid.length - 1];
    let startNext = lastRow[lastRow.length - 1].day + 1;
    const newRow = [];
    for (let k = 0; k < 7; k++) {
      newRow.push({
        day: startNext + k,
        isCurrentMonth: false,
        monthOffset: 1
      });
    }
    calendarGrid.push(newRow);
  }

  // Format tanggal & jam real-time
  const formattedRealTimeClock = realTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' WIB';

  const formattedRealTimeDate = `${DAY_NAMES_ID[realTime.getDay()]}, ${realTime.getDate()} ${MONTH_NAMES_ID[realTime.getMonth()]} ${realTime.getFullYear()}`;

  // Filter hanya janji temu yang statusnya sudah disetujui / di-ACC
  const isApprovedAppointment = (status) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return s === 'accepted' || s === 'disetujui' || s === 'approved' || s === 'completed' || s === 'selesai';
  };

  // Cek apakah tanggal memiliki jadwal yang DISETUJUI (di-ACC)
  const getMeetingForDate = (dayNum, isCurrMonth) => {
    if (!isCurrMonth) return null;

    // Cek di stored appointments yang berstatus ACC / Disetujui
    const matchStored = appointments.find(app => {
      if (!app.date) return false;
      if (!isApprovedAppointment(app.status)) return false;

      const parsed = new Date(app.date);
      if (!isNaN(parsed.getTime())) {
        return (
          parsed.getDate() === dayNum &&
          parsed.getMonth() === viewMonth &&
          parsed.getFullYear() === viewYear
        );
      }
      return false;
    });

    if (matchStored) {
      return {
        title: matchStored.permintaan || 'Pertemuan PRM Disetujui',
        waktu: matchStored.jam ? `${matchStored.jam} WIB` : '10.00 WIB',
        lokasi: matchStored.lokasi || 'Daring (Google Meet) / Kampus Polibatam',
        partner: matchStored.pemohon || matchStored.tujuan || 'Mitra PRM',
        pengingat: '30 menit sebelumnya',
        tag: 'Disetujui (ACC)',
        status: matchStored.status
      };
    }

    // Default sample fallback untuk ilustrasi di bulan aktif (Hanya jadwal yang sudah di-ACC)
    if (dayNum === 12) {
      return {
        title: 'Pertemuan koordinasi PRM (Disetujui)',
        waktu: '09.00–10.00 WIB',
        lokasi: 'Ruang rapat internal civitas Polibatam',
        partner: 'Budi Santoso (CTO Mitra)',
        pengingat: '30 menit sebelumnya • 08.30 WIB',
        tag: 'Disetujui (ACC)',
        status: 'Disetujui'
      };
    }
    if (dayNum === 15) {
      return {
        title: 'Tindak lanjut PRM & Penandatanganan MoU (Disetujui)',
        waktu: '14.00–15.00 WIB',
        lokasi: 'Daring (Google Meet / Zoom)',
        partner: 'Siti Rahma, M.Sc',
        pengingat: '30 menit sebelumnya • 13.30 WIB',
        tag: 'Disetujui (ACC)',
        status: 'Disetujui'
      };
    }

    return null;
  };

  // Meeting detail untuk tanggal yang dipilih
  const selectedMeetingDetail = getMeetingForDate(selectedDay, true);

  // Agenda mendatang yang HANYA berstatus Disetujui / di-ACC
  const upcomingAgendas = [
    {
      dayCode: 'SEN',
      dateNum: '12',
      monthCode: MONTH_NAMES_ID[viewMonth].slice(0, 3).toUpperCase(),
      title: 'Koordinasi PRM (ACC)',
      waktuLokasi: '09.00–10.00 WIB • Ruang Rapat',
      pengingat: 'Pengingat: 30 menit sebelumnya',
      dateRef: 12
    },
    {
      dayCode: 'KAM',
      dateNum: '15',
      monthCode: MONTH_NAMES_ID[viewMonth].slice(0, 3).toUpperCase(),
      title: 'Tindak lanjut PRM (ACC)',
      waktuLokasi: '14.00–15.00 WIB • Daring',
      pengingat: 'Pengingat: 30 menit sebelumnya',
      dateRef: 15
    }
  ];

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

        {/* Real-time Header & Live Clock */}
        <div className="jadwal-header-flex">
          <div>
            <h1 className="jadwal-title">Jadwal Janji Temu & Pertemuan</h1>
            <p className="jadwal-subtitle">
              Navigasi kalender jadwal, tinjau agenda pertemuan, dan pantau waktu kondisi terkini secara real-time.
            </p>
          </div>

          {/* Real-Time Live Widget Badge */}
          <div className="realtime-status-card" title="Deteksi waktu kondisi saat ini">
            <div className="live-pulse-dot"></div>
            <div className="realtime-content">
              <span className="realtime-clock">{formattedRealTimeClock}</span>
              <span className="realtime-date">{formattedRealTimeDate}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="jadwal-layout-grid">
          {/* Kolom Kiri: Kalender */}
          <div className="jadwal-card calendar-card">
            {/* Calendar Controls & Switch Bulan / Tahun */}
            <div className="calendar-header-row">
              <div className="calendar-title-selectors">
                <div className="calendar-selectors-group">
                  {/* Dropdown Bulan */}
                  <select
                    className="cal-select-dropdown"
                    value={viewMonth}
                    onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                    aria-label="Pilih Bulan"
                  >
                    {MONTH_NAMES_ID.map((name, idx) => (
                      <option key={idx} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Tahun */}
                  <select
                    className="cal-select-dropdown year-select"
                    value={viewYear}
                    onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                    aria-label="Pilih Tahun"
                  >
                    {yearOptions.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="calendar-subtitle-count">
                  {MONTH_NAMES_ID[viewMonth]} {viewYear} • 2 agenda terjadwal
                </span>
              </div>

              {/* Tombol Navigasi Cepat (‹ › Hari Ini) */}
              <div className="calendar-btn-group">
                <button
                  type="button"
                  className="btn-cal-today"
                  onClick={handleJumpToToday}
                  title="Kembali ke Bulan & Hari Ini"
                >
                  Hari ini
                </button>
                <button
                  type="button"
                  className="btn-cal-arrow"
                  onClick={handlePrevMonth}
                  title="Bulan Sebelumnya"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="btn-cal-arrow"
                  onClick={handleNextMonth}
                  title="Bulan Berikutnya"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Grid Kalender */}
            <div className="calendar-table">
              {/* Day names (Senin s/d Minggu) */}
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
                {calendarGrid.map((week, wIdx) => (
                  <div key={wIdx} className="calendar-week-row">
                    {week.map((item, dIdx) => {
                      const isSelected = item.isCurrentMonth && selectedDay === item.day;
                      const isToday =
                        isViewingCurrentMonth &&
                        item.isCurrentMonth &&
                        item.day === currentTodayDate;
                      const meeting = getMeetingForDate(item.day, item.isCurrentMonth);

                      return (
                        <div
                          key={dIdx}
                          className={`calendar-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected-cell' : ''} ${meeting ? 'has-event' : ''}`}
                          onClick={() => {
                            if (item.isCurrentMonth) {
                              setSelectedDay(item.day);
                            }
                          }}
                        >
                          <div className="cell-top-bar">
                            <span
                              className={`day-number ${isToday ? 'today-circle' : ''} ${isSelected ? 'selected-badge' : ''}`}
                            >
                              {item.day}
                            </span>
                          </div>

                          {/* Meeting badge inside cell */}
                          {meeting && (
                            <div className="cell-event-pill" title={meeting.title}>
                              <span className="event-dot"></span>
                              <span className="event-time">
                                {meeting.waktu.split('–')[0]} • PRM
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
                Agenda Pertemuan PRM
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-orange"></span>
                Tanggal Dipilih ({selectedDay} {MONTH_NAMES_ID[viewMonth]})
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-blue"></span>
                Hari ini ({currentTodayDate} {MONTH_NAMES_ID[realTime.getMonth()]})
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Detail Hari Dipilih & Agenda Mendatang */}
          <div className="jadwal-right-column">
            {/* Panel Detail Tanggal Dipilih */}
            <div className="jadwal-card detail-selected-card">
              <span className="section-label-muted">Tanggal dipilih</span>
              <h2 className="selected-date-heading">
                {selectedDay} {MONTH_NAMES_ID[viewMonth]} {viewYear}
                {isViewingCurrentMonth && selectedDay === currentTodayDate && ' (Hari Ini)'}
              </h2>

              <div className="detail-separator"></div>

              {selectedMeetingDetail ? (
                <div className="meeting-active-details">
                  <div className="detail-badge-pill">
                    {selectedMeetingDetail.tag}
                  </div>
                  <h3 className="meeting-detail-title">{selectedMeetingDetail.title}</h3>

                  <div className="detail-meta-list">
                    <div className="meta-item">
                      <span className="meta-icon">👤</span>
                      <div>
                        <div className="meta-label">Pihak / Mitra</div>
                        <div className="meta-value">{selectedMeetingDetail.partner}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🕒</span>
                      <div>
                        <div className="meta-label">Waktu Pertemuan</div>
                        <div className="meta-value">{selectedMeetingDetail.waktu}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <div>
                        <div className="meta-label">Lokasi / Ruang</div>
                        <div className="meta-value">{selectedMeetingDetail.lokasi}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🔔</span>
                      <div>
                        <div className="meta-label">Pengingat Otomatis</div>
                        <div className="meta-value">{selectedMeetingDetail.pengingat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="meeting-empty-state">
                  <span className="empty-icon">📅</span>
                  <p className="empty-text">
                    Tidak ada jadwal pertemuan khusus pada tanggal {selectedDay} {MONTH_NAMES_ID[viewMonth]} {viewYear}.
                  </p>
                  <p className="empty-sub">
                    Klik pada tanggal 12 atau 15 untuk melihat rincian agenda koordinasi PRM.
                  </p>
                </div>
              )}
            </div>

            {/* Panel Agenda Mendatang */}
            <div className="jadwal-card upcoming-card">
              <div className="upcoming-card-header">
                <h3 className="upcoming-title">Agenda Mendatang</h3>
                <span className="upcoming-count">{upcomingAgendas.length} pertemuan</span>
              </div>

              <div className="upcoming-list">
                {upcomingAgendas.map((item, idx) => (
                  <div
                    key={idx}
                    className={`upcoming-item-box ${selectedDay === item.dateRef ? 'active-highlight' : ''}`}
                    onClick={() => setSelectedDay(item.dateRef)}
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
          <span>Pratinjau jadwal dan pengingat PRM terintegrasi real-time.</span>
          <span>Sistem Kartu Nama Digital Polibatam • Internal Portal</span>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default JadwalPertemuan;

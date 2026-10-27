import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getStoredAppointments } from '../../utils/cardStorage';
import './JadwalPertemuan.css';

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const JadwalPertemuan = () => {
  const navigate = useNavigate();

  // Initialize Real-Time Current Date & Time
  const [realTime, setRealTime] = useState(new Date());

  // View state for calendar (Active Month & Year)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth()); // 0-indexed

  // Selected date (default: today)
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  // Meeting appointments from stored appointments & mock samples
  const [appointments, setAppointments] = useState([]);

  // Timer live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Retrieve appointments from storage
  useEffect(() => {
    const stored = getStoredAppointments();
    setAppointments(stored || []);
  }, []);

  // Current today condition
  const isViewingCurrentMonth =
    viewYear === realTime.getFullYear() && viewMonth === realTime.getMonth();
  const currentTodayDate = realTime.getDate();

  // Generate Year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  // Navigation Month / Year
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

  // Build calendar matrix dynamically (Monday - Sunday)
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // Monday start: Sun(0)->6, Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5
  const startDayOffset = (firstDayOfMonth + 6) % 7;

  const totalDaysCurrent = getDaysInMonth(viewYear, viewMonth);
  const totalDaysPrev = getDaysInMonth(viewYear, viewMonth - 1);

  const calendarGrid = [];
  let currentWeek = [];

  // 1. Previous month days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    currentWeek.push({
      day: totalDaysPrev - i,
      isCurrentMonth: false,
      monthOffset: -1
    });
  }

  // 2. Current active month days
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

  // 3. Next month days until full week
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

  // Real-time formatted clock & date
  const formattedRealTimeClock = realTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedRealTimeDate = `${DAY_NAMES_EN[realTime.getDay()]}, ${MONTH_NAMES_EN[realTime.getMonth()]} ${realTime.getDate()}, ${realTime.getFullYear()}`;

  // Filter approved appointments
  const isApprovedAppointment = (status) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return s === 'accepted' || s === 'disetujui' || s === 'approved' || s === 'completed' || s === 'selesai';
  };

  // Check if date has approved meetings
  const getMeetingForDate = (dayNum, isCurrMonth) => {
    if (!isCurrMonth) return null;

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
        title: matchStored.permintaan || 'Approved PRM Meeting',
        waktu: matchStored.jam ? `${matchStored.jam}` : '10:00 AM',
        lokasi: matchStored.lokasi || 'Online (Google Meet) / Campus Polibatam',
        partner: matchStored.pemohon || matchStored.tujuan || 'PRM Partner',
        pengingat: '30 minutes before',
        tag: 'Approved (Confirmed)',
        status: matchStored.status
      };
    }

    // Default sample fallback
    if (dayNum === 12) {
      return {
        title: 'PRM Coordination Meeting (Approved)',
        waktu: '09:00 - 10:00 AM',
        lokasi: 'Polibatam Internal Meeting Room',
        partner: 'Budi Santoso (Partner CTO)',
        pengingat: '30 minutes before • 08:30 AM',
        tag: 'Approved (Confirmed)',
        status: 'Approved'
      };
    }
    if (dayNum === 15) {
      return {
        title: 'PRM Follow-up & MoU Signing (Approved)',
        waktu: '02:00 - 03:00 PM',
        lokasi: 'Online (Google Meet / Zoom)',
        partner: 'Siti Rahma, M.Sc',
        pengingat: '30 minutes before • 01:30 PM',
        tag: 'Approved (Confirmed)',
        status: 'Approved'
      };
    }

    return null;
  };

  const selectedMeetingDetail = getMeetingForDate(selectedDay, true);

  // Dynamic agenda items from confirmed stored appointments + demo upcoming meetings
  const allAgendas = [
    ...appointments
      .filter(app => isApprovedAppointment(app.status) && app.date)
      .map(app => {
        const d = new Date(app.date);
        const dayCode = !isNaN(d.getTime()) ? DAY_NAMES_EN[d.getDay()].slice(0, 3).toUpperCase() : 'MEET';
        const dateNum = !isNaN(d.getTime()) ? String(d.getDate()).padStart(2, '0') : '01';
        const monthCode = !isNaN(d.getTime()) ? MONTH_NAMES_EN[d.getMonth()].slice(0, 3).toUpperCase() : 'PRM';
        const dateRef = !isNaN(d.getTime()) ? d.getDate() : 1;
        const fullDate = !isNaN(d.getTime()) ? d : new Date();

        return {
          dayCode,
          dateNum,
          monthCode,
          title: app.permintaan || 'PRM Meeting (Confirmed)',
          waktuLokasi: `${app.jam || '10:00 AM'} • ${app.lokasi || 'Meeting Room'}`,
          pengingat: 'Reminder: 30 minutes before',
          dateRef,
          fullDate
        };
      }),
    {
      dayCode: 'MON',
      dateNum: '12',
      monthCode: MONTH_NAMES_EN[viewMonth].slice(0, 3).toUpperCase(),
      title: 'PRM Coordination (Confirmed)',
      waktuLokasi: '09:00–10:00 AM • Meeting Room',
      pengingat: 'Reminder: 30 minutes before',
      dateRef: 12,
      fullDate: new Date(viewYear, viewMonth, 12, 10, 0, 0)
    },
    {
      dayCode: 'THU',
      dateNum: '15',
      monthCode: MONTH_NAMES_EN[viewMonth].slice(0, 3).toUpperCase(),
      title: 'PRM Follow-up (Confirmed)',
      waktuLokasi: '02:00–03:00 PM • Online',
      pengingat: 'Reminder: 30 minutes before',
      dateRef: 15,
      fullDate: new Date(viewYear, viewMonth, 15, 15, 0, 0)
    }
  ];

  // Sesuai permintaan: Hilangkan agenda yang sudah lewat harinya (hanya tampilkan agenda yang mendatang / hari ini ke depan)
  const startOfToday = new Date(realTime.getFullYear(), realTime.getMonth(), realTime.getDate());
  const upcomingAgendas = allAgendas.filter(item => {
    if (!item.fullDate) return true;
    const itemDateOnly = new Date(item.fullDate.getFullYear(), item.fullDate.getMonth(), item.fullDate.getDate());
    return itemDateOnly >= startOfToday;
  }).sort((a, b) => a.fullDate - b.fullDate);

  return (
    <div className="jadwal-page-wrapper">
      {/* Navbar User */}
      <Navbar active="prm" />

      <main className="jadwal-main-container">
        {/* Breadcrumb */}
        <div className="jadwal-breadcrumb">
          <span className="crumb-link" onClick={() => navigate('/home')}>PRM</span>
          <span className="crumb-sep">›</span>
          <span className="crumb-active">Meeting Schedule</span>
        </div>

        {/* Real-time Header & Live Clock */}
        <div className="jadwal-header-flex">
          <div>
            <h1 className="jadwal-title">Appointments & Meeting Schedule</h1>
            <p className="jadwal-subtitle">
              Navigate the schedule calendar, review upcoming meetings, and check real-time availability.
            </p>
          </div>

          {/* Real-Time Live Widget Badge */}
          <div className="realtime-status-card" title="Current real-time clock">
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
                    aria-label="Select Month"
                  >
                    {MONTH_NAMES_EN.map((name, idx) => (
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
                    aria-label="Select Year"
                  >
                    {yearOptions.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="calendar-subtitle-count">
                  {MONTH_NAMES_EN[viewMonth]} {viewYear} • 2 scheduled meetings
                </span>
              </div>

              {/* Quick Navigation Buttons */}
              <div className="calendar-btn-group">
                <button
                  type="button"
                  className="btn-cal-today"
                  onClick={handleJumpToToday}
                  title="Jump to Today"
                >
                  Today
                </button>
                <button
                  type="button"
                  className="btn-cal-arrow"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="btn-cal-arrow"
                  onClick={handleNextMonth}
                  title="Next Month"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-table">
              {/* Day names */}
              <div className="calendar-weekdays-row">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
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
                PRM Meeting Agenda
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-orange"></span>
                Selected Date ({selectedDay} {MONTH_NAMES_EN[viewMonth]})
              </span>
              <span className="legend-item">
                <span className="legend-ring ring-blue"></span>
                Today ({currentTodayDate} {MONTH_NAMES_EN[realTime.getMonth()]})
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Detail Hari Dipilih & Agenda Mendatang */}
          <div className="jadwal-right-column">
            {/* Panel Detail Tanggal Dipilih */}
            <div className="jadwal-card detail-selected-card">
              <span className="section-label-muted">Selected Date</span>
              <h2 className="selected-date-heading">
                {MONTH_NAMES_EN[viewMonth]} {selectedDay}, {viewYear}
                {isViewingCurrentMonth && selectedDay === currentTodayDate && ' (Today)'}
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
                        <div className="meta-label">Partner / Contact</div>
                        <div className="meta-value">{selectedMeetingDetail.partner}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🕒</span>
                      <div>
                        <div className="meta-label">Meeting Time</div>
                        <div className="meta-value">{selectedMeetingDetail.waktu}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <div>
                        <div className="meta-label">Location / Room</div>
                        <div className="meta-value">{selectedMeetingDetail.lokasi}</div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🔔</span>
                      <div>
                        <div className="meta-label">Automated Reminder</div>
                        <div className="meta-value">{selectedMeetingDetail.pengingat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="meeting-empty-state">
                  <span className="empty-icon">📅</span>
                  <p className="empty-text">
                    No scheduled meetings on {MONTH_NAMES_EN[viewMonth]} {selectedDay}, {viewYear}.
                  </p>
                  <p className="empty-sub">
                    Click on the 12th or 15th to view sample confirmed PRM agendas.
                  </p>
                </div>
              )}
            </div>

            {/* Panel Agenda Mendatang */}
            <div className="jadwal-card upcoming-card">
              <div className="upcoming-card-header">
                <h3 className="upcoming-title">Upcoming Agenda</h3>
                <span className="upcoming-count">{upcomingAgendas.length} meetings</span>
              </div>

              <div className="upcoming-list">
                {upcomingAgendas.length > 0 ? (
                  upcomingAgendas.map((item, idx) => (
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
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                    <p style={{ margin: 0 }}>No upcoming meetings ahead.</p>
                    <small>Past meetings are hidden automatically.</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Small sub-footer notes */}
        <div className="jadwal-sub-notice">
          <span>Real-time integrated PRM schedule and reminders.</span>
          <span>Polibatam Smart Business Card • Internal Portal</span>
        </div>
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default JadwalPertemuan;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isUserAccountActive, addActivityLog } from '../../utils/adminStorage';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [email, setEmail] = useState('smart.card@gmail.com');
  const [password, setPassword] = useState('pbljaya');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('smart.card@gmail.com');
      setPassword('pbljaya');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Admin Role Login
    if (role === 'admin') {
      if (
        (email.trim().toLowerCase() === 'admin@gmail.com' && password === 'admin123') ||
        (email.trim().toLowerCase() === 'admin.smartcard@gmail.com' && password === 'admin123')
      ) {
        localStorage.setItem('smart_card_logged_role', 'admin');
        addActivityLog({
          aktor: 'Administrator Utama',
          email: email.trim(),
          kategori: 'Autentikasi',
          aksi: 'Login administrator berhasil masuk ke dashboard sistem',
          status: 'Sukses',
          statusClass: 'log-success',
          perangkat: navigator.userAgent.split('(')[0] || 'Admin Browser'
        });
        navigate('/admin');
      } else {
        setError('Kredensial Admin salah. Gunakan akun demo: admin@gmail.com / admin123');
      }
      return;
    }

    // Registered User (Pengguna Terdaftar) Login
    const cleanEmail = email.trim().toLowerCase();

    // Check account status (FR-13: Admin can deactivate accounts)
    if (!isUserAccountActive(cleanEmail)) {
      setError('⚠️ Akses akun Anda telah dinonaktifkan oleh Administrator. Silahkan hubungi administrator sistem untuk pengaktifan kembali.');
      addActivityLog({
        aktor: cleanEmail,
        email: cleanEmail,
        kategori: 'Autentikasi',
        aksi: `Percobaan login ditolak: status akun pengguna dinonaktifkan (${cleanEmail})`,
        status: 'Peringatan',
        statusClass: 'log-warning'
      });
      return;
    }

    if (
      (cleanEmail === 'smart.card@gmail.com' && password === 'pbljaya') ||
      (cleanEmail === 'budi.santoso@inovasidigital.id' && password === 'pbljaya') ||
      (cleanEmail === 'siti.rahma@polibatam.ac.id' && password === 'pbljaya')
    ) {
      localStorage.setItem('smart_card_logged_role', 'user');
      addActivityLog({
        aktor: cleanEmail === 'smart.card@gmail.com' ? 'Aprillia Bunga Lestari' : cleanEmail,
        email: cleanEmail,
        kategori: 'Autentikasi',
        aksi: 'Login pengguna terdaftar berhasil masuk ke dashboard PRM',
        status: 'Sukses',
        statusClass: 'log-success'
      });
      navigate('/home');
    } else {
      setError('Kredensial tidak valid. Gunakan akun demo: smart.card@gmail.com / pbljaya');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Role Selector Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`role-tab-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => handleRoleChange('user')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Pengguna Terdaftar
          </button>

          <button
            type="button"
            className={`role-tab-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Admin
          </button>
        </div>

        <h2 className="auth-title">
          {role === 'admin' ? 'Portal Administrator' : 'Selamat Datang'}
        </h2>
        <p className="auth-subtitle">
          {role === 'admin'
            ? 'Masuk untuk mengelola pengguna & pantau log aktivitas'
            : 'Masuk ke akun SmartCard PRM internal Anda'}
        </p>

        {error && (
          <div className="auth-error-box">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              {role === 'admin' ? 'Email Administrator' : 'Email Pengguna'}
            </label>
            <input
              type="email"
              id="email"
              placeholder={role === 'admin' ? 'admin@gmail.com' : 'smart.card@gmail.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Quick Demo Helper Hint */}
          <div className="demo-credentials-box">
            <div className="demo-hint-title">
              💡 Akun Demo {role === 'admin' ? 'Admin' : 'Pengguna'}:
            </div>
            <div className="demo-hint-code">
              {role === 'admin' ? (
                <>
                  Email: <strong>admin@gmail.com</strong> | Sandi: <strong>admin123</strong>
                </>
              ) : (
                <>
                  Email: <strong>smart.card@gmail.com</strong> | Sandi: <strong>pbljaya</strong>
                </>
              )}
            </div>
          </div>

          <button type="submit" className={`auth-submit-btn ${role === 'admin' ? 'btn-admin-login' : ''}`}>
            {role === 'admin' ? 'Masuk ke Halaman Admin →' : 'Masuk ke Dashboard Pengguna →'}
          </button>
        </form>

        <div className="auth-bottom-switch">
          <button
            type="button"
            className="switch-link-btn"
            onClick={() => navigate('/')}
          >
            ← Kembali ke Beranda Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

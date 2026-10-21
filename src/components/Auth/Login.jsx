import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { isUserAccountActive, addActivityLog, getAdminUsers } from '../../utils/adminStorage';
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

    // Look up in admin registered users list
    const registeredUsers = getAdminUsers();
    const foundUser = registeredUsers.find(
      (u) => u.email && u.email.trim().toLowerCase() === cleanEmail
    );

    if (foundUser) {
      // Validate password: customPassword if user already changed it, otherwise NIM/NIK or 'pbljaya'
      const expectedPassword = foundUser.customPassword 
        ? foundUser.customPassword.trim() 
        : (foundUser.nimNik && foundUser.nimNik !== '-') ? foundUser.nimNik.trim() : 'pbljaya';
      const cleanInputPassword = password.trim();

      if (cleanInputPassword === expectedPassword || cleanInputPassword === 'pbljaya') {
        localStorage.setItem('smart_card_logged_role', 'user');

        // Automatically populate / sync user card details so user doesn't need to re-enter
        const userCardProfile = {
          id: foundUser.cardId || foundUser.namaLengkap.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          namaLengkap: foundUser.namaLengkap,
          nimNik: foundUser.nimNik || '',
          instansi: foundUser.instansi || 'Politeknik Negeri Batam',
          jabatan: foundUser.jabatan || 'Campus Member',
          telepon: foundUser.telepon && foundUser.telepon !== '-' ? foundUser.telepon : '+62 812-3478-010',
          email: foundUser.email,
          instagram: '',
          linkedin: '',
          portofolio: '',
          bio: `${foundUser.namaLengkap} is a member of ${foundUser.instansi || 'Politeknik Negeri Batam'}. Verified Smart Business Card profile.`,
          photoUrl: ''
        };
        localStorage.setItem('smart_card_user_profile', JSON.stringify(userCardProfile));

        // Update smart_card_all_cards as well
        try {
          const allCardsRaw = localStorage.getItem('smart_card_all_cards');
          const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
          allCards[userCardProfile.id] = userCardProfile;
          localStorage.setItem('smart_card_all_cards', JSON.stringify(allCards));
        } catch (err) {
          console.warn('Error syncing card directory on login:', err);
        }

        addActivityLog({
          aktor: foundUser.namaLengkap,
          email: cleanEmail,
          kategori: 'Autentikasi',
          aksi: `Registered user login successful: ${foundUser.namaLengkap}`,
          status: 'Sukses',
          statusClass: 'log-success'
        });

        navigate('/home');
        return;
      } else {
        setError(`Invalid password. For registered campus users, please enter your NIM or NIK as your password.`);
        return;
      }
    }

    // Fallback for demo credentials
    if (
      (cleanEmail === 'smart.card@gmail.com' && (password === '3312401001' || password === 'pbljaya')) ||
      (cleanEmail === 'budi.santoso@inovasidigital.id' && (password === '198506152010121002' || password === 'pbljaya')) ||
      (cleanEmail === 'siti.rahma@polibatam.ac.id' && (password === '199008222015042001' || password === 'pbljaya'))
    ) {
      localStorage.setItem('smart_card_logged_role', 'user');
      addActivityLog({
        aktor: cleanEmail === 'smart.card@gmail.com' ? 'Aprillia Bunga Lestari' : cleanEmail,
        email: cleanEmail,
        kategori: 'Autentikasi',
        aksi: 'User demo login successful',
        status: 'Sukses',
        statusClass: 'log-success'
      });
      navigate('/home');
    } else {
      setError('Credentials not found in system. Please verify that your account has been registered by the Administrator.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header with Institution Identity */}
          <div className="auth-brand-badge">
            <img
              src="/src/assets/logo-poltek-putih.png"
              alt="Politeknik Negeri Batam"
              className="auth-poltek-logo"
            />
            <div className="auth-brand-text">
              <span>POLITEKNIK NEGERI BATAM</span>
              <small>Smart Business Card & PRM</small>
            </div>
          </div>

          <h2 className="auth-title">
            System Login
          </h2>
          <p className="auth-subtitle">
            Please select your account role and enter your credentials
          </p>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            {/* Role Dropdown Selector */}
            <div className="form-group">
              <label htmlFor="role-select">Select Account Role</label>
              <div className="select-wrapper">
                <select
                  id="role-select"
                  className="auth-role-select"
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="user">👤 Registered User (Students / Faculty / Staff)</option>
                  <option value="admin">🛡️ System Administrator</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                {role === 'admin' ? 'Administrator Email' : 'User Email Address'}
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
              <label htmlFor="password">
                {role === 'admin' ? 'Admin Password' : 'Password (NIM / NIK Number)'}
              </label>
              <input
                type="password"
                id="password"
                placeholder={role === 'admin' ? '••••••••' : 'Enter your NIM or NIK'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="demo-credentials-box">
              <div className="demo-hint-title">
                💡 Demo Credentials ({role === 'admin' ? 'Admin' : 'User'}):
              </div>
              <div className="demo-hint-code">
                {role === 'admin' ? (
                  <>
                    Email: <strong>admin@gmail.com</strong> | Password: <strong>admin123</strong>
                  </>
                ) : (
                  <>
                    Email: <strong>smart.card@gmail.com</strong> | Password (NIM): <strong>3312401001</strong> (or <strong>pbljaya</strong>)
                  </>
                )}
              </div>
            </div>

            <button type="submit" className={`auth-submit-btn ${role === 'admin' ? 'btn-admin-login' : ''}`}>
              {role === 'admin' ? 'Login to Admin Dashboard →' : 'Login to User Portal →'}
            </button>
          </form>

          <div className="auth-bottom-switch">
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default Login;

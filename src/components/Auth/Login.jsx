import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { isUserAccountActive, addActivityLog, getAdminUsers, getAdminProfile } from '../../utils/adminStorage';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    // 1. Check if email belongs to Administrator
    // Default admin emails & dynamically stored admin profile email
    const adminProfile = getAdminProfile();
    const storedAdminEmail = adminProfile?.email ? adminProfile.email.trim().toLowerCase() : 'admin@gmail.com';
    const isAdminEmail =
      cleanEmail === 'admin@gmail.com' ||
      cleanEmail === 'admin.smartcard@gmail.com' ||
      cleanEmail === storedAdminEmail;

    if (isAdminEmail) {
      // Validate Admin Password (supports demo password 'admin123' or custom password if set)
      const expectedAdminPassword = adminProfile?.password ? adminProfile.password.trim() : 'admin123';
      if (cleanPassword === 'admin123' || cleanPassword === expectedAdminPassword) {
        localStorage.setItem('smart_card_logged_role', 'admin');
        addActivityLog({
          aktor: adminProfile?.nama || 'Administrator Utama',
          email: cleanEmail,
          kategori: 'Autentikasi',
          aksi: 'Login administrator berhasil masuk ke dashboard sistem',
          status: 'Sukses',
          statusClass: 'log-success',
          perangkat: navigator.userAgent?.split('(')[0] || 'Admin Browser'
        });
        navigate('/admin');
        return;
      } else {
        setError('Incorrect password for Administrator account.');
        return;
      }
    }

    // 2. Validate Registered Internal User
    // Check account active status (FR-13)
    if (!isUserAccountActive(cleanEmail)) {
      setError('Your account access has been deactivated by the Administrator. Please contact system support for reactivation.');
      addActivityLog({
        aktor: cleanEmail,
        email: cleanEmail,
        kategori: 'Autentikasi',
        aksi: `Login attempt rejected: user account status is inactive (${cleanEmail})`,
        status: 'Peringatan',
        statusClass: 'log-warning'
      });
      return;
    }

    // Look up user in registered users list
    const registeredUsers = getAdminUsers();
    const foundUser = registeredUsers.find(
      (u) => u.email && u.email.trim().toLowerCase() === cleanEmail
    );

    if (foundUser) {
      // If user is marked as Admin role in user list, redirect to /admin
      const isUserAdminRole = foundUser.role === 'Admin';

      // Validate password: customPassword if changed, or nimNik, or initial default 'pbljaya'
      const expectedPassword = foundUser.customPassword
        ? foundUser.customPassword.trim()
        : (foundUser.nimNik && foundUser.nimNik !== '-') ? foundUser.nimNik.trim() : 'pbljaya';

      if (cleanPassword === expectedPassword || cleanPassword === 'pbljaya') {
        const assignedRole = isUserAdminRole ? 'admin' : 'user';
        localStorage.setItem('smart_card_logged_role', assignedRole);

        // If internal user, prepare/sync user card profile
        if (!isUserAdminRole) {
          let userCardProfile = null;
          try {
            const allCardsRaw = localStorage.getItem('smart_card_all_cards');
            const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
            const existingCard = (foundUser.cardId && allCards[foundUser.cardId]) || foundUser.cardProfile;
            if (existingCard) {
              userCardProfile = { ...existingCard };
            }
          } catch (err) {
            console.warn('Error reading existing card directory on login:', err);
          }

          if (!userCardProfile) {
            userCardProfile = {
              id: foundUser.cardId || foundUser.namaLengkap.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              namaLengkap: foundUser.namaLengkap,
              nimNik: foundUser.nimNik || '',
              instansi: foundUser.instansi || 'Politeknik Negeri Batam',
              jabatan: foundUser.jabatan || 'Campus Member',
              telepon: foundUser.telepon && foundUser.telepon !== '-' ? foundUser.telepon : '+62 812-3478-010',
              email: foundUser.email,
              instagram: '',
              twitterX: '',
              facebook: '',
              linkedin: '',
              portofolio: '',
              bio: `${foundUser.namaLengkap} is a member of ${foundUser.instansi || 'Politeknik Negeri Batam'}. Verified Smart Business Card profile.`,
              photoUrl: ''
            };
          }

          localStorage.setItem('smart_card_user_profile', JSON.stringify(userCardProfile));

          try {
            const allCardsRaw = localStorage.getItem('smart_card_all_cards');
            const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
            allCards[userCardProfile.id] = userCardProfile;
            localStorage.setItem('smart_card_all_cards', JSON.stringify(allCards));
          } catch (err) {
            console.warn('Error syncing card directory on login:', err);
          }
        }

        addActivityLog({
          aktor: foundUser.namaLengkap,
          email: cleanEmail,
          kategori: 'Autentikasi',
          aksi: `Login berhasil: ${foundUser.namaLengkap} (${isUserAdminRole ? 'Admin' : 'User'})`,
          status: 'Sukses',
          statusClass: 'log-success'
        });

        if (isUserAdminRole) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        return;
      } else {
        setError('Invalid password. Please check your credentials and try again.');
        return;
      }
    }

    // 3. Fallback for demo credentials
    if (
      (cleanEmail === 'smart.card@gmail.com' && (cleanPassword === '3312401001' || cleanPassword === 'pbljaya')) ||
      (cleanEmail === 'budi.santoso@inovasidigital.id' && (cleanPassword === '198506152010121002' || cleanPassword === 'pbljaya')) ||
      (cleanEmail === 'siti.rahma@polibatam.ac.id' && (cleanPassword === '199008222015042001' || cleanPassword === 'pbljaya'))
    ) {
      localStorage.setItem('smart_card_logged_role', 'user');

      try {
        const allCardsRaw = localStorage.getItem('smart_card_all_cards');
        const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
        const demoCardId = cleanEmail === 'budi.santoso@inovasidigital.id'
          ? 'budi-santoso'
          : (cleanEmail === 'siti.rahma@polibatam.ac.id' ? 'siti-rahma' : 'aprillia-bunga');
        if (allCards[demoCardId]) {
          localStorage.setItem('smart_card_user_profile', JSON.stringify(allCards[demoCardId]));
        }
      } catch (err) {
        console.warn('Error reading demo card:', err);
      }

      addActivityLog({
        aktor: cleanEmail === 'smart.card@gmail.com' ? 'Aprillia Bunga Lestari' : cleanEmail,
        email: cleanEmail,
        kategori: 'Autentikasi',
        aksi: 'User demo login successful',
        status: 'Sukses',
        statusClass: 'log-success'
      });
      navigate('/home');
      return;
    }

    // If no match found at all
    setError('Credentials not found. Please verify that your email is registered and your password is correct.');
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
            Enter your email and password to access your account
          </p>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@polibatam.ac.id or admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Login
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
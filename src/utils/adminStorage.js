// Management of Admin registered users, system activity logs, and monitoring stats

const STORAGE_KEY_ADMIN_USERS = 'smart_card_admin_registered_users';
const STORAGE_KEY_ACTIVITY_LOGS = 'smart_card_admin_activity_logs';
const STORAGE_KEY_ADMIN_PROFILE = 'smart_card_admin_profile';

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'USR-001',
    namaLengkap: 'Aprillia Bunga Lestari',
    email: 'smart.card@gmail.com',
    nimNik: '3312401001',
    instansi: 'Politeknik Negeri Batam',
    jabatan: 'Informatics Engineering Student',
    telepon: '+62 812-3478-010',
    role: 'Pengguna Terdaftar',
    status: 'Aktif', // 'Aktif' | 'Nonaktif'
    tanggalDibuat: '10 Okt 2026',
    cardId: 'aprillia-bunga',
    totalKartu: 1,
    terakhirAktif: 'Hari ini, 10:15 WIB'
  },
  {
    id: 'USR-002',
    namaLengkap: 'Budi Santoso, M.Kom',
    email: 'budi.santoso@inovasidigital.id',
    nimNik: '198506152010121002',
    instansi: 'PT Inovasi Digital Nusantara',
    jabatan: 'Chief Technology Officer (CTO)',
    telepon: '+62 812-9876-5432',
    role: 'Pengguna Terdaftar',
    status: 'Aktif',
    tanggalDibuat: '11 Okt 2026',
    cardId: 'budi-santoso',
    totalKartu: 1,
    terakhirAktif: 'Kemarin, 16:40 WIB'
  },
  {
    id: 'USR-003',
    namaLengkap: 'Siti Rahma, S.T., M.Sc',
    email: 'siti.rahma@polibatam.ac.id',
    nimNik: '199008222015042001',
    instansi: 'Politeknik Negeri Batam',
    jabatan: 'Dosen Pembimbing Teknik Informatika',
    telepon: '+62 813-7722-9011',
    role: 'Pengguna Terdaftar',
    status: 'Aktif',
    tanggalDibuat: '12 Okt 2026',
    cardId: 'siti-rahma',
    totalKartu: 1,
    terakhirAktif: '12 Okt 2026, 09:20 WIB'
  },
  {
    id: 'USR-004',
    namaLengkap: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@techindo.com',
    nimNik: '3312401099',
    instansi: 'TechIndo Solutions',
    jabatan: 'Business Development Specialist',
    telepon: '+62 821-5544-3322',
    role: 'Pengguna Terdaftar',
    status: 'Nonaktif',
    tanggalDibuat: '08 Okt 2026',
    cardId: 'ahmad-fauzi',
    totalKartu: 0,
    terakhirAktif: '09 Okt 2026, 14:10 WIB'
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'LOG-101',
    timestamp: '13 Okt 2026, 11:45 WIB',
    aktor: 'Aprillia Bunga Lestari',
    email: 'smart.card@gmail.com',
    kategori: 'Kartu Nama',
    aksi: 'Memperbarui data kartu nama digital & bio profil',
    status: 'Sukses',
    statusClass: 'log-success',
    ip: '192.168.1.45',
    perangkat: 'Chrome / Windows'
  },
  {
    id: 'LOG-102',
    timestamp: '13 Okt 2026, 10:30 WIB',
    aktor: 'Budi Santoso, M.Kom',
    email: 'budi.santoso@inovasidigital.id',
    kategori: 'PRM Interaksi',
    aksi: 'Mengonfirmasi janji temu PRM dengan mitra industri',
    status: 'Sukses',
    statusClass: 'log-success',
    ip: '192.168.1.18',
    perangkat: 'Firefox / macOS'
  },
  {
    id: 'LOG-103',
    timestamp: '12 Okt 2026, 17:15 WIB',
    aktor: 'Admin Sistem',
    email: 'admin@gmail.com',
    kategori: 'Akses Akun',
    aksi: 'Menonaktifkan akses akun Ahmad Fauzi (USR-004)',
    status: 'Peringatan',
    statusClass: 'log-warning',
    ip: '10.0.0.1',
    perangkat: 'Admin Workstation'
  },
  {
    id: 'LOG-104',
    timestamp: '12 Okt 2026, 14:05 WIB',
    aktor: 'Siti Rahma, S.T., M.Sc',
    email: 'siti.rahma@polibatam.ac.id',
    kategori: 'Autentikasi',
    aksi: 'Login berhasil ke platform SmartCard PRM',
    status: 'Sukses',
    statusClass: 'log-success',
    ip: '192.168.1.92',
    perangkat: 'Safari / iPadOS'
  },
  {
    id: 'LOG-105',
    timestamp: '11 Okt 2026, 09:20 WIB',
    aktor: 'Aprillia Bunga Lestari',
    email: 'smart.card@gmail.com',
    kategori: 'Kartu Nama',
    aksi: 'Mengunduh format PDF kartu nama digital untuk cetak',
    status: 'Sukses',
    statusClass: 'log-success',
    ip: '192.168.1.45',
    perangkat: 'Chrome / Windows'
  },
  {
    id: 'LOG-106',
    timestamp: '10 Okt 2026, 08:00 WIB',
    aktor: 'Admin Sistem',
    email: 'admin@gmail.com',
    kategori: 'Akun Pengguna',
    aksi: 'Menambahkan akun pengguna baru USR-001 (Aprillia Bunga)',
    status: 'Sukses',
    statusClass: 'log-success',
    ip: '10.0.0.1',
    perangkat: 'Admin Workstation'
  }
];

export const DEFAULT_ADMIN_PROFILE = {
  nama: 'Administrator Utama PRM',
  email: 'admin@gmail.com',
  jabatan: 'Chief System Administrator',
  instansi: 'Politeknik Negeri Batam',
  telepon: '+62 811-7788-9900',
  role: 'Super Administrator',
  avatar: 'A'
};

// Initialize Admin Storage
export const initAdminStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_ADMIN_USERS)) {
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(INITIAL_REGISTERED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEY_ACTIVITY_LOGS)) {
    localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEY_ADMIN_PROFILE)) {
    localStorage.setItem(STORAGE_KEY_ADMIN_PROFILE, JSON.stringify(DEFAULT_ADMIN_PROFILE));
  }
};

// Retrieve registered users
export const getAdminUsers = () => {
  initAdminStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
    return raw ? JSON.parse(raw) : INITIAL_REGISTERED_USERS;
  } catch (e) {
    console.error('Error getting admin users:', e);
    return INITIAL_REGISTERED_USERS;
  }
};

// Add new user (FR-13)
export const addAdminUser = (userData) => {
  initAdminStorage();
  try {
    const users = getAdminUsers();
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const cleanName = (userData.namaLengkap && userData.namaLengkap.trim()) ? userData.namaLengkap.trim() : (userData.nimNik ? `User ${userData.nimNik}` : 'Pengguna Baru');
    const cleanInstansi = (userData.instansi && userData.instansi.trim()) ? userData.instansi.trim() : 'Politeknik Negeri Batam';
    const cleanJabatan = (userData.jabatan && userData.jabatan.trim()) ? userData.jabatan.trim() : 'Mahasiswa / Staf';
    const cleanTelepon = (userData.telepon && userData.telepon.trim()) ? userData.telepon.trim() : '-';
    const cleanEmail = userData.email ? userData.email.trim().toLowerCase() : '';
    const cleanNimNik = userData.nimNik ? userData.nimNik.trim() : '';
    const generatedCardId = cleanName.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `user-${Date.now()}`;

    const newUser = {
      id: newId,
      namaLengkap: cleanName,
      nimNik: cleanNimNik,
      email: cleanEmail,
      instansi: cleanInstansi,
      jabatan: cleanJabatan,
      telepon: cleanTelepon,
      role: userData.role === 'Admin' ? 'Admin' : 'Pengguna Terdaftar',
      status: userData.status || 'Aktif',
      tanggalDibuat: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      cardId: generatedCardId,
      totalKartu: 1,
      terakhirAktif: 'Belum pernah login'
    };

    const updatedUsers = [newUser, ...users];
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updatedUsers));

    // Also register user's business card into smart_card_all_cards
    try {
      const allCardsRaw = localStorage.getItem('smart_card_all_cards');
      const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
      const newCardEntry = {
        id: generatedCardId,
        namaLengkap: cleanName,
        nimNik: cleanNimNik,
        instansi: cleanInstansi,
        jabatan: cleanJabatan,
        telepon: cleanTelepon,
        email: cleanEmail,
        instagram: '',
        linkedin: '',
        portofolio: '',
        bio: `${cleanName} merupakan civitas di ${cleanInstansi} sebagai ${cleanJabatan}.`,
        photoUrl: ''
      };
      allCards[generatedCardId] = newCardEntry;
      localStorage.setItem('smart_card_all_cards', JSON.stringify(allCards));
    } catch (e) {
      console.warn('Could not sync card to smart_card_all_cards:', e);
    }

    // Append activity log automatically
    addActivityLog({
      aktor: 'Admin Sistem',
      email: 'admin@gmail.com',
      kategori: 'Akun Pengguna',
      aksi: `Menambahkan akun pengguna terdaftar baru: ${newUser.namaLengkap} (${newUser.email})`,
      status: 'Sukses',
      statusClass: 'log-success',
      perangkat: 'Admin Panel'
    });

    return newUser;
  } catch (e) {
    console.error('Error adding user:', e);
    return null;
  }
};

// Toggle user status (FR-13: mengaktifkan atau menonaktifkan akun)
export const toggleUserStatus = (userId) => {
  initAdminStorage();
  try {
    const users = getAdminUsers();
    let targetUser = null;

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const newStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        targetUser = { ...u, status: newStatus };
        return targetUser;
      }
      return u;
    });

    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updatedUsers));

    if (targetUser) {
      const isNowActive = targetUser.status === 'Aktif';
      addActivityLog({
        aktor: 'Admin Sistem',
        email: 'admin@gmail.com',
        kategori: 'Akses Akun',
        aksi: isNowActive
          ? `Mengaktifkan kembali akses akun pengguna: ${targetUser.namaLengkap} (${targetUser.email})`
          : `Menonaktifkan akses akun pengguna: ${targetUser.namaLengkap} (${targetUser.email})`,
        status: isNowActive ? 'Sukses' : 'Peringatan',
        statusClass: isNowActive ? 'log-success' : 'log-warning',
        perangkat: 'Admin Panel'
      });
    }

    return targetUser;
  } catch (e) {
    console.error('Error toggling user status:', e);
    return null;
  }
};

// Update existing user (FR-13)
export const updateAdminUser = (userId, updatedFields) => {
  initAdminStorage();
  try {
    const users = getAdminUsers();
    let updatedUser = null;

    const updatedList = users.map((u) => {
      if (u.id === userId) {
        const cleanName = updatedFields.namaLengkap ? updatedFields.namaLengkap.trim() : u.namaLengkap;
        const newCardId = cleanName.toLowerCase().trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || u.cardId || `user-${Date.now()}`;

        updatedUser = {
          ...u,
          ...updatedFields,
          namaLengkap: cleanName,
          cardId: newCardId
        };
        return updatedUser;
      }
      return u;
    });

    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updatedList));

    if (updatedUser) {
      // Sync changes to smart_card_all_cards
      try {
        const allCardsRaw = localStorage.getItem('smart_card_all_cards');
        const allCards = allCardsRaw ? JSON.parse(allCardsRaw) : {};
        const oldCardId = updatedUser.cardId;
        const existingCard = allCards[oldCardId] || {};

        const updatedCard = {
          ...existingCard,
          id: updatedUser.cardId,
          namaLengkap: updatedUser.namaLengkap,
          nimNik: updatedUser.nimNik || '',
          instansi: updatedUser.instansi,
          jabatan: updatedUser.jabatan,
          telepon: updatedUser.telepon,
          email: updatedUser.email,
          bio: existingCard.bio || `${updatedUser.namaLengkap} merupakan civitas di ${updatedUser.instansi} sebagai ${updatedUser.jabatan}.`
        };

        allCards[updatedUser.cardId] = updatedCard;
        localStorage.setItem('smart_card_all_cards', JSON.stringify(allCards));

        // If the current logged-in user profile in localStorage matches this user, sync it as well
        const currentProfileRaw = localStorage.getItem('smart_card_user_profile');
        if (currentProfileRaw) {
          const currentProfile = JSON.parse(currentProfileRaw);
          if (currentProfile.email === updatedUser.email || currentProfile.id === oldCardId || currentProfile.id === updatedUser.cardId) {
            localStorage.setItem('smart_card_user_profile', JSON.stringify({
              ...currentProfile,
              ...updatedCard
            }));
          }
        }
      } catch (err) {
        console.warn('Error syncing updated user card in directory:', err);
      }

      addActivityLog({
        aktor: 'Admin Sistem',
        email: 'admin@gmail.com',
        kategori: 'Akun Pengguna',
        aksi: `Memperbarui rincian profil pengguna terdaftar: ${updatedUser.namaLengkap}`,
        status: 'Sukses',
        statusClass: 'log-success',
        perangkat: 'Admin Panel'
      });
    }

    return updatedUser;
  } catch (e) {
    console.error('Error updating user:', e);
    return null;
  }
};

// Delete user
export const deleteAdminUser = (userId) => {
  initAdminStorage();
  try {
    const users = getAdminUsers();
    const userToDelete = users.find((u) => u.id === userId);
    const filteredUsers = users.filter((u) => u.id !== userId);

    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(filteredUsers));

    if (userToDelete) {
      addActivityLog({
        aktor: 'Admin Sistem',
        email: 'admin@gmail.com',
        kategori: 'Akun Pengguna',
        aksi: `Menghapus akun pengguna terdaftar: ${userToDelete.namaLengkap} (${userToDelete.email})`,
        status: 'Peringatan',
        statusClass: 'log-warning',
        perangkat: 'Admin Panel'
      });
    }

    return true;
  } catch (e) {
    console.error('Error deleting user:', e);
    return false;
  }
};

// Check if user is active (Used in Login validation)
export const isUserAccountActive = (email) => {
  initAdminStorage();
  const users = getAdminUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    return found.status === 'Aktif';
  }
  return true; // default allow demo if not specifically configured
};

// Get activity logs (FR-14)
export const getActivityLogs = () => {
  initAdminStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_ACTIVITY_LOGS;
  } catch (e) {
    console.error('Error getting activity logs:', e);
    return INITIAL_ACTIVITY_LOGS;
  }
};

// Add new activity log
export const addActivityLog = (logItem) => {
  initAdminStorage();
  try {
    const logs = getActivityLogs();
    const now = new Date();
    const timeFormatted = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeFormatted,
      aktor: logItem.aktor || 'Sistem',
      email: logItem.email || '-',
      kategori: logItem.kategori || 'Sistem',
      aksi: logItem.aksi || 'Aktivitas tercatat',
      status: logItem.status || 'Sukses',
      statusClass: logItem.statusClass || 'log-success',
      ip: logItem.ip || '127.0.0.1',
      perangkat: logItem.perangkat || navigator.userAgent.split('(')[0] || 'Web Browser'
    };

    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify(updated));
    return newLog;
  } catch (e) {
    console.error('Error saving activity log:', e);
    return null;
  }
};

// Clear activity logs
export const clearActivityLogs = () => {
  localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify([]));
  return [];
};

// Admin Profile
export const getAdminProfile = () => {
  initAdminStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_ADMIN_PROFILE;
  } catch (_e) {
    return DEFAULT_ADMIN_PROFILE;
  }
};

export const updateAdminProfile = (data) => {
  initAdminStorage();
  const updated = { ...getAdminProfile(), ...data };
  localStorage.setItem(STORAGE_KEY_ADMIN_PROFILE, JSON.stringify(updated));
  return updated;
};

// Centralized statistics for FR-14
export const getAdminStatistics = () => {
  const users = getAdminUsers();
  const logs = getActivityLogs();
  
  const totalPengguna = users.length;
  const penggunaAktif = users.filter(u => u.status === 'Aktif').length;
  const penggunaNonaktif = users.filter(u => u.status === 'Nonaktif').length;
  const totalAktivitas = logs.length;

  return {
    totalPengguna,
    penggunaAktif,
    penggunaNonaktif,
    totalAktivitas,
    totalKartuDigital: totalPengguna, // each active internal user has their digital card
    totalInteraksiPRM: 7
  };
};

// Change registered user password (FR-PRM-Password)
export const changeUserPassword = (userEmail, oldPassword, newPassword) => {
  initAdminStorage();
  try {
    const users = getAdminUsers();
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const userIndex = users.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, message: 'Akun pengguna tidak ditemukan dalam database.' };
    }

    const targetUser = users[userIndex];
    // Current valid password: customPassword if set, otherwise nimNik or 'pbljaya'
    const expectedPassword = targetUser.customPassword || targetUser.nimNik || 'pbljaya';

    if (oldPassword.trim() !== expectedPassword.trim() && oldPassword.trim() !== 'pbljaya') {
      return { success: false, message: 'Kata sandi lama yang Anda masukkan tidak sesuai.' };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
    }

    users[userIndex] = {
      ...targetUser,
      customPassword: newPassword.trim(),
      passwordChangedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(users));

    // Append security activity log
    addActivityLog({
      aktor: targetUser.namaLengkap,
      email: cleanEmail,
      kategori: 'Keamanan Akun',
      aksi: `Pengguna berhasil memperbarui kata sandi mandiri (${cleanEmail})`,
      status: 'Sukses',
      statusClass: 'log-success',
      perangkat: 'Profile Security'
    });

    return { success: true, message: 'Kata sandi berhasil diperbarui! Silakan gunakan kata sandi baru untuk login selanjutnya.' };
  } catch (err) {
    console.error('Error changing user password:', err);
    return { success: false, message: 'Terjadi kesalahan sistem saat memperbarui kata sandi.' };
  }
};

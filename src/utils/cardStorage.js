// Utility for managing Business Card data, QR Code, PRM appointments, and PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DEFAULT_CARD = {
  id: 'aprillia-bunga',
  namaLengkap: 'Aprillia Bunga Lestari',
  instansi: 'Politeknik Negeri Batam',
  jabatan: 'Informatics Engineering Student',
  telepon: '+62 812-3478-010',
  email: 'bungaa.123@gmail.com',
  instagram: 'aprilliabunga',
  linkedin: 'aprillia-bunga-lestari',
  portofolio: 'https://github.com/aprilliabunga',
  bio: 'Passionate Informatics Engineering student focusing on full-stack web development, intelligent business cards, and modern digital ecosystems.',
  photoUrl: ''
};

const STORAGE_KEY_USER_CARD = 'smart_card_user_profile';
const STORAGE_KEY_ALL_CARDS = 'smart_card_all_cards';
const STORAGE_KEY_APPOINTMENTS = 'smart_card_appointments';

// Initialize storage with default data if empty
export const initCardStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_USER_CARD)) {
    localStorage.setItem(STORAGE_KEY_USER_CARD, JSON.stringify(DEFAULT_CARD));
  }
  if (!localStorage.getItem(STORAGE_KEY_ALL_CARDS)) {
    const initialDirectory = {
      [DEFAULT_CARD.id]: DEFAULT_CARD,
      'budi-santoso': {
        id: 'budi-santoso',
        namaLengkap: 'Budi Santoso, M.Kom',
        instansi: 'PT Inovasi Digital Nusantara',
        jabatan: 'Chief Technology Officer (CTO)',
        telepon: '+62 812-9876-5432',
        email: 'budi.santoso@inovasidigital.id',
        instagram: 'budisantoso_tech',
        linkedin: 'budi-santoso-cto',
        portofolio: 'https://budisantoso.dev',
        bio: 'Tech executive with 10+ years expertise in scalable enterprise cloud architecture and digital transformation.',
        photoUrl: ''
      }
    };
    localStorage.setItem(STORAGE_KEY_ALL_CARDS, JSON.stringify(initialDirectory));
  }
};

// Retrieve currently logged-in user profile
export const getUserCard = () => {
  initCardStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER_CARD);
    return data ? JSON.parse(data) : DEFAULT_CARD;
  } catch (e) {
    console.error('Error getting user card:', e);
    return DEFAULT_CARD;
  }
};

// Save user card profile
export const saveUserCard = (cardData) => {
  initCardStorage();
  try {
    const existing = getUserCard();
    let resolvedId = cardData.id || existing.id;
    if (cardData.namaLengkap && cardData.namaLengkap.trim()) {
      const generatedSlug = cardData.namaLengkap.toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (generatedSlug) {
        resolvedId = generatedSlug;
      }
    }
    if (!resolvedId) resolvedId = 'aprillia-bunga';

    const updated = {
      ...existing,
      ...cardData,
      id: resolvedId
    };
    localStorage.setItem(STORAGE_KEY_USER_CARD, JSON.stringify(updated));

    // Also persist into card directory
    const allCards = getAllCards();
    allCards[updated.id] = updated;
    localStorage.setItem(STORAGE_KEY_ALL_CARDS, JSON.stringify(allCards));

    return updated;
  } catch (e) {
    console.error('Error saving user card:', e);
    return cardData;
  }
};

// Get all card profiles
export const getAllCards = () => {
  initCardStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEY_ALL_CARDS);
    return data ? JSON.parse(data) : { [DEFAULT_CARD.id]: DEFAULT_CARD };
  } catch (e) {
    console.error('Error getting all cards:', e);
    return { [DEFAULT_CARD.id]: DEFAULT_CARD };
  }
};

// Get card profile by ID
export const getCardById = (id) => {
  initCardStorage();
  const allCards = getAllCards();
  if (id && allCards[id]) {
    return allCards[id];
  }
  const userCard = getUserCard();
  if (userCard.id === id || !id || id === 'default') {
    return userCard;
  }

  // Lookup in admin registered users
  try {
    const rawAdminUsers = localStorage.getItem('smart_card_admin_registered_users');
    if (rawAdminUsers) {
      const adminUsers = JSON.parse(rawAdminUsers);
      const match = adminUsers.find(u => u.cardId === id || u.id === id);
      if (match) {
        return {
          id: match.cardId || id,
          namaLengkap: match.namaLengkap,
          nimNik: match.nimNik || '',
          instansi: match.instansi || 'Politeknik Negeri Batam',
          jabatan: match.jabatan || 'Civitas Akademika',
          telepon: match.telepon || '-',
          email: match.email || '',
          instagram: '',
          linkedin: '',
          portofolio: '',
          bio: `${match.namaLengkap} merupakan civitas di ${match.instansi || 'Politeknik Negeri Batam'} sebagai ${match.jabatan || 'Civitas Akademika'}.`,
          photoUrl: ''
        };
      }
    }
  } catch (err) {
    console.warn('Error matching admin user for card:', err);
  }

  return {
    ...DEFAULT_CARD,
    id: id || 'aprillia-bunga'
  };
};

// Check if currently viewing own card
export const isUserOwnCard = (cardId) => {
  const userCard = getUserCard();
  return !cardId || cardId === 'default' || cardId === userCard.id;
};

// Generate and trigger download of vCard (.vcf)
export const downloadVCard = (card) => {
  const vcardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.namaLengkap || 'Contact Name'}`,
    `ORG:${card.instansi || ''}`,
    `TITLE:${card.jabatan || ''}`,
    `TEL;TYPE=CELL:${card.telepon || ''}`,
    `EMAIL;TYPE=INTERNET:${card.email || ''}`,
    `URL:${card.portofolio || ''}`,
    `NOTE:${card.bio || ''}`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(card.namaLengkap || 'contact').replace(/\s+/g, '_')}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export digital business card as high quality PDF (Standard 3.5 x 2 inch card or A4 printable)
export const exportCardToPDF = async (elementId, card) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export:', elementId);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    // Standard business card aspect ratio 85mm x 55mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 85, 55, undefined, 'FAST');
    const fileName = `${(card?.namaLengkap || 'Smart_Business_Card').replace(/\s+/g, '_')}_Card.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
};

// PRM Appointment Management
export const saveAppointment = (appointmentData) => {
  initCardStorage();
  try {
    const currentList = getStoredAppointments();
    const newAppointment = {
      id: `PRM-${Date.now().toString().slice(-4)}`,
      permintaan: `Appointment request: ${appointmentData.alasan?.slice(0, 45) || 'Business Discussion'}...`,
      tujuan: appointmentData.targetNama || 'Card Owner',
      pemohon: appointmentData.namaLengkap,
      perusahaanPemohon: appointmentData.perusahaan,
      jabatanPemohon: appointmentData.jabatan,
      emailPemohon: appointmentData.email,
      teleponPemohon: appointmentData.telepon,
      date: appointmentData.tanggal || new Date().toLocaleDateString('en-US'),
      jam: appointmentData.jam || '10:00 AM',
      alasanLengkap: appointmentData.alasan,
      status: 'Pending Confirmation',
      statusClass: 'status-ulang',
      createdAt: new Date().toISOString()
    };
    const updated = [newAppointment, ...currentList];
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
    return newAppointment;
  } catch (e) {
    console.error('Error saving appointment:', e);
    return null;
  }
};

export const getStoredAppointments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting appointments:', e);
    return [];
  }
};

// Update appointment status with decision reason and email log
export const updateAppointmentStatus = (id, status, alasanRespon = '', catatanTambahan = '') => {
  initCardStorage();
  try {
    const list = getStoredAppointments();
    let updatedItem = null;
    const statusClass = status === 'Accepted' || status === 'Disetujui' 
      ? 'status-selesai' 
      : status === 'Declined' || status === 'Ditolak' 
        ? 'status-ditolak' 
        : 'status-ulang';

    const updatedList = list.map(item => {
      if (item.id === id) {
        const notifEmail = {
          sentTo: item.emailPemohon || 'external@partner.com',
          status: status,
          alasan: alasanRespon,
          catatan: catatanTambahan,
          sentAt: new Date().toISOString()
        };

        updatedItem = {
          ...item,
          status,
          statusClass,
          alasanRespon,
          catatanTambahan,
          emailNotifikasi: notifEmail,
          updatedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updatedList));
    return updatedItem;
  } catch (e) {
    console.error('Error updating appointment status:', e);
    return null;
  }
};

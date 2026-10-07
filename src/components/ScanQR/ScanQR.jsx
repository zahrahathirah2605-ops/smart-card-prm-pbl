import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import './ScanQR.css';

const ScanQR = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = (result) => {
    // Cegah eksekusi berulang jika sedang mengarahkan halaman
    if (!result || result.length === 0 || isProcessing) return;

    const rawValue = result[0]?.rawValue;
    if (!rawValue) return;

    setIsProcessing(true);

    try {
      // 1. Cek apakah rawValue berupa URL lengkap (dimulai dengan http:// atau https://)
      if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
        const parsedUrl = new URL(rawValue);

        // Hanya izinkan navigasi jika domain cocok dengan website Anda
        if (parsedUrl.origin === window.location.origin) {
          navigate(parsedUrl.pathname + parsedUrl.search);
        } else {
          // Jika URL mengarah ke domain luar yang tidak dikenal
          setError('QR Code merujuk ke domain eksternal yang tidak dikenal.');
          setIsProcessing(false);
        }
      }
      // 2. Jika rawValue sudah diawali dengan path internal (misal: "/card/123")
      else if (rawValue.startsWith('/card/')) {
        navigate(rawValue);
      }
      // 3. Jika rawValue hanya berupa ID (misal: "CARD-12345" atau "123")
      else {
        // Sanitasi sederhana: bersihkan karakter berbahaya untuk URL
        const cleanId = encodeURIComponent(rawValue.trim());
        navigate(`/card/${cleanId}`);
      }
    } catch (err) {
      console.error('QR Parsing Error:', err);
      setError('Format QR Code tidak valid.');
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
  };

  return (
    <div className="scan-qr-container">
      {/* Top Navbar */}
      <header className="scan-navbar">
        <div className="navbar-content">
          <div className="logo" onClick={() => navigate('/')}>Logo</div>
          <button className="login-link" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="scan-main-content">
        <h1 className="scan-title">Silakan Scan Kartu Nama Digital Disini</h1>
        <p className="scan-subtitle">
          Arahkan kamera ke QR kartu nama digital untuk melihat profil pengguna terdaftar.
        </p>

        <div className="scan-card">
          <div className="scanner-wrapper">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              paused={isProcessing} // Hentikan scan jika sedang memproses navigasi
              components={{
                audio: false,
                finder: true
              }}
            />
          </div>
          {error && <p className="scan-error">{error}</p>}
          <p className="scan-instruction">Arahkan QR kartu nama ke area pemindaian</p>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
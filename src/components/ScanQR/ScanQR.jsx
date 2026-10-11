import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import Navbar from '../Navbar/Navbar';
import { getUserCard } from '../../utils/cardStorage';
import './ScanQR.css';

const ScanQR = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const processScannedValue = (rawValue) => {
    if (!rawValue) return;
    setIsProcessing(true);
    setError(null);

    try {
      const trimmed = rawValue.trim();

      // Full URL handling
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const parsedUrl = new URL(trimmed);

        if (parsedUrl.pathname.startsWith('/card/')) {
          navigate(parsedUrl.pathname + parsedUrl.search);
          return;
        }

        if (parsedUrl.origin === window.location.origin) {
          navigate(parsedUrl.pathname + parsedUrl.search);
          return;
        }

        window.location.href = trimmed;
      }
      // Internal card path
      else if (trimmed.startsWith('/card/')) {
        navigate(trimmed);
      }
      // Raw card identifier
      else {
        const cleanId = encodeURIComponent(trimmed);
        navigate(`/card/${cleanId}`);
      }
    } catch (err) {
      console.error('QR Parsing Error:', err);
      setError('Invalid QR Code data format.');
      setIsProcessing(false);
    }
  };

  const handleScan = (result) => {
    if (!result || result.length === 0 || isProcessing) return;
    const rawValue = result[0]?.rawValue;
    if (rawValue) {
      processScannedValue(rawValue);
    }
  };

  const handleError = (err) => {
    console.warn('Camera scan notice:', err);
    setError('Camera permission is unavailable or blocked. Please grant camera access, or use the Quick Test simulation below.');
  };

  const handleTestScan = (cardId) => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate(`/card/${cardId}`);
    }, 400);
  };

  const currentCard = getUserCard();

  return (
    <div className="scan-qr-container">
      {/* Unified Navbar */}
      <Navbar active="prm" />

      {/* Main Content */}
      <div className="scan-main-content">
        <h1 className="scan-title">Scan Digital Business Card</h1>
        <p className="scan-subtitle">
          Point your device camera at a partner's Smart Card QR code to view their digital credentials and schedule an appointment.
        </p>

        <div className="scan-card">
          <div className="scanner-wrapper">
            {cameraActive && (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                paused={isProcessing}
                components={{
                  audio: false,
                  finder: true,
                }}
              />
            )}
            {isProcessing && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(18, 65, 125, 0.9)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                zIndex: 10
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  QR Code Detected! ✓
                </div>
                <div style={{ fontSize: '0.85rem' }}>Opening digital business card...</div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              width: '100%'
            }}>
              <p className="scan-error" style={{ margin: 0, color: '#e11d48', fontSize: '0.85rem' }}>
                {error}
              </p>
            </div>
          )}

          <p className="scan-instruction">
            Align the QR code within the target frame to scan
          </p>

          {/* Quick Simulation Options */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0',
            width: '100%',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
              Instant Test Simulation (No Camera Required):
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleTestScan('budi-santoso')}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--primary, #12417D)',
                  background: 'var(--primary, #12417D)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Scan Partner: Budi Santoso (CTO)
              </button>

              <button
                onClick={() => handleTestScan(currentCard.id || 'aprillia-bunga')}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Scan: My Own Card ({currentCard.namaLengkap.split(' ')[0]})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
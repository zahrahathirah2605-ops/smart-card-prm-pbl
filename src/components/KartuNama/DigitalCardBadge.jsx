import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './DigitalCardBadge.css';

const DigitalCardBadge = ({ card, qrUrl, elementId = 'printable-card' }) => {
  const getInitials = (name) => {
    if (!name) return 'SC';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div id={elementId} className="business-card-canvas">
      {/* Background Decorative Accents */}
      <div className="card-bg-gradient"></div>
      <div className="card-shape-circle top-right"></div>
      <div className="card-shape-circle bottom-left"></div>

      {/* Card Header Brand: Logo Poltek & Tulisan Politeknik Negeri Batam */}
      <div className="card-top-poltek-header">
        <div className="card-top-poltek-brand">
          <img
            src="/src/assets/logo-poltek-putih.png"
            alt="Politeknik Negeri Batam"
            className="card-poltek-logo-img"
          />
          <div className="card-poltek-text-block">
            <span className="card-poltek-univ-name">POLITEKNIK NEGERI BATAM</span>
            <span className="card-poltek-univ-tag">Official Smart Business Card</span>
          </div>
        </div>
        <div className="card-brand-tag">
          <span className="brand-dot"></span>
          SMART CARD
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="card-inner-grid">
        {/* Left Column: Avatar */}
        <div className="card-left-identity">
          <div className="card-photo-wrapper">
            {card?.photoUrl ? (
              <img src={card.photoUrl} alt={card?.namaLengkap} className="card-avatar-image" />
            ) : (
              <div className="card-avatar-initials">
                {getInitials(card?.namaLengkap)}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Details (Name, Role, Company, Contacts) */}
        <div className="card-details-section">
          <div className="card-header-info">
            <h2 className="card-owner-name">{card?.namaLengkap || 'Aprillia Bunga Lestari'}</h2>
            <p className="card-owner-role">{card?.jabatan || 'Professional'}</p>
            <p className="card-owner-org">{card?.instansi || 'Organization'}</p>
          </div>

          <div className="card-divider-line"></div>

          <div className="card-contacts-grid">
            {card?.telepon && (
              <div className="contact-row">
                <span className="icon-badge">📞</span>
                <span className="contact-text">{card.telepon}</span>
              </div>
            )}
            {card?.email && (
              <div className="contact-row">
                <span className="icon-badge">✉️</span>
                <span className="contact-text">{card.email}</span>
              </div>
            )}
            {card?.twitterX && (
              <div className="contact-row">
                <span className="icon-badge">𝕏</span>
                <span className="contact-text">{card.twitterX.startsWith('@') ? card.twitterX : `@${card.twitterX}`}</span>
              </div>
            )}
            {card?.facebook && (
              <div className="contact-row">
                <span className="icon-badge">🌐</span>
                <span className="contact-text">fb/{card.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}</span>
              </div>
            )}
            {card?.linkedin && (
              <div className="contact-row">
                <span className="icon-badge">💼</span>
                <span className="contact-text">in/{card.linkedin}</span>
              </div>
            )}
            {card?.portofolio && (
              <div className="contact-row">
                <span className="icon-badge">🌐</span>
                <span className="contact-text">{card.portofolio.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scannable QR Code & Instructions */}
        <div className="card-qr-section">
          <div className="card-qr-frame">
            <QRCodeSVG
              value={qrUrl || `${window.location.origin}/card/${card?.id || 'aprillia-bunga'}`}
              size={100}
              level="M"
              includeMargin={false}
              fgColor="#0F172A"
              bgColor="#ffffff"
            />
          </div>
          <span className="qr-caption">SCAN TO CONNECT</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalCardBadge;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import PublicNavbar from '../Navbar/PublicNavbar';
import Footer from '../Footer/Footer';
import DigitalCardBadge from '../KartuNama/DigitalCardBadge';
import { getCardById, getUserCard, downloadVCard, isUserOwnCard, exportCardToPDF } from '../../utils/cardStorage';
import './PublicCard.css';

const PublicCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const cardData = getCardById(id);
    setCard(cardData);
  }, [id]);

  if (!card) {
    return (
      <div className="public-card-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading digital business card...</p>
      </div>
    );
  }

  // STRICT CHECK: Visitor is ONLY considered "self" if:
  // 1. User is actually logged in as 'user'
  // 2. The ID matches their own user profile ID
  // Anyone scanning a partner (e.g. budi-santoso) or an external card is NOT self
  const loggedRole = localStorage.getItem('smart_card_logged_role');
  const userProfile = getUserCard();
  const isSelf = loggedRole === 'user' && (id === userProfile.id);

  const handleDownloadContact = () => {
    downloadVCard(card);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await exportCardToPDF('public-card-badge-target', card);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const currentUrl = window.location.href;

  return (
    <div className="public-card-page">
      {/* If viewing own card as logged-in user, use User Navbar. Otherwise, always show clean PublicNavbar */}
      {isSelf ? <Navbar active="card" /> : <PublicNavbar active="card" hideScanAction={true} />}

      {/* Main Content */}
      <div className="card-main-content">
        <div className="page-header-container">
          <span className="verification-badge">
            ✓ Verified Digital Smart Card
          </span>
          <h1 className="page-title">Digital Business Card</h1>
          <p className="page-subtitle">
            {isSelf ? (
              <>This is your official business card as seen by your partners and contacts.</>
            ) : (
              <>Official business profile of <strong>{card.namaLengkap}</strong> from {card.instansi}.</>
            )}
          </p>
        </div>

        {/* Realistic Business Card Showcase */}
        <div className="preview-showcase-wrapper">
          <DigitalCardBadge card={card} qrUrl={currentUrl} elementId="public-card-badge-target" />
        </div>

        {/* Action Panel */}
        <div className="card-details-panel">
          <div className="panel-grid">
            {/* Left Column: Bio & Organization */}
            <div className="panel-bio-box">
              <h3 className="panel-subheading">About & Bio</h3>
              <p className="bio-description">
                {card.bio || `${card.namaLengkap} is currently at ${card.instansi} as ${card.jabatan}. Open for networking, collaborations, and discussions.`}
              </p>

              <div className="company-badge-box">
                <div className="company-icon">🏢</div>
                <div>
                  <h4 className="company-name">{card.instansi || 'Independent'}</h4>
                  <p className="company-role">{card.jabatan || 'Member'}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Connect & Action Buttons */}
            <div className="panel-contacts-box">
              <h3 className="panel-subheading">Connect Directly</h3>

              <div className="contact-actions-list">
                {card.telepon && (
                  <a href={`tel:${card.telepon}`} className="action-contact-card">
                    <span className="contact-icon">📞</span>
                    <div className="contact-info-col">
                      <span className="contact-type">Phone / WhatsApp</span>
                      <span className="contact-val">{card.telepon}</span>
                    </div>
                    <span className="contact-arrow">Call ↗</span>
                  </a>
                )}

                {card.email && (
                  <a href={`mailto:${card.email}`} className="action-contact-card">
                    <span className="contact-icon">✉️</span>
                    <div className="contact-info-col">
                      <span className="contact-type">Email Address</span>
                      <span className="contact-val">{card.email}</span>
                    </div>
                    <span className="contact-arrow">Email ↗</span>
                  </a>
                )}

                {card.twitterX && (
                  <a
                    href={card.twitterX.startsWith('http') ? card.twitterX : `https://x.com/${card.twitterX.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-contact-card"
                  >
                    <span className="contact-icon">𝕏</span>
                    <div className="contact-info-col">
                      <span className="contact-type">X / Twitter</span>
                      <span className="contact-val">{card.twitterX.startsWith('@') ? card.twitterX : `@${card.twitterX}`}</span>
                    </div>
                    <span className="contact-arrow">Follow ↗</span>
                  </a>
                )}

                {card.facebook && (
                  <a
                    href={card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-contact-card"
                  >
                    <span className="contact-icon">🌐</span>
                    <div className="contact-info-col">
                      <span className="contact-type">Facebook</span>
                      <span className="contact-val">{card.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}</span>
                    </div>
                    <span className="contact-arrow">View ↗</span>
                  </a>
                )}

                {card.linkedin && (
                  <a
                    href={card.linkedin.startsWith('http') ? card.linkedin : `https://linkedin.com/in/${card.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-contact-card"
                  >
                    <span className="contact-icon">💼</span>
                    <div className="contact-info-col">
                      <span className="contact-type">LinkedIn Profile</span>
                      <span className="contact-val">{card.linkedin}</span>
                    </div>
                    <span className="contact-arrow">Visit ↗</span>
                  </a>
                )}

                {card.portofolio && (
                  <a
                    href={card.portofolio.startsWith('http') ? card.portofolio : `https://${card.portofolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-contact-card"
                  >
                    <span className="contact-icon">🌐</span>
                    <div className="contact-info-col">
                      <span className="contact-type">Portfolio / Website</span>
                      <span className="contact-val">{card.portofolio.replace(/^https?:\/\//, '')}</span>
                    </div>
                    <span className="contact-arrow">Explore ↗</span>
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bottom-action-buttons">
                {/* PDF Card Download: ONLY accessible to logged-in internal users */}
                {loggedRole ? (
                  <button
                    className="btn-primary-action"
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    title="Unduh kartu nama resmi sebagai dokumen PDF (Akses Internal)"
                  >
                    {isExporting ? '⏳ Exporting...' : '📄 Download PDF Card'}
                  </button>
                ) : null}

                {/* Save Contact (vCard): Standard public action for saving contact to phone/PC */}
                <button
                  className="btn-outline-action"
                  onClick={handleDownloadContact}
                  title="Simpan kontak langsung (.vcf) ke kontak telepon atau komputer"
                >
                  📥 Save Contact (vCard)
                </button>

                {/* CRITICAL: "Schedule Appointment" ONLY shown for external visitors / NOT own card */}
                {!isSelf ? (
                  <button
                    className="btn-accent-appointment"
                    onClick={() => navigate(`/janji-temu/${card.id || id}`)}
                  >
                    📅 Schedule Appointment (PRM)
                  </button>
                ) : (
                  <button
                    className="btn-outline-action edit-shortcut"
                    onClick={() => navigate('/kartu-nama')}
                  >
                    ✏️ Edit My Card Details
                  </button>
                )}
              </div>

              {savedSuccess && (
                <div className="success-toast">
                  ✓ Contact file ({card.namaLengkap}.vcf) downloaded successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default PublicCard;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import DigitalCardBadge from '../KartuNama/DigitalCardBadge';
import { getCardById, downloadVCard, isUserOwnCard, exportCardToPDF } from '../../utils/cardStorage';
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

  // Check whether the visitor is viewing their own card or someone else's scanned card
  const isSelf = isUserOwnCard(id || card.id);

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
      {/* Consistent Navbar */}
      <Navbar active="card" />

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
                {/* PDF Card Download */}
                <button
                  className="btn-primary-action"
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  title="Download standard business card as PDF"
                >
                  {isExporting ? '⏳ Exporting...' : '📄 Download PDF Card'}
                </button>

                {/* Save Contact (vCard) */}
                <button
                  className="btn-outline-action"
                  onClick={handleDownloadContact}
                  title="Save contact (.vcf) directly into phone or PC contacts"
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
    </div>
  );
};

export default PublicCard;

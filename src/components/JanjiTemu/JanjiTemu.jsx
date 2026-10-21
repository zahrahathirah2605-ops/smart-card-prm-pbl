import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import PublicNavbar from '../Navbar/PublicNavbar';
import Footer from '../Footer/Footer';
import { getCardById, saveAppointment, isUserOwnCard } from '../../utils/cardStorage';
import './JanjiTemu.css';

const JanjiTemu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    perusahaan: '',
    jabatan: '',
    email: '',
    telepon: '',
    tanggal: '',
    jam: '',
    alasan: '',
  });

  useEffect(() => {
    const cardData = getCardById(id);
    setCard(cardData);
  }, [id]);

  const isSelf = isUserOwnCard(id || card?.id);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;

    const saved = saveAppointment({
      ...formData,
      targetNama: card?.namaLengkap || 'Card Owner',
      targetId: card?.id || id
    });

    setSubmittedData(saved);
    setIsSubmitted(true);
  };

  return (
    <div className="jt-page">
      {/* If self previewing use Navbar, if external visitor use PublicNavbar without scan action */}
      {isSelf ? <Navbar active="prm" /> : <PublicNavbar active="prm" hideScanAction={true} />}

      {/* Main Container */}
      <main className="jt-main">
        {/* Back Link */}
        <button className="jt-back-link" onClick={() => navigate(`/card/${id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Digital Business Card {card?.namaLengkap ? `(${card.namaLengkap})` : ''}
        </button>

        {/* If user navigates to their own appointment page, inform them */}
        {isSelf && (
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
            <div>
              <strong>Notice:</strong> This appointment form is intended for external partners scanning your card.
              You are currently previewing how others request appointments with you.
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="jt-page-header">
          <h1 className="jt-title">Schedule an Appointment</h1>
          <p className="jt-subtitle">
            Connect and propose a meeting with <strong>{card?.namaLengkap || 'the card owner'}</strong> ({card?.instansi || 'Organization'}). Fill out your contact details and desired meeting agenda below.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {isSubmitted ? (
          <div className="jt-success-card">
            <div className="jt-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="jt-success-title">Appointment Request Submitted!</h2>
            <p className="jt-success-desc">
              Your meeting request for <strong>{card?.namaLengkap}</strong> has been successfully recorded in the PRM system.
              A status notification will be sent to <strong>{formData.email}</strong>.
            </p>

            {submittedData && (
              <div className="submitted-summary-box">
                <div className="summary-row">
                  <span className="summary-label">Reference ID:</span>
                  <span className="summary-val">{submittedData.id}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Requested Schedule:</span>
                  <span className="summary-val">{formData.tanggal} at {formData.jam}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Discussion Agenda:</span>
                  <span className="summary-val">{formData.alasan}</span>
                </div>
              </div>
            )}

            <div className="submitted-actions-row">
              <button className="jt-success-btn" onClick={() => navigate('/riwayat-prm')}>
                View PRM History
              </button>
              <button
                className="jt-success-btn outline"
                onClick={() => navigate(`/card/${id}`)}
              >
                Return to Card Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="jt-content-grid">
            {/* Left: Info Panel */}
            <div className="jt-info-panel">
              <div className="jt-info-card">
                <div className="jt-info-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="jt-info-title">Seamless meeting requests.</h3>
                <p className="jt-info-desc">
                  Propose meeting dates directly from this smart business card without requiring a login or account registration.
                </p>
              </div>

              {/* Steps */}
              <div className="jt-steps">
                <div className="jt-step">
                  <div className="jt-step-number">1</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Submit Details</h4>
                    <p className="jt-step-desc">Fill in your identity, preferred schedule, and meeting objectives.</p>
                  </div>
                </div>
                <div className="jt-step">
                  <div className="jt-step-number">2</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Partner Review</h4>
                    <p className="jt-step-desc">The card owner receives your request in their PRM system.</p>
                  </div>
                </div>
                <div className="jt-step">
                  <div className="jt-step-number">3</div>
                  <div className="jt-step-content">
                    <h4 className="jt-step-title">Email Notification</h4>
                    <p className="jt-step-desc">Receive confirmation and meeting invites via your email address.</p>
                  </div>
                </div>
              </div>

              <div className="jt-info-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <polyline points="9 11 12 14 22 4"></polyline>
                </svg>
                <span>Proposed times are suggestions subject to card owner approval.</span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="jt-form-panel">
              <form onSubmit={handleSubmit} className="jt-form">
                {/* Personal Information */}
                <div className="jt-section">
                  <div className="jt-section-header">
                    <h3 className="jt-section-title">Your Contact Information</h3>
                    <span className="jt-required-note">* Required</span>
                  </div>
                  <p className="jt-section-desc">Provide active credentials so the host can reach back to you.</p>

                  <div className="jt-field-full">
                    <label className="jt-label">Full Name <span className="jt-required">*</span></label>
                    <input
                      type="text"
                      name="namaLengkap"
                      className="jt-input"
                      placeholder="Enter your full name"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Organization / Company <span className="jt-required">*</span></label>
                      <input
                        type="text"
                        name="perusahaan"
                        className="jt-input"
                        placeholder="Company or institution name"
                        value={formData.perusahaan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Job Title / Position <span className="jt-required">*</span></label>
                      <input
                        type="text"
                        name="jabatan"
                        className="jt-input"
                        placeholder="Your current role"
                        value={formData.jabatan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Email Address <span className="jt-required">*</span></label>
                      <input
                        type="email"
                        name="email"
                        className="jt-input"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Phone / WhatsApp <span className="jt-required">*</span></label>
                      <input
                        type="tel"
                        name="telepon"
                        className="jt-input"
                        placeholder="+62 812-xxxx-xxxx"
                        value={formData.telepon}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="jt-section">
                  <h3 className="jt-section-title">Meeting Schedule & Objectives</h3>
                  <p className="jt-section-desc">Select desired date, time, and conversation topic.</p>

                  <div className="jt-field-row">
                    <div className="jt-field">
                      <label className="jt-label">Proposed Date <span className="jt-required">*</span></label>
                      <input
                        type="date"
                        name="tanggal"
                        className="jt-input"
                        value={formData.tanggal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="jt-field">
                      <label className="jt-label">Proposed Time <span className="jt-required">*</span></label>
                      <input
                        type="time"
                        name="jam"
                        className="jt-input"
                        value={formData.jam}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="jt-field-full">
                    <label className="jt-label">Meeting Purpose / Discussion Agenda <span className="jt-required">*</span></label>
                    <textarea
                      name="alasan"
                      className="jt-textarea"
                      placeholder="Explain what topics or opportunities you would like to discuss..."
                      rows="4"
                      value={formData.alasan}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Privacy & Terms */}
                <div className="jt-terms">
                  <label className="jt-checkbox-label">
                    <input
                      type="checkbox"
                      className="jt-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className="jt-checkbox-custom"></span>
                    <span className="jt-checkbox-text">
                      I agree that my contact information will only be used for this PRM meeting coordination.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="jt-submit-wrapper">
                  <button 
                    type="submit" 
                    className={`jt-submit-btn ${!agreeTerms ? 'jt-submit-disabled' : ''}`}
                    disabled={!agreeTerms}
                  >
                    Submit Appointment Request
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Global Campus Footer */}
      <Footer />
    </div>
  );
};

export default JanjiTemu;

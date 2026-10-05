import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './PublicCard.css';

const PublicCard = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: '', email: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Mock employee data
  const employee = {
    name: "Jane Doe",
    position: "Senior Marketing Manager",
    company: "SmartCard Corp",
    email: "jane.doe@smartcard.com",
    phone: "+62 812-3456-7890",
    website: "www.smartcard.com"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', date: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="public-card-container">
      <div className="glass-panel main-content">
        <h2 className="title-text">Profil Bisnis</h2>
        
        {/* Business Card Section */}
        <div className="card-preview">
          <div className="card-header">
            <div className="avatar">JD</div>
            <div className="card-title">
              <h3>{employee.name}</h3>
              <p>{employee.position}</p>
            </div>
          </div>
          <div className="card-body">
            <p><strong>Perusahaan:</strong> {employee.company}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Telepon:</strong> {employee.phone}</p>
            <p><strong>Website:</strong> {employee.website}</p>
          </div>
        </div>
        
        <div className="action-buttons no-print">
          <button className="primary-btn" onClick={handlePrint}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Simpan PDF
          </button>
        </div>

        {/* Appointment Form */}
        <div className="appointment-section no-print">
          <h3 className="section-subtitle">Buat Janji Temu</h3>
          {submitted ? (
            <div className="success-message">
              Permintaan janji temu berhasil dikirim!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label>Nama Anda</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Masukkan nama" />
              </div>
              <div className="form-group">
                <label>Email Anda</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Masukkan email" />
              </div>
              <div className="form-group">
                <label>Tanggal & Waktu</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Pesan / Keperluan</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" required placeholder="Tuliskan keperluan Anda..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Kirim Permintaan</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicCard;

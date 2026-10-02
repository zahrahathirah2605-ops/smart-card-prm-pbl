import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Mari Mulai</h2>
        <p className="auth-subtitle">Buat akun utama digitalmu</p>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="fullname">Nama Lengkap</label>
            <input type="text" id="fullname" placeholder="Masukkan nama lengkap Anda" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Masukkan email Anda" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input type="password" id="password" placeholder="Buat kata sandi" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Tulis Ulang Kata Sandi</label>
            <input type="password" id="confirmPassword" placeholder="Konfirmasi kata sandi" required />
          </div>
          
          <button type="submit" className="auth-submit-btn">Buat</button>
        </form>
        
        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

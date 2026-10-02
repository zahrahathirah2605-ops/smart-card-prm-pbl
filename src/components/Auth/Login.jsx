import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Masuk</h2>
        <p className="auth-subtitle">Silakan Masuk Pada Akun Anda</p>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Masukkan email Anda" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input type="password" id="password" placeholder="Masukkan kata sandi Anda" required />
          </div>
          
          <button type="submit" className="auth-submit-btn">Masuk</button>
        </form>
        
        <p className="auth-footer">
          Tidak Punya Akun? <Link to="/register">Silahkan Registrasi Disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

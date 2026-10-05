import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'dummy@gmail.com' && password === 'dummy123') {
      navigate('/home');
    } else {
      setError('Email atau password salah. Gunakan dummy@gmail.com / dummy123');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Masuk</h2>
        <p className="auth-subtitle">Silakan Masuk Pada Akun Anda</p>
        
        {error && <div className="auth-error" style={{ color: '#e53e3e', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', backgroundColor: '#fed7d7', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Masukkan email Anda" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Masukkan kata sandi Anda" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="auth-submit-btn">Masuk</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

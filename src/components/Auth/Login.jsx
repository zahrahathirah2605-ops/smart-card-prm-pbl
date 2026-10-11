import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'smart.card@gmail.com' && password === 'pbljaya') {
      navigate('/home');
    } else {
      setError('Invalid credentials. Use demo account: smart.card@gmail.com / pbljaya');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your SmartCard PRM account</p>

        {error && (
          <div className="auth-error" style={{ color: '#e53e3e', marginBottom: '1rem', fontSize: '0.88rem', textAlign: 'center', backgroundColor: '#fed7d7', padding: '0.6rem', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="smart.card@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            💡 Demo credentials: <strong>smart.card@gmail.com</strong> / <strong>pbljaya</strong>
          </div>

          <button type="submit" className="auth-submit-btn">Sign In to Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

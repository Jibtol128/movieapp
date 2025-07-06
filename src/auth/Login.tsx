import React, { useState } from 'react';
import { login } from './api';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const res = await login(identifier, password);
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
      setSuccess('');
    } else if (res.session && res.user) {
      doLogin(res.session.access_token, res.user);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError('Login failed.');
      setSuccess('');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">MovieApp</span>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your movie journey</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type="text" 
                  value={identifier} 
                  onChange={e => setIdentifier(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Email or Username</label>
                <div className="input-icon">👤</div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Password</label>
                <div className="input-icon">🔒</div>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? (
                <div className="loading-spinner">
                  <span className="spinner"></span>
                  Signing In...
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>

            {error && (
              <div className="auth-message error">
                <span className="message-icon">⚠️</span>
                {error}
              </div>
            )}
            {success && (
              <div className="auth-message success">
                <span className="message-icon">✅</span>
                {success}
              </div>
            )}
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Don't have an account? 
              <Link to="/register" className="auth-link">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

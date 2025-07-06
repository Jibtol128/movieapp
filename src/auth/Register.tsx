import React, { useState } from 'react';
import { register } from './api';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await register(email, password, { fullName, username });
      setLoading(false);
      
      if (res.error) {
        setError(res.error);
        setSuccess('');
      } else {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">MovieApp</span>
            </div>
            <h1 className="auth-title">Join the Community</h1>
            <p className="auth-subtitle">Create your account and start discovering amazing movies</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Full Name</label>
                <div className="input-icon">👤</div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Username</label>
                <div className="input-icon">@</div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Email Address</label>
                <div className="input-icon">📧</div>
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

            <div className="input-group">
              <div className="input-container">
                <input 
                  className="auth-input" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder=" "
                  required 
                />
                <label className="input-label">Confirm Password</label>
                <div className="input-icon">🔒</div>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? (
                <div className="loading-spinner">
                  <span className="spinner"></span>
                  Creating Account...
                </div>
              ) : (
                <>
                  <span>Create Account</span>
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
              Already have an account? 
              <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

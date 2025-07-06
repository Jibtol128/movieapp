import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector('.navbar');
      if (menuOpen && navbar && !navbar.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="logo-icon">🎬</span>
          MovieApp
        </Link>
        
        <button 
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`} 
          onClick={handleMenuToggle} 
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        
        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className={isActiveLink('/') ? 'active' : ''}
          >
            Home
          </Link>
          
          {token && (
            <Link 
              to="/favourites" 
              onClick={handleLinkClick}
              className={isActiveLink('/favourites') ? 'active' : ''}
            >
              Favourites
            </Link>
          )}
          
          {token && (
            <Link 
              to="/watchlist" 
              onClick={handleLinkClick}
              className={isActiveLink('/watchlist') ? 'active' : ''}
            >
              Watchlist
            </Link>
          )}
          
          {token && (
            <Link 
              to="/lists" 
              onClick={handleLinkClick}
              className={isActiveLink('/lists') ? 'active' : ''}
            >
              Custom Lists
            </Link>
          )}
          
          {token && (
            <Link 
              to="/profile" 
              onClick={handleLinkClick}
              className={isActiveLink('/profile') ? 'active' : ''}
            >
              Profile
            </Link>
          )}
          
          {token ? (
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={handleLinkClick}
                className={`login-link ${isActiveLink('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={handleLinkClick}
                className={`register-link ${isActiveLink('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
      {menuOpen && <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;

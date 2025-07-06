import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎬</span>
              <span className="footer-logo-text">MovieApp</span>
            </div>
            <p className="footer-description">
              Discover, rate, and track your favorite movies. Your ultimate companion for an amazing cinematic journey.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="YouTube">📺</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><a href="/">Popular Movies</a></li>
              <li><a href="/">Top Rated</a></li>
              <li><a href="/">New Releases</a></li>
              <li><a href="/">Coming Soon</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Features</h3>
            <ul className="footer-links">
              <li><a href="/favourites">My Favourites</a></li>
              <li><a href="/watchlist">My Watchlist</a></li>
              <li><a href="/">Rate Movies</a></li>
              <li><a href="/">Search & Filter</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2025 MovieApp. All rights reserved. Powered by TMDB API.
            </p>
            <div className="footer-credits">
              <span>Data provided by</span>
              <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="tmdb-link">
                <span className="tmdb-logo">🎭</span>
                TMDB
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

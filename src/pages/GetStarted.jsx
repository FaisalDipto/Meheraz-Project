import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GetStarted.css';
import logoImg from '../assets/logo1.png';
import titleImg from '../assets/title.png';

export default function GetStarted() {
  const navigate = useNavigate();

  const handleConnectFacebook = () => {
    navigate('/app/pricing');
  };

  return (
    <div className="get-started-container">
      {/* Left Panel - Sky Blue */}
      <div className="left-panel">
        <div className="left-panel-header">
          <Link to="/app" className="gs-logo-container">
            <img src={logoImg} alt="LYFFLOW Logo" style={{ height: '40px', width: 'auto' }} />
            <img src={titleImg} alt="LYFFLOW" style={{ height: '20px', width: 'auto', marginLeft: '8px' }} />
          </Link>
        </div>
        
        <div className="left-panel-content">
          <div className="graphic-placeholder">
            {/* We will add an aesthetic CSS graphic here */}
            <div className="colorful-shapes">
              <div className="shape shape-circle"></div>
              <div className="shape shape-star"></div>
              <div className="shape shape-blob"></div>
            </div>
          </div>
          <h1 className="left-title">Connect Instagram</h1>
          <p className="left-desc">Use your Instagram account to connect to LYFFLOW.</p>
        </div>

        <div className="left-panel-footer">
          <Link to="/app" className="back-link">&lt; Choose Another Channel</Link>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="right-panel">
        <div className="right-content">
          <h2 className="right-title">A few steps in</h2>
          <p className="right-desc">
            We'll take you to Meta to connect. Just set your permissions, and your Instagram account will be linked to LYFFLOW.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-sm mt-8 mb-8">
            <button className="btn-connect-meta flex items-center justify-center gap-3 w-full" onClick={handleConnectFacebook}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
              Connect Via Facebook
            </button>
            <button className="btn-connect-meta flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 border-none hover:opacity-90" onClick={() => alert("Instagram connection coming soon!")}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
              Connect Via Instagram
            </button>
          </div>

          <div className="trust-badge">
            <span className="trust-text">LYFFLOW is a trusted<br/>Meta Business Partner</span>
            <div className="meta-logo">
              <svg viewBox="0 0 36 20" fill="none" height="24" width="44"><path fill="#1C2B33" d="M29.5 0a6.5 6.5 0 0 0-5.6 3.3L22.2 6A8.5 8.5 0 1 0 8.5 6L6.8 3.3A6.5 6.5 0 1 0 0 6.5a6.5 6.5 0 0 0 5.6-3.3L7.3 6A8.5 8.5 0 0 0 22.2 6l1.7-2.7A6.5 6.5 0 1 0 29.5 0Zm0 10a3.5 3.5 0 1 1 3.5-3.5A3.5 3.5 0 0 1 29.5 10Zm-23 0A3.5 3.5 0 1 1 10 6.5 3.5 3.5 0 0 1 6.5 10Zm9-3.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"></path></svg>
              <span>Meta</span>
              <span className="partner-text">Business Partner</span>
            </div>
          </div>
          
          <div className="more-options-toggle">
            See More Options
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
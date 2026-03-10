import React from 'react';
import { Link } from 'react-router-dom';
import './GetStarted.css';

export default function GetStarted() {
  return (
    <div className="get-started-container">
      {/* Left Panel - Sky Blue */}
      <div className="left-panel">
        <div className="left-panel-header">
          <Link to="/" className="gs-logo-container">
            <div className="gs-logo-q">
              Q
              <div className="gs-logo-bubble"><div className="gs-logo-dot"></div><div className="gs-logo-dot"></div><div className="gs-logo-dot"></div></div>
            </div>
            <span className="gs-logo-text">chat</span>
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
          <p className="left-desc">Use your Instagram account to connect to Qchat.</p>
        </div>

        <div className="left-panel-footer">
          <Link to="/" className="back-link">&lt; Choose Another Channel</Link>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="right-panel">
        <div className="right-content">
          <h2 className="right-title">A few steps in</h2>
          <p className="right-desc">
            We'll take you to Meta to connect. Just set your permissions, and your Instagram account will be linked to Qchat.
          </p>
          
          <button className="btn-connect-meta">
            Connect Via Meta
          </button>

          <div className="trust-badge">
            <span className="trust-text">Qchat is a trusted<br/>Meta Business Partner</span>
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

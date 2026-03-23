import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import ChatWidget from './ChatWidget';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up">
            Automate Conversations <br/>
            on Facebook, Instagram <br/>
            & WhatsApp
          </h1>
          <p className="hero-description animate-fade-in-up delay-1">
            Instantly reply to customers, capture leads, and grow sales automatically using smart chat automation built for modern businesses.
          </p>
          <div className="hero-action animate-fade-in-up delay-2">
            <Link to="/app/get-started" className="btn-hero-started">Get Started</Link>
          </div>
        </div>

        {/* Right Content - Chat Widget */}
        <div className="hero-image-wrapper animate-fade-in-left delay-3">
          <ChatWidget />
          
          {/* Decorative Elements */}
          <div className="floating-bubble bubble-1"></div>
          <div className="floating-bubble bubble-2"></div>
        </div>
      </div>
    </section>
  );
}

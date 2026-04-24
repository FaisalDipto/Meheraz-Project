import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './GetStarted.css';
import logoImg from '../assets/logo1.png';
import titleImg from '../assets/title.png';
import LegalCenter from '../components/LegalCenter';
import catAnimationUrl from '../../animation/catLottieJSON.json?url';

const PricingCards = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {/* Free Plan */}
      <div className="flex flex-col p-8 rounded-[1.5rem] bg-surface-container-low transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-2xl shadow-on-surface/5 group border border-transparent hover:border-outline-variant/30">
        <div className="mb-8">
          <h3 className="font-headline text-2xl font-bold mb-2">Free</h3>
          <p className="text-on-surface-variant text-sm">Perfect for hobbyists and experimentation.</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-black text-on-surface">$0</span>
          <span className="text-on-surface-variant">/mo</span>
        </div>
        <ul className="flex-grow space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 Page</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 AI Agent</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>100K Tokens/mo</span>
          </li>

          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 MB Storage</span>
          </li>
          <li className="pt-4 border-t border-outline-variant/30 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Features</li>
          <li className="text-sm">Basic AI replies</li>
          <li className="text-sm">Manual knowledge base</li>
        </ul>
        <button onClick={() => onSelect('FREE')} className="w-full py-4 bg-surface-container-highest text-on-surface font-bold rounded-full transition-all group-hover:bg-primary group-hover:text-on-primary">
          Get Started
        </button>
      </div>

      {/* Starter Plan */}
      <div className="flex flex-col p-8 rounded-[1.5rem] bg-surface-container-low transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-2xl shadow-on-surface/5 group border border-transparent hover:border-outline-variant/30">
        <div className="mb-8">
          <h3 className="font-headline text-2xl font-bold mb-2">Starter</h3>
          <p className="text-on-surface-variant text-sm">For small teams building their first bots.</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-black text-on-surface">$19</span>
          <span className="text-on-surface-variant">/mo</span>
        </div>
        <ul className="flex-grow space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3 Pages</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3 AI Agents</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3M Tokens/mo</span>
          </li>

          <li className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>200 MB Storage</span>
          </li>
          <li className="pt-4 border-t border-outline-variant/30 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Features</li>
          <li className="text-sm">AI replies + personality config</li>
          <li className="text-sm">File upload knowledge base</li>
          <li className="text-sm">Human takeover toggle</li>
          <li className="text-sm">Token top-up available</li>
        </ul>
        <button disabled className="w-full py-4 bg-surface-container flex items-center justify-center opacity-80 cursor-not-allowed text-on-surface font-bold rounded-full transition-all">
          Coming Soon
        </button>
      </div>

      {/* Growth Plan (Featured) */}
      <div className="relative flex flex-col p-8 rounded-[1.5rem] bg-white border-2 border-primary shadow-2xl shadow-primary/10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_32px_64px_-8px_rgba(15,23,42,0.25)] cursor-pointer">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>
        <div className="mb-8">
          <h3 className="font-headline text-2xl font-bold mb-2">Growth</h3>
          <p className="text-on-surface-variant text-sm">Scaling businesses needing advanced control.</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-black text-on-surface">$49</span>
          <span className="text-on-surface-variant">/mo</span>
        </div>
        <ul className="flex-grow space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm font-semibold">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 Pages</span>
          </li>
          <li className="flex items-center gap-3 text-sm font-semibold">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 AI Agents</span>
          </li>
          <li className="flex items-center gap-3 text-sm font-semibold">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10M Tokens/mo</span>
          </li>

          <li className="flex items-center gap-3 text-sm font-semibold">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 GB Storage</span>
          </li>
          <li className="pt-4 border-t border-outline-variant/30 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Features</li>
          <li className="text-sm">All Starter features</li>
          <li className="text-sm">Analytics dashboard</li>
          <li className="text-sm">Multi-admin per page</li>
          <li className="text-sm">Token top-up available</li>
          <li className="text-sm font-medium text-primary">Priority support</li>
        </ul>
        <button disabled className="w-full py-4 bg-outline-variant text-on-surface opacity-80 cursor-not-allowed font-black rounded-full shadow-lg transition-transform">
          Coming Soon
        </button>
      </div>

      {/* Agency Plan */}
      <div className="flex flex-col p-8 rounded-[1.5rem] bg-[#222222] text-[#f1f1f1] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_32px_64px_-8px_rgba(0,0,0,0.6)] hover:border-[#6366f1] group border border-[#333] cursor-pointer">
        <div className="mb-8">
          <h3 className="font-headline text-2xl font-bold mb-2">Agency</h3>
          <p className="text-[#a1a1aa] text-sm">For agencies & resellers</p>
        </div>
        <div className="mb-8 border-b border-[#333] pb-6">
          <span className="text-4xl font-black text-white">$99</span>
          <span className="text-[#a1a1aa]">/mo</span>
        </div>
        <ul className="flex-grow space-y-3 mb-10 text-[13px] xl:text-[14px]">
          <li className="flex items-center justify-between">
            <span className="text-[#a1a1aa]">Pages</span>
            <span className="px-2 py-0.5 bg-[#18181b] rounded font-semibold border border-[#333]">Unlimited</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-[#a1a1aa]">AI Agents</span>
            <span className="px-2 py-0.5 bg-[#18181b] rounded font-semibold border border-[#333]">Unlimited</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-[#a1a1aa]">Tokens / mo</span>
            <span className="px-2 py-0.5 bg-[#14532d]/40 text-[#4ade80] rounded font-semibold flex items-center gap-1">30M <span className="material-symbols-outlined text-[14px] font-bold">arrow_upward</span></span>
          </li>

          <li className="flex items-center justify-between">
            <span className="text-[#a1a1aa]">Storage</span>
            <span className="px-2 py-0.5 bg-[#18181b] rounded font-semibold border border-[#333]">5 GB</span>
          </li>
          <div className="pt-6 space-y-4 border-t border-[#333] !mt-6 block">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4ade80] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>All Growth features</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4ade80] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>White-label branding</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4ade80] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>Advanced analytics + export</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4ade80] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>Token top-up available</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4ade80] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>Dedicated support + SLA</span>
            </div>
          </div>
        </ul>
        <button disabled className="w-full py-4 mt-auto bg-[#333]/50 text-gray-400 opacity-80 cursor-not-allowed font-medium rounded-full shadow-lg transition-transform border border-[#444]">
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default function GetStarted() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReturningUser = !!localStorage.getItem('lyfflow_ReturningUser');
  
  // Steps: 'pricing' | 'connect'
  const [currentStep, setCurrentStep] = useState(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('step') === 'pricing') return 'pricing';
    return 'connect';
  });
  
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('step') === 'pricing') {
      setCurrentStep('pricing');
    } else if (isReturningUser) {
      setCurrentStep('connect');
    }
  }, [location.search, isReturningUser]);

  const handleAcceptTerms = () => {
    // Legacy function, handled inline now
  };

  const handleSelectPackage = (packageName) => {
    // Mark as returning user after choosing a plan
    localStorage.setItem('lyfflow_ReturningUser', 'true');
    navigate('/app/dashboard');
  };

  const handleConnectFacebook = () => {
    const nextPath = isReturningUser ? '/app/dashboard' : '/app/get-started?step=pricing';

    // Save intended destination — backend will redirect to /dashboard regardless,
    // so Dashboard will pick this up and forward the user to the right place.
    localStorage.setItem('lyfflow_postAuthRedirect', nextPath);

    const redirectUrl = encodeURIComponent(window.location.origin + nextPath);
    window.location.href = `https://www.lyfflow.com/api/auth/facebook/login?redirect_uri=${redirectUrl}&next=${nextPath}`;
  };

  return (
    <div className="get-started-container">
      {/* Modals for Onboarding Flow */}
      


      {currentStep === 'pricing' && (
        <div className="onboarding-modal-overlay">
          <div className="onboarding-modal-container fade-in bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
            <div className="onboarding-modal-body custom-scrollbar p-0">
              <main className="relative flex-grow min-h-screen">
                {/* Floating Abstract Background Elements */}
                <div className="absolute top-20 -left-20 w-96 h-96 bg-primary rounded-full -z-10" style={{ filter: 'blur(80px)', opacity: 0.15 }}></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary rounded-full -z-10" style={{ filter: 'blur(80px)', opacity: 0.15 }}></div>
                <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-surface-tint rounded-full -z-10" style={{ filter: 'blur(80px)', opacity: 0.15 }}></div>
                
                {/* Hero Section */}
                <section className="relative pt-2 pb-4 px-6 max-w-7xl mx-auto text-center">
                  <span className="inline-block py-1 px-4 mb-3 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-sm font-bold tracking-widest uppercase">Pricing Plans</span>
                  <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-tight mb-3">
                    Simple, transparent pricing <br className="hidden md:block"/> for teams of all sizes.
                  </h1>
                  <p className="max-w-2xl mx-auto text-lg text-on-surface-variant font-body mb-4">
                    Scale your customer interactions with intelligent AI agents that grow with your business. No hidden fees, just pure flow.
                  </p>
                </section>

                {/* Pricing Grid */}
                <section className="relative px-6 pb-32 max-w-7xl mx-auto z-10 w-full">
                  <PricingCards onSelect={handleSelectPackage} />
                </section>
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Main Connection Interface */}
      <div className="left-panel">
        <div className="left-panel-header">
          <Link to="/app" className="gs-logo-container">
            <img src={logoImg} alt="LYFFLOW Logo" style={{ height: '40px', width: 'auto' }} />
            <img src={titleImg} alt="LYFFLOW" style={{ height: '20px', width: 'auto', marginLeft: '8px' }} />
          </Link>
        </div>
        
        <div className="left-panel-content">
          <div className="graphic-placeholder flex justify-center items-center w-full max-w-[280px] mx-auto mb-8 relative" style={{ height: '240px' }}>
            <DotLottieReact
              src={catAnimationUrl}
              loop
              autoplay
              style={{ width: '100%', height: '100%', transform: 'scale(1.7)', transformOrigin: 'center' }}
            />
          </div>
          <h1 className="left-title">Connect Channel</h1>
          <p className="left-desc">Use your Facebook account to connect to LYFFLOW and start automating.</p>
        </div>

        <div className="left-panel-footer">
          <Link to="/app" className="back-link">&lt; Choose Another Channel</Link>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="right-panel">
        <div className="right-content">
          <div className="step-container fade-in">
            <div className="flex flex-col gap-2 w-full max-sm mt-4 mb-8">
              <button 
                className={`btn-connect-meta flex items-center justify-center gap-3 w-full transition-all duration-300 ${!agreed ? 'opacity-40 cursor-not-allowed saturate-0' : ''}`} 
                onClick={agreed ? handleConnectFacebook : undefined}
                disabled={!agreed}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                Connect Via Facebook
              </button>
              <button 
                className={`btn-connect-meta flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 border-none transition-all duration-300 ${!agreed ? 'opacity-40 cursor-not-allowed saturate-0' : 'hover:opacity-90'}`} 
                onClick={() => agreed ? alert("Instagram connection coming soon!") : undefined}
                disabled={!agreed}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
                Connect Via Instagram
              </button>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
              <input 
                type="checkbox" 
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0"
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <div className="text-[12px] text-slate-500 text-left leading-relaxed">
                By proceeding, I acknowledge that I have read and agree to the Lyfflow{' '}
                <Link to="/app/legal" target="_blank" className="font-bold text-slate-700 hover:text-primary transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/app/legal" target="_blank" className="font-bold text-slate-700 hover:text-primary transition-colors">Privacy Policy</Link>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
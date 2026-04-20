import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './GetStarted.css';
import logoImg from '../assets/logo1.png';
import titleImg from '../assets/title.png';
import LegalCenter from '../components/LegalCenter';

// Reusable Pricing Cards for the Onboarding Modal
const PricingCards = ({ onSelect }) => {
  return (
    <div className="pricing-modal-grid">
      {/* Free Plan */}
      <div className="flex flex-col p-6 rounded-[1.5rem] bg-slate-50 transition-all duration-300 hover:bg-white hover:shadow-xl group border-2 border-transparent hover:border-slate-200">
        <div className="mb-4">
          <h3 className="font-headline text-xl font-bold mb-1">Free</h3>
          <p className="text-slate-500 text-xs text-balance">Perfect for hobbyists and experimentation.</p>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-black text-slate-900">$0</span>
          <span className="text-slate-500 text-sm">/mo</span>
        </div>
        <ul className="flex-grow space-y-2 mb-6 text-[11px] leading-tight">
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 Facebook Page</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 AI Agent</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>100K Tokens / mo</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 MB Storage</span>
          </li>
          <li className="pt-2 border-t border-slate-200 text-slate-400 font-bold uppercase tracking-tighter text-[9px]">Features</li>
          <li className="text-slate-500">Basic AI replies</li>
          <li className="text-slate-500">Manual knowledge base</li>
        </ul>
        <button 
          onClick={() => onSelect('free')} 
          className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl transition-all hover:bg-emerald-600"
        >
          Select Free
        </button>
      </div>

      {/* Starter Plan */}
      <div className="flex flex-col p-6 rounded-[1.5rem] bg-slate-50 opacity-80 border-2 border-transparent hover:border-slate-200 transition-all">
        <div className="mb-4">
          <h3 className="font-headline text-xl font-bold mb-1">Starter</h3>
          <p className="text-slate-500 text-xs">For small teams building first bots.</p>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-black text-slate-900">$19</span>
          <span className="text-slate-500 text-sm">/mo</span>
        </div>
        <ul className="flex-grow space-y-2 mb-6 text-[11px] leading-tight">
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3 Facebook Pages</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3 AI Agents</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>3M Tokens / mo</span>
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>200 MB Storage</span>
          </li>
          <li className="pt-2 border-t border-slate-200 text-slate-400 font-bold uppercase tracking-tighter text-[9px]">Features</li>
          <li className="text-slate-500">Personality config</li>
          <li className="text-slate-500">File upload KB</li>
          <li className="text-slate-500">Human takeover</li>
        </ul>
        <button disabled className="w-full py-3 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
          Coming Soon
        </button>
      </div>

      {/* Growth Plan */}
      <div className="relative flex flex-col p-6 rounded-[1.5rem] bg-white border-2 border-emerald-500/30 shadow-lg scale-[1.02] z-10">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
        <div className="mb-4">
          <h3 className="font-headline text-xl font-bold mb-1">Growth</h3>
          <p className="text-slate-500 text-xs">Scaling businesses needing control.</p>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-black text-slate-900">$49</span>
          <span className="text-slate-500 text-sm">/mo</span>
        </div>
        <ul className="flex-grow space-y-2 mb-6 text-[11px] leading-tight font-medium">
          <li className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 Facebook Pages</span>
          </li>
          <li className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10 AI Agents</span>
          </li>
          <li className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>10M Tokens / mo</span>
          </li>
          <li className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>1 GB Storage</span>
          </li>
          <li className="pt-2 border-t border-slate-200 text-slate-400 font-bold uppercase tracking-tighter text-[9px]">Features</li>
          <li className="text-slate-600 underline decoration-emerald-500/30">Analytics Dashboard</li>
          <li className="text-slate-600 underline decoration-emerald-500/30">Multi-admin Support</li>
          <li className="text-emerald-600 font-bold">Priority Support</li>
        </ul>
        <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed">
          Coming Soon
        </button>
      </div>

      {/* Agency Plan */}
      <div className="flex flex-col p-6 rounded-[1.5rem] bg-slate-900 text-white opacity-95 hover:opacity-100 transition-all border-2 border-transparent hover:border-emerald-500">
        <div className="mb-4 text-center">
          <h3 className="font-headline text-xl font-bold mb-1">Agency</h3>
          <p className="text-slate-400 text-xs">For agencies & resellers</p>
        </div>
        <div className="mb-4 text-center border-b border-white/10 pb-4">
          <span className="text-3xl font-black text-white">$99</span>
          <span className="text-slate-400 text-sm">/mo</span>
        </div>
        <ul className="flex-grow space-y-2 mb-6 text-[11px] leading-tight">
          <li className="flex items-center justify-between">
            <span className="text-slate-400">Pages</span>
            <span className="font-bold text-emerald-400">Unlimited</span>
          </li>
          <li className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">AI Agents</span>
            <span className="font-bold text-emerald-400">Unlimited</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>30M Tokens / mo</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>White-label brand</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>Dedicated Support</span>
          </li>
        </ul>
        <button disabled className="w-full py-3 bg-white/5 text-slate-400 font-bold rounded-xl cursor-not-allowed border border-white/10">
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
          <div className="onboarding-modal-container fade-in">
            <div className="onboarding-modal-body custom-scrollbar">
              <div className="mb-12 text-center">
                <h2 className="modal-step-title">Choose Your Plan</h2>
                <p className="modal-step-desc">Pick the package that best suits your needs.</p>
              </div>
              <div className="pricing-modal-content">
                <PricingCards onSelect={handleSelectPackage} />
              </div>
            </div>
            {/* Note: Buttons are inside the cards for step advancement */}
            <div className="onboarding-modal-footer justify-center">
              <p className="text-on-surface-variant text-sm italic">You can always upgrade or downgrade your plan later from the dashboard.</p>
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
          <div className="graphic-placeholder">
            <div className="colorful-shapes">
              <div className="shape shape-circle"></div>
              <div className="shape shape-star"></div>
              <div className="shape shape-blob"></div>
            </div>
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
            <h2 className="right-title">Connect your platform</h2>
            <p className="right-desc">
              We'll take you to Meta to connect. Just set your permissions, and your account will be linked to LYFFLOW.
            </p>
            
            <div className="flex flex-col gap-4 w-full max-sm mt-8 mb-8">
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
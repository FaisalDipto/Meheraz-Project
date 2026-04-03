import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import meharazPhoto from '../assets/team/meharaz.jpg';
import swajanPhoto from '../assets/team/swajan.jpg';
import mehediPhoto from '../assets/team/mehedi.jpg';
import faisalPhoto from '../assets/team/faisal.jpg';

const TEAM = [
  {
    id: 'meharaz',
    name: 'Meharaz Hossain',
    since: 'Since 2025',
    role: 'Founder & AI',
    background: 'BSc. Engg. in CSE, Bangladesh University of Business and Technology',
    interests: null,
    photo: meharazPhoto,
    delay: '',
  },
  {
    id: 'swajan',
    name: 'Swajan Baruah',
    since: 'Since 2026',
    role: 'Backend Engineer',
    background: 'BSc. Engg. in CSE, American International University Bangladesh (AIUB)',
    interests: null,
    photo: swajanPhoto,
    delay: '[transition-delay:100ms]',
  },
  {
    id: 'mehedi',
    name: 'Mehedi Rifat',
    since: 'Since 2026',
    role: 'Backend Engineer',
    background: 'BSc. Engg. in CSE, Bangladesh University of Business and Technology',
    interests: null,
    photo: mehediPhoto,
    delay: '[transition-delay:200ms]',
  },
  {
    id: 'faisal',
    name: 'Faisal Amir Dipto',
    since: 'Since 2026',
    role: 'UI/UX & Frontend',
    background: 'BSc. Engg. in CSE, Bangladesh University of Business and Technology',
    interests: null,
    photo: faisalPhoto,
    delay: '[transition-delay:300ms]',
  },
];

export default function Hero() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hoveredMember, setHoveredMember] = useState(null);

  const handleMouseMove = useCallback((e, memberId) => {
    setCursor({ x: e.clientX, y: e.clientY });
    setHoveredMember(memberId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredMember(null);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    return () => {
      document.querySelectorAll('.reveal').forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate min-h-screen flex items-center pt-[136px] pb-[88px] overflow-hidden">
        <div className="absolute inset-0 bg-background -z-30"></div>
        
        {/* Floating Background Layers (4 Distinct Glass Rectangles) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Rect 1: Top Left — Green | increased tilt + stronger up/down */}
          <div className="absolute top-[12%] left-[8%] w-[450px] h-[450px] bg-[#10B981]/15 opacity-60 rounded-[12px] animate-rect1"></div>

          {/* Rect 2: Top Right — Purple | left/right drift + subtle tilt, shifted left to not overlap rect1 much */}
          <div className="absolute top-[8%] right-[10%] w-[350px] h-[350px] bg-[#6366F1]/10 opacity-50 rounded-[12px] animate-rect2"></div>

          {/* Rect 3: Overlaps Rect4 ~40% — Green 350x350, higher z, more visible */}
          <div className="absolute top-[52%] left-[42%] w-[350px] h-[350px] bg-[#10B981]/20 opacity-70 rounded-[12px] animate-rect3 z-10"></div>

          {/* Rect 4: Touches bottom-right of Rect1 — Purple, slightly higher */}
          <div className="absolute top-[38%] left-[22%] w-[500px] h-[500px] bg-[#6366F1]/15 opacity-60 rounded-[12px] animate-rect4"></div>
        </div>

        {/* CONTENT LAYER */}
        <div className="max-w-7xl mx-auto px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="space-y-8 animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-secondary text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-secondary/20">Automate Everything</span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] text-primary">
              Automate Conversations on <span className="text-tertiary">Facebook, Instagram & WhatsApp</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
              Scale your customer engagement with instant AI-powered replies, automated lead capture, and hyper-growth sales funnels that work 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/app/get-started" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group shadow-xl shadow-primary/10">
                Start Free Trial
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
              </Link>
              <button className="bg-white border border-slate-200 text-primary px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
          {/* Detailed Chat Interface */}
          <div className="relative animate-fade-in [animation-delay:200ms]">
            {/* Accent Blur 1 — Green #108981, 160×160, bottom-left overflow, 60% opacity, layer blur */}
            <div className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] bg-[#10B981]/5 opacity-30 rounded-[12px] blur-[32px] z-20 pointer-events-none"></div>
            {/* Accent Blur 2 — Amber #FEF3C7, 128×128, top-right overflow, 60% opacity, layer blur */}
            <div className="absolute -top-[40px] -right-[40px] w-[128px] h-[128px] bg-[#FEF3C7]/50 opacity-30 rounded-[12px] blur-[32px] z-20 pointer-events-none"></div>
            <div className="relative z-10 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                  </div>
                  <div className="bg-slate-50 text-slate-700 py-3 px-5 rounded-[1.5rem] rounded-tl-none shadow-sm max-w-[85%] border border-slate-100">
                    <p className="text-[15px] font-medium leading-relaxed">Hi there 👋 How can we help you?</p>
                  </div>
                </div>
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-[#0ea5e9] text-white py-3 px-5 rounded-[1.5rem] rounded-tr-none shadow-lg shadow-blue-500/20 max-w-[85%]">
                    <p className="text-[15px] font-medium leading-relaxed">Yes 😊 Would you like pricing or a demo?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                  </div>
                  <div className="bg-slate-50 text-slate-700 py-3 px-5 rounded-[1.5rem] rounded-tl-none shadow-sm max-w-[85%] border border-slate-100">
                    <p className="text-[15px] font-medium leading-relaxed">Book me a demo 🚀</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 shadow-lg shadow-tertiary/30">
                    <span className="material-symbols-outlined text-white text-[10px]">bolt</span>
                  </div>
                  <div className="bg-white py-3 px-5 rounded-[1.5rem] rounded-tl-none border border-slate-100 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl opacity-60 -z-10"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full blur-3xl opacity-60 -z-10"></div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-40 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24 reveal">
            <label className="font-label text-xs font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">The Process</label>
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-primary">Three steps to automation</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="group reveal">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-tertiary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-tertiary/20">
                <span className="material-symbols-outlined text-3xl" data-icon="hub">hub</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-5">Connect</h3>
              <p className="text-on-surface-variant leading-relaxed">Securely link your social profiles in seconds with our one-click integration suite.</p>
            </div>
            <div className="group reveal [transition-delay:150ms]">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-secondary/20">
                <span className="material-symbols-outlined text-3xl" data-icon="auto_awesome">auto_awesome</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-5">Automate</h3>
              <p className="text-on-surface-variant leading-relaxed">Build intelligent conversation flows using our visual drag-and-drop AI architect.</p>
            </div>
            <div className="group reveal [transition-delay:300ms]">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-3xl" data-icon="trending_up">trending_up</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-5">Grow</h3>
              <p className="text-on-surface-variant leading-relaxed">Watch your lead list expand and conversion rates soar with 24/7 engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Synergy */}
      <section className="py-32 bg-primary text-on-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-20 reveal">
            <h2 className="font-headline text-4xl font-bold mb-6">Omnichannel Synergy</h2>
            <p className="text-slate-400 text-lg">A single dashboard to rule them all. No more switching apps or missing messages.</p>
          </div>
          <div className="relative w-full max-w-4xl flex justify-between items-center py-20 reveal">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tertiary/40 to-transparent -translate-y-1/2"></div>
            <div className="relative z-10 bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-110 transition-transform">
              <img alt="Facebook messenger logo" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcW2rj-h53SQ7LhV76izr5JwowjL-A8821umSA4_qhFz4g63wFze-rUp046O60r44fp5aU74V_cEAhQOvdcRHRDB9qm8H4r3xfjql2HjlMlXrC9Lsxv_FWX25fu1BI-PThAvJ0uF06pzLkG2ACetp1tlPPZQDdM7H-tJE4Xdu-X-K84DP5n_rbNrmvByISoceoLX9SdEq0tozwh58o6_InaZQ5M5cJvDFKtPIdG1Q95O4hSmRrEyh48lcKhs6E0DUVb1C6UDuOCcA" />
            </div>
            <div className="relative z-10 bg-tertiary p-10 rounded-[2.5rem] border-4 border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.4)] animate-pulse">
              <span className="material-symbols-outlined text-5xl text-white" data-icon="cloud_sync" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_sync</span>
            </div>
            <div className="relative z-10 bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-110 transition-transform">
              <img alt="Instagram logo" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV3j-otyDGUGyOHapwp030HUNc5LFdaPKAJin9zwTRjakIeonFBPbXt5sFZNA9Oxt_TXinoeZI0QAu0ijNyurCq4G35dA2dGn9KToYgueh4TYfjnL2ngvG9cRT6VAixe3yd1vnAREtnYaTiWYvTdITW1Yhwnumvn014CyZpXj_h6SUx9Lnon9J1b0Q_TXYUi8APFBCzY5pCnobY5aP6pVLUbhJC9Oh-OmupshFz3nXYVjV-8V0R-3E__hWPpX-SE2mGDzwbTBNp84" />
            </div>
            <div className="relative z-10 bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-110 transition-transform">
              <img alt="WhatsApp logo" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-9XQRSH1hmeI1fkrtRdSwRrUMgTrNSV32tdNeTdueVweKxAvtuJTcuU_08wQAuaRdCzrR9CToBX96Mevh4-5A8BZ1fegR1qUiReiAFwCo4qVlODwo9IW8ZRIyy21IGDwanZi28V59T9PQQXPTelE9mPAadgdW9nP5h5M3cXw01nHFI-r0Go6_sTkJnW8VK-LRQpb-Z1VbfHCyMyBTjev6KOUCO_4uhVakI9RakrUyWnJk80zU6UBNlReFcOXxkMSwRnFbpw3Ly8" />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section id="about" className="bg-surface-container-low py-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Left: image + stat card */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-container-highest shadow-2xl">
              <img
                alt="Creative team collaborating"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJkqaSLM1OebncJsUwK8vz1EfZX93sv_qeVGUbEOz6rE2C7X9L8KB9Csuib_n3lNH3UGB_nUKl7RkDep3rWz9VhIQuIObyVEMyDXCkz2vvlo1hSuegAVQ0cesQSxRRRub0PgLZuxNvV6r5cDHJYKk8w9iF0D-sayjEqm64JBQS-NSnvvYJFfpmjnCKrItv_6_62SkKXeLXGsOmfpor7Yxv1CYE6W6O6pKSZH0mr-TyltD9-Og9WnTI-p38WTHEQZpZzmYWNXj6IdA"
              />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-10 -right-6 bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[1.5rem] shadow-xl max-w-xs hidden md:block">
              <p className="font-headline text-primary text-4xl font-black mb-2">100M+</p>
              <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Messages curated daily across our global ecosystem</p>
            </div>
          </div>
          {/* Right: text */}
          <div>
            <span className="text-secondary font-label uppercase tracking-[0.2em] text-sm mb-6 block">Who We Are</span>
            <h2 className="font-headline text-4xl md:text-6xl font-bold mb-8 leading-tight text-primary">Eliminating the bottlenecks of human scale.</h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>We are a team of curators, engineers, and dreamers who believe that technology should amplify human connection, not replace it. Our mission is to provide the digital infrastructure that allows brands to speak with thousands while maintaining the intimacy of one.</p>
              <p>By blending high-end editorial aesthetics with cutting-edge AI, we've built a platform that feels like a boutique agency but performs like a global enterprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM WE SOLVE ── */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-tertiary font-label uppercase tracking-[0.2em] text-sm mb-6 block">The Challenge</span>
              <h2 className="font-headline text-4xl md:text-6xl font-bold leading-tight text-primary">The noise of scaling is the silence of lost revenue.</h2>
            </div>
            <p className="text-on-surface-variant max-w-sm pb-2 text-lg">Traditional communication tools create silos and delays. We solve the friction points that prevent growth.</p>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1 */}
            <div className="md:col-span-7 bg-primary text-on-primary p-12 rounded-[2rem] flex flex-col justify-between min-h-[400px]">
              <span className="material-symbols-outlined text-5xl text-secondary-fixed-dim">error_outline</span>
              <div>
                <h3 className="font-headline text-3xl mb-4">Fragmented Channels</h3>
                <p className="opacity-70 text-lg">Managing customers across five platforms leads to missed messages and inconsistent brand voice. We unify the chaos into one intelligent hub.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="md:col-span-5 bg-surface-container-high p-12 rounded-[2rem] flex flex-col justify-between min-h-[400px]">
              <span className="material-symbols-outlined text-5xl text-primary">speed</span>
              <div>
                <h3 className="font-headline text-3xl mb-4 text-primary">Response Latency</h3>
                <p className="text-on-surface-variant text-lg">In the digital age, a 10-minute delay is a lost lead. Automation ensures you are always present, even when you aren't.</p>
              </div>
            </div>
            {/* Card 3 — Full width */}
            <div className="md:col-span-12 bg-surface-container-lowest border border-outline-variant/20 p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="font-headline text-3xl mb-4 text-primary">Decision Fatigue</h3>
                <p className="text-on-surface-variant text-lg">Analyzing thousands of chats for insights is impossible for humans. Our AI does the heavy lifting, surfacing what actually matters for your bottom line.</p>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-surface-dim rounded-xl overflow-hidden shadow-inner">
                <img
                  alt="Data visualization"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSxVCBtES0UfCSd6Os1abuBk4-1chZKx5kDuwqLGG0ySKLVxvh6_JozkThMQCrO_xIwMTDMAzDuQMKzCt2IRVMjXeLJNBBTBJonOTagPt1QKxgPq_jGaJhvooFUr5Zotug82stCTqUmsRsfL5KZ4TE4Z3AJ_LDwK7Fny2265zmLjQH1JThSbs4hTwO-nxRONYE6vDC8nqINkgSLsT70jn2c3Ot4-NiMmEolqAotyyyhvbK9hcUvruFo96evwqKioyUPx-9ZKSGQ4Q"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO — Feature Grid ── */}
      <section className="py-32 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <label className="font-label text-xs font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">Our Platform</label>
            <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-primary mb-6">Designed for impact.</h2>
            <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">Our features aren't just utilities — they are tools that refine your digital presence into a curated, high-performance experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-tertiary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-tertiary/20">
                <span className="material-symbols-outlined text-3xl text-tertiary group-hover:text-white transition-colors duration-500">auto_awesome</span>
              </div>
              <h4 className="font-headline text-xl mb-4 text-primary">Smart Replies</h4>
              <p className="text-on-surface-variant leading-relaxed">Context-aware AI that mimics your brand's unique tone of voice, providing instant, accurate answers around the clock.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-secondary/20">
                <span className="material-symbols-outlined text-3xl text-secondary group-hover:text-white transition-colors duration-500">security</span>
              </div>
              <h4 className="font-headline text-xl mb-4 text-primary">Automated Moderation</h4>
              <p className="text-on-surface-variant leading-relaxed">Protect your community with real-time sentiment analysis and proactive filtering of harmful content before it causes damage.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white transition-colors duration-500">insights</span>
              </div>
              <h4 className="font-headline text-xl mb-4 text-primary">Conversation Insights</h4>
              <p className="text-on-surface-variant leading-relaxed">Turn dialogue into data. Understand customer pain points and trends through deep linguistic modeling and AI reporting.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-slate-800 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-slate-800/20">
                <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-white transition-colors duration-500">all_inbox</span>
              </div>
              <h4 className="font-headline text-xl mb-4 text-primary">Unified Inbox</h4>
              <p className="text-on-surface-variant leading-relaxed">One dashboard to rule them all. Manage Instagram, WhatsApp, and Messenger without ever switching context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION & PRINCIPLES ── */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sticky label */}
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-32">
                <label className="font-label text-xs font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">Our Philosophy</label>
                <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-primary mb-8">Our core principles.</h2>
                <p className="text-on-surface-variant text-lg">We don't just build software; we build a philosophy for the modern digital era of AI-first business.</p>
              </div>
            </div>
            {/* Cards */}
            <div className="lg:w-2/3 space-y-8">
              <div className="p-10 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-start gap-8">
                  <span className="font-headline text-5xl text-primary/20 font-black flex-shrink-0">01</span>
                  <div>
                    <h3 className="font-headline text-2xl mb-4 text-primary">Simplicity</h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed">Complexity is the enemy of execution. We design every interface to be intuitive, stripping away the friction until only the essentials remain.</p>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-start gap-8">
                  <span className="font-headline text-5xl text-secondary/25 font-black flex-shrink-0">02</span>
                  <div>
                    <h3 className="font-headline text-2xl mb-4 text-primary">Intelligence</h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed">Data without context is noise. Our AI isn't just fast; it's smart. It learns from your history to predict the needs of your future customers.</p>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-start gap-8">
                  <span className="font-headline text-5xl text-tertiary/25 font-black flex-shrink-0">03</span>
                  <div>
                    <h3 className="font-headline text-2xl mb-4 text-primary">Scalability</h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed">Growth should never be painful. Whether you're handling ten chats or ten million, QchatLive scales horizontally to meet the demand without missing a beat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-40 bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="mb-24">
            <label className="font-label text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4 block">The Brains Behind the Bot</label>
            <h2 className="font-headline text-5xl font-black tracking-tight text-white">Our Expertise</h2>
          </div>
          <div className="relative space-y-0">
            {TEAM.map((member) => (
              <div
                key={member.id}
                className="team-row group relative py-12 flex items-center justify-between cursor-pointer border-b border-white/10"
                onMouseMove={(e) => handleMouseMove(e, member.id)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="hidden md:block text-slate-400 font-bold text-xs uppercase tracking-widest z-20 transition-colors group-hover:text-white">{member.since}</span>
                <div className="flex-1 text-center md:text-left z-20">
                  <h3 className="team-name font-headline text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">{member.name}</h3>
                </div>
                <span className="hidden md:block text-slate-400 font-bold text-xs uppercase tracking-widest text-right z-20 transition-colors group-hover:text-white">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-xl">
              <label className="font-label text-xs font-bold tracking-[0.3em] uppercase text-tertiary mb-4 block">Visual Interface</label>
              <h2 className="font-headline text-5xl font-black tracking-tight text-primary">The Bento Dashboard</h2>
            </div>
            <p className="text-on-surface-variant md:w-1/3 text-lg leading-relaxed">Intelligent data collection structured for clarity and professional insight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-2 gap-8 h-auto md:h-[650px]">
            {/* Main Chat Panel */}
            <div className="md:col-span-7 md:row-span-2 bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400" data-icon="forum">forum</span>
                  <h4 className="font-bold text-lg">Live Conversations</h4>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/40"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary/40"></div>
                </div>
              </div>
              <div className="space-y-6 flex-1">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-300 text-sm">person</span>
                  </div>
                  <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none shadow-sm max-w-[80%] border border-slate-100">
                    <p className="text-[15px] text-slate-600">Hi! Do you have the summer collection in stock?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-tertiary text-white p-5 rounded-[1.5rem] rounded-tr-none shadow-lg shadow-tertiary/20 max-w-[80%]">
                    <p className="text-[15px]">Yes, Sarah! We just restocked. Would you like to see the catalog?</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-primary/20">AI</div>
                </div>
              </div>
              <div className="mt-10 bg-white p-5 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
                <span className="text-slate-400 text-sm">Wait for visitor reply...</span>
                <span className="material-symbols-outlined text-tertiary" data-icon="send">send</span>
              </div>
            </div>

            {/* Lead Data */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-primary text-white rounded-[3rem] p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 blur-3xl rounded-full"></div>
              <h4 className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-8">Real-time Lead Capture</h4>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">Sarah Jenkins</p>
                    <p className="text-slate-400 font-medium">sarah.j@example.com</p>
                  </div>
                  <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-secondary/20">VIP Lead</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-3/4 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-secondary" data-icon="shopping_bag">shopping_bag</span>
                  <p className="italic">Interest: Fashion, Summer Catalog</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-5 bg-secondary-container/30 border border-secondary-container rounded-[3rem] p-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Automated</p>
                <p className="text-5xl font-headline font-black text-primary">94<span className="text-secondary">%</span></p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Saved Hours</p>
                <p className="text-5xl font-headline font-black text-primary">128</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto bg-primary rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-tertiary/40 via-primary to-primary"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-7xl font-extrabold text-white tracking-tighter mb-10 leading-tight">
              Ready to dominate your <br className="hidden md:block"/>social channels?
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed">
              Join 10,000+ businesses automating their growth with ChatAutomate. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/app/login" className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-white/5">
                Create Free Account
              </Link>
              <button className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/5 transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cursor-following team member card */}
      {hoveredMember && (() => {
        const member = TEAM.find(m => m.id === hoveredMember);
        if (!member) return null;
        const CARD_W = 600;
        const CARD_H = 280;
        const OFFSET = 24;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = cursor.x + OFFSET;
        let y = cursor.y + OFFSET;
        if (x + CARD_W > vw - 16) x = cursor.x - CARD_W - OFFSET;
        if (y + CARD_H > vh - 16) y = cursor.y - CARD_H - OFFSET;
        return (
          <div
            className="team-cursor-card"
            style={{ left: x, top: y }}
          >
            <img className="team-cursor-photo" alt={member.name} src={member.photo} />
            <div className="team-cursor-info">
              <p className="team-cursor-name">{member.name}</p>
              <p className="team-cursor-role">{member.role}</p>
              <div className="team-cursor-divider" />
              <p className="team-cursor-meta"><strong>Background:</strong> <span>{member.background}</span></p>
              {member.interests && (
                <p className="team-cursor-meta"><strong>Interests:</strong> <span>{member.interests}</span></p>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}

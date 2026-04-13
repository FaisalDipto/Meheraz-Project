import React, { useState, useEffect } from 'react';

export default function LegalCenter() {
  const [activeSection, setActiveSection] = useState('tos');

  useEffect(() => {
    const sectionElements = document.querySelectorAll('article > section[id]');
    
    // Create an observer to watch for sections entering the screen
    const observer = new IntersectionObserver((entries) => {
      // Find the intersecting entry (sometimes multiple fire at once, this ensures we grab the visible one)
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-15% 0px -65% 0px', // Trigger when section is near the top of the viewport
      threshold: 0
    });

    sectionElements.forEach(el => observer.observe(el));

    return () => {
      sectionElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const getLinkClasses = (sectionId) => {
    if (activeSection === sectionId) {
      return "flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-container-lowest rounded-xl shadow-sm transition-transform duration-200 hover:translate-x-1";
    }
    return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-xl transition-transform duration-200 hover:translate-x-1";
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 flex flex-col md:flex-row gap-16 border-t border-surface-variant">
      {/* SideNavBar (Sticky Sidebar) */}
      <aside className="md:w-72 relative">
        <div className="sticky top-24 w-full h-fit p-6 bg-surface-container-low dark:bg-slate-900 rounded-2xl font-body text-sm font-medium border border-surface-variant/50">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-on-surface">Legal Center</h2>
            <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Last updated April 2026</p>
          </div>
          
          <nav className="space-y-2">
            <a href="#tos" className={getLinkClasses('tos')}>
              <span className="material-symbols-outlined" style={activeSection === 'tos' ? { fontVariationSettings: "'FILL' 1" } : {}}>gavel</span>
              Terms of Service
            </a>
            <a href="#privacy" className={getLinkClasses('privacy')}>
              <span className="material-symbols-outlined" style={activeSection === 'privacy' ? { fontVariationSettings: "'FILL' 1" } : {}}>policy</span>
              Privacy Policy
            </a>
            <a href="#cookies" className={getLinkClasses('cookies')}>
              <span className="material-symbols-outlined" style={activeSection === 'cookies' ? { fontVariationSettings: "'FILL' 1" } : {}}>cookie</span>
              Cookie Policy
            </a>
            <a href="#gdpr" className={getLinkClasses('gdpr')}>
              <span className="material-symbols-outlined" style={activeSection === 'gdpr' ? { fontVariationSettings: "'FILL' 1" } : {}}>security_update_good</span>
              GDPR Compliance
            </a>
            <a href="#security" className={getLinkClasses('security')}>
              <span className="material-symbols-outlined" style={activeSection === 'security' ? { fontVariationSettings: "'FILL' 1" } : {}}>verified_user</span>
              Security
            </a>
          </nav>

          <div className="mt-12 p-6 bg-secondary-container rounded-xl overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-on-secondary-container font-bold text-xs uppercase tracking-widest mb-2">Need help?</p>
              <p className="text-on-secondary-container text-sm leading-relaxed mb-4">Questions about our legal framework?</p>
              <a href="#" className="text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all text-on-secondary-container">
                CONTACT LEGAL <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-8xl">gavel</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Column */}
      <article className="flex-1 max-w-4xl space-y-32">
        {/* Terms of Service Section */}
        <section id="tos" className="scroll-mt-32">
          <header className="mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">LYFFLOW - Terms of Service</h1>
            <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
            <p className="mt-6 text-on-surface-variant font-medium">Effective Date: April 13, 2026 <br/> Last Updated: April 13, 2026</p>
          </header>

          <div className="space-y-16">
            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">1. Agreement to Terms</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Lyfflow ("Company," "we," "us," or "our"), governing your access to and use of the Lyfflow platform, including all associated software, services, APIs, dashboards, and features (collectively, the "Service").
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                By registering an account, accessing the Service, or clicking "I Agree," you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                If you are accepting these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">2. Description of Service</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                Lyfflow is a Software-as-a-Service (SaaS) platform that enables businesses and individuals ("Clients") to deploy AI-powered automation agents on Facebook Messenger. Core features of the Service include, but are not limited to:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Creation and configuration of AI chatbot agents with customizable personalities and response behaviors;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Integration with Facebook Pages via the Meta Messenger Platform;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Knowledge base management, including manual text entries and document uploads processed via vector search;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Automated AI responses to incoming Messenger conversations;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Human takeover controls allowing agents to be paused and conversations managed manually;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Conversation and message history storage and retrieval;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">Multi-page and multi-admin support.</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                The Service may be updated, modified, or expanded at any time at our sole discretion.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">3. Eligibility</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                To use the Service, you must:
              </p>
              <ol className="list-decimal list-outside space-y-2 text-on-surface-variant ml-6 text-lg font-light">
                <li>Be at least 18 years of age, or the age of legal majority in your jurisdiction;</li>
                <li>Have the legal capacity to enter into a binding contract;</li>
                <li>Not be prohibited from using the Service under applicable laws;</li>
                <li>Comply with Meta's Platform Terms and Policies in connection with any Facebook Page you connect to the Service.</li>
              </ol>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                By using the Service, you represent and warrant that you meet all of the above eligibility requirements.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">4. Account Registration and Security</h2>
              
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">4.1 Account Creation</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                To access the Service, you must register for an account by providing accurate, current, and complete information. You agree to maintain and promptly update your account information to keep it accurate and current.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">4.2 Account Credentials</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You are solely responsible for maintaining the confidentiality of your account credentials, including your password. You must not share your credentials with any unauthorized third party. You agree to notify us immediately at [support@lyfflow.com] if you suspect any unauthorized access to or use of your account.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">4.3 Account Responsibility</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You are fully responsible for all activities that occur under your account, whether or not authorized by you. Lyfflow shall not be liable for any loss or damage arising from your failure to protect your account credentials.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">4.4 One Account Per User</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Unless expressly authorized by Lyfflow, each individual or entity may maintain only one active account. Duplicate accounts may be suspended or terminated.
              </p>
            </div>

            <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-primary shadow-sm">
              <p className="font-headline text-xl font-bold text-primary mb-2 italic">Pro Tip for Enterprise Clients</p>
              <p className="text-on-surface-variant">Ensure your team has read the full compliance guide before initializing large-scale automated deployments to comply with Meta's messaging policies.</p>
            </div>
            
            <div>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-8">
                *The above is an excerpt. Please view the full documentation for all sections including Subscriptions, Acceptable Use, IP Rights, and Disclaimers.*
              </p>
            </div>

          </div>
        </section>

        <hr className="border-surface-variant/50" />

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-32">
          <header className="mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">LYFFLOW - Privacy Policy</h1>
            <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
            <p className="mt-6 text-on-surface-variant font-medium">Effective Date: April 13, 2026 <br/> Last Updated: April 13, 2026</p>
          </header>

          <div className="space-y-16">
            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">1. Introduction</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Welcome to QchatLive, an AI-powered communication and business messaging platform operated by <strong>Lyfflow</strong> ("Lyfflow", "we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and related services (collectively, the "Service").
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                By accessing or using QchatLive, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Service immediately.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                This policy applies to all users of QchatLive globally, including users located in Bangladesh, the European Union, the United Kingdom, and the United States of America.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.05)] border border-surface-variant/30">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">database</span>
                <h3 className="font-headline text-xl font-bold mb-3">2. Information We Collect</h3>
                <p className="text-on-surface-variant leading-relaxed font-light">
                  We collect information that you provide directly to us (e.g., name, email, billing info), information from third-party platforms (e.g., Meta API tokens), and information automatically collected through your use of the service (e.g., IP address, device type, usage patterns).
                </p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.05)] border border-surface-variant/30">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">security</span>
                <h3 className="font-headline text-xl font-bold mb-3">3. How We Use Information</h3>
                <p className="text-on-surface-variant leading-relaxed font-light">
                  Your data is used to provide, maintain, and improve our services, generate AI-powered replies, process payments, and protect the security of our platform and users. We rely on performance of contract and legitimate interest as legal bases.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">4. Facebook and Meta Platform Data</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                QchatLive integrates with the Meta (Facebook) Platform. By connecting your Facebook Page to QchatLive, you acknowledge and agree to the following:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">We access your Page and Messenger data solely to provide the services you have requested.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">We do not use Facebook user data to build advertising profiles or for any advertising purposes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <span className="text-lg">We do not sell, license, or transfer Facebook-derived data to third parties for advertising or data broker purposes.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">5. Data Retention</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                We retain your personal data for as long as your account is active or as needed to provide the Service. Account data is retained for up to 90 days after deletion. Conversation and message data is retained for as long as your account is active. Payment records are retained for a minimum of 7 years. Log and security data is retained for up to 12 months.
              </p>
            </div>
            
            <div>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-8">
                *The above is an excerpt. Please view the full documentation for all sections including How We Share Your Information, Data Security, Your Rights, and International Data Transfers.*
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@lyfflow.com.
              </p>
            </div>

          </div>
        </section>
        
        {/* Cookie Policy Section Placeholder */}
        <section id="cookies" className="scroll-mt-32">
        </section>
        
        {/* GDPR Compliance Section Placeholder */}
        <section id="gdpr" className="scroll-mt-32">
        </section>

        {/* Security Section Placeholder */}
         <section id="security" className="scroll-mt-32">
        </section>
      </article>
    </section>
  );
}

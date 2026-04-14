import React, { useState, useEffect } from "react";

export default function LegalCenter() {
  const [activeSection, setActiveSection] = useState("tos");

  useEffect(() => {
    const sectionElements = document.querySelectorAll("article > section[id]");

    // Create an observer to watch for sections entering the screen
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the intersecting entry (sometimes multiple fire at once, this ensures we grab the visible one)
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-15% 0px -65% 0px", // Trigger when section is near the top of the viewport
        threshold: 0,
      },
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Handle scrolling to hash on mount
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveSection(id);
        }
      }, 100);
    }
  }, []);

  const getLinkClasses = (sectionId) => {
    if (activeSection === sectionId) {
      return "flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-container-lowest rounded-xl shadow-sm transition-transform duration-200 hover:translate-x-1";
    }
    return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-xl transition-transform duration-200 hover:translate-x-1";
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-[136px] pb-24 flex flex-col md:flex-row gap-16 border-t border-surface-variant">
      {/* SideNavBar (Sticky Sidebar) */}
      <aside className="md:w-72 relative">
        <div className="sticky top-[120px] w-full h-fit p-6 bg-surface-container-low dark:bg-slate-900 rounded-2xl font-body text-sm font-medium border border-surface-variant/50">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-on-surface">Legal Center</h2>
            <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
              Last updated April 2026
            </p>
          </div>

          <nav className="space-y-2">
            <a href="#tos" className={getLinkClasses("tos")}>
              <span
                className="material-symbols-outlined"
                style={
                  activeSection === "tos"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                gavel
              </span>
              Terms of Service
            </a>
            <a href="#privacy" className={getLinkClasses("privacy")}>
              <span
                className="material-symbols-outlined"
                style={
                  activeSection === "privacy"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                policy
              </span>
              Privacy Policy
            </a>
            <a href="#cookies" className={getLinkClasses("cookies")}>
              <span
                className="material-symbols-outlined"
                style={
                  activeSection === "cookies"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                cookie
              </span>
              Cookie Policy
            </a>
            <a href="#gdpr" className={getLinkClasses("gdpr")}>
              <span
                className="material-symbols-outlined"
                style={
                  activeSection === "gdpr"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                security_update_good
              </span>
              GDPR Compliance
            </a>
            <a href="#security" className={getLinkClasses("security")}>
              <span
                className="material-symbols-outlined"
                style={
                  activeSection === "security"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                verified_user
              </span>
              Security
            </a>
          </nav>

          <div className="mt-12 p-6 bg-secondary-container rounded-xl overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-on-secondary-container font-bold text-xs uppercase tracking-widest mb-2">
                Need help?
              </p>
              <p className="text-on-secondary-container text-sm leading-relaxed mb-4">
                Questions about our legal framework?
              </p>
              <a
                href="#"
                className="text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all text-on-secondary-container"
              >
                CONTACT LEGAL{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
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
            <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">
              LYFFLOW - Terms of Service
            </h1>
            <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
            <p className="mt-6 text-on-surface-variant font-medium">
              Effective Date: April 13, 2026 <br /> Last Updated: April 13, 2026
            </p>
          </header>

          <div className="space-y-16">
            <div>
              <h1 className="font-headline text-4xl font-bold text-on-surface mb-6">
                Terms of Service
              </h1>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                <strong>Lyfflow</strong>
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                <strong>Effective Date:</strong> April 13, 2026
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                <strong>Last Updated:</strong> April 13, 2026
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                1. Agreement to Terms
              </h2>
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
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                2. Description of Service
              </h2>
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
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                3. Eligibility
              </h2>
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
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                4. Account Registration and Security
              </h2>

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

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                5. Subscriptions, Billing, and Payment
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.1 Subscription Plans</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Access to the Service requires a paid subscription. Details of available plans, pricing, and included features are described on our pricing page at [lyfflow.com/pricing]. We reserve the right to modify pricing at any time, with notice as described in Section 18.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.2 Billing Cycle</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Subscriptions are billed on a recurring basis (monthly or annually, as selected) beginning on the date of your initial subscription. Billing continues automatically until your subscription is cancelled.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.3 Payment Authorization</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                By providing payment information, you authorize Lyfflow (or its designated payment processor) to charge your payment method for all applicable fees. You represent that you are authorized to use the payment method provided.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.4 Taxes</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                All fees are exclusive of applicable taxes (including VAT, GST, or similar), which shall be your sole responsibility. Lyfflow may collect applicable taxes where required by law.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.5 Failed Payments</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                If a payment fails, we will attempt to notify you. Access to the Service may be suspended until outstanding amounts are settled. Lyfflow reserves the right to terminate accounts with repeated payment failures.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.6 No Refunds</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                All fees paid are non-refundable except as expressly required by applicable law or as stated in a separate refund policy published by Lyfflow. Unused subscription time is not refunded upon cancellation.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.7 Free Trials</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                If Lyfflow offers a free trial, it will be subject to any additional terms communicated at sign-up. Upon expiry of the trial, you will be charged unless you cancel prior to the trial end date.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                6. Acceptable Use Policy
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">6.1 Permitted Use</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You may use the Service solely for lawful business purposes and in accordance with these Terms, all applicable laws, and Meta's Platform Terms.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-6 mt-6">
                6.2 Prohibited Activities
              </h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                You must not use the Service to:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-red-500/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Send unsolicited, deceptive, fraudulent, or spam messages to Facebook Messenger users;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Impersonate any person, company, or entity, or misrepresent your affiliation with any party;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Collect, harvest, or process personal data of Messenger users in violation of applicable privacy laws (including GDPR, PDPA, or equivalent legislation);</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Disseminate content that is illegal, defamatory, obscene, threatening, abusive, hateful, or otherwise objectionable;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Violate Meta's Messenger Platform Policies or Community Standards;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Engage in any activity that constitutes unauthorized automation, scraping, or data extraction from Meta's platforms beyond what is permitted under Meta's API terms;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Distribute malware, viruses, or any other malicious code;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Interfere with or disrupt the integrity or performance of the Service or its infrastructure;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Attempt to gain unauthorized access to any component of the Service or its related systems;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Circumvent, disable, or otherwise interfere with security features of the Service;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Resell, sublicense, or commercialize access to the Service without our express written authorization;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">cancel</span>
                  <span className="text-lg">Use the Service in a manner that could expose Lyfflow to legal liability.</span>
                </li>
              </ul>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">6.3 AI-Generated Content</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You acknowledge that AI-generated responses produced by the Service are automated and may not always be accurate, appropriate, or suitable. You are solely responsible for reviewing AI agent configurations, monitoring deployed agents, and ensuring compliance with applicable laws and Meta policies.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                7. Facebook and Meta Platform Compliance
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                The Service integrates with the Meta Messenger Platform. Your use of the Service in connection with Facebook Pages is additionally governed by:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">policy</span>
                  <span className="text-lg">
                    <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Meta's Platform Terms
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">policy</span>
                  <span className="text-lg">
                    <a href="https://transparency.fb.com/policies/community-standards/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Meta's Community Standards
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">policy</span>
                  <span className="text-lg">
                    <a href="https://developers.facebook.com/docs/messenger-platform/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Meta's Messenger Platform Policy
                    </a>
                  </span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                You agree to comply with all such policies. Lyfflow is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. We are not responsible for any suspension, restriction, or termination of your Facebook Page or developer account by Meta.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                8. Intellectual Property Rights
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">8.1 Lyfflow's Intellectual Property</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                All rights, title, and interest in and to the Service, including all software, algorithms, user interfaces, designs, trademarks, service marks, logos, and documentation, are owned by or licensed to Lyfflow. Nothing in these Terms grants you any right, title, or license to Lyfflow's intellectual property except for the limited right to use the Service as set forth herein.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">8.2 Your Content and Data</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You retain all ownership rights to content, data, and materials you upload to or create through the Service ("User Content"), including knowledge base documents, agent configurations, and conversation data. By uploading User Content, you grant Lyfflow a non-exclusive, worldwide, royalty-free license to store, process, and transmit your User Content solely as necessary to provide the Service.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">8.3 Feedback</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                If you provide suggestions, feedback, or ideas regarding the Service, you grant Lyfflow a perpetual, irrevocable, royalty-free license to use such feedback for any purpose without compensation or attribution to you.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                9. Data Privacy and Security
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">9.1 Privacy Policy</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at [lyfflow.com/privacy] to understand how we collect, use, and protect your information.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">9.2 Data You Process Through the Service</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                To the extent you process personal data of third parties (e.g., your Messenger end-users) using the Service, you are responsible for ensuring you have a lawful basis for doing so and that you comply with all applicable data protection laws. Lyfflow acts as a data processor on your behalf in relation to such third-party personal data.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">9.3 Security</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Lyfflow implements commercially reasonable technical and organizational measures to protect the Service and your data. However, no system is completely secure, and Lyfflow does not warrant that unauthorized access, hacking, data loss, or breaches will never occur.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">9.4 Data Retention</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                We retain your account data for the duration of your subscription and for a reasonable period thereafter, as described in our Privacy Policy. Upon account termination, data may be deleted in accordance with our data retention schedule.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                10. Third-Party Services and Integrations
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                The Service may interact with or depend upon third-party services, including but not limited to:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">extension</span>
                  <span className="text-lg">Meta / Facebook Messenger Platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">extension</span>
                  <span className="text-lg">OpenAI API</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">extension</span>
                  <span className="text-lg">Pinecone vector database</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">extension</span>
                  <span className="text-lg">Redis and other infrastructure providers</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                Lyfflow does not endorse or assume responsibility for any third-party services. Your use of third-party services may be subject to their own terms and privacy policies. Interruptions, changes, or terminations of third-party services may affect the availability or functionality of Lyfflow, and we shall not be liable for any resulting disruption.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                11. Service Availability and Maintenance
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">11.1 Uptime</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Lyfflow will use commercially reasonable efforts to maintain Service availability. However, we do not guarantee uninterrupted or error-free operation of the Service.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">11.2 Scheduled Maintenance</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                We may perform scheduled maintenance that temporarily interrupts the Service. Where reasonably practicable, we will provide advance notice of scheduled downtime.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">11.3 No Liability for Downtime</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Lyfflow shall not be liable for any damages or losses resulting from Service outages, interruptions, or degraded performance, whether scheduled or unscheduled.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                12. Suspension and Termination
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">12.1 Termination by You</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You may cancel your subscription and terminate your account at any time through your account dashboard or by contacting support. Termination takes effect at the end of your current billing cycle unless otherwise stated.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">12.2 Suspension or Termination by Lyfflow</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                We reserve the right to suspend or terminate your account, with or without notice, if:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-red-500/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">gavel</span>
                  <span className="text-lg">You breach any provision of these Terms;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">gavel</span>
                  <span className="text-lg">We determine, in our sole discretion, that your use of the Service poses a risk to us, other users, third parties, or the integrity of the Service;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">gavel</span>
                  <span className="text-lg">Required by applicable law or court order;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">gavel</span>
                  <span className="text-lg">Your account is inactive for an extended period as defined in our policies.</span>
                </li>
              </ul>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">12.3 Effect of Termination</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
                Upon termination, your right to access and use the Service immediately ceases. We may delete your account data in accordance with our data retention policy. Provisions of these Terms that by their nature should survive termination (including Sections 8, 9, 13, 14, 15, and 16) shall survive.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                13. Disclaimers and Warranties
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4 uppercase">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4 uppercase">
                LYFFLOW DOES NOT WARRANT THAT:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6 uppercase">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                  <span className="text-lg">THE SERVICE WILL MEET YOUR SPECIFIC REQUIREMENTS;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                  <span className="text-lg">THE SERVICE WILL OPERATE WITHOUT INTERRUPTION, ERROR, OR DEFECT;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                  <span className="text-lg">AI-GENERATED OUTPUTS WILL BE ACCURATE, COMPLETE, OR APPROPRIATE FOR ANY PARTICULAR USE;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                  <span className="text-lg">ANY DEFECTS IN THE SERVICE WILL BE CORRECTED.</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4 uppercase">
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                14. Limitation of Liability
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4 uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LYFFLOW, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6 uppercase">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">shield</span>
                  <span className="text-lg">INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">shield</span>
                  <span className="text-lg">LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">shield</span>
                  <span className="text-lg">DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">shield</span>
                  <span className="text-lg">DAMAGES ARISING FROM UNAUTHORIZED ACCESS TO YOUR ACCOUNT OR DATA;</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4 uppercase">
                WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF LYFFLOW HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4 uppercase">
                IN ANY CASE, LYFFLOW'S AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED THE TOTAL AMOUNTS PAID BY YOU TO LYFFLOW IN THE <strong>THREE (3) MONTHS</strong> IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4 uppercase">
                SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS OF LIABILITY, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                15. Indemnification
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
                You agree to defend, indemnify, and hold harmless Lyfflow and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">balance</span>
                  <span className="text-lg">Your use or misuse of the Service;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">balance</span>
                  <span className="text-lg">Your violation of these Terms;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">balance</span>
                  <span className="text-lg">Your violation of any applicable law, regulation, or third-party rights (including Meta's policies);</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">balance</span>
                  <span className="text-lg">Any User Content you submit through the Service;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">balance</span>
                  <span className="text-lg">Your AI agent configurations and the automated messages sent on your behalf.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                16. Dispute Resolution
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">16.1 Informal Resolution</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Before initiating any formal legal proceeding, you agree to contact Lyfflow at [legal@lyfflow.com] and attempt to resolve the dispute informally for at least thirty (30) days.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">16.2 Governing Law</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">16.3 Jurisdiction</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Any disputes not resolved informally shall be subject to the exclusive jurisdiction of the competent courts located in Dhaka, Bangladesh. You consent to personal jurisdiction in such courts.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">16.4 Class Action Waiver</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                To the extent permitted by law, you waive any right to bring claims against Lyfflow as a plaintiff or class member in any class action, consolidated, or representative proceeding.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                17. Confidentiality
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You agree to keep confidential any non-public information about the Service, its technology, pricing, or business that is disclosed to you in the course of using the Service, and not to disclose such information to any third party without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                18. Modifications to Terms and Service
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">18.1 Changes to Terms</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you via email or a prominent notice within the Service at least <strong>14 days</strong> before the changes take effect. Your continued use of the Service after the effective date of the updated Terms constitutes your acceptance of the changes.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">18.2 Changes to Service</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                We may modify, suspend, or discontinue any aspect of the Service at any time. We will endeavor to provide reasonable notice of significant changes where practicable.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                19. General Provisions
              </h2>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.1 Entire Agreement</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                These Terms, together with the Privacy Policy and any other agreements referenced herein, constitute the entire agreement between you and Lyfflow with respect to the Service and supersede all prior or contemporaneous agreements.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.2 Severability</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.3 Waiver</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Failure by Lyfflow to enforce any provision of these Terms shall not constitute a waiver of our right to enforce such provision in the future.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.4 Assignment</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                You may not assign or transfer any rights or obligations under these Terms without our prior written consent. Lyfflow may assign these Terms freely, including in connection with a merger, acquisition, or sale of assets.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.5 Force Majeure</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Lyfflow shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including but not limited to acts of God, war, terrorism, internet outages, government actions, or failures of third-party service providers.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.6 No Agency</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and Lyfflow.
              </p>

              <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">19.7 Headings</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                Section headings are for convenience only and shall not affect the interpretation of these Terms.
              </p>
            </div>

            {/* <div>
    <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
      20. Contact Information
    </h2>
    <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
      For questions about these Terms of Service, please contact us at:
    </p>
    <p className="text-lg leading-relaxed text-on-surface-variant font-light">
      <strong>Lyfflow</strong><br/>
      Email: [legal@lyfflow.com]<br/>
      Support: [support@lyfflow.com]<br/>
      Website: [lyfflow.com]<br/>
      Address: Dhaka, Bangladesh
    </p>
  </div> */}

            <div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                20. Contact Information
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-8">
                For questions about these Terms of Service, please contact us at:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legal Inquiries Card */}
                <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg mb-1">Legal Inquiries</h4>
                    <a href="mailto:legal@lyfflow.com" className="text-secondary hover:text-primary transition-colors font-light text-lg">
                      legal@lyfflow.com
                    </a>
                  </div>
                </div>

                {/* Customer Support Card */}
                <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg mb-1">Customer Support</h4>
                    <a href="mailto:support@lyfflow.com" className="text-secondary hover:text-primary transition-colors font-light text-lg">
                      support@lyfflow.com
                    </a>
                  </div>
                </div>

                {/* Website Card */}
                <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">language</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg mb-1">Website</h4>
                    <a href="https://lyfflow.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors font-light text-lg">
                      lyfflow.com
                    </a>
                  </div>
                </div>

                {/* Address Card */}
                <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-lg mb-1">Headquarters</h4>
                    <p className="text-on-surface-variant font-light text-lg">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>


              </div>
            </div>

            <div className="flex flex-col space-y-8">
              {/* Pro Tip Box */}
              <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-primary shadow-sm">
                <p className="font-headline text-xl font-bold text-primary mb-2 italic">
                  Pro Tip for Enterprise Clients
                </p>
                <p className="text-on-surface-variant">
                  Ensure your team has read the full compliance guide before
                  initializing large-scale automated deployments to comply with
                  Meta's messaging policies.
                </p>
              </div>

              {/* Footer Note */}
              <div>
                <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-8">
                  *The above is an excerpt. Please view the full documentation for
                  all sections including Subscriptions, Acceptable Use, IP Rights,
                  and Disclaimers.*
                </p>
              </div>
            </div>

            <div className="pt-8 text-center border-t border-primary/20">
              <p className="text-lg leading-relaxed text-on-surface-variant font-light italic">
                *By using Lyfflow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.*
              </p>
            </div>
          </div>
        </section>

        <hr className="border-surface-variant/50" />

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-32">
  <header className="mb-12">
    <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">
      Privacy Policy
    </h1>
    <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
    <p className="mt-6 text-on-surface-variant font-medium text-lg">
      <strong>Brand:</strong> Lyfflow <br />
      <strong>Product:</strong> QchatLive <br />
      <strong>Effective Date:</strong> April 13, 2025 <br />
      <strong>Last Updated:</strong> April 13, 2025
    </p>
  </header>

  <div className="space-y-16">
    {/* 1. Introduction */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        1. Introduction
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        Welcome to QchatLive, an AI-powered communication and business messaging platform operated by <strong>Lyfflow</strong> ("Lyfflow", "we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and related services (collectively, the "Service").
      </p>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        By accessing or using QchatLive, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Service immediately.
      </p>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        This policy applies to all users of QchatLive globally, including users located in Bangladesh, the European Union, the United Kingdom, and the United States of America.
      </p>
    </div>

    {/* 2. Information We Collect */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        2. Information We Collect
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-6">
        We collect information in the following ways:
      </p>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">2.1 Information You Provide Directly</h3>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">person</span>
          <span className="text-lg"><strong>Account Information:</strong> Full name, email address, phone number, and password when you register.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">storefront</span>
          <span className="text-lg"><strong>Business Information:</strong> Business or page name, industry type, and relevant business details you provide during onboarding.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">credit_card</span>
          <span className="text-lg"><strong>Payment Information:</strong> Billing address and payment details processed securely through third-party payment processors. We do not store raw card data on our servers.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">support_agent</span>
          <span className="text-lg"><strong>Support Communications:</strong> Any messages, feedback, or inquiries you send to our support team.</span>
        </li>
      </ul>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">2.2 Information from Third-Party Platforms</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        When you connect QchatLive to your Facebook Page or Instagram account via the Meta API, we collect:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">api</span>
          <span className="text-lg"><strong>Facebook Page Access Tokens</strong> required to send and receive messages on your behalf.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">data_object</span>
          <span className="text-lg"><strong>Page metadata:</strong> Page name, Page ID, and page category.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">forum</span>
          <span className="text-lg"><strong>Conversation data:</strong> Messages, comments, and user interactions on your connected Facebook Page or Instagram account.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">fingerprint</span>
          <span className="text-lg"><strong>Messenger user identifiers (PSIDs):</strong> Unique identifiers assigned by Facebook to individuals who message your Page. We do not receive personal profile information about your customers beyond what they voluntarily share in conversation.</span>
        </li>
      </ul>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">2.3 Information Collected Automatically</h3>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">analytics</span>
          <span className="text-lg"><strong>Usage Data:</strong> Pages visited, features used, session duration, click events, and navigation paths within the platform.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">devices</span>
          <span className="text-lg"><strong>Device and Technical Data:</strong> IP address, browser type and version, operating system, device identifiers, and time zone.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">receipt_long</span>
          <span className="text-lg"><strong>Log Data:</strong> Server logs, error reports, and API request logs for security and debugging purposes.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">cookie</span>
          <span className="text-lg"><strong>Cookies and Tracking Technologies:</strong> Session cookies, persistent cookies, and similar technologies to maintain your session, remember preferences, and analyze usage. See Section 9 for full details.</span>
        </li>
      </ul>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">2.4 AI-Generated and Processed Data</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        As part of delivering AI-powered features, QchatLive processes:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">smart_toy</span>
          <span className="text-lg">Conversation content to generate smart replies and response suggestions.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">history</span>
          <span className="text-lg">Message history to provide contextually relevant AI responses.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">upload_file</span>
          <span className="text-lg">Knowledge base content you upload (text, documents) to train your AI agent.</span>
        </li>
      </ul>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        This data is processed by our AI infrastructure and, where applicable, by third-party AI providers including OpenAI. Please refer to Section 5 for details on third-party sharing.
      </p>
    </div>

    {/* 3. How We Use Your Information */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        3. How We Use Your Information
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-6">
        We use the information we collect for the following purposes:
      </p>
      
      <div className="overflow-x-auto rounded-xl border border-surface-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest">
              <th className="py-4 px-6 font-bold text-on-surface border-b border-surface-variant/30">Purpose</th>
              <th className="py-4 px-6 font-bold text-on-surface border-b border-surface-variant/30">Legal Basis (GDPR)</th>
            </tr>
          </thead>
          <tbody className="text-on-surface-variant font-light text-lg divide-y divide-surface-variant/20 bg-surface-container-lowest">
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To provide, operate, and maintain the Service</td>
              <td className="py-4 px-6 font-medium">Performance of contract</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To authenticate your identity and manage your account</td>
              <td className="py-4 px-6 font-medium">Performance of contract</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To process payments and send billing communications</td>
              <td className="py-4 px-6 font-medium">Performance of contract / Legal obligation</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To generate AI-powered replies on your behalf</td>
              <td className="py-4 px-6 font-medium">Performance of contract</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To improve platform features and user experience</td>
              <td className="py-4 px-6 font-medium">Legitimate interest</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To monitor for security threats and prevent fraud</td>
              <td className="py-4 px-6 font-medium">Legitimate interest / Legal obligation</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To send product updates, feature announcements, and newsletters</td>
              <td className="py-4 px-6 font-medium">Consent</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To comply with applicable laws and regulations</td>
              <td className="py-4 px-6 font-medium">Legal obligation</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To respond to support requests</td>
              <td className="py-4 px-6 font-medium">Legitimate interest / Performance of contract</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6">To conduct analytics and measure platform performance</td>
              <td className="py-4 px-6 font-medium">Legitimate interest</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        We will never use your data for purposes incompatible with those listed above without your explicit consent.
      </p>
    </div>

    {/* 4. Facebook and Meta Platform Data */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        4. Facebook and Meta Platform Data
      </h2>
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
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
          <span className="text-lg">Conversation data accessed via the Meta API is stored securely and retained only for as long as necessary to provide the Service or as required by law.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
          <span className="text-lg">Your use of QchatLive in connection with Meta platforms is also subject to <a href="https://www.facebook.com/privacy/policy/" className="text-primary hover:underline">Meta's Privacy Policy</a> and <a href="https://developers.facebook.com/terms/" className="text-primary hover:underline">Meta's Platform Terms</a>.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
          <span className="text-lg">You may disconnect your Facebook Page from QchatLive at any time through your dashboard settings or through your Facebook Page Settings.</span>
        </li>
      </ul>
    </div>

    {/* 5. How We Share Your Information */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        5. How We Share Your Information
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-6">
        We do not sell your personal information. We may share your information only in the following circumstances:
      </p>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-6">5.1 Service Providers and Sub-processors</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        We engage trusted third-party service providers who process data on our behalf, including:
      </p>
      <ul className="space-y-3 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6 list-disc list-inside text-lg font-light">
        <li><strong>OpenAI</strong> — for AI language model inference and smart reply generation.</li>
        <li><strong>Pinecone</strong> — for vector database storage used in AI knowledge base features.</li>
        <li><strong>Meta (Facebook)</strong> — for Messenger and Instagram API integration.</li>
        <li><strong>Payment Processors</strong> — for secure billing and subscription management.</li>
        <li><strong>Cloud Infrastructure Providers</strong> — for hosting, storage, and computing services.</li>
        <li><strong>Analytics Providers</strong> — for usage analytics and product improvement.</li>
      </ul>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        All sub-processors are bound by data processing agreements and are required to implement appropriate security measures.
      </p>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">5.2 Business Transfers</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        If Lyfflow is involved in a merger, acquisition, asset sale, or bankruptcy proceeding, your information may be transferred as part of that transaction. We will provide notice before your data becomes subject to a different privacy policy.
      </p>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">5.3 Legal Obligations</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        We may disclose your information if required to do so by law or in good-faith belief that such action is necessary to comply with a legal obligation, protect the rights or safety of Lyfflow, our users, or the public, or respond to a verified government or law enforcement request.
      </p>

      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 mt-8">5.4 With Your Consent</h3>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        We may share your information with third parties when you have given us explicit consent to do so.
      </p>
    </div>

    {/* 6. Data Retention */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        6. Data Retention
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        We retain your personal data for as long as your account is active or as needed to provide the Service. Specifically:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
          <span className="text-lg"><strong>Account data</strong> is retained for the duration of your subscription and for up to <strong>90 days</strong> after account deletion, to allow for reactivation or dispute resolution.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
          <span className="text-lg"><strong>Conversation and message data</strong> is retained for as long as your account is active, or for the period specified in your subscription plan.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
          <span className="text-lg"><strong>Payment records</strong> are retained for a minimum of <strong>7 years</strong> to comply with financial regulations.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
          <span className="text-lg"><strong>Log and security data</strong> is retained for up to <strong>12 months.</strong></span>
        </li>
      </ul>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        Upon verified deletion request or account closure, we will permanently delete or anonymize your personal data within <strong>30 days</strong>, except where retention is required by applicable law.
      </p>
    </div>

    {/* 7. Data Security */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        7. Data Security
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        We implement industry-standard security measures to protect your information, including:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">lock</span>
          <span className="text-lg"><strong>Encryption in transit</strong> using TLS 1.2 or higher for all data transmitted between your browser and our servers.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">database</span>
          <span className="text-lg"><strong>Encryption at rest</strong> for sensitive data stored in our databases.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">admin_panel_settings</span>
          <span className="text-lg"><strong>Access controls</strong> — data access is restricted to authorized personnel on a need-to-know basis.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">policy</span>
          <span className="text-lg"><strong>Regular security audits</strong> and vulnerability assessments.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">key</span>
          <span className="text-lg"><strong>API key and token security</strong> — Facebook access tokens are encrypted and never exposed in client-side code.</span>
        </li>
      </ul>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        Despite these measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security, and you use the Service at your own risk. In the event of a data breach that affects your personal data, we will notify you as required by applicable law.
      </p>
    </div>

    {/* 8. Your Rights */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        8. Your Rights
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-6">
        Depending on your location, you may have the following rights regarding your personal data:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* All Users */}
        <div className="bg-surface-container p-6 rounded-2xl border border-surface-variant/30">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">public</span>
            All Users
          </h3>
          <ul className="space-y-2 text-on-surface-variant text-lg font-light list-disc list-inside">
            <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Deletion:</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Data Portability:</strong> Request your data in a structured format.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications.</li>
          </ul>
        </div>

        {/* EU / UK Users */}
        <div className="bg-surface-container p-6 rounded-2xl border border-surface-variant/30">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">euro</span>
            EU / UK Users (GDPR / UK GDPR)
          </h3>
          <p className="text-on-surface-variant text-lg font-light mb-2">In addition to the above, you have the right to:</p>
          <ul className="space-y-2 text-on-surface-variant text-lg font-light list-disc list-inside">
            <li><strong>Object to processing</strong> based on legitimate interests.</li>
            <li><strong>Restrict processing</strong> in certain circumstances.</li>
            <li><strong>Lodge a complaint</strong> with your local data protection authority.</li>
          </ul>
        </div>

        {/* California Residents */}
        <div className="bg-surface-container p-6 rounded-2xl border border-surface-variant/30">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">location_city</span>
            California Residents (CCPA / CPRA)
          </h3>
          <ul className="space-y-2 text-on-surface-variant text-lg font-light list-disc list-inside">
            <li>Know what personal information we collect, use, and disclose.</li>
            <li>Opt out of the sale or sharing of personal information.</li>
            <li>Non-discrimination for exercising your privacy rights.</li>
            <li>Correct inaccurate personal information.</li>
            <li>Limit the use of sensitive personal information.</li>
          </ul>
        </div>

        {/* Bangladesh Users */}
        <div className="bg-surface-container p-6 rounded-2xl border border-surface-variant/30 flex flex-col justify-center">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">gavel</span>
            Bangladesh Users
          </h3>
          <p className="text-on-surface-variant text-lg font-light">
            Your use of our Service is also subject to the <strong>Digital Security Act 2018</strong> and applicable Bangladesh laws governing digital data and communications.
          </p>
        </div>
      </div>

      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-6">
        To exercise any of your rights, contact us at: <strong>[privacy@lyfflow.com]</strong>. We will respond to all verified requests within <strong>30 days.</strong>
      </p>
    </div>

    {/* 9. Cookies and Tracking Technologies */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        9. Cookies and Tracking Technologies
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-6">
        QchatLive uses the following types of cookies:
      </p>

      <div className="overflow-x-auto rounded-xl border border-surface-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest">
              <th className="py-4 px-6 font-bold text-on-surface border-b border-surface-variant/30">Cookie Type</th>
              <th className="py-4 px-6 font-bold text-on-surface border-b border-surface-variant/30">Purpose</th>
              <th className="py-4 px-6 font-bold text-on-surface border-b border-surface-variant/30">Can Be Disabled?</th>
            </tr>
          </thead>
          <tbody className="text-on-surface-variant font-light text-lg divide-y divide-surface-variant/20 bg-surface-container-lowest">
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6 font-medium">Essential Cookies</td>
              <td className="py-4 px-6">Required for login, session management, and platform function</td>
              <td className="py-4 px-6">No — Service will not function</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6 font-medium">Analytics Cookies</td>
              <td className="py-4 px-6">Track usage patterns to improve the platform</td>
              <td className="py-4 px-6 text-green-600 font-medium">Yes</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6 font-medium">Preference Cookies</td>
              <td className="py-4 px-6">Remember your settings and customizations</td>
              <td className="py-4 px-6 text-green-600 font-medium">Yes</td>
            </tr>
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-4 px-6 font-medium">Marketing Cookies</td>
              <td className="py-4 px-6">Track referrals and campaign effectiveness</td>
              <td className="py-4 px-6 text-green-600 font-medium">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        You may control cookie preferences through your browser settings or our in-platform cookie consent tool. Note that disabling essential cookies will impair your ability to use the Service.
      </p>
    </div>

    {/* 10. Children's Privacy */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        10. Children's Privacy
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        QchatLive is intended solely for use by individuals who are <strong>18 years of age or older</strong>. We do not knowingly collect personal information from anyone under the age of 13 (or 16 in the EU). If we learn that we have inadvertently collected data from a child, we will delete it immediately. If you believe a child has provided us with personal information, please contact us at <strong>[privacy@lyfflow.com]</strong>.
      </p>
    </div>

    {/* 11. International Data Transfers */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        11. International Data Transfers
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        Lyfflow operates globally. Your data may be transferred to and processed in countries outside your country of residence, including countries that may not have the same data protection laws as your home country.
      </p>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        Where we transfer data from the European Economic Area (EEA) or United Kingdom to countries not deemed adequate by the European Commission, we rely on appropriate safeguards, including:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">verified</span>
          <span className="text-lg">Standard Contractual Clauses (SCCs) approved by the European Commission.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">verified</span>
          <span className="text-lg">Data processing agreements with all sub-processors.</span>
        </li>
      </ul>
    </div>

    {/* 12. Third-Party Links and Integrations */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        12. Third-Party Links and Integrations
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
        Our platform may contain links to third-party websites or integrate with external services (such as Meta, payment processors, or analytics tools). This Privacy Policy does not apply to those third-party services. We encourage you to review the privacy policies of any third-party services you connect with through QchatLive.
      </p>
    </div>

    {/* 13. Changes to This Privacy Policy */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        13. Changes to This Privacy Policy
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-4">
        We reserve the right to update this Privacy Policy at any time. When we make material changes, we will:
      </p>
      <ul className="space-y-4 text-on-surface-variant ml-4 border-l-2 border-primary/20 pl-6">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">update</span>
          <span className="text-lg">Update the "Last Updated" date at the top of this page.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">mark_email_unread</span>
          <span className="text-lg">Notify registered users via email or an in-platform notification.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-1">rule</span>
          <span className="text-lg">Where required by law, request renewed consent.</span>
        </li>
      </ul>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-4">
        Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated policy.
      </p>
    </div>

    {/* 14. Contact Us */}
    <div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
        14. Contact Us
      </h2>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mb-8">
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Card */}
        <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">mail</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-lg mb-1">Privacy Team</h4>
            <a href="mailto:privacy@lyfflow.com" className="text-secondary hover:text-primary transition-colors font-light text-lg">
              privacy@lyfflow.com
            </a>
          </div>
        </div>

        {/* Website Card */}
        <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">language</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-lg mb-1">Websites</h4>
            <div className="flex flex-col gap-1">
              <a href="https://www.lyfflow.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors font-light text-lg">
                www.lyfflow.com
              </a>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="flex items-start gap-4 p-6 bg-surface-container border border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">location_on</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-lg mb-1">Headquarters</h4>
            <p className="text-on-surface-variant font-light text-lg">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </div>
      <p className="text-lg leading-relaxed text-on-surface-variant font-light mt-6">
        For GDPR-specific inquiries, you may also contact our designated representative at the same email address.
      </p>
    </div>

    {/* Footer Disclaimer */}
    <div className="pt-8 text-center border-t border-primary/20">
      <p className="text-lg leading-relaxed text-on-surface-variant font-light italic">
        *This Privacy Policy was prepared by the Legal Team at Lyfflow and is intended for informational purposes. It does not constitute legal advice. We recommend consulting a qualified legal professional to ensure full compliance with all applicable laws in your jurisdiction.*
      </p>
    </div>
  </div>
</section>

        {/* Cookie Policy Section Placeholder */}
        <section id="cookies" className="scroll-mt-32"></section>

        {/* GDPR Compliance Section Placeholder */}
        <section id="gdpr" className="scroll-mt-32"></section>

        {/* Security Section Placeholder */}
        <section id="security" className="scroll-mt-32"></section>
      </article>
    </section>
  );
}

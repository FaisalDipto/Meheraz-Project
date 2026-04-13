import React from 'react';
import Navbar from '../components/Navbar';
import LegalCenter from '../components/LegalCenter';
import Footer from '../components/Footer';

export default function Legal() {
  return (
    <div className="bg-background font-body text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <Navbar />
      <main>
        <LegalCenter />
      </main>
      <Footer />
    </div>
  );
}

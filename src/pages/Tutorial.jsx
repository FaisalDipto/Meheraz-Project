import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Tutorial() {
  return (
    <div className="bg-surface min-h-screen flex flex-col font-body text-on-surface">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-8 text-center pt-24">
        <div>
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 inline-block">school</span>
          <h1 className="text-5xl font-headline font-black tracking-tighter text-slate-900 mb-4">Tutorials</h1>
          <p className="text-slate-500 max-w-md mx-auto text-lg">We're putting together comprehensive guides to help you master LYFFLOW. Check back soon!</p>
          <div className="mt-8">
            <span className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase inline-block">
              Coming Soon
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

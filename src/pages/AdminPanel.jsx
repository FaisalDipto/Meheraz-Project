import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-2xl border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-emerald-600">admin_panel_settings</span>
        </div>
        <h1 className="text-4xl font-headline font-black text-slate-900 mb-4 tracking-tight">Admin Control Panel</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Welcome to the LYFFLOW Admin Interface. This is currently a placeholder. Advanced management tools and analytics will be built here soon.
        </p>
        
        <button 
          onClick={() => navigate('/app/admin/login')}
          className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

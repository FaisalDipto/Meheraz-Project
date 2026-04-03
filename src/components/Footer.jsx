export default function Footer() {
  return (
    <footer className="bg-white py-20 px-8">
      <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto border-t border-slate-100 pt-16">
        <div className="mb-10 md:mb-0 text-center md:text-left">
          <div className="text-2xl font-black text-primary mb-3 tracking-tighter flex items-center justify-center md:justify-start gap-1">
            <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="logo-q" style={{ position: 'relative', display: 'flex', alignItems: 'center', fontWeight: '900', color: '#0ea5e9', fontSize: '28px', lineHeight: '1' }}>
                Q
                <div className="logo-bubble" style={{ position: 'absolute', top: '-4px', right: '-12px', background: '#cbd5e1', padding: '4px', borderRadius: '8px', borderRadiusBottomLeft: '2px', display: 'flex', gap: '2px' }}>
                  <div className="logo-dot" style={{ width: '3px', height: '3px', background: '#fff', borderRadius: '50%' }}></div>
                  <div className="logo-dot" style={{ width: '3px', height: '3px', background: '#fff', borderRadius: '50%' }}></div>
                  <div className="logo-dot" style={{ width: '3px', height: '3px', background: '#fff', borderRadius: '50%' }}></div>
                </div>
              </div>
              <span className="logo-text" style={{ fontWeight: '700', fontSize: '24px', color: '#0f172a', marginLeft: '10px' }}>chat</span>
            </div>
          </div>
          <p className="font-['Inter'] text-slate-500 text-sm">© {new Date().getFullYear()} Qchat, Inc. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Contact Support</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">API Docs</a>
        </div>
      </div>
    </footer>
  );
}

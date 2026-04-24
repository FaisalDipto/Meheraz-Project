import { useEffect } from 'react' // Final check on imports
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'
import Legal from './pages/Legal'
import Pricing from './pages/Pricing'
import Sales from './pages/Sales'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import { WidgetProvider } from './context/WidgetContext'
import './App.css'

// Handles scroll-to-top on route change and smooth-scroll to hash sections
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Give the page time to render before scrolling to the element
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      // No hash — always start at the top of the new page
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const location = useLocation();
  return (
    <WidgetProvider>
      <ScrollManager />
      <Routes>
        <Route path="/app" element={<Home />} />
        <Route path="/app/get-started" element={<GetStarted />} />
        <Route path="/app/login" element={<Login />} />
        <Route path="/app/dashboard/*" element={<Dashboard />} />
        <Route path="/app/feedback" element={<Feedback />} />
        <Route path="/app/legal" element={<Legal />} />
        <Route path="/app/pricing" element={<Pricing />} />
        <Route path="/app/sales" element={<Sales />} />
        <Route path="/app/admin/login" element={<AdminLogin />} />
        <Route path="/app/admin" element={<AdminPanel />} />
        
        
        {/* Redirect hardcoded backend callbacks back to /app prefix */}
        <Route path="/dashboard/*" element={<Navigate to={`/app${location.pathname}${location.search}`} replace />} />
      </Routes>
    </WidgetProvider>
  )
}

export default App

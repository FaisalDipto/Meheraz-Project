import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'
import { WidgetProvider } from './context/WidgetContext'
import './App.css'

function App() {
  const location = useLocation();
  return (
    <WidgetProvider>
      <Routes>
        <Route path="/app" element={<Home />} />
        <Route path="/app/get-started" element={<GetStarted />} />
        <Route path="/app/login" element={<Login />} />
        <Route path="/app/dashboard/*" element={<Dashboard />} />
        <Route path="/app/feedback" element={<Feedback />} />
        
        {/* Redirect hardcoded backend callbacks back to /app prefix */}
        <Route path="/dashboard/*" element={<Navigate to={`/app${location.pathname}${location.search}`} replace />} />
      </Routes>
    </WidgetProvider>
  )
}

export default App

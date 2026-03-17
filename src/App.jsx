import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'
import { WidgetProvider } from './context/WidgetContext'
import './App.css'

function App() {
  return (
    <WidgetProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </WidgetProvider>
  )
}

export default App

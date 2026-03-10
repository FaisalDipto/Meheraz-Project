import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../App.css'

export default function Home() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}

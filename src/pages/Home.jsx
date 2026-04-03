import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../App.css'

export default function Home() {
  return (
    <div className="bg-background font-body text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  )
}

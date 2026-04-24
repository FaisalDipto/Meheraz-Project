import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'
import '../App.css'
import catAnimationUrl from '../../animation/catLottieJSON.json?url'

export default function Home() {
  useEffect(() => {
    // Preload the Get Started cat animation so it's instantly available from cache
    fetch(catAnimationUrl).catch(() => {});
  }, []);

  return (
    <div className="bg-background font-body text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <Navbar />
      <main>
        <Hero />
      </main>
      <FAQ />
      <Footer />
    </div>
  )
}

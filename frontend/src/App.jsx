import { useState, useCallback } from 'react'
import BackgroundFX from './components/BackgroundFX'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Industries from './components/Industries'
import Results from './components/Results'
import Process from './components/Process'
import InquiryForm from './components/InquiryForm'
import Booking from './components/Booking'
import CaseStudies from './components/CaseStudies'
import Footer from './components/Footer'
import Modal from './components/Modal'
import WhatsAppFloat from './components/WhatsAppFloat'

function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const handleSplashComplete = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <BackgroundFX />

      <Navbar openModal={openModal} />
      <Hero openModal={openModal} />
      <Services />
      <CaseStudies />
      <Industries />
      <Results />
      <Process />
      <Booking />
      <InquiryForm />
      <Footer openModal={openModal} />
      <Modal isOpen={modalOpen} onClose={closeModal} />
      <WhatsAppFloat />
    </>
  )
}

export default App

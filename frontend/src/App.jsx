import { useState, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Results from './components/Results'
import Process from './components/Process'
import InquiryForm from './components/InquiryForm'
import Footer from './components/Footer'
import Modal from './components/Modal'

function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const handleSplashComplete = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="grid-bg" />
      <div className="gradient-orb gradient-orb--1" />
      <div className="gradient-orb gradient-orb--2" />
      <div className="gradient-orb gradient-orb--3" />

      <Navbar openModal={openModal} />
      <Hero openModal={openModal} />
      <Services />
      <Results />
      <Process />
      <InquiryForm />
      <Footer openModal={openModal} />
      <Modal isOpen={modalOpen} onClose={closeModal} />
    </>
  )
}

export default App

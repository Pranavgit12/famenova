import { useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const CALENDLY_URL = 'https://calendly.com/famenovaa/30min?hide_event_type_details=1&hide_gdpr_banner=1'

export default function Booking() {
  return (
    <section className="booking" id="booking">
      <div className="container">
        <SectionHeader />
        <CalendlyEmbed />
      </div>
    </section>
  )
}

function SectionHeader() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`section-header reveal${isVisible ? ' visible' : ''}`}>
      <div className="section-label">
        <span className="section-label-line"></span> Book a Call
      </div>
      <h2 className="section-title">Book a Meeting</h2>
      <p className="section-desc">
        Skip the back-and-forth. Pick a date, choose a time, and you're booked.
      </p>
    </div>
  )
}

function CalendlyEmbed() {
  const containerRef = useRef(null)
  const { ref: revealRef, isVisible } = useScrollReveal({ threshold: 0.1 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    container.appendChild(script)

    return () => {
      if (container.contains(script)) {
        container.removeChild(script)
      }
    }
  }, [])

  return (
    <div ref={node => {
      revealRef.current = node
      containerRef.current = node
    }} className={`booking-widget reveal${isVisible ? ' visible' : ''} reveal-delay-1`}>
      <div
        className="calendly-inline-widget"
        data-url={CALENDLY_URL}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  )
}

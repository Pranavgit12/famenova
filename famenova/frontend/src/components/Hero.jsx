import { useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Hero({ openModal }) {
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal({ threshold: 0.3 })
  const barFills = useRef([])

  useEffect(() => {
    if (cardVisible) {
      barFills.current.forEach(bar => {
        if (bar) bar.style.width = bar.dataset.width + '%'
      })
    }
  }, [cardVisible])

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <Reveal delay={0}>
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Now Accepting New Clients
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1>
              Scale Your Brand with<br />
              <span className="gradient-text">Paid Ads &amp;<br />Short-Form Content</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="hero-sub">
              We engineer high-performance ad funnels and viral short-form content systems
              that turn attention into revenue. Stop guessing. Start scaling.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={openModal}>
                Scale My Business
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a href="#results" className="btn-secondary">
                View Results
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={2} className="hero-visual">
          <div className="hero-card" ref={cardRef}>
            <div className="hero-card-stat">
              <div className="hero-card-label">Average ROAS</div>
              <div className="hero-card-value green">4.2x</div>
              <div className="hero-card-bar">
                <div className="hero-card-bar-fill green" data-width="84" ref={el => barFills.current[0] = el}></div>
              </div>
            </div>
            <div className="hero-card-stat">
              <div className="hero-card-label">Cost Per Lead Reduction</div>
              <div className="hero-card-value blue">-62%</div>
              <div className="hero-card-bar">
                <div className="hero-card-bar-fill" data-width="62" ref={el => barFills.current[1] = el}></div>
              </div>
            </div>
            <div className="hero-card-stat">
              <div className="hero-card-label">Revenue Generated</div>
              <div className="hero-card-value purple">$8.4M+</div>
              <div className="hero-card-bar">
                <div className="hero-card-bar-fill" data-width="92" ref={el => barFills.current[2] = el}></div>
              </div>
            </div>

            <div className="floating-badge floating-badge--1">
              <div className="floating-badge-icon green">&#x2191;</div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>+247%</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ROAS Increase</div>
              </div>
            </div>
            <div className="floating-badge floating-badge--2">
              <div className="floating-badge-icon blue">&#9654;</div>
              <div>
                <div style={{ fontSize: '0.9rem' }}>10M+</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Views Generated</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  const { ref, isVisible } = useScrollReveal()
  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : ''
  return (
    <div ref={ref} className={`reveal${isVisible ? ' visible' : ''}${delayClass} ${className}`}>
      {children}
    </div>
  )
}

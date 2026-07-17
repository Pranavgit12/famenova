import { useState, useEffect } from 'react'

export default function Navbar({ openModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => setMobileOpen(false)

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="nav-logo">
          <span>FAMENOVA</span>
        </a>
        <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
          <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
          <li><a href="#results" onClick={handleLinkClick}>Results</a></li>
          <li><a href="#process" onClick={handleLinkClick}>Process</a></li>
          <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>
          <li>
            <button className="nav-cta" onClick={() => { handleLinkClick(); openModal(); }}>
              Get a Free Audit
            </button>
          </li>
        </ul>
        <button
          className="mobile-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(prev => !prev)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}

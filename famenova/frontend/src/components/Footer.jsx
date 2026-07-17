export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              <span>FAMENOVA</span>
            </a>
            <p>
              We help brands scale through high-performance paid advertising and viral
              short-form content systems.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Paid Advertising</a></li>
              <li><a href="#services">Short-Form Content</a></li>
              <li><a href="#services">Lead Generation</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#results">Case Studies</a></li>
              <li><a href="#process">Our Process</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 FAMENOVA. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Instagram">&#9733;</a>
            <a href="#" className="footer-social-link" aria-label="TikTok">&#9654;</a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

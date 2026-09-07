import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <div className="footer-brand-row">
              <div className="footer-brand-icon" style={{ background: 'transparent', borderRadius: '10px' }}>
                <img src="/basega-crest.png" alt="BASEGA Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div className="footer-brand-name">BASEGA</div>
                <div className="footer-brand-sub">Alumni Association</div>
              </div>
            </div>
            <p>
              United in Excellence, Connected for Life. BASEGA Alumni Association fosters
              lifelong connections among graduates and supports the continued growth of our alma mater.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter/X">𝕏</a>
              <a href="#" aria-label="Instagram">in</a>
              <a href="#" aria-label="LinkedIn">Li</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About the Association</Link></li>
              <li><Link to="/members">Alumni Directory</Link></li>
              {/* <li><Link to="/payment">Pay Annual Dues</Link></li> */}
              <li><Link to="/news">News &amp; Events</Link></li>
              <li><Link to="/alumni-of-month">Alumni of the Month</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/about">Constitution &amp; Bye-Laws</Link></li>
              <li><Link to="/contact">Mentorship Program</Link></li>
              <li><Link to="/contact">Career Portal</Link></li>
              <li><Link to="/contact">Transcript Requests</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>BASEGA Secretariat, 15 Alumni Way, Victoria Island, Lagos, Nigeria</li>
              <li><a href="tel:+2348001234567">+234 (0) 800 123 4567</a></li>
              <li><a href="mailto:info@basegaalumni.org">info@basegaalumni.org</a></li>
            </ul>
          </div>

        </div>
      </div>

      <hr className="footer-divider" />

      <div className="container">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BASEGA Alumni Association. All rights reserved.</span>
          <span>
            <a href="#" style={{ marginRight: '.75rem' }}>Privacy Policy</a>
            <a href="#" style={{ marginRight: '.75rem' }}>Terms of Service</a>
            <Link to="/admin" style={{ opacity: .45, fontSize: '.75rem' }}>Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

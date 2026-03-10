import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-q-footer">
              Q
              <div className="logo-bubble-footer">
                <div className="logo-dot-footer"></div>
                <div className="logo-dot-footer"></div>
                <div className="logo-dot-footer"></div>
              </div>
            </div>
            <span>chat</span>
          </div>
          <p className="footer-slogan">
            Smart chat automation built for modern businesses.
          </p>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="footer-title">Product</h4>
            <ul className="footer-list">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">WhatsApp</a></li>
              <li><a href="#">Messenger</a></li>
              <li><a href="#">Qchat Web</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-list">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Status</a></li>
              <li><a href="#">Services</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-list">
              <li><a href="#">About</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-list">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Qchat, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">Jovexa Labs</p>
          <p className="site-footer__tagline">Software built to turn ideas into impact.</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <a href="https://github.com/jovexalabs2026" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        <p className="site-footer__copy">
          &copy; {new Date().getFullYear()} Jovexa Software Development Services. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

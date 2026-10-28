import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/templates', label: 'Templates' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/learn', label: 'Learn' },
  { to: '/digital2030', label: 'Digital 2030' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img className="brand__logo" src="/brand/logo-mark.png" alt="" aria-hidden="true" />
          <span className="brand__text">
            JOVEXA<span className="brand__sub">Labs</span>
          </span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>

        <nav
          id="primary-nav"
          className={`site-nav ${open ? 'site-nav--open' : ''}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'site-nav__link is-active' : 'site-nav__link'
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/website-development"
            className="site-nav__quote"
            onClick={() => setOpen(false)}
          >
            Get a Free Quote
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

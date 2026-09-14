import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/roadmap', label: 'Roadmap' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { to: '/products', label: 'All Products' },
      { to: '/products/dash-rush', label: 'Dash Rush' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { to: '/learn', label: 'All Courses' },
      { to: '/learn/html-basics', label: 'HTML Basics' },
      { to: '/learn/javascript-basics', label: 'JavaScript' },
      { to: '/learn/playground', label: 'Code Lab' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { to: '/developers', label: 'Developer Hub' },
      { to: '/open-source', label: 'Open Source' },
      { href: 'https://github.com/jovexalabs2026', label: 'GitHub' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brandcol">
          <p className="site-footer__brand">
            <img className="brand__logo" src="/brand/logo-mark.png" alt="" aria-hidden="true" />{' '}
            Jovexa Labs
          </p>
          <p className="site-footer__tagline">Software · Ideas · Real Impact</p>
          <p className="site-footer__tagline">
            Independent software studio building apps, games, web platforms, and open-source
            tools. Build software for a brighter tomorrow.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav className="site-footer__col" aria-label={col.heading} key={col.heading}>
            <p className="site-footer__heading">{col.heading}</p>
            {col.links.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label} ↗
                </a>
              ) : (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        ))}
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">
          &copy; {new Date().getFullYear()} Jovexa Software Development Services. All rights
          reserved.
        </p>
        <p className="site-footer__copy">
          DTI-registered business in the Philippines · Reg. Ref. EVQM270119612369
        </p>
        <p className="site-footer__copy">
          <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a> ·{' '}
          <a href="mailto:support@jovexalabs.com">support@jovexalabs.com</a>
        </p>
      </div>
    </footer>
  );
}

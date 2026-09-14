import { useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { courses } from '../../data/learn/index.js';
import { referenceEntries } from '../../data/learn/reference.js';

const LEARN_LINKS = [
  { to: '/learn', label: 'Courses', end: true },
  { to: '/learn/paths', label: 'Paths' },
  { to: '/learn/practice', label: 'Practice' },
  { to: '/learn/projects', label: 'Projects' },
  { to: '/learn/reference', label: 'Reference' },
  { to: '/learn/playground', label: 'Code Lab' },
  { to: '/learn/my', label: 'My Learning' },
  { to: '/learn/community', label: 'Community' },
];

function buildSearchIndex() {
  const items = [];
  for (const course of courses) {
    items.push({
      label: `${course.title} (course)`,
      keywords: `${course.title} ${course.tagline} ${course.category}`.toLowerCase(),
      to: `/learn/${course.slug}`,
    });
    for (const lesson of course.lessons) {
      items.push({
        label: `${lesson.title} · ${course.title}`,
        keywords: `${lesson.title} ${course.title} ${lesson.objective}`.toLowerCase(),
        to: `/learn/${course.slug}/${lesson.slug}`,
      });
    }
  }
  for (const entry of referenceEntries) {
    items.push({
      label: `${entry.name} · Reference`,
      keywords: `${entry.name} ${entry.category} ${entry.description}`.toLowerCase(),
      to: `/learn/reference?q=${encodeURIComponent(entry.name)}`,
    });
  }
  return items;
}

function SearchBox() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const index = useMemo(buildSearchIndex, []);
  const blurTimer = useRef();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index.filter((item) => item.keywords.includes(q)).slice(0, 7);
  }, [query, index]);

  const go = (to) => {
    setQuery('');
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="learn-search">
      <input
        type="search"
        className="learn-search__input"
        placeholder="Search courses, lessons, reference..."
        value={query}
        aria-label="Search Jovexa Learn"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 150);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) go(results[0].to);
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      {open && results.length > 0 && (
        <ul className="learn-search__results">
          {results.map((item) => (
            <li key={item.to + item.label}>
              <button type="button" onMouseDown={() => go(item.to)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LearnLayout() {
  return (
    <>
      <div className="learn-nav">
        <nav className="learn-nav__links" aria-label="Jovexa Learn">
          {LEARN_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <SearchBox />
      </div>
      <Outlet />
    </>
  );
}

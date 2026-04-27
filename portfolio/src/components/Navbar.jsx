import { useState, useEffect } from 'react';

const sections = ['home', 'about', 'experience', 'projects', 'socials'];

const Navbar = ({ onContactClick, profile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('') ?? 'VF';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo" onClick={() => go('home')}>
        <div className="nav-logo-dot" />
        {initials}
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {sections.map(s => (
          <li key={s}>
            <a className={active === s ? 'active' : ''} onClick={() => go(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          </li>
        ))}
        <li>
          <a className="nav-cta" onClick={() => { onContactClick(); setMenuOpen(false); }}>
            Contact
          </a>
        </li>
      </ul>

      <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
};

export default Navbar;

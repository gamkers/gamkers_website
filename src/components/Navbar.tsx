import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'Community' },
  { href: '#services', label: 'Services' },
  { href: '#workshops', label: 'Workshop' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

      // Determine active section
      const sections = navLinks.map(l => l.href.substring(1));
      const scrollPos = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="nav-entrance fixed top-0 w-full z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(8,10,8,0.92)' : 'var(--bg-void)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '0.5px solid var(--bg-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <img src="/logo.png" alt="Gamkers" className="h-8 w-8" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: 'var(--text-primary)',
              }}
            >
              GAMKERS
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: activeSection === link.href.substring(1) ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== link.href.substring(1)) {
                    (e.target as HTMLElement).style.color = 'var(--accent-dim)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== link.href.substring(1)) {
                    (e.target as HTMLElement).style.color = 'var(--text-muted)';
                  }
                }}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'var(--accent)',
                      transformOrigin: 'left',
                      animation: 'scaleXIn 200ms ease forwards',
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a href="https://discord.gg/9MWjDM3cTy" target="_blank" rel="noopener noreferrer">
              <button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Join Community
              </button>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{ color: 'var(--text-primary)' }}
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? '400px' : '0',
          opacity: isOpen ? 1 : 0,
          background: 'var(--bg-void)',
          borderTop: isOpen ? '0.5px solid var(--bg-border)' : 'none',
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '14px',
                color: activeSection === link.href.substring(1) ? 'var(--accent)' : 'var(--text-muted)',
                padding: '8px 0',
              }}
            >
              {link.label}
            </a>
          ))}
          <a href="https://discord.gg/9MWjDM3cTy" target="_blank" rel="noopener noreferrer" className="mt-2">
            <button className="btn-ghost w-full" style={{ fontSize: '13px' }}>
              Join Community
            </button>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes scaleXIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </nav>
  );
}
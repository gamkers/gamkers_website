import { useInView } from '@/hooks/use-animations';

const quickLinks = [
  { label: 'Courses', href: '#courses' },
  { label: 'Products', href: '#products' },
  { label: 'Workshop', href: '#workshops' },
  { label: 'Community', href: '#community' },
  { label: 'Contact', href: 'mailto:gamkers@gmail.com' },
];

export default function Footer() {
  const sectionRef = useInView();

  return (
    <footer style={{ background: 'var(--bg-void)', borderTop: '0.5px solid var(--bg-border)' }}>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 py-16">
        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left — Logo + tagline */}
          <div className="anim-fade-in" style={{ transitionDelay: '0ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Gamkers" className="h-8 w-8" />
              <span style={{
                fontSize: '14px', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text-primary)',
              }}>
                GAMKERS
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              India's largest cybersecurity community.
            </p>
          </div>

          {/* Center — Quick links */}
          <div className="anim-fade-in" style={{ transitionDelay: '120ms' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith('http') || link.href.startsWith('mailto') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-dim)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — CTA */}
          <div className="anim-fade-in" style={{ transitionDelay: '240ms' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Join the mission
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              Be part of Asia's fastest growing security community.
            </p>
            <a href="https://discord.gg/9MWjDM3cTy" target="_blank" rel="noopener noreferrer">
              <button className="btn-ghost" style={{ fontSize: '13px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ opacity: 0.8 }}>
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </button>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="anim-fade-in"
          style={{
            transitionDelay: '400ms',
            borderTop: '0.5px solid var(--bg-border)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Gamkers. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              style={{ fontSize: '12px', color: 'var(--text-muted)', transition: 'color 200ms ease' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-dim)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{ fontSize: '12px', color: 'var(--text-muted)', transition: 'color 200ms ease' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-dim)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
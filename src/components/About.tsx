import { useInView, useCountUp } from '@/hooks/use-animations';

const stats = [
  { value: 240, suffix: 'K+', label: 'Instagram followers', duration: 1200 },
  { value: 3, suffix: 'K+', label: 'Discord members', duration: 800 },
  { value: 10, suffix: '+', label: 'YouTube videos', duration: 600 },
  { value: 500, suffix: '+', label: 'Students trained', duration: 1200 },
];

const platforms = [
  { name: 'Instagram', count: '240K+', href: 'https://www.instagram.com/gamkers/' },
  { name: 'Discord', count: '3K+', href: 'https://discord.gg/9MWjDM3cTy' },
  { name: 'YouTube', count: '10+', href: 'https://www.youtube.com/@gamkeryt/featured' },
];

function StatNumber({ value, suffix, duration }: { value: number; suffix: string; duration: number }) {
  const ref = useCountUp(value, duration, suffix);
  return <span ref={ref} style={{ fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)' }}>0</span>;
}

export default function About() {
  const sectionRef = useInView();

  return (
    <section id="about" className="py-24 md:py-32 theme-green" style={{ background: 'var(--bg-void)' }}>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="eyebrow anim-slide-left">ABOUT GAMKERS</p>

        {/* Title */}
        <h2 className="section-title anim-fade-in" style={{ maxWidth: '600px', marginBottom: '48px' }}>
          We are the hackers building the next generation of <em>hackers.</em>
        </h2>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left — Mission */}
          <div className="anim-fade-in" style={{ transitionDelay: '160ms' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              Gamkers started as an Instagram page sharing cybersecurity tips and has grown into India's
              largest community of ethical hackers, penetration testers, and bug bounty hunters. We provide
              structured courses, hands-on workshops, open-source tools, and a thriving Discord server where
              aspiring security professionals level up together.
            </p>
          </div>

          {/* Right — 2×2 stat grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="anim-fade-in"
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <StatNumber value={stat.value} suffix={stat.suffix} duration={stat.duration} />
                <p className="caption mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Platform Cards */}
        <div className="mt-20">
          <h3 className="anim-fade-in section-title" style={{ fontSize: '20px', marginBottom: '32px' }}>
            Find Us Everywehere. <em>Join Community</em>.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discord */}
            <div className="g-card anim-fade-in" style={{ padding: '28px', transitionDelay: '100ms', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>Discord</span>
                <span className="g-tag g-tag--accent">2000+ Active Members</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                Real-time discussions, Q&A sessions, and collaboration
              </p>
              <div style={{ marginBottom: '24px', flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you'll get:</span>
                <ul className="mt-3 flex flex-col gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> 24/7 Support</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Live CTF Events</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Mentorship Programs</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Job Opportunities</li>
                </ul>
              </div>
              <a href="https://discord.gg/9MWjDM3cTy" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost w-full justify-center">Click to Join →</button>
              </a>
            </div>

            {/* YouTube */}
            <div className="g-card anim-fade-in" style={{ padding: '28px', transitionDelay: '180ms', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>YouTube</span>
                <span className="g-tag g-tag--accent">9K+ Active Members</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                In-depth tutorials, security analysis, and educational content
              </p>
              <div style={{ marginBottom: '24px', flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you'll get:</span>
                <ul className="mt-3 flex flex-col gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Weekly Uploads</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Bug Bounty Walkthroughs</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Tool Reviews</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Live Streams</li>
                </ul>
              </div>
              <a href="https://www.youtube.com/@gamkeryt/featured" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost w-full justify-center">Click to Join →</button>
              </a>
            </div>

            {/* Instagram */}
            <div className="g-card anim-fade-in" style={{ padding: '28px', transitionDelay: '260ms', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>Instagram</span>
                <span className="g-tag g-tag--accent">230K+ Active Members</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                Daily cybersecurity tips, infographics, and community highlights
              </p>
              <div style={{ marginBottom: '24px', flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you'll get:</span>
                <ul className="mt-3 flex flex-col gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Daily Tips</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Security News</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Community Spotlights</li>
                  <li className="flex items-center gap-2"><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}/> Quick Tutorials</li>
                </ul>
              </div>
              <a href="https://www.instagram.com/gamkers/" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost w-full justify-center">Click to Join →</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

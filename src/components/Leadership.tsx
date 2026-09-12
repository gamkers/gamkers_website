import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/use-animations';

const team = [
  {
    initials: 'AM',
    name: 'Akash M',
    role: 'Founder & CEO',
    bio: 'Visionary cybersecurity researcher and the mind behind FlawHunt AI. Leading Gamkers mission to democratize cybersecurity education and build the largest security community in Asia.',
    tags: ['AI Security', 'Penetration Testing', 'Bug Bounty'],
    stats: [
      { value: 'FlawHunt AI', label: 'Founder' },
      { value: '500+', label: 'Vulns Found' },
      { value: '8 Yrs', label: 'Experience' },
    ],
  },
  {
    initials: 'VW',
    name: 'Vigneshwaran',
    role: 'Core Developer & CTO',
    bio: 'Full-stack developer and open-source contributor driving the technical infrastructure of Gamkers. Architect behind the community\'s tools and platform integrations.',
    tags: ['Full Stack Dev', 'Open Source', 'DevSecOps'],
    stats: [
      { value: '50+', label: 'Tools Built' },
      { value: 'Core', label: 'Developer' },
      { value: 'OSS', label: 'Contributor' },
    ],
  },
  {
    initials: 'BJ',
    name: 'Balaji',
    role: 'Security Lead',
    bio: 'OSCP-certified red team operator specializing in network penetration testing and advanced exploitation techniques. Leads the community\'s CTF initiatives and training programs.',
    tags: ['Red Team', 'Network Security', 'OSCP'],
    stats: [
      { value: 'OSCP', label: 'Certified' },
      { value: '200+', label: 'Critical Bugs' },
      { value: 'Red', label: 'Team Lead' },
    ],
  },
  {
    initials: 'BH',
    name: 'Bhavan',
    role: 'Bug Bounty Hunter',
    bio: 'Elite bug bounty hunter with active reports on HackerOne, Bugcrowd, and private programs. Specializes in web application security and API vulnerabilities.',
    tags: ['Bug Bounty', 'Web Security', 'API Hacking'],
    stats: [
      { value: 'Hall of', label: 'Fame' },
      { value: '100+', label: 'Bugs Found' },
      { value: 'H1', label: 'Top Hunter' },
    ],
  },
  {
    initials: 'MK',
    name: 'Manikandan',
    role: 'Cybersecurity Educator',
    bio: 'Passionate cybersecurity educator crafting structured learning experiences for the Gamkers community. Creates in-depth tutorials, bootcamps, and certification prep materials.',
    tags: ['Education', 'CTF Training', 'Curriculum Design'],
    stats: [
      { value: '500+', label: 'Students' },
      { value: '50+', label: 'Tutorials' },
      { value: 'Cert.', label: 'Trainer' },
    ],
  },
];

export default function Leadership() {
  const sectionRef = useInView();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && (window as any).VANTA) {
      setVantaEffect((window as any).VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x199627,
        backgroundColor: 0x181120,
        points: 8.00,
        maxDistance: 26.00
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <section 
      id="team" 
      ref={vantaRef}
      className="py-24 md:py-32 relative overflow-hidden" 
      style={{ background: '#181120' }}
    >
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="eyebrow anim-slide-left">THE TEAM</p>

        {/* Title */}
        <h2 className="section-title anim-fade-in" style={{ marginBottom: '48px' }}>
          Built by the community, <em>led</em> by practitioners.
        </h2>

        {/* Horizontal scroll row - Infinite Marquee */}
        <div 
          className="flex overflow-hidden group py-4 anim-fade-in" 
          style={{ 
            transitionDelay: '160ms', 
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          {/* We render exactly 2 copies so that when standard flex slides, the second one takes its place seamlessly. */}
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex gap-6 pr-6 animate-marquee" aria-hidden={groupIndex === 1}>
              {team.map((member) => (
                <div
                  key={`${groupIndex}-${member.initials}`}
                  className="g-card flex-shrink-0"
                  style={{
                    width: '300px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--accent-glow)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {member.initials}
                  </div>

                  {/* Name */}
                  <h4 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {member.name}
                  </h4>

                  {/* Role */}
                  <p style={{ fontSize: '13px', color: 'var(--accent)', lineHeight: 1.3 }}>
                    {member.role}
                  </p>

                  {/* Bio — 3 lines max */}
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                  }}>
                    {member.bio}
                  </p>

                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {member.tags.map((tag) => (
                      <span key={tag} className="g-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ width: '100%', height: '0.5px', background: 'var(--bg-border)', margin: '8px 0' }} />

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {member.stats.map((stat) => (
                      <div key={stat.label}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {stat.value}
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

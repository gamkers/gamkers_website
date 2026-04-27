import { useInView } from '@/hooks/use-animations';
import { useEffect, useRef } from 'react';

const products = [
  {
    tag: 'CLI TOOL',
    title: 'FlawHunt CLI',
    subtitle: 'The Smart AI Shell for Hackers',
    body: 'AI-powered terminal to simplify commands, automate workflows, and secure your environment. Built for cybersecurity professionals and ethical hackers.',
    cta: 'View on GitHub →',
    link: 'https://github.com/gamkers',
  },
  {
    tag: 'MOBILE APP',
    title: 'GamkersGPT',
    subtitle: 'AI Cybersecurity Assistant',
    body: 'Your cybersecurity AI assistant on the go. Ask, learn, and solve security challenges right from your phone.',
    cta: 'Open App →',
    link: 'https://gamkersgpt.studentbae.in/',
  },
  {
    tag: 'WEB APP',
    title: 'SentinelX',
    subtitle: 'AI Threat Analysis Platform',
    body: 'AI-powered cyber threat analysis platform. Upload, analyze, and understand threats in real time.',
    cta: 'Launch App →',
    link: 'https://gamkerscyberanalysis.streamlit.app',
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      if (borderRef.current) borderRef.current.classList.add('drawn');
      return;
    }

    const timer = setTimeout(() => {
      if (borderRef.current) borderRef.current.classList.add('drawn');
    }, 400 + index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="g-card anim-fade-in block relative overflow-hidden"
      style={{
        transitionDelay: `${100 + index * 80}ms`,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div ref={borderRef} className="product-accent-border" />
      <span className="g-tag g-tag--accent" style={{ alignSelf: 'flex-start' }}>{product.tag}</span>
      <h3 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>{product.title}</h3>
      <span className="g-tag" style={{ alignSelf: 'flex-start' }}>{product.subtitle}</span>
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', flex: 1 }}>{product.body}</p>
      <span style={{ fontSize: '13px', color: 'var(--accent-dim)', marginTop: '8px' }}>{product.cta}</span>
    </a>
  );
}

export default function Courses() {
  const sectionRef = useInView();

  return (
    <section id="services" className="py-24 md:py-32" style={{ background: 'var(--bg-void)' }}>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="eyebrow anim-slide-left">WHAT WE PROVIDE & OUR TOOLS</p>

        {/* Title */}
        <h2 className="section-title anim-fade-in" style={{ marginBottom: '48px' }}>
          Structured paths and tools to reach <em>elite</em>.
        </h2>

        {/* Bootcamp Section */}
        <div className="mb-24">
          <div className="g-panel anim-fade-in" style={{ padding: '32px md:48px', transitionDelay: '100ms' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" style={{ padding: '32px 32px 0 32px' }}>
              <div>
                <span className="g-tag g-tag--accent mb-3 block w-max">BOOTCAMP</span>
                <h3 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Get Two Comprehensive Courses in One Bootcamp
                </h3>
              </div>
              <a href="https://course.gamkers.in/" target="_blank" rel="noopener noreferrer">
                <button className="btn-solid">Enroll Now →</button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ padding: '0 32px 32px 32px', borderTop: '0.5px solid var(--bg-border)', marginTop: '24px', paddingTop: '32px' }}>
              {/* Course 1 */}
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Course 1: Python Programming
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Master Python from basics to advanced concepts through our comprehensive curriculum:
                </p>
                <ul className="flex flex-col gap-3">
                  {['Fundamentals of Python programming', 'Functional Programming', 'Object-oriented programming', 'Web scraping and automation', 'Real-world project implementation'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div style={{ marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course 2 */}
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Course 2: Ethical Hacking
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Master ethical hacking with Python through hands-on projects:
                </p>
                <ul className="flex flex-col gap-3">
                  {['Secure networks with MAC changers, ARP, and DNS spoofers', 'Build hacking tools like sniffers and network scanners', 'Ethically exploit system vulnerabilities', 'Perform penetration testing on websites and systems', 'Create reverse backdoors and keyloggers for ethical use'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div style={{ marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div id="products">
          <h3 className="anim-fade-in section-title" style={{ fontSize: '24px', marginBottom: '32px' }}>
            Built by hackers, <em>for</em> hackers.
          </h3>
          <div 
            className="flex overflow-hidden group py-4 anim-fade-in" 
            style={{ 
              transitionDelay: '200ms',
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
            }}
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex gap-6 pr-6 animate-marquee" aria-hidden={groupIndex === 1}>
                {products.map((product, i) => (
                  <div key={`${groupIndex}-${product.title}`} className="flex-shrink-0" style={{ width: '380px' }}>
                    <ProductCard product={product} index={groupIndex === 0 ? i : 0} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
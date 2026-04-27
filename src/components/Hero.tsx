import { useEffect, useRef, useState } from 'react';

const HEADLINE = 'Learn. Hunt. Dominate.';
const CHAR_DELAY = 45;

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayText(HEADLINE);
      setButtonsVisible(true);
      setShowCursor(false);
      return;
    }

    let i = 0;
    let cursorTimer1: ReturnType<typeof setTimeout>;
    let cursorTimer2: ReturnType<typeof setTimeout>;

    const timer = setInterval(() => {
      i++;
      setDisplayText(HEADLINE.slice(0, i));
      if (i >= HEADLINE.length) {
        clearInterval(timer);
        // Blink cursor for 3s then fade
        cursorTimer1 = setTimeout(() => {
          setCursorFading(true);
          cursorTimer2 = setTimeout(() => setShowCursor(false), 300);
        }, 3000);
      }
    }, CHAR_DELAY);

    // Show buttons after typing finishes
    const btnTimer = setTimeout(() => setButtonsVisible(true), HEADLINE.length * CHAR_DELAY + 200);

    return () => {
      clearInterval(timer);
      clearTimeout(btnTimer);
      clearTimeout(cursorTimer1);
      clearTimeout(cursorTimer2);
    };
  }, []);

  // Render typed text with <em> around "Hunt."
  const renderTypedText = () => {
    const huntStart = HEADLINE.indexOf('Hunt.');
    const huntEnd = huntStart + 5;
    const currentLen = displayText.length;

    if (currentLen <= huntStart) {
      return <>{displayText}</>;
    } else if (currentLen <= huntEnd) {
      return (
        <>
          {HEADLINE.slice(0, huntStart)}
          <em>{displayText.slice(huntStart)}</em>
        </>
      );
    } else {
      return (
        <>
          {HEADLINE.slice(0, huntStart)}
          <em>Hunt.</em>
          {displayText.slice(huntEnd)}
        </>
      );
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid"
      style={{
        background: 'var(--bg-void)',
        paddingTop: '80px',
      }}
    >
      {/* Subtle radial glow top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 15% 15%, rgba(34,197,94,0.05), transparent 60%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {/* Logo and Brand */}
        <div className="anim-fade-in mb-10 flex flex-col items-center gap-6" style={{ transitionDelay: '100ms' }} ref={(el) => { if (el) setTimeout(() => el.classList.add('visible'), 100); }}>
          <img src="/logo.png" alt="Gamkers Logo" className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56" style={{ filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.15))' }} />
          <h2 style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>GAMKERS</h2>
        </div>

        {/* Eyebrow */}
        <p className="eyebrow eyebrow-reveal mb-6">
          INDIA'S LARGEST CYBERSECURITY COMMUNITY
        </p>

        {/* Display headline with typewriter */}
        <h1 className="display-title mb-6">
          {renderTypedText()}
          {showCursor && (
            <span className={`typewriter-cursor ${cursorFading ? 'fade-out' : ''}`}>|</span>
          )}
        </h1>

        {/* Sub text */}
        <p
          className="anim-fade-in"
          style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 40px',
            transitionDelay: '400ms',
          }}
          ref={(el) => {
            if (el) {
              setTimeout(() => el.classList.add('visible'), 500);
            }
          }}
        >
          Gamkers is building Asia's biggest security community — where ethical hackers,
          bug bounty hunters, and red teamers level up together.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: buttonsVisible ? 1 : 0,
            transform: buttonsVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          <a href="#courses">
            <button className="btn-solid">Explore Courses</button>
          </a>
          <a href="#products">
            <button className="btn-ghost">View Products</button>
          </a>
        </div>
      </div>
    </section>
  );
}
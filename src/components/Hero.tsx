import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

const HEADLINE = 'Learn. Hunt. Dominate.';

export default function Hero() {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoPlaceholderRef = useRef<HTMLDivElement>(null);
  const bigLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial state setup
    setButtonsVisible(true);

    const ctx = gsap.context(() => {
      // 1. Initial State: Force the Big Logo to "fit" the placeholder position
      // We want it to START large and center, so we capture that first.
      const state = Flip.getState(bigLogoRef.current);
      
      // 2. Remove the manual centering styles to let it sit in the natural layout placeholder
      gsap.set(bigLogoRef.current, { 
        position: 'relative', 
        top: 'auto', 
        left: 'auto', 
        transform: 'none',
        zIndex: 'auto'
      });

      // 3. The scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        }
      });

      // 4. The Flip Animation: Big Logo moves from center to its placeholder in the layout
      tl.add(Flip.from(state, {
        targets: bigLogoRef.current,
        duration: 2,
        ease: 'power2.inOut',
        scale: true,
        absolute: true,
      }), 0); // Start at 0

      // 5. Fade out the black overlay
      tl.to('.hero-black-overlay', {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut'
      }, 0); // Synchronize with the flip

      // 6. Animate text content in
      tl.from('.hero-content-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
      }, '-=1'); // Start text reveal while logo is finishing its move

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid"
      style={{
        background: 'var(--bg-void)',
      }}
    >
      {/* Subtle radial glow top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 15% 15%, rgba(34,197,94,0.05), transparent 60%)',
        }}
      />

      {/* Dark overlay for the initial black start */}
      <div 
        className="hero-black-overlay absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none px-6" 
        style={{ background: '#000' }}
      >
        <h2 
          className="text-white font-bold tracking-[0.3em] text-3xl sm:text-5xl md:text-7xl lg:text-8xl relative z-[60] text-center w-full"
          style={{ textTransform: 'uppercase', opacity: 0.8 }}
        >
          GAMKERS
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {/* Placeholder for Logo in the final layout */}
        <div ref={logoPlaceholderRef} className="mb-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
          {/* This logo is the one that actually stays in the layout */}
          <img 
            ref={bigLogoRef}
            src="/logo.png" 
            alt="Gamkers Logo" 
            className="w-full h-full object-contain logo-breathe"
            style={{ 
              // Initially centered/fullscreen-ish style that GSAP will Flip FROM
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(4)',
              zIndex: 50
            }} 
          />
        </div>

        <div className="flex flex-col items-center w-full">
          <h2 className="hero-content-reveal mb-6 text-center w-full" style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            GAMKERS
          </h2>

          <p className="eyebrow hero-content-reveal mb-6 text-center w-full">
            INDIA'S LARGEST CYBERSECURITY COMMUNITY
          </p>

          <h1 className="display-title hero-content-reveal mb-6 text-center w-full">
            Learn. <em>Hunt.</em> Dominate.
          </h1>

          <p
            className="hero-content-reveal text-center w-full"
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 40px',
            }}
          >
            Gamkers is building Asia's biggest security community — where ethical hackers,
            bug bounty hunters, and red teamers level up together.
          </p>

          <div
            className="hero-content-reveal flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <a href="https://discord.gg/9MWjDM3cTy" target="_blank" rel="noopener noreferrer">
              <button className="btn-solid">Join Community</button>
            </a>
            <a href="#products">
              <button className="btn-ghost">View Product</button>
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes breathingGlow {
          0%, 100% { filter: drop-shadow(0 0 40px rgba(34, 197, 94, 0.25)); }
          50% { filter: drop-shadow(0 0 80px rgba(34, 197, 94, 0.45)); }
        }
        .logo-breathe {
          animation: breathingGlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
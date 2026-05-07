import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/use-animations';

// Import GhostChip images
import gcFront from './ghostchip-images/frontview.jpeg';
import gcBack from './ghostchip-images/backview.jpeg';

// Import Phantom32 images
import p32Front from './phantom-images/front.jpeg';
import p32Back from './phantom-images/back.jpeg';

interface ProductCardProps {
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  badge: string;
  onLearnMore: () => void;
  index: number;
}

function ProductCard({ tag, title, subtitle, body, image, badge, onLearnMore, index }: ProductCardProps) {
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
    <div
      className="g-card anim-fade-in relative overflow-hidden flex flex-col"
      style={{ transitionDelay: `${120 + index * 120}ms` }}
    >
      <div ref={borderRef} className="product-accent-border" />

      {/* Hero image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '260px', background: '#050505' }}>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 500ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 60%)',
          }}
        />
        {/* Badge */}
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          <span className="g-tag g-tag--accent">{badge}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <span className="g-tag" style={{ alignSelf: 'flex-start' }}>{tag}</span>
        <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, letterSpacing: '0.05em' }}>
          {subtitle}
        </p>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', flex: 1 }}>
          {body}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn-ghost"
            onClick={onLearnMore}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Know More →
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductsSectionProps {
  onNavigate: (page: 'ghostchip' | 'phantom32') => void;
}

export default function Products({ onNavigate }: ProductsSectionProps) {
  const sectionRef = useInView();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && (window as any).VANTA) {
      setVantaEffect((window as any).VANTA.TOPOLOGY({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x2fff21,
        backgroundColor: 0x050505
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const products = [
    {
      id: 'ghostchip' as const,
      tag: 'ESP32-S3 DEVELOPMENT BOARD',
      title: 'GhostChip',
      subtitle: 'The Ultimate ESP32-S3 USB Development Platform',
      body: 'A high-performance, pocket-sized USB development board for security researchers, IoT developers, and hobbyists. Plug-and-play with dual-core processing, Wi-Fi, BLE, and MicroSD — all in one compact dongle.',
      image: gcFront,
      badge: 'NEW',
    },
    {
      id: 'phantom32' as const,
      tag: 'HANDHELD SECURITY TOOL',
      title: 'Phantom32',
      subtitle: 'The Ultimate Handheld Wireless & Sub-GHz Field Tool',
      body: 'An all-in-one handheld research platform combining Sub-GHz (CC1101), Wi-Fi, BLE, IR, and HID in a single device with OLED display, 5-way navigation, LiPo battery, and GPIO expansion.',
      image: p32Front,
      badge: 'FLAGSHIP',
    },
  ];

  return (
    <section
      id="products"
      ref={vantaRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ 
        background: '#166534', // Brighter emerald green
        color: '#ffffff',
        '--text-primary': '#ffffff',
        '--text-secondary': '#f0fdf4', // Very light green-white
        '--text-muted': '#dcfce7',
        '--accent': '#4ade80',
        '--accent-dim': '#86efac',
      } as any}
    >
      {/* Subtle dark tint overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))',
          pointerEvents: 'none',
          zIndex: 1
        }} 
      />
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <p className="eyebrow anim-slide-left">OUR HARDWARE PRODUCTS</p>

        {/* Title */}
        <h2 className="section-title anim-fade-in" style={{ marginBottom: '16px' }}>
          Built for hackers. <em>Engineered</em> to dominate.
        </h2>
        <p
          className="anim-fade-in"
          style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            maxWidth: '560px',
            marginBottom: '56px',
            lineHeight: 1.7,
            transitionDelay: '100ms',
          }}
        >
          Purpose-built hardware for security research, wireless experimentation, and IoT development.
          Every board is designed with the field in mind.
        </p>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              tag={product.tag}
              title={product.title}
              subtitle={product.subtitle}
              body={product.body}
              image={product.image}
              badge={product.badge}
              index={i}
              onLearnMore={() => onNavigate(product.id)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="anim-fade-in"
          style={{
            marginTop: '48px',
            padding: '20px 28px',
            borderLeft: '2px solid var(--accent)',
            background: 'var(--accent-glow)',
            borderRadius: '0 8px 8px 0',
            transitionDelay: '300ms',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Gamkers Hardware</span> — All devices are built
            for responsible security research, educational purposes, and ethical development workflows.
          </p>
        </div>
      </div>
    </section>
  );
}

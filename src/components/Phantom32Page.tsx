import { useState, useEffect, useCallback } from 'react';

const SHARE_URL = `${window.location.origin}${window.location.pathname}#phantom32`;

import p32Front from './phantom-images/front.jpeg';
import p32Back from './phantom-images/back.jpeg';
import p32FrontMarking from './phantom-images/frontmarking.jpeg';
import p32BackMarking from './phantom-images/backmarking.jpeg';
import p32IR from './phantom-images/IR.jpeg';
import p32SubGHz from './phantom-images/subghz.jpeg';
import p32Ducky from './phantom-images/usbrubberducky.jpeg';
import p32WiFi from './phantom-images/wifi&ble.jpeg';

const gallery = [
  { src: p32Front, label: 'Front View' },
  { src: p32Back, label: 'Back View' },
  { src: p32FrontMarking, label: 'Pin Marking (Front)' },
  { src: p32BackMarking, label: 'Pin Marking (Back)' },
  { src: p32IR, label: 'IR Transmitter & Receiver' },
  { src: p32SubGHz, label: 'Sub-GHz CC1101 Module' },
  { src: p32Ducky, label: 'USB Rubber Ducky / HID' },
  { src: p32WiFi, label: 'Wi-Fi & BLE' },
];

const protocols = [
  {
    icon: '📻',
    title: 'Sub-GHz Communication',
    desc: 'Equipped with a CC1101 transceiver and SMA antenna, Phantom32 can receive and analyze sub-GHz signals commonly used in remote systems and wireless sensors.',
  },
  {
    icon: '📡',
    title: 'Wi-Fi & Bluetooth LE',
    desc: 'Leverages the ESP32-S3 dual-core processor for wireless communication, IoT development, and controlled security testing scenarios.',
  },
  {
    icon: '🔴',
    title: 'Infrared Capability',
    desc: 'Built-in IR transmitter and receiver allow Phantom32 to interact with and replicate infrared signals, enabling use as a universal remote.',
  },
  {
    icon: '⌨️',
    title: 'HID Interaction',
    desc: 'Supports USB-based Human Interface Device functionality for automation, testing, and development of input-based interactions.',
  },
];

const hardware = [
  {
    icon: '🕹️',
    title: 'Standalone Operation',
    desc: 'Features a 5-way navigation pad, dedicated back and boot button, and an OLED display for a complete menu-driven experience without requiring a computer.',
  },
  {
    icon: '🔋',
    title: 'Portable Power',
    desc: 'Includes a built-in LiPo battery with USB-C charging, making it suitable for field use and on-the-go experimentation.',
  },
  {
    icon: '💡',
    title: 'Visual Indicators',
    desc: 'An addressable RGB LED and battery indicators provide real-time feedback on device status and activity.',
  },
  {
    icon: '💾',
    title: 'Storage Support',
    desc: 'Integrated MicroSD card slot for storing captured data, scripts, and configuration files.',
  },
];

const expansion = [
  {
    icon: '🔧',
    title: 'GPIO Expansion',
    desc: 'A 20-pin GPIO header allows integration with sensors, modules, and external hardware for custom projects.',
  },
  {
    icon: '📶',
    title: 'NRF24 Support',
    desc: 'Dedicated interface for adding NRF24 modules to enable extended 2.4GHz communication and experimentation.',
  },
  {
    icon: '📻',
    title: 'Dual Antenna Design',
    desc: 'Separate SMA connectors for sub-GHz and 2.4GHz frequencies ensure improved signal performance and flexibility.',
  },
];

const specs = [
  { label: 'Processor', value: 'ESP32-S3 Dual-core Xtensa LX7 + AI Acceleration' },
  { label: 'Radio Module', value: 'CC1101 Sub-GHz Transceiver' },
  { label: 'Display', value: '0.96-inch OLED' },
  { label: 'Connectivity', value: 'USB-C, Wi-Fi, BLE, Sub-GHz, Infrared' },
  { label: 'Expansion', value: '20-pin GPIO Header + NRF24 Module Support' },
  { label: 'Battery', value: 'Rechargeable LiPo with USB-C Charging' },
  { label: 'Navigation', value: '5-way Nav Pad + Back + Boot Button' },
  { label: 'Indicators', value: 'Addressable RGB LED + Battery LEDs' },
];

interface Phantom32PageProps {
  onBack: () => void;
}

export default function Phantom32Page({ onBack }: Phantom32PageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = SHARE_URL;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Phantom32 — Gamkers Hardware', url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, #06200c, #050505 60%)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 400ms ease, transform 400ms ease',
      }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 40,
          background: 'rgba(8,10,8,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid var(--bg-border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-dim)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Back to Products
        </button>
        <span style={{ color: 'var(--bg-border)' }}>|</span>
        <span className="g-tag g-tag--accent">FLAGSHIP HANDHELD TOOL</span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Share button */}
        <button
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 500,
            color: copied ? 'var(--accent)' : 'var(--text-muted)',
            background: copied ? 'rgba(34,197,94,0.08)' : 'transparent',
            border: `0.5px solid ${copied ? 'var(--accent)' : 'var(--bg-border)'}`,
            borderRadius: '4px',
            padding: '5px 12px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {copied ? '✓ Link Copied!' : '🔗 Share'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── Hero grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div>
            <div
              className="g-panel"
              style={{
                overflow: 'hidden',
                marginBottom: '16px',
                height: '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050505',
              }}
            >
              <img
                key={activeImage}
                src={gallery[activeImage].src}
                alt={gallery[activeImage].label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  animation: 'fadeImgIn 300ms ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: '72px',
                    height: '56px',
                    border: i === activeImage
                      ? '2px solid var(--accent)'
                      : '1px solid var(--bg-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none',
                    padding: 0,
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              {gallery[activeImage].label}
            </p>
          </div>

          {/* Hero copy */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
            <span className="eyebrow">GAMKERS HARDWARE</span>
            <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Phantom<span style={{ color: 'var(--accent)' }}>32</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              The Ultimate Handheld Wireless & Sub-GHz Field Tool
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              An all-in-one handheld development and security research platform designed for hardware hackers,
              radio enthusiasts, and cybersecurity professionals. Powered by the high-performance ESP32-S3,
              it combines multiple wireless technologies into a single compact device.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              From capturing and analyzing sub-GHz signals to performing advanced Wi-Fi and Bluetooth testing,
              Phantom32 acts as a versatile field tool built for exploration, research, and development.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              <a
                href="https://shop.gamkers.in/products/phantom32"
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: '140px' }}
              >
                <button
                  className="btn-solid"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '15px' }}
                >
                  🛒 Buy Now
                </button>
              </a>
              <a
                href="https://discord.gg/9MWjDM3cTy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: '140px' }}
              >
                <button
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '15px' }}
                >
                  Ask Community
                </button>
              </a>
            </div>

            {/* Trust bar */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                paddingTop: '16px',
                borderTop: '0.5px solid var(--bg-border)',
              }}
            >
              {['Sub-GHz CC1101', 'OLED + Nav Pad', 'LiPo + USB-C'].map((f) => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Core Protocol Support ────────────────────── */}
        <div style={{ marginBottom: '80px' }}>
          <p className="eyebrow">CORE PROTOCOL SUPPORT</p>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            Every wireless protocol. <em>One device.</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((p, i) => (
              <div
                key={i}
                className="g-card"
                style={{ padding: '28px', display: 'flex', gap: '16px' }}
              >
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{p.icon}</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hardware & UI ────────────────────────────── */}
        <div style={{ marginBottom: '80px' }}>
          <p className="eyebrow">HARDWARE & USER INTERFACE</p>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            Built for the <em>field</em>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hardware.map((h, i) => (
              <div
                key={i}
                className="g-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <span style={{ fontSize: '28px' }}>{h.icon}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{h.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Expandability ────────────────────────────── */}
        <div style={{ marginBottom: '80px' }}>
          <p className="eyebrow">EXPANDABILITY & DEVELOPMENT</p>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            Expand your <em>capability</em>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expansion.map((e, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  border: '0.5px solid var(--bg-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
                onMouseEnter={(el) => {
                  el.currentTarget.style.borderColor = 'var(--accent)';
                  el.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
                }}
                onMouseLeave={(el) => {
                  el.currentTarget.style.borderColor = 'var(--bg-border)';
                  el.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>{e.icon}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {e.title}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Technical Specs ──────────────────────────── */}
        <div style={{ marginBottom: '80px' }}>
          <p className="eyebrow">TECHNICAL SPECIFICATIONS</p>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            Under the <em>hood</em>.
          </h2>
          <div className="g-panel" style={{ overflow: 'hidden' }}>
            {specs.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 28px',
                  borderBottom: i < specs.length - 1 ? '0.5px solid var(--bg-border)' : 'none',
                  gap: '16px',
                }}
              >
                <span
                  style={{
                    minWidth: '160px',
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {s.label}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final CTA Banner ─────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 100%)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '16px',
            padding: '56px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '200px',
              background: 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <span className="eyebrow" style={{ position: 'relative', zIndex: 1 }}>GET YOURS TODAY</span>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '16px 0 12px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Ready to own a <span style={{ color: 'var(--accent)' }}>Phantom32</span>?
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              maxWidth: '520px',
              margin: '0 auto 32px',
              lineHeight: 1.7,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Phantom32 brings powerful wireless capabilities into a single handheld device — enabling you to
            capture, analyze, and interact with signals in a controlled and responsible development environment.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <a
              href="https://shop.gamkers.in/products/phantom32"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="btn-solid"
                style={{ padding: '16px 40px', fontSize: '16px', fontWeight: 600 }}
              >
                🛒 Buy Now
              </button>
            </a>
            <button
              className="btn-ghost"
              onClick={onBack}
              style={{ padding: '16px 32px', fontSize: '15px' }}
            >
              ← View All Products
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeImgIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

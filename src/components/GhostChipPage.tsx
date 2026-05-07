import { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Mic, 
  Code2, 
  Cpu, 
  Play, 
  Keyboard, 
  Wifi, 
  Bluetooth, 
  ShieldAlert, 
  Palette, 
  Zap, 
  Globe, 
  ShoppingBag, 
  Smartphone, 
  Download, 
  Share2,
  Check,
  ChevronRight
} from 'lucide-react';

const SHARE_URL = `${window.location.origin}${window.location.pathname}#ghostchip`;

import gcFront from './ghostchip-images/frontview.jpeg';
import gcBack from './ghostchip-images/backview.jpeg';
import gcFrontMarking from './ghostchip-images/frontmarking.jpeg';
import gcBackMarking from './ghostchip-images/backmarking.jpg.jpeg';
import gcAI from './ghostchip-images/inbuiltai.jpg.jpeg';
import gcRealUse from './ghostchip-images/realusecase.jpeg';
import gcOS from './ghostchip-images/supports_all_os.jpeg';

const gallery = [
  { src: gcFront, label: 'Front View' },
  { src: gcBack, label: 'Back View' },
  { src: gcFrontMarking, label: 'Pin Marking (Front)' },
  { src: gcBackMarking, label: 'Pin Marking (Back)' },
  { src: gcAI, label: 'Built-in AI Acceleration' },
  { src: gcRealUse, label: 'Real Use Case' },
  { src: gcOS, label: 'Cross-Platform Support' },
];

const appFeatures = [
  {
    icon: Bot,
    title: 'AI DuckyScript Generator',
    badge: 'WORLD FIRST',
    desc: 'Describe your payload in plain English — the on-device AI (Llama 3.3 70B via Groq) writes the DuckyScript automatically. Supports Windows, macOS, and Linux targets with OS-aware context.',
  },
  {
    icon: Mic,
    title: 'Voice-to-Script Input',
    badge: 'UNIQUE',
    desc: 'Speak your payload idea and the AI transcribes and generates the DuckyScript. Hands-free script creation powered by the Web Speech API.',
  },
  {
    icon: Code2,
    title: 'DuckyScript Editor',
    badge: 'BUILT-IN',
    desc: 'Full-featured editor with syntax highlighting, line numbers, real-time character count, and auto-save. Load scripts from files or use built-in presets for Win/Mac/Linux.',
  },
  {
    icon: Cpu,
    title: 'Visual Script Builder',
    badge: 'NO-CODE',
    desc: 'Build payloads block-by-block without writing a single line. Commands for Delay, Type Text, Run CMD, PowerShell, Open URL, Download File, and more — with point-and-click UI.',
  },
  {
    icon: Play,
    title: 'Payload Simulator',
    badge: 'SAFE TEST',
    desc: 'Preview exactly what your script will do before execution. Real-time keystroke simulation at adjustable speed (1×, 2×, 5×, 10×) with progress bar and command tracking.',
  },
  {
    icon: Keyboard,
    title: 'Live Keyboard',
    badge: 'REAL-TIME',
    desc: 'Send individual keystrokes directly to the target in real time. Full keyboard layout with modifier keys (CTRL, ALT, SHIFT, GUI) and quick-action macros for Run Dialog, Spotlight, Terminal, Task Manager, and more.',
  },
  {
    icon: Wifi,
    title: 'WiFi Network Scanner',
    badge: 'RECON',
    desc: 'Scan and display all nearby Wi-Fi networks with SSID, channel, RSSI signal strength, and encryption status. Sorted by signal strength with visual signal bars.',
  },
  {
    icon: Bluetooth,
    title: 'BLE Device Scanner',
    badge: 'RECON',
    desc: 'Discover Bluetooth Low Energy devices in range. Displays device names, MAC addresses, signal strength, and flags Flipper Zero devices automatically.',
  },
  {
    icon: ShieldAlert,
    title: 'Deauth Detector',
    badge: 'DEFENSIVE',
    desc: 'Passive 802.11 deauthentication attack detector. Monitors the air for deauth frames and alerts you in real time with attacker MAC, channel, and signal strength.',
  },
  {
    icon: Palette,
    title: 'NeoPixel Controller',
    badge: 'HARDWARE',
    desc: 'Full RGB control of the onboard addressable NeoPixel LED. Set custom colors, brightness, and preset colors. Stealth mode or full status indication.',
  },
  {
    icon: Zap,
    title: 'OTA Firmware Update',
    badge: 'WIRELESS',
    desc: 'Flash new firmware directly over Wi-Fi — no USB cable or programmer required. Drag and drop a .bin file and update instantly with progress tracking.',
  },
  {
    icon: Globe,
    title: 'WiFi Station Connect',
    badge: 'NETWORK',
    desc: 'Connect GhostChip to any Wi-Fi network from the app. Scan, select a network, enter the password, and connect — all from your phone or browser.',
  },
];

const presets = [
  { os: 'WIN', name: 'Run Dialog' },
  { os: 'WIN', name: 'Terminal Admin' },
  { os: 'WIN', name: 'System Info' },
  { os: 'WIN', name: 'WiFi Passwords' },
  { os: 'MAC', name: 'Spotlight' },
  { os: 'MAC', name: 'Terminal' },
  { os: 'LNX', name: 'Terminal' },
  { os: 'LNX', name: 'Recon' },
];

const specs = [
  { label: 'Module', value: 'ESP32-S3-WROOM-1' },
  { label: 'Interface', value: 'USB-A (Male) — Plug & Play' },
  { label: 'Processor', value: 'Dual-core Xtensa LX7 @ 240MHz' },
  { label: 'AI Engine', value: 'Llama 3.3 70B via Groq API' },
  { label: 'Storage', value: 'MicroSD Card Reader (SPI)' },
  { label: 'LED', value: '1× Addressable RGB NeoPixel' },
  { label: 'Button', value: '1× GPIO User / Boot Button' },
  { label: 'Wireless', value: 'Wi-Fi 2.4GHz + BLE 5.0' },
  { label: 'Regulator', value: 'AMS1117 (5V → 3.3V LDO)' },
  { label: 'App Support', value: 'Android APK + Web PWA (iOS / Desktop)' },
];

interface GhostChipPageProps { onBack: () => void; }

export default function GhostChipPage({ onBack }: GhostChipPageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'GhostChip — World\'s First AI-Powered BadUSB', url: SHARE_URL });
      } else {
        await navigator.clipboard.writeText(SHARE_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const dot = (color = 'var(--accent)') => (
    <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 8 }} />
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #06200c, #050505 60%)', 
      opacity: visible ? 1 : 0, 
      transform: visible ? 'translateY(0)' : 'translateY(16px)', 
      transition: 'opacity 400ms ease, transform 400ms ease' 
    }}>

      {/* ── Breadcrumb bar ── */}
      <div style={{ position: 'sticky', top: '64px', zIndex: 40, background: 'rgba(8,10,8,0.92)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid var(--bg-border)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-dim)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>← Products</button>
        <span style={{ color: 'var(--bg-border)' }}>|</span>
        <span className="g-tag g-tag--accent">ESP32-S3 · AI BADUSB</span>
        <div style={{ flex: 1 }} />
        <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 500, color: copied ? 'var(--accent)' : 'var(--text-muted)', background: copied ? 'rgba(34,197,94,0.08)' : 'transparent', border: `0.5px solid ${copied ? 'var(--accent)' : 'var(--bg-border)'}`, borderRadius: 4, padding: '5px 12px', cursor: 'pointer', transition: 'all 200ms ease' }}>
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── HERO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Gallery */}
          <div>
            <div className="g-panel" style={{ overflow: 'hidden', height: 360, background: '#050505' }}>
              <img key={activeImage} src={gallery[activeImage].src} alt={gallery[activeImage].label} style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeImgIn 300ms ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} style={{ width: 64, height: 50, border: i === activeImage ? '2px solid var(--accent)' : '1px solid var(--bg-border)', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: 'none', padding: 0, transition: 'border-color 200ms ease' }}>
                  <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <p style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>{gallery[activeImage].label}</p>
          </div>

          {/* Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            {/* World First badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={12} /> World's First AI-Powered BadUSB
              </span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.05, margin: 0 }}>
              Ghost<span style={{ color: 'var(--accent)' }}>Chip</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>The Ultimate ESP32-S3 USB Development Platform</p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
              GhostChip is the world's first BadUSB device with <strong style={{ color: 'var(--accent)' }}>built-in AI script generation</strong>. Describe your payload in plain English — the AI writes, optimizes, and executes the DuckyScript automatically. Plug into any USB port and you're operational in seconds.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
              Comes with a <strong style={{ color: 'var(--text-primary)' }}>full companion app</strong> (Android APK + Web PWA) featuring a script editor, payload simulator, Wi-Fi/BLE scanner, live keyboard, NeoPixel control, and OTA firmware updates.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <a href="https://store.gamkers.in/products/ghostchip" target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 140 }}>
                <button className="btn-solid" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={18} /> Buy Now
                </button>
              </a>
              <a href="https://gamkers.github.io/GhostChipUI/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 140 }}>
                <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Open Web App <ChevronRight size={16} />
                </button>
              </a>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 14, borderTop: '0.5px solid var(--bg-border)' }}>
              {['AI-Powered', 'Plug & Play', 'Android + Web App', 'Wi-Fi + BLE'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Check size={12} style={{ color: 'var(--accent)' }} /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI HIGHLIGHT BANNER ── */}
        <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.04) 100%)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '36px 40px', marginBottom: 80, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', pointerEvents: 'none' }} />
          <span className="eyebrow">THE AI DIFFERENCE</span>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
            The World's First AI-Powered BadUSB Device
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 640, margin: 0 }}>
            Every BadUSB before GhostChip required you to write DuckyScript manually. GhostChip changes everything — just describe what you want to do in plain English, and the <strong style={{ color: 'var(--accent)' }}>Llama 3.3 70B AI model</strong> generates the complete, optimized payload instantly. Supports Windows, macOS, and Linux targets. Even converts scripts between operating systems automatically.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
            {[['Plain English → Script', 'No DuckyScript knowledge needed'], ['Multi-OS Support', 'Win, Mac, Linux auto-targeting'], ['Voice Input', 'Speak your payload idea aloud'], ['OS Converter', 'Convert any script to another OS']].map(([title, sub]) => (
              <div key={title}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── APP FEATURES ── */}
        <div style={{ marginBottom: 80 }}>
          <p className="eyebrow">COMPANION APP — 12 POWERFUL TOOLS</p>
          <h2 className="section-title" style={{ marginBottom: 12 }}>One App. Total Control.</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7 }}>Available as an Android APK and a Web PWA — works on any phone, tablet, or laptop. Connect over Wi-Fi and control GhostChip from anywhere.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appFeatures.map((f, i) => (
              <div key={i} className="g-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--accent)' }}>
                    <f.icon size={26} strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', background: f.badge === 'WORLD FIRST' || f.badge === 'UNIQUE' ? 'rgba(34,197,94,0.15)' : 'transparent', color: 'var(--accent)', border: '0.5px solid var(--accent)', borderRadius: 3, padding: '2px 7px', whiteSpace: 'nowrap' }}>{f.badge}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{f.title}</h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0, flex: 1 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRESETS ── */}
        <div style={{ marginBottom: 80 }}>
          <p className="eyebrow">BUILT-IN SCRIPT PRESETS</p>
          <h2 className="section-title" style={{ marginBottom: 32 }}>Ready-to-Run Payloads. <em>Out of the box.</em></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {presets.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '0.5px solid var(--bg-border)', borderRadius: 6, background: 'var(--bg-surface)', transition: 'border-color 200ms' }} onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bg-border)')}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', border: '0.5px solid var(--accent)', borderRadius: 3, color: 'var(--accent)' }}>{p.os}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.name}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '0.5px dashed var(--bg-border)', borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>+ AI generates unlimited more</span>
            </div>
          </div>
        </div>

        {/* ── APP DOWNLOAD ── */}
        <div style={{ marginBottom: 80, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div className="g-card" style={{ padding: 28 }}>
            <div style={{ color: 'var(--accent)', marginBottom: 16 }}>
              <Smartphone size={36} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Android App</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>Download the native Android APK for the best mobile experience. Direct USB-over-WiFi control from your phone.</p>
            <a href="https://gamkers.github.io/GhostChipUI/app-release-signed.apk" target="_blank" rel="noopener noreferrer">
              <button className="btn-solid" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={18} /> Download APK
              </button>
            </a>
          </div>
          <div className="g-card" style={{ padding: 28 }}>
            <div style={{ color: 'var(--accent)', marginBottom: 16 }}>
              <Globe size={36} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Web App (PWA)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>Works on any browser — iOS, macOS, Windows, Linux. Install as a PWA for an app-like experience without the App Store.</p>
            <a href="https://gamkers.github.io/GhostChipUI/" target="_blank" rel="noopener noreferrer">
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
                Open Web App <ChevronRight size={18} />
              </button>
            </a>
          </div>
        </div>

        {/* ── SPECS ── */}
        <div style={{ marginBottom: 80 }}>
          <p className="eyebrow">TECHNICAL SPECIFICATIONS</p>
          <h2 className="section-title" style={{ marginBottom: 32 }}>Under the <em>hood</em>.</h2>
          <div className="g-panel" style={{ overflow: 'hidden' }}>
            {specs.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 28px', borderBottom: i < specs.length - 1 ? '0.5px solid var(--bg-border)' : 'none', gap: 16 }}>
                <span style={{ minWidth: 150, fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: '56px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(34,197,94,0.12), transparent 70%)', pointerEvents: 'none' }} />
          <span className="eyebrow" style={{ position: 'relative', zIndex: 1 }}>GET YOURS TODAY</span>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', margin: '14px 0 10px', position: 'relative', zIndex: 1 }}>
            Own the World's First <span style={{ color: 'var(--accent)' }}>AI BadUSB</span>
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>
            GhostChip ships ready to use. Plug it in, connect to the app, and let AI write your payloads. No setup required. No DuckyScript knowledge needed.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <a href="https://store.gamkers.in/products/ghostchip" target="_blank" rel="noopener noreferrer">
              <button className="btn-solid" style={{ padding: '16px 44px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} /> Buy Now
              </button>
            </a>
            <button className="btn-ghost" onClick={onBack} style={{ padding: '16px 32px', fontSize: 14 }}>← View All Products</button>
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

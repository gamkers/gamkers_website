import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-animations';
import { supabase } from '@/lib/supabase';

/* ── Types ── */
interface CompletedWorkshop {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
  platform: string;
  recording_urls: string[];
  thumbnail_url: string;
  avg_rating: number;
  total_ratings: number;
}

interface UpcomingWorkshop {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
  platform: string;
  seats_total: number;
  seats_left: number;
  thumbnail_url: string;
  is_active: boolean;
}

/* ── Star Rating Component ── */
function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= (hover || Math.round(value)) ? '#22c55e' : 'none'}
          stroke={star <= (hover || Math.round(value)) ? '#22c55e' : '#6b7280'}
          strokeWidth="1.5"
          style={{ cursor: readonly ? 'default' : 'pointer', transition: 'all 150ms' }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(star)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Loading Dots ── */
function LoadingDots() {
  const [dots, setDots] = useState('.');
  useEffect(() => {
    const t = setInterval(() => setDots((p) => (p.length >= 3 ? '.' : p + '.')), 400);
    return () => clearInterval(t);
  }, []);
  return <span>{dots}</span>;
}

/* ── Modal Overlay ── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 200ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="g-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          animation: 'slideUp 300ms ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Workshops() {
  const sectionRef = useInView();
  const [completed, setCompleted] = useState<CompletedWorkshop[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedCompleted, setSelectedCompleted] = useState<CompletedWorkshop | null>(null);
  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingWorkshop | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regMessage, setRegMessage] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Feedback form
  const [fbName, setFbName] = useState('');
  const [fbRating, setFbRating] = useState(0);
  const [fbText, setFbText] = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);

  // Keep modal data synced if background fetch update arrives
  useEffect(() => {
    if (selectedCompleted) {
      const fresh = completed.find(w => w.id === selectedCompleted.id);
      if (fresh && fresh.total_ratings !== selectedCompleted.total_ratings) {
        setSelectedCompleted(fresh);
      }
    }
  }, [completed]);

  useEffect(() => {
    if (selectedUpcoming) {
      const fresh = upcoming.find(w => w.id === selectedUpcoming.id);
      if (fresh && fresh.seats_left !== selectedUpcoming.seats_left) {
        setSelectedUpcoming(fresh);
      }
    }
  }, [upcoming]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [compRes, upRes] = await Promise.all([
        supabase.from('completed_workshops').select('*'),
        supabase.from('upcoming_workshops').select('*').eq('is_active', true),
      ]);

      const parseDate = (dStr: string) => {
        const match = dStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (!match) return 0;
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1])).getTime();
      };

      if (compRes.data) {
        // Sort completed: latest first (descending)
        const sortedComp = [...compRes.data].sort((a, b) => parseDate(b.date) - parseDate(a.date));
        setCompleted(sortedComp);
      }

      if (upRes.data) {
        // Sort upcoming: soonest first (ascending)
        const sortedUp = [...upRes.data].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        setUpcoming(sortedUp);
      }
    } catch {
      /* silent — UI will show empty state */
    } finally {
      setLoading(false);
    }
  }

  /* Registration submit */
  async function handleRegSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUpcoming) return;
    setRegSubmitting(true);
    try {
      const { error } = await supabase.from('workshop_registrations').insert({
        workshop_id: selectedUpcoming.id,
        full_name: regName,
        email: regEmail,
        phone: regPhone,
        message: regMessage,
      });
      if (!error) {
        setRegSuccess(true);
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegMessage('');
        // Refresh to update seat count
        fetchData();
        // Removed auto-close timeout so user can click Discord link
      }
    } catch {
      /* silent */
    }
    setRegSubmitting(false);
  }

  /* Feedback submit */
  async function handleFbSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCompleted) return;
    setFbSubmitting(true);
    try {
      const { error } = await supabase.from('workshop_feedback').insert({
        workshop_id: selectedCompleted.id,
        name: fbName,
        rating: fbRating,
        feedback: fbText,
      });
      if (!error) {
        setFbSuccess(true);
        setFbName('');
        setFbRating(0);
        setFbText('');
        // Refresh to update avg rating
        fetchData();
        setTimeout(() => {
          setFbSuccess(false);
          setShowFeedback(false);
        }, 3000);
      }
    } catch {
      /* silent */
    }
    setFbSubmitting(false);
  }

  return (
    <section id="workshops" className="py-24 md:py-32 theme-green" style={{ background: 'var(--bg-void)' }}>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <p className="eyebrow anim-slide-left">WORKSHOPS</p>

        {/* Title */}
        <h2 className="section-title anim-fade-in" style={{ marginBottom: '48px' }}>
          Hands-on. Live. <em>Brutal.</em>
        </h2>

        {loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Loading workshops<LoadingDots />
          </p>
        )}

        {/* ══════════════════════════════════════
             UPCOMING WORKSHOPS — Stable Cards
           ══════════════════════════════════════ */}
        {!loading && (
          <div className="mb-20">
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}
            >
              Upcoming Workshops
            </h3>

            {upcoming.length === 0 ? (
              <div
                className="g-card"
                style={{
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  No upcoming workshops scheduled right now.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                  Check back soon or join our Discord to get notified first!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((w) => (
                  <div
                    key={w.id}
                    className="g-card"
                    style={{ padding: '28px', cursor: 'pointer' }}
                    onClick={() => setSelectedUpcoming(w)}
                  >
                    {w.thumbnail_url && (
                      <div style={{ borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                        <img
                          src={w.thumbnail_url}
                          alt={w.title}
                          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="g-tag g-tag--accent">{w.date}</span>
                      <span className="g-tag">{w.time}</span>
                      <span className="g-tag">{w.platform}</span>
                    </div>
                    <h4
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                      }}
                    >
                      {w.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Speaker: {w.speaker}
                    </p>
                    {w.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        {w.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {w.seats_left} / {w.seats_total} seats left
                      </span>
                      <button className="btn-solid" style={{ fontSize: '13px' }}>
                        Register →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
             COMPLETED WORKSHOPS — Scroll with Arrows
           ══════════════════════════════════════ */}
        {!loading && completed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  Completed Workshops
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Watch our recorded workshop sessions
                </p>
              </div>
              {/* Navigation arrows */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('completed-scroll');
                    if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-border)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('completed-scroll');
                    if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-border)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable row */}
            <div
              id="completed-scroll"
              className="flex gap-6 overflow-x-auto py-4"
              style={{
                scrollbarWidth: 'none',
                scrollSnapType: 'x mandatory',
              }}
            >
              {completed.map((w) => (
                <div
                  key={w.id}
                  className="g-card flex-shrink-0"
                  style={{
                    width: '380px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => setSelectedCompleted(w)}
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={
                        w.thumbnail_url ||
                        `https://via.placeholder.com/380x200/0d110d/22c55e?text=${encodeURIComponent(w.title)}`
                      }
                      alt={w.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    {/* Play overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.5)',
                        opacity: 0,
                        transition: 'opacity 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '0';
                      }}
                    >
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="#22c55e" stroke="none">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    {/* Recording badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.75)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#22c55e',
                      }}
                    >
                      {w.recording_urls.length} {w.recording_urls.length === 1 ? 'Recording' : 'Recordings'}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Title */}
                    <h4
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                      }}
                    >
                      {w.title}
                    </h4>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {w.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="g-tag">👤 {w.speaker}</span>
                      <span className="g-tag">📅 {w.date}</span>
                      <span className="g-tag">🕐 {w.time}</span>
                      <span className="g-tag">💬 {w.platform}</span>
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Bottom row: Rating + Watch button */}
                    <div
                      style={{
                        borderTop: '0.5px solid var(--bg-border)',
                        paddingTop: '14px',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <StarRating value={w.avg_rating} readonly size={16} />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {w.total_ratings > 0
                            ? `${w.avg_rating.toFixed(1)} (${w.total_ratings})`
                            : 'No reviews yet'}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#22c55e',
                          fontWeight: 500,
                        }}
                      >
                        Watch Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
           MODAL: Registration Form
         ══════════════════════════════════════ */}
      {selectedUpcoming && (
        <Modal onClose={() => setSelectedUpcoming(null)}>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Register for {selectedUpcoming.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="g-tag g-tag--accent">{selectedUpcoming.date}</span>
            <span className="g-tag">{selectedUpcoming.time}</span>
            <span className="g-tag">{selectedUpcoming.platform}</span>
            <span className="g-tag">Speaker: {selectedUpcoming.speaker}</span>
          </div>
          {selectedUpcoming.description && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {selectedUpcoming.description}
            </p>
          )}
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {selectedUpcoming.seats_left} / {selectedUpcoming.seats_total} seats remaining
          </p>

          <form onSubmit={handleRegSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder=" "
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <label>Full Name</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder=" "
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder=" "
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
              <label>Phone (optional)</label>
            </div>
            <div className="form-group">
              <textarea
                placeholder=" "
                rows={3}
                value={regMessage}
                onChange={(e) => setRegMessage(e.target.value)}
              />
              <label>Message (optional)</label>
            </div>

            <button
              type="submit"
              className="btn-solid w-full justify-center"
              disabled={regSubmitting}
            >
              {regSubmitting ? <LoadingDots /> : regSuccess ? '✓ Registered!' : 'Register Now →'}
            </button>

            {regSuccess && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  borderRadius: '6px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                  ✓ You're in!
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>
                  Your seat is secured. Step 2 is to join our dedicated Discord community where the live workshop will take place!
                </p>
                <a
                  href="https://discord.gg/9MWjDM3cTy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Join Gamkers Discord 👾
                </a>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════
           MODAL: Completed Workshop Details
         ══════════════════════════════════════ */}
      {selectedCompleted && !showFeedback && (
        <Modal onClose={() => setSelectedCompleted(null)}>
          {selectedCompleted.thumbnail_url && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <img
                src={selectedCompleted.thumbnail_url}
                alt={selectedCompleted.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
            </div>
          )}
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            {selectedCompleted.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="g-tag g-tag--accent">{selectedCompleted.date}</span>
            <span className="g-tag">{selectedCompleted.time}</span>
            <span className="g-tag">{selectedCompleted.platform}</span>
            <span className="g-tag">Speaker: {selectedCompleted.speaker}</span>
          </div>
          {selectedCompleted.description && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {selectedCompleted.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <StarRating value={selectedCompleted.avg_rating} readonly size={18} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {selectedCompleted.avg_rating.toFixed(1)} / 5 ({selectedCompleted.total_ratings}{' '}
              reviews)
            </span>
          </div>

          {/* Recording links */}
          <div style={{ marginBottom: '20px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Recordings
            </p>
            <div className="flex flex-col gap-2">
              {selectedCompleted.recording_urls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  {selectedCompleted.recording_urls.length > 1
                    ? `Watch Part ${i + 1}`
                    : 'Watch Now'}
                  →
                </a>
              ))}
            </div>
          </div>

          {/* Feedback button */}
          <button
            className="btn-solid w-full justify-center"
            onClick={() => setShowFeedback(true)}
          >
            Give Feedback ★
          </button>
        </Modal>
      )}

      {/* ══════════════════════════════════════
           MODAL: Feedback Form
         ══════════════════════════════════════ */}
      {selectedCompleted && showFeedback && (
        <Modal
          onClose={() => {
            setShowFeedback(false);
            setSelectedCompleted(null);
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Feedback for {selectedCompleted.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Speaker: {selectedCompleted.speaker}
          </p>

          <form onSubmit={handleFbSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder=" "
                required
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
              />
              <label>Your Name</label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Rate this workshop
              </p>
              <StarRating value={fbRating} onChange={setFbRating} size={28} />
            </div>

            <div className="form-group">
              <textarea
                placeholder=" "
                rows={4}
                required
                value={fbText}
                onChange={(e) => setFbText(e.target.value)}
              />
              <label>Your feedback</label>
            </div>

            <button
              type="submit"
              className="btn-solid w-full justify-center"
              disabled={fbSubmitting || fbRating === 0}
            >
              {fbSubmitting ? <LoadingDots /> : fbSuccess ? '✓ Thank You!' : 'Submit Feedback'}
            </button>

            {fbSuccess && (
              <p
                style={{
                  color: '#22c55e',
                  fontSize: '13px',
                  marginTop: '12px',
                  textAlign: 'center',
                }}
              >
                Your feedback has been submitted successfully!
              </p>
            )}
          </form>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
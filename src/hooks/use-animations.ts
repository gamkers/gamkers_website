import { useEffect, useRef } from 'react';

/**
 * Intersection Observer hook for entrance animations.
 * Adds 'visible' class when element enters viewport.
 */
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Make everything visible immediately
      el.querySelectorAll('.anim-fade-in, .anim-slide-left, .anim-slide-right, .anim-scale-in, .btn-entrance, .section-divider').forEach(child => {
        child.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe children with animation classes
    el.querySelectorAll('.anim-fade-in, .anim-slide-left, .anim-slide-right, .anim-scale-in, .btn-entrance, .section-divider').forEach(child => {
      observer.observe(child);
    });

    // Also observe the element itself
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * Counter animation hook — counts up when visible.
 */
export function useCountUp(target: number, duration: number, suffix: string = '') {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            observer.disconnect();
            animateCount(el, target, duration, suffix);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix]);

  return ref;
}

function animateCount(el: HTMLSpanElement, target: number, duration: number, suffix: string) {
  const start = performance.now();
  const animate = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}

/**
 * Drag-to-scroll for horizontal scroll rows.
 */
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      el.scrollLeft = scrollLeft.current - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return ref;
}

/**
 * Auto-scroll for horizontal rows — pauses on hover.
 */
export function useAutoScroll(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const userInteracted = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId: number;

    const scroll = () => {
      if (!isPaused.current && !userInteracted.current) {
        el.scrollLeft += speed;
        // Loop back
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);

    const pause = () => { isPaused.current = true; };
    const resume = () => { isPaused.current = false; };
    const onUserInteract = () => {
      userInteracted.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        userInteracted.current = false;
      }, 3000);
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('mousedown', onUserInteract);
    el.addEventListener('touchstart', onUserInteract);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('mousedown', onUserInteract);
      el.removeEventListener('touchstart', onUserInteract);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [speed]);

  return ref;
}

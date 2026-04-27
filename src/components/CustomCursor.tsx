import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only on fine-pointer devices (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('custom-cursor-active');
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .g-card');
      if (isInteractive) {
        cursor.classList.add('hovering');
      } else {
        cursor.classList.remove('hovering');
      }
    };

    // Lerp-based smooth follow
    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.15);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.15);
      cursor.style.left = `${cursorPos.current.x}px`;
      cursor.style.top = `${cursorPos.current.y}px`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return <div ref={cursorRef} className="cursor-dot" />;
}

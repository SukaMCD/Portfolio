import { useEffect, useRef } from 'react';

const C_COAL = '#1c1c21';
const C_PAPER = '#E2DFD2';

// Interactive Cursor
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('custom-cursor-active');
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    let isHovering = false, raf: number;
    let isDark = false;

    const getDarkSection = (e: MouseEvent): boolean => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      return !!el?.closest('#contact');
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      isDark = getDarkSection(e);
      const fg = isDark ? C_PAPER : C_COAL;
      const fgAlpha = isDark ? 'rgba(226,223,210,0.45)' : 'rgba(28,28,33,0.4)';
      const bgAlpha = isDark ? 'rgba(226,223,210,0.1)' : 'rgba(28,28,33,0.08)';

      dot.style.backgroundColor = fg;

      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, [role=button], input, textarea')) {
        if (!isHovering) {
          isHovering = true;
          ring.style.width = '48px';
          ring.style.height = '48px';
          ring.style.borderColor = fg;
          ring.style.backgroundColor = bgAlpha;
          dot.style.opacity = '0';
        }
      } else {
        if (isHovering) {
          isHovering = false;
          ring.style.width = '32px';
          ring.style.height = '32px';
          ring.style.backgroundColor = 'transparent';
          dot.style.opacity = '1';
        }
        ring.style.borderColor = fgAlpha;
      }
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none transition-opacity duration-150" style={{ backgroundColor: C_COAL, transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }} />
      <div ref={ringRef} className="fixed top-0 left-0 rounded-full pointer-events-none border transition-[width,height,background-color,border-color] duration-200" style={{ width: '32px', height: '32px', borderColor: 'rgba(28, 28, 33, 0.4)', transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }} />
    </div>
  );
}
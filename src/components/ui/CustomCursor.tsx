import React, { useEffect, useRef } from 'react';

// Custom Cursor
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hovering = false;
    let pressed = false;
    let visible = false;
    let rafId = 0;

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label[for]';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
      const target = e.target as HTMLElement | null;
      hovering = Boolean(target?.closest(interactiveSelector));
    };

    const onMouseDown = () => {
      pressed = true;
    };

    const onMouseUp = () => {
      pressed = false;
    };

    const onMouseLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        const dotScale = pressed ? 0.7 : hovering ? 1.4 : 1;
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.backgroundColor = hovering ? '#F03A2A' : '';
      }

      if (ringRef.current) {
        const ringScale = pressed ? 0.85 : hovering ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.borderColor = hovering ? '#F03A2A' : '';
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[200] w-7 h-7 rounded-full border-[1.5px] border-[#1c1c21]/70 transition-colors duration-150 hidden md:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[201] w-2 h-2 rounded-full bg-[#1c1c21] transition-colors duration-150 hidden md:block"
      />
    </>
  );
}

import { useEffect, useRef } from 'react';

const C_COAL = '#1c1c21';
const C_PAPER = '#E2DFD2';

// Interactive Cursor
export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    const path = pathRef.current;
    if (!cursor || !path) return;

    let mouseX = -100;
    let mouseY = -100;
    let isVisible = false;
    let isDown = false;
    let isDark = false;
    let isHovering = false;

    const checkIsDark = (target: HTMLElement | null): boolean => {
      if (!target) return false;

      let cur: HTMLElement | null = target;
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
            if (a > 0.35) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              return brightness < 128;
            }
          }
        }
        if (cur.id === 'contact') return true;
        cur = cur.parentElement;
      }
      return false;
    };

    const updateAppearance = () => {
      const fg = isDark ? C_PAPER : C_COAL;
      const stroke = isDark ? C_COAL : C_PAPER;

      path.setAttribute('fill', fg);
      path.setAttribute('stroke', stroke);

      const scale = isDown ? 'scale(0.88)' : isHovering ? 'scale(1.08)' : 'scale(1)';
      cursor.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 2}px, 0) ${scale}`;
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      isDark = checkIsDark(target);
      isHovering = !!target?.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');

      updateAppearance();
    };

    const onMouseDown = () => {
      isDown = true;
      updateAppearance();
    };

    const onMouseUp = () => {
      isDown = false;
      updateAppearance();
    };

    const onMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
    };

    const onMouseEnter = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;
      cursor.style.opacity = '1';
      isDark = checkIsDark(e.target as HTMLElement | null);
      updateAppearance();
    };

    const onScroll = () => {
      const el = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const nextDark = checkIsDark(el);
      if (nextDark !== isDark) {
        isDark = nextDark;
        updateAppearance();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform origin-[3px_2px] transition-opacity duration-150 select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        opacity: 0,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none filter drop-shadow-[0_2px_4px_rgba(28,28,33,0.18)]"
      >
        <path
          ref={pathRef}
          d="M3 2L3 18L7.8 13.2L15.5 14.2Z"
          fill={C_COAL}
          stroke={C_PAPER}
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{
            transition: 'fill 0.15s ease, stroke 0.15s ease',
          }}
        />
      </svg>
    </div>
  );
}
import React, { useEffect, useRef, useCallback } from 'react';
import type { Theme } from '../../lib/theme';

// Theme Transition
export interface TransitionOptions {
  x: number;
  y: number;
  targetTheme: Theme;
}

let _trigger: ((opts: TransitionOptions) => void) | null = null;

export function triggerThemeTransition(opts: TransitionOptions) {
  if (_trigger) _trigger(opts);
}

const easeOutExpo = (t: number) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function ThemeTransition() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const splashRef = useRef<SVGCircleElement>(null);
  const turbRef   = useRef<SVGFETurbulenceElement>(null);
  const dispRef   = useRef<SVGFEDisplacementMapElement>(null);
  const rafRef    = useRef<number>(0);
  const isAnimating = useRef(false);

  const runTransition = useCallback(({ x, y, targetTheme }: TransitionOptions) => {
    if (isAnimating.current) return;
    const svg     = svgRef.current;
    const circle  = circleRef.current;
    const splash  = splashRef.current;
    const turb    = turbRef.current;
    const disp    = dispRef.current;
    if (!svg || !circle || !splash || !turb || !disp) return;

    isAnimating.current = true;
    cancelAnimationFrame(rafRef.current);

    const fillColor = targetTheme === 'dark' ? '#1c1c21' : '#E2DFD2';
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = Math.max(x, vw - x);
    const dy = Math.max(y, vh - y);
    const maxRadius = Math.sqrt(dx * dx + dy * dy) + 60;

    // SVG canvas
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    svg.style.width  = `${vw}px`;
    svg.style.height = `${vh}px`;
    svg.style.display = 'block';
    svg.style.opacity = '1';

    // Main ink circle
    circle.setAttribute('cx', `${x}`);
    circle.setAttribute('cy', `${y}`);
    circle.setAttribute('r',  '0');
    circle.setAttribute('fill', fillColor);

    // Micro-splash ring at origin
    splash.setAttribute('cx', `${x}`);
    splash.setAttribute('cy', `${y}`);
    splash.setAttribute('r',  '0');
    splash.setAttribute('fill', 'none');
    splash.setAttribute('stroke', fillColor);
    splash.setAttribute('stroke-width', '3');
    splash.setAttribute('opacity', '0.6');

    // Initial turbulence: high frequency = chaotic ink splatter at start
    turb.setAttribute('baseFrequency', '0.032 0.022');
    turb.setAttribute('seed', '3');
    disp.setAttribute('scale', '0');

    document.documentElement.classList.add('theme-transitioning');

    // Apply theme class at ~45% of animation
    const DURATION = 820;
    const themeTimer = setTimeout(() => {
      const root = document.documentElement;
      if (targetTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      try { localStorage.setItem('theme', targetTheme); } catch {}
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', targetTheme === 'dark' ? '#1c1c21' : '#E2DFD2');
      window.dispatchEvent(new CustomEvent('theme-change', { detail: targetTheme }));
    }, DURATION * 0.44);

    let startTime: number | null = null;
    let seedTick = 0;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      // Main circle: fast out-expo expand
      const r = easeOutExpo(t) * maxRadius;
      circle.setAttribute('r', `${r}`);

      // Displacement: ramp up fast (0→peak at t=0.15) then decay
      // Creates ink "splash" effect at the moment of contact
      const dispPeak = 0.15;
      const rawDisp = t < dispPeak
        ? (t / dispPeak) * 42
        : 42 * Math.pow(1 - (t - dispPeak) / (1 - dispPeak), 1.8);
      disp.setAttribute('scale', `${Math.max(rawDisp, 0).toFixed(1)}`);

      // Turbulence frequency: coarse → fine as it spreads (ink absorbed by paper)
      const baseFreq = 0.032 - easeInOutCubic(Math.min(t / 0.7, 1)) * 0.018;
      turb.setAttribute('baseFrequency', `${baseFreq.toFixed(4)} ${(baseFreq * 0.7).toFixed(4)}`);

      // Change turbulence seed periodically for organic shimmer at start
      if (t < 0.3 && Math.floor(t * 20) !== seedTick) {
        seedTick = Math.floor(t * 20);
        turb.setAttribute('seed', `${(seedTick % 6) + 1}`);
      }

      // Micro-splash ring: expands fast then fades
      const splashR   = easeOutExpo(Math.min(t * 5, 1)) * 48;
      const splashOp  = Math.max(0, 0.7 - t * 3.5);
      const splashW   = Math.max(0.5, 3 - t * 12);
      splash.setAttribute('r', `${splashR}`);
      splash.setAttribute('opacity', `${splashOp}`);
      splash.setAttribute('stroke-width', `${splashW}`);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Gentle fade out
        circle.setAttribute('r', `${maxRadius}`);
        disp.setAttribute('scale', '0');
        let fadeStart: number | null = null;
        const FADE = 200;
        const fadeOut = (fts: number) => {
          if (!fadeStart) fadeStart = fts;
          const ft = Math.min((fts - fadeStart) / FADE, 1);
          svg.style.opacity = `${1 - ft}`;
          if (ft < 1) {
            rafRef.current = requestAnimationFrame(fadeOut);
          } else {
            svg.style.display  = 'none';
            svg.style.opacity  = '1';
            document.documentElement.classList.remove('theme-transitioning');
            isAnimating.current = false;
          }
        };
        rafRef.current = requestAnimationFrame(fadeOut);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(themeTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    _trigger = runTransition;
    return () => { _trigger = null; };
  }, [runTransition]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'none',
        zIndex: 9999,
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      <defs>
        <filter
          id="ink-bleed"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbRef}
            type="turbulence"
            baseFrequency="0.032 0.022"
            numOctaves="5"
            seed="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      {/* Main ink blob */}
      <circle ref={circleRef} cx="0" cy="0" r="0" filter="url(#ink-bleed)" />
      {/* Micro-splash ring at click origin */}
      <circle ref={splashRef} cx="0" cy="0" r="0" fill="none" />
    </svg>
  );
}

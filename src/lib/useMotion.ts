import { useEffect, useRef, useState, useCallback } from 'react';

export function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

export function useMagnetic<T extends HTMLElement>(strength = 4) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      if (
        !window.matchMedia('(pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate3d(${(relX * strength * 2).toFixed(1)}px, ${(relY * strength * 2).toFixed(1)}px, 0)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

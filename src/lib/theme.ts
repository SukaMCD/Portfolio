export type Theme = 'light' | 'dark';

// Theme Manager
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  if (document.documentElement.classList.contains('dark')) return 'dark';
  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'dark') return 'dark';
  } catch {}
  return 'light';
}

export function setTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#1c1c21' : '#E2DFD2');
  }
  window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
}

export function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

if (typeof window !== 'undefined') {
  (window as any).__getTheme = getTheme;
  (window as any).__setTheme = setTheme;
  (window as any).__toggleTheme = toggleTheme;
}

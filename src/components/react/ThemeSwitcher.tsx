import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Access localstorage on client side
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Check if browser supports View Transition API and prefers-reduced-motion is false
    const isAppearanceTransition = 
      typeof document !== 'undefined' &&
      // @ts-ignore
      document.startViewTransition && 
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const changeThemeClasses = () => {
      setTheme(nextTheme);
      localStorage.setItem('theme', nextTheme);
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    };

    if (!isAppearanceTransition) {
      changeThemeClasses();
      return;
    }

    // Add transitioning helper class to html
    document.documentElement.classList.add('theme-transition');

    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      changeThemeClasses();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    // Remove transitioning helper class when finished
    transition.finished.then(() => {
      document.documentElement.classList.remove('theme-transition');
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border-soft hover:border-silver-500 text-silver-300 hover:text-silver-100 transition-all duration-300 cursor-pointer shadow-md select-none"
      title={theme === 'dark' ? 'Switch to Off-White' : 'Switch to Charcoal'}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 animate-[spin_20s_linear_infinite]" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

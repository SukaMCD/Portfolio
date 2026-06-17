import { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  activeTab: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Overview';
      case 'projects': return 'Projects';
      case 'stats': return 'Tech Stack';
      case 'contact': return 'Contact';
      default: return 'Portfolio';
    }
  };

  return (
    <header className="mx-4 mt-2 sm:mx-6 sm:mt-6 flex flex-row justify-between items-center px-6 py-4 bg-bg-surface/50 border border-border-soft rounded-2xl backdrop-blur-md shrink-0 gap-4 transition-all duration-300 shadow-md">
      
      {/* Title info */}
      <div>
        <h1 className="text-sm sm:text-base font-black tracking-tight text-silver-100">
          {getTitle()}
        </h1>
      </div>

      {/* Clock and Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Live Clock */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-silver-400 select-none">
          <span className="text-silver-500">time:</span>
          <span className="text-silver-100 font-mono tracking-widest">{time || '00:00:00'}</span>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-border-soft"></div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  activeTab: string;
  openTerminal?: () => void;
}

export default function Header({ activeTab, openTerminal }: HeaderProps) {
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
      case 'certificates': return 'Certificates';
      case 'contact': return 'Contact';
      default: return 'Portfolio';
    }
  };

  return (
    <header className="mx-3 mt-3 sm:mx-6 sm:mt-6 flex flex-row justify-between items-center px-4 sm:px-6 py-3.5 sm:py-4 bg-bg-surface/60 border border-border-soft rounded-2xl backdrop-blur-md shrink-0 gap-3 transition-all duration-300 shadow-md">
      
      {/* Mobile Profile & Desktop Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Mini Avatar */}
        <div className="flex lg:hidden items-center gap-2.5 min-w-0">
          <img
            src="https://github.com/SukaMCD.png"
            alt="Fabian Rizky Pratama"
            className="w-8 h-8 rounded-lg object-cover border border-border-soft shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/100';
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-silver-100 truncate">Fabian Rizky P.</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-[8.5px] font-mono font-bold text-accent-emerald uppercase tracking-wider">Available</span>
            </div>
          </div>
        </div>

        {/* Desktop Title */}
        <h1 className="hidden lg:block text-sm sm:text-base font-black tracking-tight text-silver-100">
          {getTitle()}
        </h1>
      </div>

      {/* Clock, Terminal Trigger, and Theme Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Live Clock (Hidden on very tiny mobile to save space) */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-silver-400 select-none">
          <span className="text-silver-500">time:</span>
          <span className="text-silver-100 font-mono tracking-widest">{time || '00:00:00'}</span>
        </div>

        {/* Mobile Terminal Button */}
        {openTerminal && (
          <button
            onClick={openTerminal}
            className="lg:hidden p-2 rounded-xl bg-bg-elevated border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100 transition-colors cursor-pointer"
            aria-label="Open Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-silver-400" />
          </button>
        )}

        {/* Vertical Divider */}
        <div className="hidden sm:block h-4 w-px bg-border-soft"></div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}


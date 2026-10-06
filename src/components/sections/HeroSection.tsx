import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Mail, Moon, Sun } from 'lucide-react';
import { getTheme, type Theme } from '../../lib/theme';
import { triggerThemeTransition } from '../ui/ThemeTransition';

// Hero Illustration
export function HeroIllustration() {
  return (
    <div className="shrink-0 self-start lg:self-end">
      <div className="w-30 sm:w-33.75 md:w-37.5 lg:w-40 aspect-square border-[3.5px] border-[#1c1c21] bg-[#E2DFD2] overflow-hidden relative shadow-[4px_4px_0px_#1c1c21]">
        <img
          src="/image/hiura.webp"
          alt="Fabian Rizky Pratama anime ink lineart portrait"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-top scale-[1.04] origin-top mix-blend-multiply opacity-95"
        />
      </div>
    </div>
  );
}

// Hero Section
export default function HeroSection({
  onNavigateDossier,
  onNavigateWorks,
}: {
  onNavigateDossier?: () => void;
  onNavigateWorks?: () => void;
}) {
  const [time, setTime] = useState('');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(getTheme());
    const onTheme = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      setThemeState(customEvent.detail || getTheme());
    };
    window.addEventListener('theme-change', onTheme);
    return () => window.removeEventListener('theme-change', onTheme);
  }, []);

  const handleToggleTheme = (e: React.MouseEvent) => {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    triggerThemeTransition({ x: e.clientX, y: e.clientY, targetTheme: next });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-10 w-full h-screen min-h-170 flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
      <header className="relative z-10 w-full flex items-center justify-between border-b border-[#1c1c21]/15 pb-5">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold tracking-tight text-sm sm:text-base text-[#1c1c21]">
            FABIAN RIZKY PRATAMA
          </span>
        </div>

        <div className="hidden md:flex items-center font-mono-stack text-xs text-[#58554f]">
          <span>JAKARTA, ID {time && `[${time} WIB]`}</span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 font-mono-stack text-xs">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1c1c21]/20 hover:border-[#1c1c21] hover:bg-[#1c1c21] hover:text-[#E2DFD2] transition-all text-[#1c1c21] cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            <span className="hidden sm:inline uppercase font-bold">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
          <a
            href="https://github.com/SukaMCD"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1c1c21]/20 hover:border-[#1c1c21] hover:bg-[#1c1c21] hover:text-[#E2DFD2] transition-all text-[#1c1c21]"
          >
            <Github size={13} />
            <span className="hidden sm:inline">GITHUB</span>
          </a>
          <a
            href="mailto:sukamcdev@gmail.com"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#2e2e36] transition-all"
          >
            <Mail size={13} />
            <span>CONTACT</span>
          </a>
        </nav>
      </header>

      <div className="relative z-10 w-full my-auto py-8 flex flex-col justify-center">
        <h1 className="font-display font-extrabold uppercase text-4xl sm:text-6xl md:text-7xl lg:text-[5.8vw] leading-[0.92] tracking-[-0.04em] text-[#1c1c21]">
          ARCHITECTING
          <br />
          ROBUST SYSTEMS
          <br />
          <span className="font-light italic text-[#58554f]">& CRAFTING DIGITAL DEPTH</span>
        </h1>

        <div className="w-full mt-8 sm:mt-12 pt-6 border-t border-[#1c1c21]/15 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 max-w-3xl">
            <p className="max-w-md text-sm text-[#58554f] leading-relaxed">
              Architecting resilient backend infrastructures (Laravel, PostgreSQL) with
              sub-second API precision, deterministic data workflows, and scalable architectures.
              Dedicated to clean code and uncompromising system integrity.
            </p>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#works"
                onClick={(e) => {
                  if (onNavigateWorks) {
                    e.preventDefault();
                    onNavigateWorks();
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#2e2e36] transition-all font-mono-stack text-xs tracking-wider uppercase flex items-center gap-2 group shadow-sm cursor-pointer"
              >
                <span>EXPLORE WORKS</span>
                <ArrowDown size={13} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#dossier"
                onClick={(e) => {
                  if (onNavigateDossier) {
                    e.preventDefault();
                    onNavigateDossier();
                  }
                }}
                className="px-5 py-2.5 rounded-full border border-[#1c1c21]/30 text-[#1c1c21] hover:border-[#1c1c21] hover:bg-[#1c1c21]/5 transition-all font-mono-stack text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>DOSSIER</span>
                <ArrowDown size={13} />
              </a>
            </div>
          </div>

          <HeroIllustration />
        </div>
      </div>

      <footer className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-[#1c1c21]/15 font-mono-stack text-[11px] text-[#58554f]">
        <div className="flex items-center gap-4">
          <span>LAT 06°12'S 106°50'E</span>
        </div>

        <a
          href="#dossier"
          onClick={(e) => {
            if (onNavigateDossier) {
              e.preventDefault();
              onNavigateDossier();
            }
          }}
          className="flex items-center gap-2 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
        >
          <span>SCROLL TO PROCEED</span>
          <ArrowDown size={12} className="animate-bounce" />
        </a>
      </footer>
    </section>
  );
}

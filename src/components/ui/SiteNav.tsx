import React from 'react';

// Site Nav
export default function SiteNav({
  visible,
  scrollPct,
  activeSection = 0,
  onNavigateHero,
  onNavigateDossier,
  onNavigateWorks,
  onNavigateCredentials,
  onNavigateExperience,
  onNavigateContact,
}: {
  visible: boolean;
  scrollPct: number;
  activeSection?: number;
  onNavigateHero: () => void;
  onNavigateDossier: () => void;
  onNavigateWorks: () => void;
  onNavigateCredentials?: () => void;
  onNavigateExperience?: () => void;
  onNavigateContact?: () => void;
}) {
  const isInverted = activeSection === 5;

  const navItems = [
    { id: 'nav-hero', label: '§00 hero', section: 0, onClick: onNavigateHero },
    { id: 'nav-dossier', label: '§01 dossier', section: 1, onClick: onNavigateDossier },
    { id: 'nav-works', label: '§02 works', section: 2, onClick: onNavigateWorks },
    { id: 'nav-credentials', label: '§03 creds', section: 3, onClick: onNavigateCredentials },
    { id: 'nav-experience', label: '§04 exp', section: 4, onClick: onNavigateExperience },
    { id: 'nav-contact', label: '§05 trans', section: 5, onClick: onNavigateContact },
  ];

  return (
    <nav
      aria-label="Site navigation"
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="fixed left-0 top-0 bottom-0 z-[120] w-8 flex flex-col items-center select-none"
    >
      {/* Progress fill — behind border */}
      <div
        className={`absolute right-0 top-0 w-px ${isInverted ? 'bg-[#E2DFD2]/15' : 'bg-[#1c1c21]/12'} bottom-0 transition-colors duration-300`}
        aria-hidden="true"
      />
      <div
        className={`absolute right-0 top-0 w-px ${isInverted ? 'bg-[#E2DFD2]/70' : 'bg-[#1c1c21]/50'} transition-all duration-150 ease-linear`}
        style={{ height: `${scrollPct}%` }}
        aria-hidden="true"
      />

      {/* Top — identity stamp */}
      <div className={`pt-3 pb-2 flex flex-col items-center gap-1 border-b ${isInverted ? 'border-[#E2DFD2]/15' : 'border-[#1c1c21]/10'} w-full transition-colors duration-300 shrink-0`}>
        <button
          id="nav-home"
          onClick={onNavigateHero}
          className={`font-mono-stack text-[9px] font-bold ${isInverted ? 'text-[#E2DFD2]' : 'text-[#1c1c21]'} tracking-[0.18em] hover:opacity-50 transition-all duration-200 cursor-pointer`}
        >
          F
        </button>
        <div className={`w-2 h-px ${isInverted ? 'bg-[#E2DFD2]/30' : 'bg-[#1c1c21]/25'} transition-colors duration-300`} />
      </div>

      {/* Center — nav labels (rotated, distributed evenly to fit any height) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-evenly py-1.5 w-full">
        {navItems.map((item) => {
          const isActive = activeSection === item.section;
          return (
            <div key={item.id} className="relative w-full flex items-center justify-center py-0.5">
              <button
                id={item.id}
                onClick={item.onClick}
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                className={`group flex items-center gap-1 font-mono-stack text-[8px] tracking-[0.13em] uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isInverted
                      ? 'text-[#E2DFD2] font-bold'
                      : 'text-[#1c1c21] font-bold'
                    : isInverted
                    ? 'text-[#E2DFD2]/40 font-normal hover:text-[#E2DFD2]'
                    : 'text-[#58554f]/40 font-normal hover:text-[#1c1c21]'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    isInverted ? 'bg-[#E2DFD2]' : 'bg-[#1c1c21]'
                  } ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-75'
                  }`}
                />
                <span>{item.label}</span>
              </button>

              {/* Right edge border tick indicator */}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-4 transition-all duration-200 ${
                  isInverted ? 'bg-[#E2DFD2]' : 'bg-[#1c1c21]'
                } ${
                  isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                }`}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom — github */}
      <div className={`pb-3 pt-2 flex flex-col items-center gap-1 border-t ${isInverted ? 'border-[#E2DFD2]/15' : 'border-[#1c1c21]/10'} w-full transition-colors duration-300 shrink-0`}>
        <div className={`w-2 h-px ${isInverted ? 'bg-[#E2DFD2]/30' : 'bg-[#1c1c21]/25'} transition-colors duration-300`} />
        <a
          id="nav-github"
          href="https://github.com/SukaMCD"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub Profile"
          className={`${isInverted ? 'text-[#E2DFD2]/60 hover:text-[#E2DFD2]' : 'text-[#58554f] hover:text-[#1c1c21]'} transition-colors duration-200 p-1 flex items-center justify-center cursor-pointer`}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}

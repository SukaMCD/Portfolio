import React from 'react';
import { CornerDownRight } from 'lucide-react';
import ArchIcon from '../ui/ArchIcon';
import ArchTerminal from '../ui/ArchTerminal';

// Dossier Section
export default function DossierSection({
  onNavigateHero,
  onNavigateWorks,
  onNavigateDossier,
}: {
  onNavigateHero?: () => void;
  onNavigateWorks?: () => void;
  onNavigateDossier?: () => void;
}) {
  return (
    <section
      id="dossier"
      className="relative z-20 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between p-4 pb-20 sm:p-7 md:p-9 lg:p-11 bg-[#E2DFD2] border-t-[3px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)]"
    >
      <button
        id="dossier-tab"
        type="button"
        onClick={onNavigateDossier}
        className="hidden md:block group absolute -top-8.5 left-3 sm:left-10 md:left-14 select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 z-10"
      >
        <div className="bg-[#1c1c21] pt-0.75 pl-0.75 pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
          <div className="h-7.75 bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-17.5px)_0,calc(100%-4.5px)_100%,0_100%)]">
            <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
            <span className="w-5 h-4.25 flex items-center justify-center rounded-xs border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
              01
            </span>
            <span className="font-mono-stack text-[10px] font-bold tracking-widest text-[#1c1c21] whitespace-nowrap">
              <span className="sm:hidden">DOSSIER</span>
              <span className="hidden sm:inline">DOSSIER ARCHIVE</span>
            </span>
            <span className="font-mono-stack text-[9px] text-[#58554f] font-normal tracking-wider hidden md:inline">
              // SEC_01
            </span>
          </div>
        </div>
      </button>

      <header className="w-full flex items-center justify-between pb-2.5 sm:pb-3.5 border-b border-[#1c1c21]/15 gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 font-mono-stack text-xs">
          <span className="px-2.5 py-1 rounded bg-[#1c1c21] text-[#E2DFD2] font-semibold tracking-wider text-[11px]">
            DOSSIER // 01
          </span>
          <span className="text-[#58554f] text-[11px] sm:text-xs hidden sm:inline">PERSONNEL PROFILE & TECH ARSENAL</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 font-mono-stack text-xs text-[#58554f]">
          <span className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded border border-[#1c1c21]/20 bg-[#1c1c21]/2 text-[10.5px] sm:text-[11px]">
            <ArchIcon className="w-3.5 h-3.5 text-[#1c1c21]" />
            <span className="text-[#1c1c21] font-semibold">ARCH LINUX</span>
            <span className="text-[#1c1c21]/30">/</span>
            <span>x86_64</span>
          </span>
          <span className="text-[10.5px] sm:text-[11px]">TTY1</span>
        </div>
      </header>

      <div className="w-full my-auto py-2 sm:py-3 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-7 flex flex-col justify-end">
          <div className="font-mono-stack text-[10px] sm:text-[11px] uppercase tracking-widest text-[#58554f] mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c21]" />
            <span>PERSONNEL DOSSIER // ABOUT ME</span>
          </div>

          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl lg:text-[2.6vw] xl:text-[2.8vw] leading-[0.94] tracking-[-0.03em] text-[#1c1c21] mb-3 sm:mb-4">
            FABIAN RIZKY PRATAMA.
            <br />
            BACKEND ARCHITECT
            <br />
            <span className="font-light italic text-[#58554f]">& HIGH-PERFORMANCE API CRAFTSMAN</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch">
            <div className="w-32 sm:w-40 shrink-0 relative border-[3px] border-[#1c1c21] bg-[#1c1c21]/3 shadow-[4px_4px_0px_#1c1c21] overflow-hidden flex flex-col">
              <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#1c1c21]/2">
                <img
                  src="/image/fabian-portrait.webp"
                  alt="Fabian Rizky Pratama"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top filter grayscale contrast-110"
                />
                <div className="absolute inset-0 scan-beam pointer-events-none" />
              </div>
              <div className="border-t-2 border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] font-mono-stack text-[9px] font-bold text-center py-1 tracking-wider flex items-center justify-center shrink-0">
                <span>FABIAN RIZKY PRATAMA</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-2.5">
                <p className="text-xs sm:text-[13px] text-[#58554f] leading-relaxed">
                  Software Engineering student at <strong className="text-[#1c1c21] font-semibold">SMK Budi Luhur</strong> with a deep focus on
                  <strong className="text-[#1c1c21] font-semibold"> Laravel & PostgreSQL</strong> backend architecture, high-performance RESTful API engineering, and robust data management.
                </p>
                <p className="text-xs sm:text-[13px] text-[#58554f] leading-relaxed">
                  Experienced in engineering production systems like <strong className="text-[#1c1c21] font-semibold">Bluvocation</strong> and <strong className="text-[#1c1c21] font-semibold">HRIS</strong>, prioritizing data integrity, determinism, and sub-second latency on an <strong className="text-[#1c1c21] font-semibold">Arch Linux</strong> workstation.
                </p>
              </div>

              <div className="p-3 border-[3px] border-[#1c1c21] bg-[#E2DFD2] shadow-[4px_4px_0px_#1c1c21] font-mono-stack space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between pb-1 border-b border-[#1c1c21]/15">
                  <span className="text-[#58554f]">INSTITUTION</span>
                  <span className="font-bold text-[#1c1c21]">SMK Budi Luhur</span>
                </div>
                <div className="flex items-center justify-between pb-1 border-b border-[#1c1c21]/15">
                  <span className="text-[#58554f]">CORE FOCUS</span>
                  <span className="font-medium text-[#1c1c21]">Backend APIs & Database Architecture</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#58554f]">STATUS</span>
                  <span className="font-bold text-[#1c1c21]">
                    AVAILABLE FOR WORK / COLLAB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full flex flex-col justify-end">
          <ArchTerminal />
        </div>
      </div>

      <footer className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 sm:pt-3.5 border-t border-[#1c1c21]/15 font-mono-stack text-[10px] sm:text-[11px] text-[#58554f] shrink-0">
        <div className="flex items-center gap-3">
          <span>STATION // ARCH LINUX x86_64</span>
          <span>•</span>
          <span>PERSONNEL PROFILE & TECH ARSENAL</span>
        </div>
        <div className="flex items-center gap-3">
          {onNavigateHero && (
            <button
              type="button"
              onClick={onNavigateHero}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>▲ HERO</span>
            </button>
          )}
          <span>•</span>
          {onNavigateWorks ? (
            <button
              type="button"
              onClick={onNavigateWorks}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>NEXT: SELECTED WORKS</span>
              <CornerDownRight size={11} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 min-h-[44px]">
              <span>NEXT: SELECTED WORKS</span>
              <CornerDownRight size={11} />
            </div>
          )}
        </div>
      </footer>
    </section>
  );
}

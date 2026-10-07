import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';
import ArchIcon from '../ui/ArchIcon';
import GithubContributions from '../ui/GithubContributions';
import { subscribeExperiences, type Experience } from '../../lib/firebase';

// Experience Section
export default function ExperienceSection({
  onNavigateCredentials,
  onNavigateContact,
}: {
  onNavigateCredentials?: () => void;
  onNavigateContact?: () => void;
}) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeExperiences((data) => {
      setExperiences(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeExp = experiences[selectedIndex] || experiences[0];

  return (
    <section
      id="experience"
      className="relative z-70 w-full h-screen min-h-160 max-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 bg-[#E2DFD2] border-t-[3px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)] overflow-hidden"
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1c1c21]/15 gap-3 shrink-0">
        <div className="flex items-center gap-2.5 font-mono-stack text-xs">
          <span className="px-2.5 py-1 bg-[#1c1c21] text-[#E2DFD2] font-semibold tracking-wider text-[11px]">
            SERVICE RECORD // 04
          </span>
          <span className="text-[#58554f] text-[11px] sm:text-xs">CAREER TIMELINE & OPERATIONAL HISTORY</span>
        </div>
        <div className="flex items-center gap-3 font-mono-stack text-xs text-[#58554f]">
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-[#1c1c21]/20 bg-[#1c1c21]/2 text-[11px]">
            <ArchIcon className="w-3 h-3 text-[#1c1c21]" />
            <span className="text-[#1c1c21] font-semibold">ARCH / PROD</span>
          </span>
          <div className="text-[11px] text-[#58554f]">
            {loading ? 'SYNCING DATABASE...' : `SHOWING ${String(experiences.length).padStart(2, '0')} // VERIFIED MILESTONES`}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 my-auto py-1 sm:py-2 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch h-full">
        {/* Left Column: Role Selector / Timeline Strip */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2 sm:gap-2.5 h-full min-h-0">
          {experiences.map((exp, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={exp.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex-1 min-h-0 w-full text-left p-2 sm:p-2.5 xl:p-3 transition-all duration-150 border-[2.5px] select-none cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] shadow-[3px_3px_0px_#58554f]'
                    : 'border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] hover:bg-[#1c1c21]/4'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-mono-stack text-[9.5px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 flex items-center justify-center font-bold text-[9px] border ${
                        isSelected
                          ? 'border-[#E2DFD2] text-[#E2DFD2]'
                          : 'border-[#1c1c21] text-[#1c1c21]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="font-semibold tracking-wider uppercase">
                      {exp.period}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${
                      isSelected
                        ? 'bg-[#E2DFD2] text-[#1c1c21]'
                        : 'bg-[#1c1c21] text-[#E2DFD2]'
                    }`}
                  >
                    {exp.type}
                  </span>
                </div>

                <div className="py-0.5">
                  <h3
                    className={`font-display font-bold text-xs sm:text-sm lg:text-[13.5px] leading-tight uppercase tracking-tight truncate ${
                      isSelected ? 'text-[#E2DFD2]' : 'text-[#1c1c21]'
                    }`}
                  >
                    {exp.role}
                  </h3>
                  <div
                    className={`font-mono-stack text-[10.5px] truncate mt-0.5 ${
                      isSelected ? 'text-[#E2DFD2]/75' : 'text-[#58554f]'
                    }`}
                  >
                    {exp.organization}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5 border-t border-current/15 font-mono-stack text-[9px]">
                  <span className={isSelected ? 'text-[#E2DFD2]/70' : 'text-[#58554f]'}>
                    {exp.location || 'Remote / Hybrid'}
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <span>DETAILS</span>
                    <ChevronRight size={10} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Operational Dossier (Top) + GitHub Activity (Bottom) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-2.5 sm:gap-3 h-full min-h-0">
          {/* Top Box: Detailed Operational Dossier */}
          <div className="flex-1 min-h-0 flex flex-col justify-between border-[2.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[3px_3px_0px_#1c1c21] p-3 sm:p-3.5 overflow-y-auto">
            {activeExp ? (
              <div className="flex flex-col justify-between h-full gap-2">
                {/* Role Header */}
                <div className="pb-1.5 border-b border-[#1c1c21]/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono-stack text-[9.5px] text-[#58554f] mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={11} className="text-[#1c1c21]" />
                      <span className="font-bold text-[#1c1c21]">RECORD_ENTRY // 0{selectedIndex + 1}</span>
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{activeExp.period}</span>
                      </span>
                      {activeExp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          <span>{activeExp.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="font-display font-extrabold uppercase text-base sm:text-lg lg:text-xl leading-[1.05] tracking-[-0.02em] text-[#1c1c21] mb-0.5">
                    {activeExp.role}
                  </h2>
                  <div className="font-mono-stack text-[11px] sm:text-xs text-[#58554f] font-semibold tracking-wider">
                    {activeExp.organization}
                  </div>
                </div>

                {/* Description & Deliverables */}
                <div className="space-y-1.5 overflow-y-auto">
                  <p className="text-[11.5px] sm:text-xs text-[#1c1c21] leading-relaxed">
                    {activeExp.description}
                  </p>

                  {/* Highlights */}
                  {activeExp.highlights && activeExp.highlights.length > 0 && (
                    <div className="pt-0.5 space-y-1">
                      <div className="font-mono-stack text-[8.5px] uppercase font-bold text-[#58554f] tracking-wider">
                        // KEY DELIVERABLES & IMPACT:
                      </div>
                      <ul className="space-y-0.5 text-[11px] text-[#58554f]">
                        {activeExp.highlights.map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 size={12} className="text-[#1c1c21] shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="pt-1.5 border-t border-[#1c1c21]/20">
                  <div className="space-y-0.5">
                    <div className="font-mono-stack text-[8.5px] uppercase font-bold text-[#58554f] tracking-wider">
                      TECH ARSENAL:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeExp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.5 border border-[#1c1c21] bg-[#1c1c21]/3 text-[#1c1c21] font-mono-stack text-[8.5px] font-bold tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full font-mono-stack text-xs text-[#58554f]">
                SELECT A RECORD TO INSPECT
              </div>
            )}
          </div>

          {/* Bottom Box: GitHub Contribution Graph */}
          <div className="shrink-0">
            <GithubContributions />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between pt-2 sm:pt-2.5 border-t border-[#1c1c21]/15 font-mono-stack text-[10px] sm:text-[11px] text-[#58554f] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span>TIMELINE // SERVICE LOG</span>
          <span className="hidden sm:inline text-[#1c1c21]/30">|</span>
          <span className="hidden sm:inline">ARCH LINUX WORKSTATION</span>
        </div>
        <div className="flex items-center gap-4">
          {onNavigateCredentials && (
            <button
              type="button"
              onClick={onNavigateCredentials}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              <span>▲ CREDENTIALS</span>
            </button>
          )}
          <span className="text-[#1c1c21]/30">•</span>
          {onNavigateContact && (
            <button
              type="button"
              onClick={onNavigateContact}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              <span>NEXT: TRANSMISSION</span>
              <CornerDownRight size={12} />
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}

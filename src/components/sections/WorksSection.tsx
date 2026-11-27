import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, CornerDownRight, ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import {
  subscribeProjects,
  formatDriveImageUrl,
  DEFAULT_FALLBACK_IMAGE,
  type Project,
} from '../../lib/firebase';
import { playModalOpen, playModalClose, playTabFlip } from '../../lib/sfx';
import { useSectionReveal } from '../../lib/useMotion';

// Works Section
export default function WorksSection({
  onNavigateDossier,
  onNavigateWorks,
  onNavigateCredentials,
}: {
  onNavigateDossier?: () => void;
  onNavigateWorks?: () => void;
  onNavigateCredentials?: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>();

  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayProjects = projects.slice(0, 6);
  const selectedProject = selectedIndex !== null ? displayProjects[selectedIndex] ?? null : null;

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playModalClose();
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        playTabFlip();
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        playTabFlip();
        setSelectedIndex((prev) =>
          prev !== null && prev < displayProjects.length - 1 ? prev + 1 : prev
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, displayProjects.length]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const cardWidth = clientWidth * 0.84;
    const index = Math.round(scrollLeft / cardWidth) + 1;
    setActiveSlide(Math.max(1, Math.min(displayProjects.length || 1, index)));
  };

  const scrollCarousel = (direction: 'prev' | 'next') => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.clientWidth * 0.85;
    carouselRef.current.scrollBy({
      left: direction === 'next' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="works"
      data-revealed={revealed}
      className="reveal-section relative z-40 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between p-4 pb-20 sm:p-6 md:p-8 lg:p-10 bg-[#E2DFD2] border-t-[3px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)] overflow-visible lg:overflow-hidden"
    >
      <header className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1c1c21]/15 gap-3 shrink-0">
        <div className="flex items-center gap-2.5 font-mono-stack text-xs">
          <span className="px-2.5 py-1 bg-[#1c1c21] text-[#E2DFD2] font-semibold tracking-wider text-[11px]">
            WORKS // 02
          </span>
          <span className="text-[#58554f] text-[11px] sm:text-xs hidden sm:inline">ENGINEERING CASE FILES</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono-stack text-[11px] text-[#58554f] hidden md:inline">
            {loading ? 'LOADING...' : `SHOWING 06 // ${projects.length} ARCHIVED`}
          </div>
          <a
            href="/projects"
            className="group inline-flex items-center px-3 py-1 bg-[#F03A2A] text-[#F0E8D8] hover:bg-[#14181F] font-mono-stack text-[10px] sm:text-[11px] font-bold tracking-wider border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] hover:shadow-[3px_3px_0px_#1c1c21] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer min-h-11"
          >
            <span>VIEW ALL</span>
          </a>
        </div>
      </header>

      {/* Mobile Carousel Control Bar */}
      <div className="flex sm:hidden items-center justify-between pt-2 pb-1 border-b border-[#1c1c21]/15 font-mono-stack text-[10px] shrink-0">
        <div className="flex items-center gap-2 text-[#58554f]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c21]" />
          <span className="font-bold text-[#1c1c21] tracking-wider">SWIPE ARCHIVE</span>
          <span>•</span>
          <span>{String(activeSlide).padStart(2, '0')} / {String(displayProjects.length || 6).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollCarousel('prev')}
            disabled={activeSlide <= 1}
            aria-label="Previous project"
            className="w-8 h-8 flex items-center justify-center border border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] disabled:opacity-30 shadow-[1px_1px_0px_#1c1c21] active:translate-y-0.5 cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel('next')}
            disabled={activeSlide >= displayProjects.length}
            aria-label="Next project"
            className="w-8 h-8 flex items-center justify-center border border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] disabled:opacity-30 shadow-[1px_1px_0px_#1c1c21] active:translate-y-0.5 cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="w-full flex items-center sm:items-stretch overflow-x-auto snap-x snap-mandatory py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 sm:gap-3 lg:gap-3.5 flex-1 min-h-0 my-auto no-scrollbar"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[84vw] max-w-[320px] sm:w-full sm:max-w-none h-fit sm:h-full shrink-0 sm:shrink snap-center self-center sm:self-auto border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse flex flex-col justify-start sm:justify-between overflow-hidden min-h-0"
              >
                <div className="aspect-16/10 sm:aspect-auto sm:flex-1 sm:min-h-0 w-full shrink-0 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
                <div className="p-2.5 sm:p-3 shrink-0 space-y-2">
                  <div className="h-2.5 w-20 bg-[#1c1c21]/15 rounded" />
                  <div className="h-3.5 w-3/4 bg-[#1c1c21]/15 rounded" />
                  <div className="h-2 w-full bg-[#1c1c21]/10 rounded" />
                  <div className="h-2 w-1/2 bg-[#1c1c21]/10 rounded" />
                </div>
              </div>
            ))
          : displayProjects.length === 0
          ? (
            <div className="col-span-full row-span-2 border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] p-8 flex flex-col items-center justify-center text-center font-mono-stack gap-3">
              <div className="text-base font-bold text-[#1c1c21]">ENGINEERING_ARCHIVE // 0 RECORDS</div>
              <p className="text-xs text-[#58554f] max-w-md">
                Project records are synchronizing with Firestore collection. Production case files will appear here automatically.
              </p>
            </div>
          )
          : displayProjects.map((project, idx) => {
              const imgUrl = formatDriveImageUrl(project.image) || DEFAULT_FALLBACK_IMAGE;
              const primaryLink = project.links?.[0];
              return (
                <article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    playModalOpen();
                    setSelectedIndex(idx);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      playModalOpen();
                      setSelectedIndex(idx);
                    }
                  }}
                  style={{ '--reveal-delay': `${idx * 65}ms` } as React.CSSProperties}
                  className="reveal-item w-[84vw] max-w-[320px] sm:w-full sm:max-w-none h-fit sm:h-full shrink-0 sm:shrink snap-center self-center sm:self-auto group border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] hover:shadow-[5px_5px_0px_#1c1c21] hover:-translate-y-0.5 bg-[#E2DFD2] overflow-hidden flex flex-col justify-start sm:justify-between transition-all duration-200 min-h-0 cursor-pointer text-left"
                >
                  <div className="relative aspect-16/10 sm:aspect-auto sm:flex-1 sm:min-h-0 w-full shrink-0 overflow-hidden border-b-2 border-[#1c1c21] bg-[#1c1c21]/5">
                    <img
                      src={imgUrl}
                      alt={project.alt || project.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover object-top filter grayscale mix-blend-multiply opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE; }}
                    />
                    <div className="absolute top-1.5 left-2 font-mono-stack text-[8.5px] font-bold tracking-wider uppercase text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-1.5 py-0.2 shadow-[1px_1px_0px_#1c1c21]">
                      {project.category || 'CASE FILE'}
                    </div>
                    <div className="absolute top-1.5 right-2 font-mono-stack text-[9.5px] font-bold text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-1.5 py-0.2 shadow-[1px_1px_0px_#1c1c21]">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="shrink-0 p-2.5 sm:p-3 flex flex-col gap-1.5 bg-[#E2DFD2]">
                    <div className="flex items-center justify-between text-[9px] font-mono-stack text-[#58554f]">
                      <span>{project.date || 'ACTIVE'}</span>
                      {project.tags?.length > 0 && (
                        <span className="font-semibold text-[#1c1c21] truncate max-w-30">
                          {project.tags[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-extrabold uppercase text-[13px] sm:text-[14px] leading-snug tracking-[-0.02em] text-[#1c1c21] line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] sm:text-[11.5px] text-[#58554f] leading-snug line-clamp-2">
                      {project.description}
                    </p>

                    {/* Footer tags & link */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1c1c21]/15 gap-2">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-stack text-[8px] font-semibold uppercase text-[#1c1c21] border border-[#1c1c21]/20 px-1 py-0.2 truncate"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {primaryLink ? (
                        <a
                          href={primaryLink.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 flex items-center gap-1 font-mono-stack text-[9px] font-bold uppercase text-[#1c1c21] hover:text-[#58554f] transition-colors min-h-11"
                        >
                          <span>{primaryLink.label || 'VISIT'}</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="shrink-0 font-mono-stack text-[9px] font-bold uppercase text-[#58554f] group-hover:text-[#1c1c21] min-h-11 flex items-center transition-colors">
                          INSPECT FILE →
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between pt-2 sm:pt-2.5 border-t border-[#1c1c21]/15 font-mono-stack text-[10px] sm:text-[11px] text-[#58554f] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span>CASE_FILES // SELECTED 06</span>
          <span className="hidden sm:inline text-[#1c1c21]/30">|</span>
          <span className="hidden sm:inline">ARCH LINUX / DEV-ENV</span>
        </div>
        <div className="flex items-center gap-4">
          {onNavigateDossier && (
            <button
              type="button"
              onClick={onNavigateDossier}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-11"
            >
              <span>▲ DOSSIER</span>
            </button>
          )}
          <span className="text-[#1c1c21]/30">•</span>
          {onNavigateCredentials ? (
            <button
              type="button"
              onClick={onNavigateCredentials}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-11"
            >
              <span>NEXT: CREDENTIALS</span>
              <CornerDownRight size={12} />
            </button>
          ) : (
            <a
              href="/projects"
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-11"
            >
              <span>NEXT: ALL PROJECTS</span>
              <CornerDownRight size={12} />
            </a>
          )}
        </div>
      </footer>

      {mounted && selectedProject && selectedIndex !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-modal-title"
            onClick={() => {
              playModalClose();
              setSelectedIndex(null);
            }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-[#14181F]/70 backdrop-blur-[2px] animate-backdrop-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col border-[3px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] overflow-hidden animate-dossier-in"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b-[2.5px] border-[#1c1c21] bg-[#E2DFD2] shrink-0 gap-3">
                <div className="flex items-center gap-2 font-mono-stack text-[10px] sm:text-[11px] min-w-0">
                  <span className="px-2 py-0.5 bg-[#F03A2A] text-[#F0E8D8] font-bold tracking-wider shrink-0">
                    CASE_FILE // {String(selectedIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#58554f] font-semibold uppercase truncate">
                    {selectedProject.category || 'PROJECT'}
                  </span>
                  <span className="hidden sm:inline text-[#1c1c21]/30">•</span>
                  <span className="hidden sm:inline text-[#58554f]">
                    {selectedProject.date || 'ACTIVE'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Close case file"
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#F03A2A] hover:border-[#F03A2A] hover:text-[#F0E8D8] font-mono-stack text-[10px] font-bold tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  <span className="hidden sm:inline">ESC</span>
                  <X size={13} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1">
                <div className="relative aspect-16/9 max-h-72 w-full border-b-[2.5px] border-[#1c1c21] bg-[#1c1c21]/5 overflow-hidden">
                  <img
                    src={formatDriveImageUrl(selectedProject.image) || DEFAULT_FALLBACK_IMAGE}
                    alt={selectedProject.alt || selectedProject.title}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-1.5">
                    <div className="font-mono-stack text-[10px] uppercase tracking-widest text-[#58554f]">
                      ENGINEERING DOSSIER // {selectedProject.date || 'ACTIVE'}
                    </div>
                    <h2
                      id="dossier-modal-title"
                      className="font-display font-extrabold uppercase text-xl sm:text-2xl leading-tight tracking-[-0.02em] text-[#1c1c21]"
                    >
                      {selectedProject.title}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1c1c21]/80 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="font-mono-stack text-[9.5px] uppercase tracking-widest text-[#58554f]">
                        STACK & ARCHITECTURE
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-stack text-[10px] font-semibold uppercase text-[#1c1c21] border border-[#1c1c21]/25 bg-[#1c1c21]/5 px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.links && selectedProject.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      {selectedProject.links.map((link, lIdx) => (
                        <a
                          key={`${link.url}-${lIdx}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            lIdx === 0
                              ? 'inline-flex items-center gap-1.5 px-4 py-2 bg-[#F03A2A] text-[#F0E8D8] hover:bg-[#14181F] font-mono-stack text-[11px] font-bold uppercase tracking-wider border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] transition-colors'
                              : 'inline-flex items-center gap-1.5 px-4 py-2 bg-[#E2DFD2] text-[#1c1c21] hover:bg-[#1c1c21] hover:text-[#E2DFD2] font-mono-stack text-[11px] font-bold uppercase tracking-wider border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] transition-colors'
                          }
                        >
                          <span>{link.label || 'OPEN LINK'}</span>
                          <ArrowUpRight size={13} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1c1c21]/20 bg-[#E2DFD2] font-mono-stack text-[10px] text-[#58554f] shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedIndex <= 0}
                    onClick={() => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
                    className="inline-flex items-center gap-1 px-2 py-1 border border-[#1c1c21]/30 text-[#1c1c21] hover:bg-[#1c1c21] hover:text-[#E2DFD2] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={12} />
                    <span>PREV</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex >= displayProjects.length - 1}
                    onClick={() =>
                      setSelectedIndex((prev) =>
                        prev !== null && prev < displayProjects.length - 1 ? prev + 1 : prev
                      )
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 border border-[#1c1c21]/30 text-[#1c1c21] hover:bg-[#1c1c21] hover:text-[#E2DFD2] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <span>NEXT</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
                <a
                  href="/projects"
                  onClick={() => setSelectedIndex(null)}
                  className="inline-flex items-center gap-1 font-bold text-[#1c1c21] hover:text-[#F03A2A] transition-colors"
                >
                  <span>FULL ARCHIVE</span>
                  <CornerDownRight size={11} />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

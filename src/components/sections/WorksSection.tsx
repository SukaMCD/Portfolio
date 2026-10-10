import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, CornerDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  subscribeProjects,
  formatDriveImageUrl,
  DEFAULT_FALLBACK_IMAGE,
  type Project,
} from '../../lib/firebase';

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

  useEffect(() => {
    const unsubscribe = subscribeProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayProjects = projects.slice(0, 6);

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
      id="works"
      className="relative z-40 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between p-4 pb-20 sm:p-6 md:p-8 lg:p-10 bg-[#E2DFD2] border-t-[3px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)] overflow-visible lg:overflow-hidden"
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
            className="group inline-flex items-center px-3 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-[10px] sm:text-[11px] font-bold tracking-wider border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] hover:shadow-[3px_3px_0px_#1c1c21] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer min-h-[44px]"
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
        data-lenis-prevent="true"
        className="flex items-center sm:items-stretch overflow-x-auto snap-x snap-mandatory py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 sm:gap-3 lg:gap-3.5 flex-1 min-h-0 my-auto no-scrollbar"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[84vw] max-w-[320px] h-fit sm:h-full shrink-0 snap-center self-center sm:self-auto border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse flex flex-col justify-start sm:justify-between overflow-hidden min-h-0"
              >
                <div className="aspect-[16/10] sm:aspect-auto sm:flex-1 sm:min-h-0 w-full shrink-0 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
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
                  className="w-[84vw] max-w-[320px] h-fit sm:h-full shrink-0 snap-center self-center sm:self-auto group border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] hover:shadow-[5px_5px_0px_#1c1c21] bg-[#E2DFD2] overflow-hidden flex flex-col justify-start sm:justify-between transition-all duration-200 min-h-0"
                >
                  <div className="relative aspect-[16/10] sm:aspect-auto sm:flex-1 sm:min-h-0 w-full shrink-0 overflow-hidden border-b-2 border-[#1c1c21] bg-[#1c1c21]/5">
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
                          className="shrink-0 flex items-center gap-1 font-mono-stack text-[9px] font-bold uppercase text-[#1c1c21] hover:text-[#58554f] transition-colors min-h-[44px]"
                        >
                          <span>{primaryLink.label || 'VISIT'}</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <a
                          href="/projects"
                          className="shrink-0 font-mono-stack text-[9px] font-bold uppercase text-[#58554f] hover:text-[#1c1c21] min-h-[44px] flex items-center"
                        >
                          VIEW FILE →
                        </a>
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
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>▲ DOSSIER</span>
            </button>
          )}
          <span className="text-[#1c1c21]/30">•</span>
          {onNavigateCredentials ? (
            <button
              type="button"
              onClick={onNavigateCredentials}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>NEXT: CREDENTIALS</span>
              <CornerDownRight size={12} />
            </button>
          ) : (
            <a
              href="/projects"
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>NEXT: ALL PROJECTS</span>
              <CornerDownRight size={12} />
            </a>
          )}
        </div>
      </footer>
    </section>
  );
}

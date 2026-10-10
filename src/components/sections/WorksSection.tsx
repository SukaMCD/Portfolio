import React, { useState, useEffect } from 'react';
import { ExternalLink, CornerDownRight } from 'lucide-react';
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

  useEffect(() => {
    const unsubscribe = subscribeProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayProjects = projects.slice(0, 6);

  return (
    <section
      id="works"
      className="relative z-40 w-full h-screen min-h-160 max-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 bg-[#E2DFD2] border-t-[3px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)] overflow-hidden"
    >
      <header className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1c1c21]/15 gap-3 shrink-0">
        <div className="flex items-center gap-2.5 font-mono-stack text-xs">
          <span className="px-2.5 py-1 bg-[#1c1c21] text-[#E2DFD2] font-semibold tracking-wider text-[11px]">
            WORKS // 02
          </span>
          <span className="text-[#58554f] text-[11px] sm:text-xs">ENGINEERING CASE FILES</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono-stack text-[11px] text-[#58554f] hidden md:inline">
            {loading ? 'LOADING...' : `SHOWING 06 // ${projects.length} ARCHIVED`}
          </div>
          <a
            href="/projects"
            className="group inline-flex items-center px-3 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-[10px] sm:text-[11px] font-bold tracking-wider border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21] hover:shadow-[3px_3px_0px_#1c1c21] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>VIEW ALL</span>
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-2.5 sm:gap-3 lg:gap-3.5 flex-1 min-h-0 my-auto py-2 sm:py-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse flex flex-col justify-between overflow-hidden min-h-0"
              >
                <div className="flex-1 min-h-0 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
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
                  className="group border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] hover:shadow-[5px_5px_0px_#1c1c21] bg-[#E2DFD2] overflow-hidden flex flex-col justify-between transition-all duration-200 min-h-0"
                >
                  <div className="relative flex-1 min-h-0 overflow-hidden border-b-2 border-[#1c1c21] bg-[#1c1c21]/5">
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
                          className="shrink-0 flex items-center gap-1 font-mono-stack text-[9px] font-bold uppercase text-[#1c1c21] hover:text-[#58554f] transition-colors"
                        >
                          <span>{primaryLink.label || 'VISIT'}</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <a
                          href="/projects"
                          className="shrink-0 font-mono-stack text-[9px] font-bold uppercase text-[#58554f] hover:text-[#1c1c21]"
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
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              <span>▲ DOSSIER</span>
            </button>
          )}
          <span className="text-[#1c1c21]/30">•</span>
          {onNavigateCredentials ? (
            <button
              type="button"
              onClick={onNavigateCredentials}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              <span>NEXT: CREDENTIALS</span>
              <CornerDownRight size={12} />
            </button>
          ) : (
            <a
              href="/projects"
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
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

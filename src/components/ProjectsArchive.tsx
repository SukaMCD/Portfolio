import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Search, ArrowLeft, Terminal, Filter, Sun, Moon } from 'lucide-react';
import { getProjects, formatDriveImageUrl, DEFAULT_FALLBACK_IMAGE, type Project } from '../lib/firebase';
import { getTheme, type Theme } from '../lib/theme';
import InteractiveBackground from './ui/InteractiveBackground';
import ArchIcon from './ui/ArchIcon';
import ThemeTransition, { triggerThemeTransition } from './ui/ThemeTransition';

// Projects Archive Component
export default function ProjectsArchive() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
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
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category.toUpperCase().trim());
    });
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        (p.category && p.category.toUpperCase().trim() === selectedCategory);
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCategory = p.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchTags || matchCategory;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen text-[#1c1c21] bg-[#E2DFD2]">
      <ThemeTransition />
      <InteractiveBackground />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10">
        
        {/* Navigation Bar */}
        <header className="w-full flex items-center justify-between pb-4 border-b-[2.5px] border-[#1c1c21] gap-4">
          <a
            href="/"
            className="group inline-flex items-center gap-2 px-3 py-1.5 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-xs font-bold tracking-wider transition-colors border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21]"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>BACK TO HOME</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3 font-mono-stack text-xs text-[#58554f]">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-[#1c1c21]/20 bg-[#1c1c21]/2 text-[11px]">
              <ArchIcon className="w-3.5 h-3.5 text-[#1c1c21]" />
              <span className="text-[#1c1c21] font-semibold">ARCH LINUX</span>
              <span className="text-[#1c1c21]/30">/</span>
              <span>x86_64</span>
            </span>
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle Theme"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-[11px] font-bold tracking-wider transition-colors shadow-[2px_2px_0px_#1c1c21] cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              <span className="uppercase">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
            <span className="hidden md:inline px-2 py-1 bg-[#1c1c21]/5 border border-[#1c1c21]/15 text-[11px] font-semibold text-[#1c1c21]">
              DIRECTORY // ARCHIVE
            </span>
          </div>
        </header>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="font-mono-stack text-[10px] sm:text-[11px] uppercase tracking-widest text-[#58554f]">
              <span>CASE_FILES // COMPLETE CATALOGUE</span>
            </div>
            <h1 className="font-display font-extrabold uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] text-[#1c1c21]">
              PROJECT DIRECTORY.
              <br />
              ENGINEERING ARCHIVE
              <br />
              <span className="font-light italic text-[#58554f]">& COMPREHENSIVE CASE FILES</span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end font-mono-stack text-xs text-[#58554f] gap-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#1c1c21] font-bold text-sm">{loading ? '...' : projects.length}</span>
              <span>TOTAL REPOSITORIES</span>
            </div>
            <div className="text-[11px] text-[#58554f]">
              {loading ? 'SYNCING DATABASE...' : `FILTERED: ${filteredProjects.length} CASES`}
            </div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="flex flex-col gap-3 p-3.5 sm:p-4 border-[2.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[3px_3px_0px_#1c1c21]">
          {/* CLI Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 border border-[#1c1c21]/20 focus-within:border-[#1c1c21] focus-within:bg-[#1c1c21]/2 font-mono-stack text-xs transition-colors bg-transparent">
            <div className="flex items-center gap-1.5 text-[#58554f] shrink-0 select-none">
              <Terminal size={14} className="text-[#1c1c21]" />
              <span className="hidden sm:inline font-bold text-[#1c1c21]">sukamcd@archlinux:~/projects$</span>
              <span className="text-[#58554f]">grep</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search by title, description, or tech stack..."
              className="flex-1 min-w-0 bg-transparent text-[#1c1c21] placeholder-[#58554f] focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#58554f] hover:text-[#1c1c21] font-bold cursor-pointer shrink-0 px-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : (
              <Search size={14} className="text-[#58554f] shrink-0 pointer-events-none" />
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 font-mono-stack text-[10px]">
            <span className="text-[#58554f] mr-1 flex items-center gap-1">
              <Filter size={11} />
              <span>CATEGORY:</span>
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 border transition-colors cursor-pointer font-semibold uppercase tracking-wider ${
                    active
                      ? 'border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2]'
                      : 'border-[#1c1c21]/20 bg-[#E2DFD2] text-[#58554f] hover:border-[#1c1c21] hover:text-[#1c1c21]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse h-96 flex flex-col"
              >
                <div className="h-44 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="h-3 w-20 bg-[#1c1c21]/15 rounded" />
                  <div className="h-4 w-3/4 bg-[#1c1c21]/15 rounded" />
                  <div className="h-2.5 w-full bg-[#1c1c21]/10 rounded" />
                  <div className="h-2.5 w-2/3 bg-[#1c1c21]/10 rounded" />
                  <div className="h-6 w-full bg-[#1c1c21]/10 rounded mt-auto" />
                </div>
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] p-12 text-center font-mono-stack space-y-3">
              <div className="text-2xl text-[#1c1c21] font-bold">404 // NO_RECORDS_FOUND</div>
              <p className="text-xs text-[#58554f]">
                No engineering projects matched search query: "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 mt-2 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-xs font-bold tracking-wider inline-flex items-center gap-2 border border-[#1c1c21]"
              >
                <span>RESET SEARCH & FILTERS</span>
              </button>
            </div>
          ) : (
            filteredProjects.map((project, idx) => {
              const imgUrl = formatDriveImageUrl(project.image) || DEFAULT_FALLBACK_IMAGE;
              return (
                <article
                  key={project.id}
                  className="group border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] hover:shadow-[7px_7px_0px_#1c1c21] hover:-translate-y-1 bg-[#E2DFD2] overflow-hidden flex flex-col justify-between transition-all duration-200"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-44 overflow-hidden border-b-[2.5px] border-[#1c1c21] bg-[#1c1c21]/5">
                    <img
                      src={imgUrl}
                      alt={project.alt || project.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover object-top filter grayscale mix-blend-multiply opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 font-mono-stack text-[9px] font-bold tracking-wider uppercase text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-2 py-0.5 shadow-[1px_1px_0px_#1c1c21]">
                      {project.category || 'CASE FILE'}
                    </div>
                    <div className="absolute top-2.5 right-2.5 font-mono-stack text-[10px] font-bold text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-2 py-0.5 shadow-[1px_1px_0px_#1c1c21]">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono-stack text-[#58554f]">
                        <span>{project.date || 'ACTIVE'}</span>
                        <span className="border border-[#1c1c21]/15 px-1.5 py-0.2">INDEX #{idx + 1}</span>
                      </div>

                      <h3 className="font-display font-extrabold uppercase text-lg sm:text-xl leading-tight tracking-[-0.02em] text-[#1c1c21]">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#58554f] leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1c1c21]/10">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-stack text-[9px] font-semibold uppercase text-[#1c1c21] border border-[#1c1c21]/25 px-1.5 py-0.5 bg-[#1c1c21]/2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* External links */}
                    {project.links?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1c1c21]/15">
                        {project.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#1c1c21]"
                          >
                            <ExternalLink size={10} />
                            <span>{link.label || 'VISIT'}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Archive Footer */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t-[2.5px] border-[#1c1c21] font-mono-stack text-xs text-[#58554f]">
          <div className="flex items-center gap-4">
            <a href="/" className="font-bold text-[#1c1c21] hover:underline flex items-center gap-1">
              <ArrowLeft size={12} />
              <span>BACK TO HOME</span>
            </a>
            <span className="text-[#1c1c21]/30">|</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              ▲ BACK TO TOP
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

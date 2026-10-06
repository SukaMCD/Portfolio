import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Search, ArrowLeft, Terminal, Filter, ShieldCheck, Award, ZoomIn, X, Sun, Moon } from 'lucide-react';
import { getCertificates, formatDriveImageUrl, extractDriveFileId, DEFAULT_FALLBACK_IMAGE, type Certificate } from '../lib/firebase';
import { getTheme, type Theme } from '../lib/theme';
import InteractiveBackground from './ui/InteractiveBackground';
import ArchIcon from './ui/ArchIcon';
import ThemeTransition, { triggerThemeTransition } from './ui/ThemeTransition';

// Category resolver helper
function getCertificateCategory(cert: Certificate): string {
  const combined = `${cert.title} ${cert.issuer || ''} ${(cert.tags || []).join(' ')}`.toLowerCase();
  if (
    combined.includes('lomba') ||
    combined.includes('winner') ||
    combined.includes('competition') ||
    combined.includes('competitive')
  ) {
    return 'COMPETITION';
  }
  if (
    combined.includes('internship') ||
    combined.includes('prakerin') ||
    combined.includes('industrial training')
  ) {
    return 'INTERNSHIP';
  }
  if (
    combined.includes('workshop') ||
    combined.includes('solve for tomorrow') ||
    combined.includes('vibecode') ||
    combined.includes('course')
  ) {
    return 'WORKSHOP';
  }
  if (
    combined.includes('scholarship') ||
    combined.includes('academic') ||
    combined.includes('beasiswa')
  ) {
    return 'SCHOLARSHIP';
  }
  return 'ACCREDITATION';
}

const CATEGORIES = ['ALL', 'COMPETITION', 'INTERNSHIP', 'WORKSHOP', 'SCHOLARSHIP'];

// Certificates Archive Component
export default function CertificatesArchive() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePreview, setActivePreview] = useState<Certificate | null>(null);
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
    getCertificates().then((data) => {
      setCertificates(data);
      setLoading(false);
    });
  }, []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const cat = getCertificateCategory(c);
      const matchCat = selectedCategory === 'ALL' || cat === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchIssuer = c.issuer?.toLowerCase().includes(q);
      const matchId = c.credentialId?.toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchIssuer || matchId || matchTags;
    });
  }, [certificates, selectedCategory, searchQuery]);

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
              CREDENTIALS // VAULT
            </span>
          </div>
        </header>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="font-mono-stack text-[10px] sm:text-[11px] uppercase tracking-widest text-[#58554f]">
              <span>ACCREDITATIONS // OFFICIAL LICENSES</span>
            </div>
            <h1 className="font-display font-extrabold uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] text-[#1c1c21]">
              CREDENTIAL VAULT.
              <br />
              CERTIFICATE ARCHIVE
              <br />
              <span className="font-light italic text-[#58554f]">& VERIFIED ACCREDITATIONS</span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end font-mono-stack text-xs text-[#58554f] gap-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#1c1c21] font-bold text-sm">{loading ? '...' : certificates.length}</span>
              <span>TOTAL ACCREDITATIONS</span>
            </div>
            <div className="text-[11px] text-[#58554f]">
              {loading ? 'SYNCING DATABASE...' : `FILTERED: ${filteredCertificates.length} RECORDS`}
            </div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="flex flex-col gap-3 p-3.5 sm:p-4 border-[2.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[3px_3px_0px_#1c1c21]">
          {/* CLI Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 border border-[#1c1c21]/20 focus-within:border-[#1c1c21] focus-within:bg-[#1c1c21]/2 font-mono-stack text-xs transition-colors bg-transparent">
            <div className="flex items-center gap-1.5 text-[#58554f] shrink-0 select-none">
              <Terminal size={14} className="text-[#1c1c21]" />
              <span className="hidden sm:inline font-bold text-[#1c1c21]">sukamcd@archlinux:~/certs$</span>
              <span className="text-[#58554f]">grep</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search certificates by title, issuer, credential ID, or skill..."
              className="flex-1 min-w-0 bg-transparent text-[#1c1c21] placeholder-[#58554f]/60 focus:outline-none"
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
            {CATEGORIES.map((cat) => {
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

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse h-96 flex flex-col"
              >
                <div className="h-48 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="h-3 w-20 bg-[#1c1c21]/15 rounded" />
                  <div className="h-4 w-3/4 bg-[#1c1c21]/15 rounded" />
                  <div className="h-2.5 w-full bg-[#1c1c21]/10 rounded" />
                  <div className="h-6 w-full bg-[#1c1c21]/10 rounded mt-auto" />
                </div>
              </div>
            ))
          ) : filteredCertificates.length === 0 ? (
            <div className="col-span-full border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] p-12 text-center font-mono-stack space-y-3">
              <div className="text-2xl text-[#1c1c21] font-bold">404 // NO_RECORDS_FOUND</div>
              <p className="text-xs text-[#58554f]">
                No certificates matched search query: "{searchQuery}".
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
            filteredCertificates.map((cert, idx) => {
              const imgUrl = formatDriveImageUrl(cert.image) || DEFAULT_FALLBACK_IMAGE;
              return (
                <article
                  key={cert.id}
                  className="group border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] hover:shadow-[7px_7px_0px_#1c1c21] hover:-translate-y-1 bg-[#E2DFD2] overflow-hidden flex flex-col justify-between transition-all duration-200"
                >
                  {/* Card Thumbnail */}
                  <div
                    onClick={() => setActivePreview(cert)}
                    className="relative h-52 overflow-hidden border-b-[2.5px] border-[#1c1c21] bg-[#1c1c21]/5 cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={imgUrl}
                      alt={cert.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover object-center filter contrast-[1.03] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const fileId = extractDriveFileId(cert.image);
                        const target = e.currentTarget as HTMLImageElement;
                        if (fileId && !target.dataset.tried) {
                          target.dataset.tried = 'true';
                          target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                        } else {
                          target.src = DEFAULT_FALLBACK_IMAGE;
                        }
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 font-mono-stack text-[9px] font-bold tracking-wider uppercase text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-2 py-0.5 shadow-[1px_1px_0px_#1c1c21] flex items-center gap-1 z-10 max-w-[70%] truncate">
                      <ShieldCheck size={11} className="text-[#1c1c21] shrink-0" />
                      <span className="truncate">{cert.issuer || 'CERTIFIED'}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 font-mono-stack text-[10px] font-bold text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-2 py-0.5 shadow-[1px_1px_0px_#1c1c21] z-10">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute inset-0 bg-[#1c1c21]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                      <span className="px-3 py-1.5 bg-[#1c1c21] text-[#E2DFD2] font-mono-stack text-[10px] font-bold tracking-widest flex items-center gap-1.5 shadow-[2px_2px_0px_#E2DFD2]">
                        <ZoomIn size={13} />
                        <span>ZOOM PREVIEW</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono-stack text-[#58554f]">
                        <span>DATE: {cert.date || 'VERIFIED'}</span>
                        {cert.credentialId && (
                          <span className="font-semibold text-[#1c1c21] truncate max-w-37.5">
                            ID: {cert.credentialId}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-extrabold uppercase text-lg sm:text-xl leading-snug tracking-[-0.02em] text-[#1c1c21]">
                        {cert.title}
                      </h3>
                    </div>

                    {/* Tags & Action Link */}
                    <div className="pt-3 border-t border-[#1c1c21]/15 space-y-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {cert.tags && cert.tags.length > 0 ? (
                          cert.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono-stack text-[9px] font-semibold uppercase text-[#1c1c21] border border-[#1c1c21]/20 px-1.5 py-0.5"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="font-mono-stack text-[9px] text-[#58554f]">ACCREDITED CREDENTIAL</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setActivePreview(cert)}
                          className="font-mono-stack text-[10px] font-bold uppercase text-[#58554f] hover:text-[#1c1c21] cursor-pointer inline-flex items-center gap-1"
                        >
                          <ZoomIn size={11} />
                          <span>INSPECT DOCUMENT</span>
                        </button>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-[10px] font-bold tracking-wider transition-colors border border-[#1c1c21]"
                          >
                            <span>OFFICIAL VERIFICATION</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Archival Terminal Footer */}
        <footer className="w-full pt-8 pb-6 border-t-[2.5px] border-[#1c1c21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-stack text-xs text-[#58554f]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#1c1c21]" />
            <span>CREDENTIAL_VAULT // AUTHORIZED RECORDS</span>
            <span className="text-[#1c1c21]/20">•</span>
            <span className="text-[#1c1c21] font-semibold">TOTAL: {certificates.length}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>UPTIME: ARCH LINUX TTY1</span>
            <span className="text-[#1c1c21]/20">•</span>
            <a
              href="/"
              className="text-[#1c1c21] font-bold hover:underline"
            >
              ↑ BACK TO OVERVIEW
            </a>
          </div>
        </footer>
      </main>

      {/* Lightbox Certificate Zoom Modal */}
      {activePreview && (
        <div
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 bg-[#1c1c21]/80 backdrop-blur-xs flex items-center justify-center p-4 select-none cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full border-[3.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[8px_8px_0px_#1c1c21] p-4 sm:p-6 flex flex-col gap-4 cursor-default animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b-2 border-[#1c1c21] pb-3">
              <div>
                <span className="font-mono-stack text-[9px] font-bold uppercase tracking-wider text-[#58554f]">
                  ACCREDITATION PREVIEW // {activePreview.issuer}
                </span>
                <h4 className="font-display font-extrabold uppercase text-base sm:text-xl text-[#1c1c21]">
                  {activePreview.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="p-1 border-2 border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative border-2 border-[#1c1c21] overflow-hidden bg-[#1c1c21]/5 max-h-[70vh] flex items-center justify-center">
              <img
                src={formatDriveImageUrl(activePreview.image) || DEFAULT_FALLBACK_IMAGE}
                alt={activePreview.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-contain filter contrast-105"
                onError={(e) => {
                  const fileId = extractDriveFileId(activePreview.image);
                  const target = e.currentTarget as HTMLImageElement;
                  if (fileId && !target.dataset.tried) {
                    target.dataset.tried = 'true';
                    target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                  } else {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 font-mono-stack text-xs">
              <div className="text-[#58554f]">
                <span>DATE: {activePreview.date}</span>
                {activePreview.credentialId && (
                  <span className="ml-3">ID: {activePreview.credentialId}</span>
                )}
              </div>
              {activePreview.credentialUrl && (
                <a
                  href={activePreview.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] text-xs font-bold tracking-wider transition-colors border border-[#1c1c21]"
                >
                  <span>OFFICIAL VERIFICATION</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

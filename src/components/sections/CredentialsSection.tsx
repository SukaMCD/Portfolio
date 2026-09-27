import React, { useState, useEffect } from 'react';
import { ExternalLink, Award, ShieldCheck, ZoomIn, X, CornerDownRight } from 'lucide-react';
import {
  subscribeCertificates,
  formatDriveImageUrl,
  extractDriveFileId,
  DEFAULT_FALLBACK_IMAGE,
  type Certificate,
} from '../../lib/firebase';

// Credentials Section
export default function CredentialsSection({
  onNavigateWorks,
  onNavigateExperience,
}: {
  onNavigateWorks?: () => void;
  onNavigateExperience?: () => void;
}) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState<Certificate | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCertificates((data) => {
      setCertificates(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayCerts = certificates.slice(0, 6);

  return (
    <section
      id="credentials"
      className="relative z-50 w-full h-screen min-h-[640px] max-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 bg-[#E2DFD2] border-t-[3.5px] border-[#1c1c21] shadow-[0_-24px_50px_rgba(28,28,33,0.18)] overflow-hidden"
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1c1c21]/15 gap-3 shrink-0">
        <div className="flex items-center gap-2.5 font-mono-stack text-xs">
          <span className="px-2.5 py-1 bg-[#1c1c21] text-[#E2DFD2] font-semibold tracking-wider text-[11px]">
            CREDENTIALS // 03
          </span>
          <span className="text-[#58554f] text-[11px] sm:text-xs">VERIFIED LICENSES & CERTIFICATIONS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono-stack text-[11px] text-[#58554f] hidden md:inline">
            {loading ? 'SYNCING DATABASE...' : `SHOWING 06 // ${certificates.length} ACCREDITED`}
          </div>
          <a
            href="/certificates"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] font-mono-stack text-xs font-bold tracking-wider transition-colors border border-[#1c1c21] shadow-[2px_2px_0px_#1c1c21]"
          >
            <span>VIEW ALL</span>
            <span>→</span>
          </a>
        </div>
      </header>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-2.5 sm:gap-3 lg:gap-3.5 flex-1 min-h-0 my-auto py-2 sm:py-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] bg-[#E2DFD2] animate-pulse flex flex-col justify-between overflow-hidden min-h-0"
              >
                <div className="flex-1 min-h-0 bg-[#1c1c21]/8 border-b-2 border-[#1c1c21]/15" />
                <div className="p-2.5 sm:p-3 shrink-0 space-y-2">
                  <div className="h-2.5 w-24 bg-[#1c1c21]/15 rounded" />
                  <div className="h-3.5 w-3/4 bg-[#1c1c21]/15 rounded" />
                  <div className="h-2 w-full bg-[#1c1c21]/10 rounded" />
                </div>
              </div>
            ))
          : displayCerts.length === 0
          ? (
            <div className="col-span-full row-span-2 border-[3px] border-[#1c1c21] shadow-[4px_4px_0px_#1c1c21] bg-[#E2DFD2] p-8 flex flex-col items-center justify-center text-center font-mono-stack gap-3">
              <Award size={36} className="text-[#1c1c21]" />
              <div className="text-base font-bold text-[#1c1c21]">CREDENTIAL_VAULT // 0 RECORDS</div>
              <p className="text-xs text-[#58554f] max-w-md">
                Certificate records are synchronizing with Firestore collection. Verified credentials will appear here automatically.
              </p>
            </div>
          )
          : displayCerts.map((cert, idx) => {
              const imgUrl = formatDriveImageUrl(cert.image) || DEFAULT_FALLBACK_IMAGE;
              return (
                <article
                  key={cert.id}
                  className="group border-[2.5px] sm:border-[3px] border-[#1c1c21] shadow-[3px_3px_0px_#1c1c21] hover:shadow-[5px_5px_0px_#1c1c21] bg-[#E2DFD2] overflow-hidden flex flex-col justify-between transition-all duration-200 min-h-0"
                >
                  {/* Thumbnail & Image Preview Trigger */}
                  <div
                    onClick={() => setActivePreview(cert)}
                    className="relative flex-1 min-h-0 overflow-hidden border-b-2 border-[#1c1c21] bg-[#1c1c21]/5 cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={imgUrl}
                      alt={cert.title}
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
                    <div className="absolute top-1.5 left-2 font-mono-stack text-[8.5px] font-bold tracking-wider uppercase text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-1.5 py-0.2 shadow-[1px_1px_0px_#1c1c21] flex items-center gap-1 z-10 max-w-[65%] truncate">
                      <ShieldCheck size={10} className="text-[#1c1c21] shrink-0" />
                      <span className="truncate">{cert.issuer || 'CERTIFIED'}</span>
                    </div>
                    <div className="absolute top-1.5 right-2 font-mono-stack text-[9.5px] font-bold text-[#1c1c21] bg-[#E2DFD2]/95 border border-[#1c1c21] px-1.5 py-0.2 shadow-[1px_1px_0px_#1c1c21] z-10">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute inset-0 bg-[#1c1c21]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                      <span className="px-2 py-1 bg-[#1c1c21] text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-widest flex items-center gap-1 shadow-[2px_2px_0px_#E2DFD2]">
                        <ZoomIn size={11} />
                        <span>ZOOM CERTS</span>
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="shrink-0 p-2.5 sm:p-3 flex flex-col gap-1.5 bg-[#E2DFD2]">
                    <div className="flex items-center justify-between text-[9px] font-mono-stack text-[#58554f]">
                      <span>{cert.date || 'VERIFIED'}</span>
                      {cert.credentialId && (
                        <span className="font-semibold text-[#1c1c21] truncate max-w-[140px]">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-extrabold uppercase text-[13px] sm:text-[14px] leading-snug tracking-[-0.02em] text-[#1c1c21] line-clamp-1">
                      {cert.title}
                    </h3>

                    {/* Footer Tags & Verification Link */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1c1c21]/15 gap-2">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {cert.tags && cert.tags.length > 0 ? (
                          cert.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="font-mono-stack text-[8px] font-semibold uppercase text-[#1c1c21] border border-[#1c1c21]/20 px-1 py-0.2 truncate"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="font-mono-stack text-[8px] text-[#58554f]">ACCREDITED CREDENTIAL</span>
                        )}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 flex items-center gap-1 font-mono-stack text-[9px] font-bold uppercase text-[#1c1c21] hover:text-[#58554f] transition-colors"
                        >
                          <span>VERIFY</span>
                          <ExternalLink size={10} />
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
          <span>CREDENTIALS // ARCHIVAL VERIFICATION</span>
          <span className="hidden sm:inline text-[#1c1c21]/30">|</span>
          <span className="hidden sm:inline">AUTHORIZED LICENSES</span>
        </div>
        <div className="flex items-center gap-4">
          {onNavigateWorks && (
            <button
              type="button"
              onClick={onNavigateWorks}
              className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
            >
              <span>▲ WORKS</span>
            </button>
          )}
          {onNavigateExperience && (
            <>
              <span className="text-[#1c1c21]/30">•</span>
              <button
                type="button"
                onClick={onNavigateExperience}
                className="flex items-center gap-1.5 text-[#58554f] hover:text-[#1c1c21] transition-colors cursor-pointer"
              >
                <span>NEXT: EXPERIENCE</span>
                <CornerDownRight size={12} />
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Lightbox Certificate Zoom Modal */}
      {activePreview && (
        <div
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 bg-[#1c1c21]/80 backdrop-blur-xs flex items-center justify-center p-4 select-none cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full border-[3.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[8px_8px_0px_#1c1c21] p-4 sm:p-6 flex flex-col gap-4 cursor-default animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b-2 border-[#1c1c21] pb-3">
              <div>
                <span className="font-mono-stack text-[9px] font-bold uppercase tracking-wider text-[#58554f]">
                  ACCREDITATION PREVIEW // {activePreview.issuer}
                </span>
                <h4 className="font-display font-extrabold uppercase text-base sm:text-lg text-[#1c1c21]">
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

            <div className="relative border-2 border-[#1c1c21] overflow-hidden bg-[#1c1c21]/5 max-h-[60vh] flex items-center justify-center">
              <img
                src={formatDriveImageUrl(activePreview.image) || DEFAULT_FALLBACK_IMAGE}
                alt={activePreview.title}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1c1c21] text-[#E2DFD2] hover:bg-[#58554f] text-[11px] font-bold tracking-wider transition-colors border border-[#1c1c21]"
                >
                  <span>OFFICIAL VERIFICATION</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

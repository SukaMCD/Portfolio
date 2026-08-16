import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Award, Calendar, ExternalLink, X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { initialCertificates, type Certificate } from '../../data/certificates';
import { triggerToast } from './GooeyToast';

export default function CertificatesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Load from localStorage or defaults on mount
  useEffect(() => {
    const saved = localStorage.getItem('sukamcd_portfolio_certificates');
    if (saved) {
      try {
        setCertificates(JSON.parse(saved));
      } catch (e) {
        setCertificates(initialCertificates);
      }
    } else {
      setCertificates(initialCertificates);
      localStorage.setItem('sukamcd_portfolio_certificates', JSON.stringify(initialCertificates));
    }
  }, []);

  // Save to localStorage whenever state changes
  const saveCertificates = (updated: Certificate[]) => {
    setCertificates(updated);
    localStorage.setItem('sukamcd_portfolio_certificates', JSON.stringify(updated));
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      triggerToast('Title and Issuer are required', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      credentialId: credentialId.trim() || undefined,
      credentialUrl: credentialUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    const updated = [newCert, ...certificates];
    saveCertificates(updated);
    triggerToast('Certificate added successfully!', 'success');
    
    // Reset Form
    setTitle('');
    setIssuer('');
    setDate('');
    setCredentialId('');
    setCredentialUrl('');
    setTagsInput('');
    setIsModalOpen(false);
  };

  const handleDeleteCertificate = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = certificates.filter(c => c.id !== id);
      saveCertificates(updated);
      triggerToast('Certificate deleted', 'info');
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default certificates? This will wipe your custom certificates.')) {
      saveCertificates(initialCertificates);
      triggerToast('Reset to default certificates', 'info');
    }
  };

  // Filter certificates by search term
  const filteredCertificates = certificates.filter((cert) => {
    const term = searchTerm.toLowerCase();
    return (
      cert.title.toLowerCase().includes(term) ||
      cert.issuer.toLowerCase().includes(term) ||
      (cert.credentialId && cert.credentialId.toLowerCase().includes(term)) ||
      (cert.tags && cert.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  });

  // Modal scrolling lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      
      {/* Control Bar (Search, Add, Reset) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-soft pb-5 select-none">
        
        {/* Buttons for Modifying / Resetting */}
        <div className="flex items-center gap-3.5 order-2 sm:order-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root font-black uppercase text-[9px] font-mono tracking-widest flex items-center gap-1.5 cursor-pointer shadow-md transition-all select-none"
          >
            <Plus className="w-3.5 h-3.5 text-bg-root" />
            <span>Add Certificate</span>
          </button>
          
          <button
            onClick={handleResetToDefault}
            className="p-2.5 rounded-xl bg-bg-surface border border-border-soft hover:border-silver-500 text-silver-500 hover:text-silver-200 cursor-pointer transition-all shadow-md"
            title="Reset to default certificates"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 order-1 sm:order-2 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-600" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-10 pr-9 text-xs placeholder-silver-600 bg-bg-surface border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all focus:bg-bg-surface/50"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-silver-500 hover:text-silver-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Grid of Certificates */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-soft rounded-2xl bg-bg-surface/20 flex flex-col items-center justify-center gap-3 select-none">
          <Award className="w-8 h-8 text-silver-600" />
          <p className="text-xs font-mono uppercase tracking-widest text-silver-500">
            No certificates found
          </p>
        </div>
      ) : (
        <div 
          key={searchTerm}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-[fadeIn_0.35s_ease-out_forwards]"
        >
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group p-5 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.02] rounded-2xl flex flex-col justify-between min-h-[220px] shadow-lg transition-all duration-300 relative select-none"
            >
              <div>
                {/* Delete Button (floating top right) */}
                <button
                  onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-bg-elevated/40 hover:bg-bg-elevated border border-border-soft hover:border-accent-rose flex items-center justify-center text-silver-500 hover:text-accent-rose opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10"
                  title="Delete certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Badge/Icon & Title */}
                <div className="flex gap-4 items-start pr-6">
                  <div className="w-10 h-10 rounded-xl bg-bg-root border border-border-soft flex items-center justify-center text-silver-400 group-hover:border-silver-500 transition-colors shrink-0">
                    <Award className="w-5 h-5 text-silver-400 group-hover:text-silver-200 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-wider text-silver-400">
                      {cert.issuer}
                    </h3>
                    <h2 className="text-sm font-bold text-silver-100 leading-snug group-hover:text-white transition-colors">
                      {cert.title}
                    </h2>
                  </div>
                </div>

                {/* Tags */}
                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {cert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg border border-border-soft bg-bg-root text-[8.5px] font-mono text-silver-500 uppercase tracking-wide shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between border-t border-border-subtle pt-3.5 mt-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="text-[8.5px] font-mono text-silver-600">
                      ID: <span className="text-silver-500">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono uppercase tracking-widest text-silver-400 group-hover:text-silver-100 transition-colors font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Verify <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Certificate Modal (Portaled) ── */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease_out_forwards] overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-bg-surface/95 border border-border-soft rounded-2xl overflow-hidden shadow-2xl animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] p-6 relative my-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-elevated/50 hover:bg-bg-elevated border border-border-soft hover:border-silver-400 flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer shadow-md z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="space-y-1.5 mb-6 pr-8 select-none">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-silver-500">
                — Certificate Registry
              </span>
              <h2 className="text-xl font-black text-silver-100 tracking-tight">
                Add New Certificate
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCertificate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belajar Dasar Pemrograman Web"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dicoding Indonesia"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jul 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 81LD8OGG7ZPG"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                  Credential URL
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.dicoding.com/certificates/81LD8OGG7ZPG"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                  Tags / Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTML, CSS, JavaScript"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl py-2.5 px-4 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-bg-elevated border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100 font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root font-mono text-[10px] uppercase tracking-wider font-black transition-all cursor-pointer text-center"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Retro CSS animations (for portal modal slide in) */}
      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

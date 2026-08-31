import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Award, Calendar, ExternalLink, X, Plus, Trash2, Edit3, ShieldCheck, LogOut, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { initialCertificates, type Certificate } from '../../data/certificates';
import { 
  getCertificates, 
  getLocalCertificates,
  createCertificate, 
  updateCertificate, 
  deleteCertificate, 
  isFirebaseConfigured,
  isAdminAuthenticated, 
  logoutAdmin, 
  subscribeToAuthChange,
  formatDriveImageUrl,
  extractDriveFileId,
  DEFAULT_FALLBACK_IMAGE,
  parseDateToTimestamp
} from '../../lib/firebase';
import { triggerToast } from './GooeyToast';

export default function CertificatesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>(() => getLocalCertificates());
  const [isLoading, setIsLoading] = useState(() => getLocalCertificates().length === 0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [image, setImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Initial fetch and subscription to auth changes
  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const unsubscribe = subscribeToAuthChange((authed) => {
      setIsAdmin(authed);
    });

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getCertificates();
        setCertificates(data);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setCertificates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setDate('');
    setCredentialId('');
    setCredentialUrl('');
    setImage('');
    setTagsInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setImage(cert.image || '');
    setTagsInput(cert.tags ? cert.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      triggerToast('Title and Issuer are required', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formattedImage = formatDriveImageUrl(image);

    const payload = {
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      credentialId: credentialId.trim() || undefined,
      credentialUrl: credentialUrl.trim() || undefined,
      image: formattedImage,
      tags: tags.length > 0 ? tags : undefined,
    };

    try {
      if (editingId) {
        // Update existing certificate
        await updateCertificate(editingId, payload);
        setCertificates((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
        );
        triggerToast('Certificate updated successfully!', 'success');
      } else {
        // Create new certificate
        const created = await createCertificate(payload);
        setCertificates((prev) => [created, ...prev]);
        triggerToast('Certificate saved to database!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save certificate', 'error');
    }
  };

  const handleDelete = async (cert: Certificate) => {
    if (confirm(`Are you sure you want to delete "${cert.title}"?`)) {
      try {
        if (cert.id) {
          await deleteCertificate(cert.id);
        }
        setCertificates((prev) => {
          const updated = prev.filter((c) => (cert.id ? c.id !== cert.id : c.title !== cert.title));
          if (typeof window !== 'undefined') {
            localStorage.setItem('sukamcd_portfolio_certificates', JSON.stringify(updated));
          }
          return updated;
        });
        triggerToast('Certificate deleted', 'info');
      } catch (err) {
        console.error(err);
        triggerToast('Failed to delete certificate', 'error');
      }
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    triggerToast('Logged out from Admin Mode', 'info');
  };

  // Filter and sort certificates by latest date first
  const filteredCertificates = [...certificates]
    .sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date))
    .filter((cert) => {
      const term = searchTerm.toLowerCase();
      return (
        cert.title.toLowerCase().includes(term) ||
        cert.issuer.toLowerCase().includes(term) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(term)) ||
        (cert.tags && cert.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    });

  // Modal scrolling lock
  useEffect(() => {
    if (isModalOpen || previewImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, previewImage]);

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Top Bar: Admin Banner / Actions & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-soft pb-4 select-none">
        
        {/* Left Side: Stats & Admin Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-silver-500 uppercase tracking-wider">Certificates</span>
            <span className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg bg-bg-surface border border-border-soft text-silver-300 font-mono text-xs font-bold">
              {isLoading && certificates.length === 0 ? '-' : certificates.length}
            </span>
          </div>

          {/* Admin Indicator Badge & Actions */}
          {isAdmin ? (
            <div className="flex items-center gap-2 pl-2.5 border-l border-border-soft">
              <span className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Active</span>
              </span>

              <button
                onClick={openAddModal}
                className="h-7 px-3 inline-flex items-center gap-1.5 rounded-lg bg-silver-100 hover:bg-silver-200 text-bg-root font-black uppercase text-[10px] font-mono tracking-wider cursor-pointer transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certificate</span>
              </button>

              <button
                onClick={handleLogout}
                className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-bg-surface border border-border-soft hover:border-accent-crimson text-silver-400 hover:text-accent-crimson transition-colors cursor-pointer"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Right Side: Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-silver-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-7 pl-8 pr-7 bg-bg-surface border border-border-soft focus:border-border-silver rounded-lg text-xs text-silver-100 placeholder-silver-500 font-mono focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-3 sm:p-5 bg-bg-surface border border-border-soft rounded-xl sm:rounded-2xl animate-pulse space-y-3">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-bg-elevated shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-2 bg-bg-elevated rounded w-1/3" />
                  <div className="h-3 bg-bg-elevated rounded w-3/4" />
                </div>
              </div>
              <div className="h-2 bg-bg-elevated rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-soft rounded-2xl bg-bg-surface/20 flex flex-col items-center justify-center gap-2 select-none">
          <Award className="w-8 h-8 text-silver-600" />
          <p className="text-xs font-mono uppercase tracking-wider text-silver-500">
            No certificates found
          </p>
        </div>
      ) : (
        /* Certificates Grid */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCertificates.map((cert) => {
            const formattedImg = formatDriveImageUrl(cert.image);
            return (
              <div
                key={cert.id}
                className="p-3 sm:p-4 bg-bg-surface border border-border-soft hover:border-border-silver rounded-xl sm:rounded-2xl flex flex-col justify-between min-h-[190px] sm:min-h-[220px] shadow-sm hover:shadow-md transition-all duration-200 group relative select-none"
              >
                <div>
                  {/* Admin Quick Action Floating Buttons */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 z-10">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-silver-100 flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                        title="Edit certificate"
                      >
                        <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-accent-crimson flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                        title="Delete certificate"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  )}

                  {/* Certificate Image Preview Banner (if provided) */}
                  {formattedImg ? (
                    <div 
                      onClick={() => setPreviewImage(formattedImg)}
                      className="w-full h-24 sm:h-36 rounded-lg sm:rounded-xl bg-bg-root border border-border-soft overflow-hidden mb-2.5 sm:mb-3.5 relative group/img cursor-pointer transition-all hover:border-silver-400"
                    >
                      <img 
                        src={formattedImg} 
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const fileId = extractDriveFileId(cert.image);
                          const target = e.currentTarget;
                          if (fileId && !target.dataset.tried) {
                            target.dataset.tried = 'true';
                            target.src = `https://lh3.googleusercontent.com/d/${fileId}=w800`;
                          } else {
                            target.src = DEFAULT_FALLBACK_IMAGE;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-[9px] font-bold">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </div>
                    </div>
                  ) : (
                    /* Fallback Icon Box */
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-400 mb-2 sm:mb-3">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent-amber" />
                    </div>
                  )}

                  {/* Issuer & Title */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[7.5px] sm:text-[8.5px] font-mono uppercase tracking-widest text-silver-500 font-bold block truncate">
                      {cert.issuer}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-silver-100 group-hover:text-silver-200 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>

                  {/* Skills / Tags */}
                  {cert.tags && cert.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cert.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded-md border border-border-soft bg-bg-root text-[7px] sm:text-[8px] font-mono text-silver-400 uppercase tracking-wide truncate"
                        >
                          {tag}
                        </span>
                      ))}
                      {cert.tags.length > 2 && (
                        <span className="text-[7px] sm:text-[8px] font-mono text-silver-500 self-center">
                          +{cert.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details: Date & Credential Link */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-2 sm:pt-3 mt-2 sm:mt-3 text-[8px] sm:text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1 truncate">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                    <span className="truncate">{cert.date}</span>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-silver-400 hover:text-silver-100 flex items-center gap-0.5 transition-colors shrink-0"
                      title="Verify credential"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="hidden sm:inline">Verify</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Certificate Modal ── */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-2xl p-6 relative my-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-bg-elevated hover:bg-bg-hover border border-border-soft flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Title */}
            <div className="space-y-1 mb-5 select-none pr-6">
              <span className="text-[9px] font-mono uppercase tracking-widest text-silver-500">
                — {isFirebaseConfigured ? 'NoSQL Firestore Registry' : 'Local Storage Registry'}
              </span>
              <h2 className="text-lg font-black text-silver-100 tracking-tight">
                {editingId ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belajar Dasar Pemrograman Web"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dicoding Indonesia"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jul 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 81LD8OGG7ZPG"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Credential URL / Verification Link
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.dicoding.com/certificates/81LD8OGG7ZPG"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              {/* Image URL / Google Drive link field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-silver-500" />
                    <span>Certificate Image / Google Drive Link (Optional)</span>
                  </label>
                  {image && (
                    <span className="text-[8.5px] font-mono text-emerald-400">Link detected</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Google Drive link or image link"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
                <p className="text-[8px] font-mono text-silver-500">
                  Tip: Pastikan file di Google Drive diatur ke "Siapa saja yang memiliki link dapat melihat".
                </p>

                {/* Live Preview of Image in Modal */}
                {image && image.trim() !== '/image/.webp' && image.trim() !== '/image/' && image.trim() !== '.webp' ? (
                  <div className="mt-2 w-full h-28 rounded-xl bg-bg-root border border-border-soft overflow-hidden flex items-center justify-center relative p-1">
                    <img 
                      src={formatDriveImageUrl(image.trim()) || image.trim()} 
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const fileId = extractDriveFileId(image);
                        const target = e.currentTarget;
                        if (fileId && !target.dataset.tried) {
                          target.dataset.tried = 'true';
                          target.src = `https://lh3.googleusercontent.com/d/${fileId}=w800`;
                        } else {
                          target.src = DEFAULT_FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Tags / Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTML, CSS, JavaScript"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-bg-elevated border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100 font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root font-mono text-[10px] uppercase tracking-wider font-black transition-all cursor-pointer text-center shadow-sm"
                >
                  {editingId ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Fullscreen Image Lightbox Modal ── */}
      {previewImage && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 cursor-zoom-out animate-[fadeIn_0.2s_ease-out_forwards]"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-auto">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-lg bg-bg-surface border border-border-soft text-silver-300 hover:text-silver-100 flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewImage} 
              alt="Certificate Enlarge Preview"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-border-soft shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

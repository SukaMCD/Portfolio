import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Award, Calendar, ExternalLink, X, Plus, Trash2, Edit3, ShieldCheck, LogOut, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { initialCertificates, type Certificate } from '../../data/certificates';
import { 
  getCertificates, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate, 
  isFirebaseConfigured,
  isAdminAuthenticated, 
  logoutAdmin, 
  subscribeToAuthChange,
  formatDriveImageUrl,
  extractDriveFileId,
  DEFAULT_FALLBACK_IMAGE
} from '../../lib/firebase';
import { triggerToast } from './GooeyToast';

export default function CertificatesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Filter certificates by search term
  const filteredCertificates = certificates.filter((cert) => {
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
              {certificates.length}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 bg-bg-surface border border-border-soft rounded-2xl animate-pulse space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated" />
                <div className="space-y-2 flex-1">
                  <div className="h-2.5 bg-bg-elevated rounded w-1/3" />
                  <div className="h-3.5 bg-bg-elevated rounded w-3/4" />
                </div>
              </div>
              <div className="h-2.5 bg-bg-elevated rounded w-1/2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.map((cert) => {
            const formattedImg = formatDriveImageUrl(cert.image);
            return (
              <div
                key={cert.id}
                className="p-4 bg-bg-surface border border-border-soft hover:border-border-silver rounded-2xl flex flex-col justify-between min-h-[200px] shadow-sm hover:shadow-md transition-all duration-200 group relative select-none"
              >
                <div>
                  {/* Admin Quick Action Floating Buttons */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="w-7 h-7 rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                        title="Edit certificate"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert)}
                        className="w-7 h-7 rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-accent-crimson flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                        title="Delete certificate"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Certificate Image Preview Banner (if provided) */}
                  {formattedImg ? (
                    <div 
                      onClick={() => setPreviewImage(formattedImg)}
                      className="w-full h-36 rounded-xl bg-bg-root border border-border-soft overflow-hidden mb-3.5 relative group/img cursor-pointer transition-all hover:border-silver-400"
                    >
                      <img 
                        src={formattedImg} 
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const fileId = extractDriveFileId(cert.image);
                          const target = e.currentTarget;
                          if (fileId && !target.dataset.tried) {
                            target.dataset.tried = 'true';
                            target.src = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Header Icon + Organization & Title */}
                  <div className="flex gap-3 items-start pr-8">
                    {!formattedImg && (
                      <div className="w-9 h-9 rounded-xl bg-bg-root border border-border-soft flex items-center justify-center text-silver-400 shrink-0">
                        <Award className="w-4.5 h-4.5 text-silver-400 group-hover:text-silver-200 transition-colors" />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-silver-500">
                        {cert.issuer}
                      </h4>
                      <h3 className="text-xs font-bold text-silver-100 leading-snug group-hover:text-white transition-colors">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  {/* Skill Tags */}
                  {cert.tags && cert.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {cert.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md border border-border-subtle bg-bg-root text-[8px] font-mono text-silver-500 uppercase font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Info */}
                <div className="flex items-end justify-between border-t border-border-subtle pt-3 mt-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-silver-500">
                      <Calendar className="w-3 h-3" />
                      <span>{cert.date}</span>
                    </div>
                    {cert.credentialId && (
                      <div className="text-[8px] font-mono text-silver-600">
                        ID: <span className="text-silver-500">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-mono uppercase tracking-wider text-silver-400 hover:text-silver-100 transition-colors font-bold flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
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
              className="absolute -top-10 right-0 w-8 h-8 rounded-lg bg-bg-surface border border-border-soft text-silver-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg"
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

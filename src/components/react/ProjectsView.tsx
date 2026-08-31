import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  FolderKanban, 
  Calendar, 
  Github, 
  Globe, 
  X, 
  ArrowUpRight, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  LogOut, 
  Image as ImageIcon,
  Link as LinkIcon,
  Layers
} from 'lucide-react';
import { type Project, type ProjectLink } from '../../data/projects';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  isFirebaseConfigured, 
  isAdminAuthenticated, 
  logoutAdmin, 
  subscribeToAuthChange,
  formatDriveImageUrl,
  extractDriveFileId,
  DEFAULT_FALLBACK_IMAGE
} from '../../lib/firebase';
import { triggerToast } from './GooeyToast';

const POPULAR_CATEGORIES = [
  'Web Application',
  'Laravel',
  'Flutter',
  'Game Dev',
  'E-Commerce',
  'WordPress',
  'React',
  'Fullstack'
];

export default function ProjectsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Detail Modal Drawer State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState('');
  const [alt, setAlt] = useState('');
  const [links, setLinks] = useState<ProjectLink[]>([
    { label: 'View Project', url: '' },
  ]);

  // Initial fetch and subscribe to admin auth changes
  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const unsubscribe = subscribeToAuthChange((authed) => {
      setIsAdmin(authed);
    });

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => unsubscribe();
  }, []);

  // Extract unique categories from current projects
  const categories = [
    'ALL',
    ...Array.from(new Set(projects.map((p) => (p.category || 'OTHER').toUpperCase()))),
  ];

  // Open Add Project Modal
  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Web Application');
    setDate('');
    setDescription('');
    setTagsInput('');
    setImage('');
    setAlt('');
    setLinks([
      { label: 'View Project', url: '' },
      { label: 'Live Demo', url: '' }
    ]);
    setIsModalOpen(true);
  };

  // Open Edit Project Modal
  const openEditModal = (proj: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(proj.id);
    setTitle(proj.title);
    setCategory(proj.category);
    setDate(proj.date);
    setDescription(proj.description);
    setTagsInput(proj.tags ? proj.tags.join(', ') : '');
    setImage(proj.image || '');
    setAlt(proj.alt || '');
    setLinks(
      proj.links && proj.links.length > 0
        ? proj.links.map((l) => ({ ...l }))
        : [{ label: 'View Project', url: '' }]
    );
    setIsModalOpen(true);
  };

  // Handle Dynamic Link List in Form
  const handleLinkChange = (index: number, field: keyof ProjectLink, value: string) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddLinkRow = () => {
    setLinks((prev) => [...prev, { label: '', url: '' }]);
  };

  const handleRemoveLinkRow = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Form Submission (Create / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !description.trim()) {
      triggerToast('Title, Category, and Description are required', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const validLinks = links
      .filter((l) => l.label.trim().length > 0 && l.url.trim().length > 0)
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }));

    const rawImage = image.trim();
    const formattedImage = formatDriveImageUrl(rawImage) || (rawImage && rawImage !== '/image/.webp' && rawImage !== '/image/' && rawImage !== '.webp' ? rawImage : DEFAULT_FALLBACK_IMAGE);

    const payload = {
      title: title.trim(),
      category: category.trim(),
      date: date.trim() || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: description.trim(),
      tags: tags.length > 0 ? tags : ['Project'],
      links: validLinks,
      image: formattedImage,
      alt: alt.trim() || `Screenshot ${title.trim()}`,
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        );
        // If the updated project is currently selected in drawer, update drawer state too
        if (selectedProject && selectedProject.id === editingId) {
          setSelectedProject({ ...selectedProject, ...payload });
        }
        triggerToast('Project updated successfully!', 'success');
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        triggerToast('Project added to database!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save project', 'error');
    }
  };

  // Handle Delete Project
  const handleDelete = async (proj: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      try {
        if (proj.id) {
          await deleteProject(proj.id);
        }
        setProjects((prev) => {
          const updated = prev.filter((p) => (proj.id ? p.id !== proj.id : p.title !== proj.title));
          if (typeof window !== 'undefined') {
            localStorage.setItem('sukamcd_portfolio_projects', JSON.stringify(updated));
          }
          return updated;
        });
        if (selectedProject && (selectedProject.id === proj.id || selectedProject.title === proj.title)) {
          setSelectedProject(null);
        }
        triggerToast('Project deleted', 'info');
      } catch (err) {
        console.error(err);
        triggerToast('Failed to delete project', 'error');
      }
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    logoutAdmin();
    triggerToast('Logged out from Admin Mode', 'info');
  };

  // Modal Scroll Lock & ESC Key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
        } else if (selectedProject) {
          setSelectedProject(null);
        }
      }
    };

    if (selectedProject || isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.style.overflow = 'auto';
    };
  }, [selectedProject, isModalOpen]);

  // Filter projects by search term and category
  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(term))) ||
      (project.category && project.category.toLowerCase().includes(term));

    const matchesCategory =
      activeCategory === 'ALL' ||
      (project.category && project.category.toUpperCase() === activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* ── Top Bar: Admin Banner & Quick Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-soft pb-4 select-none">
        
        {/* Left Side: Stats & Admin Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-silver-500 uppercase tracking-wider">Projects</span>
            <span className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg bg-bg-surface border border-border-soft text-silver-300 font-mono text-xs font-bold">
              {projects.length}
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
                <span>Add Project</span>
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

        {/* Right Side: Search Box */}
        <div className="relative w-full sm:w-64 max-w-md shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-silver-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
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

      {/* ── Category Filters ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer font-mono border whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-silver-100 text-bg-root border-silver-100 font-bold shadow-md'
                : 'bg-bg-surface text-silver-500 border-border-soft hover:text-silver-200 hover:border-silver-500'
            }`}
          >
            {cat === 'ALL' ? 'All Projects' : cat}
          </button>
        ))}
      </div>

      {/* ── Loading Skeleton State ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-5 bg-bg-surface border border-border-soft rounded-2xl animate-pulse space-y-4 min-h-[340px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-full aspect-video rounded-xl bg-bg-elevated" />
                <div className="h-4 bg-bg-elevated rounded w-2/3" />
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-bg-elevated rounded w-full" />
                  <div className="h-2.5 bg-bg-elevated rounded w-4/5" />
                </div>
              </div>
              <div className="h-3 bg-bg-elevated rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-soft rounded-2xl bg-bg-surface/20 flex flex-col items-center justify-center gap-3 select-none">
          <FolderKanban className="w-8 h-8 text-silver-600" />
          <p className="text-xs font-mono uppercase tracking-widest text-silver-500">
            No projects matched your search criteria
          </p>
        </div>
      ) : (
        /* ── Grid of Projects ── */
        <div 
          key={activeCategory + searchTerm} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-[fadeIn_0.35s_ease-out_forwards]"
        >
          {filteredProjects.map((project, index) => {
            const rawImg = project.image?.trim();
            const formattedImg = formatDriveImageUrl(rawImg) || (rawImg && rawImg !== '/image/.webp' && rawImg !== '/image/' && rawImg !== '.webp' ? rawImg : DEFAULT_FALLBACK_IMAGE);
            return (
              <div
                key={project.id || index}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer p-5 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.02] active:scale-[0.99] rounded-2xl flex flex-col justify-between min-h-[360px] shadow-lg transition-all duration-300 relative select-none"
              >
                {/* Admin Floating Quick Action Buttons */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                    <button
                      onClick={(e) => openEditModal(project, e)}
                      className="w-7 h-7 rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                      title="Edit project"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(project, e)}
                      className="w-7 h-7 rounded-lg bg-bg-elevated/90 hover:bg-bg-hover border border-border-soft text-silver-300 hover:text-accent-crimson flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-sm"
                      title="Delete project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-xl border border-border-subtle aspect-video bg-bg-root">
                    <img
                      src={formattedImg}
                      alt={project.alt || project.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                      loading={index < 6 ? "eager" : "lazy"}
                      onError={(e) => {
                        const fileId = extractDriveFileId(project.image);
                        const target = e.currentTarget;
                        if (fileId && !target.dataset.tried) {
                          target.dataset.tried = 'true';
                          target.src = `https://lh3.googleusercontent.com/d/${fileId}=w800`;
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';
                        }
                      }}
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-bg-root/80 backdrop-blur-md text-[8.5px] font-mono font-black uppercase tracking-wider text-silver-200 border border-border-soft shadow-md z-10">
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-silver-100 group-hover:translate-x-1 transition-transform">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-silver-500 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Technology Tags Preview */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-lg border border-border-soft bg-bg-root text-[8.5px] font-mono text-silver-400 uppercase tracking-wide font-medium shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[8.5px] font-mono text-silver-500 font-bold self-center pl-0.5">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Date & Details CTA */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-3.5 mt-5">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.date?.includes(',') ? project.date.split(',')[1]?.trim() : project.date}</span>
                  </div>
                  
                  <span className="text-[9px] font-mono uppercase tracking-widest text-silver-400 group-hover:text-silver-100 transition-colors font-bold flex items-center gap-1">
                    Details <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Project Modal ── */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-2xl p-6 relative my-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-bg-elevated hover:bg-bg-hover border border-border-soft flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header */}
            <div className="space-y-1 mb-5 select-none pr-6">
              <span className="text-[9px] font-mono uppercase tracking-widest text-silver-500">
                — {isFirebaseConfigured ? 'NoSQL Firestore Registry' : 'Local Storage Registry'}
              </span>
              <h2 className="text-lg font-black text-silver-100 tracking-tight">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Project Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leafly Tea E-Commerce"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              {/* Category & Date in 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laravel / Web Application"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                  />
                  {/* Category Quick Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                          category === cat
                            ? 'bg-silver-100 text-bg-root border-silver-100 font-bold'
                            : 'bg-bg-elevated text-silver-500 border-border-soft hover:text-silver-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 23 Apr, 2025 or 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan tentang tujuan, arsitektur, teknologi, dan fitur utama proyek..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Technologies / Tags */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold">
                  Technologies / Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Laravel, PostgreSQL, Filament, Tailwind"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
              </div>

              {/* Project Image Link & Alt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-silver-500" />
                    <span>Project Image / Google Drive Link (Optional)</span>
                  </label>
                  {image && (
                    <span className="text-[8.5px] font-mono text-emerald-400">Link detected</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Google Drive share link, or /image/imgporto1.webp"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                />
                
                <p className="text-[8px] font-mono text-silver-500">
                  Tip: Link Google Drive otomatis dikonversi. Pastikan hak akses "Siapa saja yang memiliki link".
                </p>

                {/* Live Image Preview */}
                {image && image.trim() !== '/image/.webp' && image.trim() !== '/image/' && image.trim() !== '.webp' ? (
                  <div className="mt-2 w-full h-32 rounded-xl bg-bg-root border border-border-soft overflow-hidden flex items-center justify-center relative p-1">
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

              {/* Dynamic Project Links List */}
              <div className="space-y-2 pt-1 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-silver-400 font-bold flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3 text-silver-500" />
                    <span>Project Links (GitHub, Demo, etc.)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLinkRow}
                    className="text-[9px] font-mono uppercase tracking-wider text-silver-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. View Project)"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                      className="w-1/3 rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                    />
                    <input
                      type="url"
                      placeholder="URL (e.g. https://github.com/...)"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      className="flex-1 rounded-xl py-2 px-3 text-xs placeholder-silver-600 bg-bg-root border border-border-soft focus:border-border-silver text-silver-100 outline-none transition-colors"
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(index)}
                        className="w-8 h-8 rounded-lg bg-bg-elevated hover:bg-bg-hover border border-border-soft text-silver-400 hover:text-accent-crimson flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
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
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Details Drawer Overlay (Portaled to Body) ── */}
      {selectedProject && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease_out_forwards] overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-bg-surface/95 border border-border-soft rounded-2xl overflow-hidden shadow-2xl animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] flex flex-col md:flex-row p-6 gap-6 my-8 relative"
          >
            {/* Action buttons (Close + optional Admin Edit) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              {isAdmin && (
                <button
                  onClick={() => openEditModal(selectedProject)}
                  className="w-8 h-8 rounded-full bg-bg-elevated/80 hover:bg-bg-elevated border border-border-soft hover:border-silver-400 flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer shadow-md"
                  title="Edit this project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-full bg-bg-elevated/80 hover:bg-bg-elevated border border-border-soft hover:border-silver-400 flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer shadow-md"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Left side: Image column */}
            <div className="w-full md:w-[45%] shrink-0">
              <div className="relative overflow-hidden rounded-xl border border-border-soft w-full h-full min-h-[240px] md:min-h-[420px] bg-bg-root flex items-center justify-center">
                <img
                  src={formatDriveImageUrl(selectedProject.image?.trim()) || (selectedProject.image && selectedProject.image !== '/image/.webp' && selectedProject.image !== '/image/' ? selectedProject.image : DEFAULT_FALLBACK_IMAGE)}
                  alt={selectedProject.alt || selectedProject.title}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  loading="lazy"
                  onError={(e) => {
                    const fileId = extractDriveFileId(selectedProject.image);
                    const target = e.currentTarget;
                    if (fileId && !target.dataset.tried) {
                      target.dataset.tried = 'true';
                      target.src = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';
                    }
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-bg-root/80 backdrop-blur-md text-[8.5px] font-mono font-black uppercase tracking-wider text-silver-200 border border-border-soft shadow-md z-10">
                  {selectedProject.category}
                </span>
              </div>
            </div>

            {/* Right side: Information column */}
            <div className="w-full md:w-[55%] flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Title & Metadata */}
                <div className="space-y-1.5 pr-14">
                  <h2 className="text-xl md:text-2xl font-black text-silver-100 tracking-tight leading-snug">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {selectedProject.date}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                    Project Description
                  </h4>
                  <p className="text-xs text-silver-400 leading-relaxed text-justify">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies / Tags */}
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-silver-500 font-black">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-1.5 select-none">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg border border-border-soft bg-bg-root/50 text-[9px] font-mono text-silver-300 font-semibold uppercase tracking-wider shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Links Footer Panel */}
              {selectedProject.links && selectedProject.links.length > 0 && (
                <div className="pt-4 border-t border-border-soft flex items-center justify-end gap-3 select-none flex-wrap">
                  {selectedProject.links.map((link, lIndex) => {
                    const isGithub = link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('project');
                    return (
                      <a
                        key={lIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group px-4 py-2.5 rounded-xl text-[9px] font-mono tracking-widest uppercase font-black flex items-center gap-2 cursor-pointer shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                          lIndex === 0
                            ? 'bg-silver-100 hover:bg-silver-200 text-bg-root'
                            : 'bg-bg-surface border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100'
                        }`}
                      >
                        {isGithub ? (
                          <Github className="w-3.5 h-3.5 group-hover:scale-105 transition-transform duration-200" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 group-hover:scale-105 transition-transform duration-200" />
                        )}
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* SlideIn animation injected locally */}
      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
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

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, FolderKanban, Calendar, Github, Globe, X, ArrowUpRight } from 'lucide-react';
import { featuredProjects, type Project } from '../../data/projects';

export default function ProjectsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Modal Drawer State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Extract unique categories (uppercased)
  const categories = ['ALL', ...Array.from(new Set(featuredProjects.map(p => p.category.toUpperCase())))];

  // Prevent background scrolling and handle Esc key closing when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.overflow = 'auto';
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.overflow = 'auto';
      }
    };
  }, [selectedProject]);

  // Filter projects based on search query and active tab category
  const filteredProjects = featuredProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory =
      activeCategory === 'ALL' ||
      project.category.toUpperCase() === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-5 select-none">
        
        {/* Scrollable Categories List */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer font-mono border whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-silver-100 text-bg-root border-silver-100 font-bold shadow-md'
                  : 'bg-bg-surface text-silver-500 border-border-soft hover:text-silver-200 hover:border-silver-500'
              }`}
            >
              {cat === 'ALL' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {/* Minimalist Search Box */}
        <div className="relative w-full md:w-64 max-w-md shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-600" />
          <input
            type="text"
            placeholder="Search projects by name/tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-10 pr-9 text-xs placeholder-silver-600 bg-bg-surface border border-border-soft focus:border-silver-400 text-silver-100 outline-none transition-all focus:bg-bg-surface/50"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-silver-500 hover:text-silver-100 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-soft rounded-2xl bg-bg-surface/20 flex flex-col items-center justify-center gap-3 select-none">
          <FolderKanban className="w-8 h-8 text-silver-600" />
          <p className="text-xs font-mono uppercase tracking-widest text-silver-500">
            No projects matched your search criteria
          </p>
        </div>
      ) : (
        <div 
          key={activeCategory + searchTerm} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-[fadeIn_0.35s_ease-out_forwards]"
        >
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer p-5 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.02] active:scale-[0.99] rounded-2xl flex flex-col justify-between min-h-[360px] shadow-lg transition-all duration-300 relative select-none"
            >
              <div className="space-y-4">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-xl border border-border-subtle aspect-video bg-bg-root">
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                    loading={index < 6 ? "eager" : "lazy"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';
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
                </div>
              </div>

              {/* Bottom tag & details CTA */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-3.5 mt-5">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.date.split(',')[1]?.trim() || project.date}</span>
                </div>
                
                <span className="text-[9px] font-mono uppercase tracking-widest text-silver-400 group-hover:text-silver-100 transition-colors font-bold flex items-center gap-1">
                  Details <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
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
            {/* Close Button floating */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-elevated/50 hover:bg-bg-elevated border border-border-soft hover:border-silver-400 flex items-center justify-center text-silver-400 hover:text-silver-100 transition-all cursor-pointer shadow-md z-20"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Image column */}
            <div className="w-full md:w-[45%] shrink-0">
              <div className="relative overflow-hidden rounded-xl border border-border-soft w-full h-full min-h-[240px] md:min-h-[420px] bg-bg-root flex items-center justify-center">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.alt}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';
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
                <div className="space-y-1.5 pr-8">
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
              </div>

              {/* Links Footer Panel */}
              <div className="pt-4 border-t border-border-soft flex items-center justify-end gap-3 select-none">
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



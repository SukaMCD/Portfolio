import { LayoutGrid, FolderGit, Cpu, Mail, Terminal, Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openTerminal: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, openTerminal }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'projects', label: 'Projects', icon: FolderGit },
    { id: 'stats', label: 'Tech Stack', icon: Cpu },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <aside className="w-[calc(100%-2rem)] mx-4 mt-4 mb-2 lg:w-64 lg:mx-0 lg:my-6 lg:ml-6 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start shrink-0 flex flex-col justify-between p-6 bg-bg-surface border border-border-soft rounded-2xl transition-all duration-300 z-20 shadow-md">
      <div className="space-y-8">
        
        {/* Profile Card */}
        <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center gap-3.5 shadow-md">
          <img
            src="https://github.com/SukaMCD.png"
            alt="Fabian Rizky Pratama"
            className="w-11 h-11 rounded-xl object-cover border border-border-soft select-none"
            loading="eager"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/100';
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-silver-100 truncate">
              Fabian Rizky P.
            </span>
            <span className="text-[10px] text-silver-500 truncate font-mono">
              Software Engineer
            </span>
            
            {/* Availability status */}
            <div className="flex items-center gap-1.5 mt-1 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse-emerald shadow-[0_0_8px_var(--emerald)]"></span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-accent-emerald font-bold">
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-silver-100 text-bg-root font-bold shadow-lg shadow-silver-glow scale-[1.02]'
                    : 'text-silver-400 hover:text-silver-100 hover:bg-bg-hover hover:translate-x-1'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-bg-root' : 'text-silver-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Social Links */}
        <div className="space-y-2">
          <p className="text-[9px] font-mono uppercase tracking-widest text-silver-600 px-1">Connect</p>
          <a
            href="https://github.com/SukaMCD"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-silver-400 hover:text-silver-100 hover:bg-bg-hover transition-all duration-200 group"
          >
            <Github className="w-4 h-4 shrink-0" />
            <span className="font-medium">GitHub</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
          <a
            href="https://linkedin.com/in/fabian-rizky-pratama"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-silver-400 hover:text-silver-100 hover:bg-bg-hover transition-all duration-200 group"
          >
            <Linkedin className="w-4 h-4 shrink-0" />
            <span className="font-medium">LinkedIn</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
          <a
            href="https://instagram.com/sukamcd.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-silver-400 hover:text-silver-100 hover:bg-bg-hover transition-all duration-200 group"
          >
            <Instagram className="w-4 h-4 shrink-0" />
            <span className="font-medium">Instagram</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="mt-8 pt-6 border-t border-border-subtle space-y-4">
        {/* Terminal Button */}
        <button
          onClick={openTerminal}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-bg-elevated border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100 transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wider font-bold shadow-md hover:scale-[1.02]"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-silver-500" />
            <span>Terminal</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-bg-surface text-[8px] text-silver-500 border border-border-subtle">
            DINO
          </span>
        </button>
      </div>
    </aside>
  );
}

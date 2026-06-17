import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import GithubStats from './GithubStats';
import ProjectsView from './ProjectsView';
import SkillsChart from './SkillsChart';
import TicketContact from './TicketContact';
import TerminalModal from './TerminalModal';
import GooeyToast, { triggerToast } from './GooeyToast';
import { ArrowUpRight, Sparkles, FolderKanban, Terminal } from 'lucide-react';

interface DashboardContainerProps {
  initialTab?: string;
}

export default function DashboardContainer({ initialTab = 'overview' }: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Synchronize state from URL pathname
  useEffect(() => {
    const getTabFromPath = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path === 'stack' || path === 'tech-stack') return 'stats';
      if (['overview', 'projects', 'contact'].includes(path)) return path;
      return null;
    };

    const initialTab = getTabFromPath();
    if (initialTab) {
      setActiveTab(initialTab);
    }

    const handlePopState = () => {
      const tab = getTabFromPath();
      if (tab) {
        setActiveTab(tab);
      } else if (window.location.pathname === '/') {
        setActiveTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state changes back to URL pathname
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
    const expectedPath = activeTab === 'stats' ? 'stack' : (activeTab === 'overview' ? '' : activeTab);
    if (currentPath !== expectedPath) {
      window.history.pushState(null, '', `/${expectedPath}`);
    }
  }, [activeTab]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return <ProjectsView />;
      case 'stats':
        return <SkillsChart />;
      case 'contact':
        return <TicketContact />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6 select-none animate-[fadeIn_0.4s_ease_forwards]">
        
        {/* Bento Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Main Welcome Hero Card */}
          <div className="lg:col-span-2 p-6.5 bg-bg-surface border border-border-soft rounded-2xl flex flex-col justify-between min-h-[200px] shadow-lg relative overflow-hidden group hover:border-border-silver transition-all duration-300">
            {/* Cyber lines on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-bg-elevated border border-border-soft text-[8.5px] font-mono font-bold uppercase tracking-wider text-silver-400">
                About Me
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-silver-100 tracking-tight leading-tight pt-1">
                Hello, I'm Fabian Rizky Pratama
              </h2>
              <p className="text-xs text-silver-500 leading-relaxed max-w-xl">
                Saya adalah siswa Rekayasa Perangkat Lunak di SMK Budi Luhur, berfokus pada pengembangan backend Laravel/PHP dan aplikasi interaktif modern. Senang merekayasa ide menjadi sistem fungsional berkualitas tinggi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-6">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  triggerToast('Navigated to Project Manager', 'info');
                }}
                className="px-5 py-2.5 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root font-black uppercase text-[10px] font-mono tracking-widest flex items-center gap-1.5 cursor-pointer shadow-md transition-all select-none"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('contact');
                  triggerToast('Support Ticket system ready', 'info');
                }}
                className="px-5 py-2.5 rounded-xl bg-bg-elevated border border-border-soft hover:border-silver-500 text-silver-400 hover:text-silver-100 font-bold uppercase text-[10px] font-mono tracking-widest flex items-center gap-1.5 cursor-pointer shadow-md transition-all select-none"
              >
                <span>Open Ticket</span>
              </button>
            </div>
          </div>

          {/* Quick System Stats Widget */}
          <div className="p-6.5 bg-bg-surface border border-border-soft rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-border-silver transition-all duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-bg-elevated border border-border-soft text-[8.5px] font-mono font-bold uppercase tracking-wider text-silver-400">
                At a Glance
              </div>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-500">Main Focus:</span>
                  <span className="font-bold text-silver-200 font-mono uppercase tracking-wider">Web Application</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-500">Core Stack:</span>
                  <span className="font-bold text-silver-200 font-mono uppercase tracking-wider">Laravel / PHP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-500">Database:</span>
                  <span className="font-bold text-silver-200 font-mono uppercase tracking-wider">PostgreSQL / MySQL</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 mt-6 flex items-center justify-between text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider">
              <span>GitHub Profile</span>
              <a
                href="https://github.com/SukaMCD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-400 hover:text-silver-100 flex items-center gap-1"
              >
                <span>github.com</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Dynamic GitHub Repos Showcase */}
        <div className="p-6 bg-bg-surface border border-border-soft rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-5 select-none">
            <div className="flex items-center gap-2.5">
              <FolderKanban className="w-5 h-5 text-silver-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-silver-100">
                Featured Projects on GitHub
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveTab('projects');
                triggerToast('Loading project catalog...', 'info');
              }}
              className="text-[9px] font-mono uppercase tracking-widest font-bold text-silver-500 hover:text-silver-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <GithubStats />
        </div>

        {/* Quick Contact & Skills Promo Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch select-none">
          {/* Skills Card Promo */}
          <div
            onClick={() => {
              setActiveTab('stats');
              triggerToast('System skill distribution loaded', 'info');
            }}
            className="cursor-pointer p-6 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.01] rounded-2xl flex items-center justify-between shadow-lg transition-all duration-300"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold uppercase tracking-wider text-accent-amber">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skills & Tools</span>
              </div>
              <h3 className="text-sm font-black text-silver-100">What I Work With</h3>
              <p className="text-[11px] text-silver-500 leading-normal max-w-xs">
                Visualisasi terperinci mengenai jam terbang, penguasaan framework, dan kualifikasi database.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-silver-500 shrink-0" />
          </div>

          {/* Contact Card Promo */}
          <div
            onClick={() => {
              setActiveTab('contact');
              triggerToast('Support Ticket system ready', 'info');
            }}
            className="cursor-pointer p-6 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.01] rounded-2xl flex items-center justify-between shadow-lg transition-all duration-300"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold uppercase tracking-wider text-accent-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse shadow-[0_0_8px_var(--emerald)] mr-0.5"></span>
                <span>Available for Hire</span>
              </div>
              <h3 className="text-sm font-black text-silver-100">Start a Project</h3>
              <p className="text-[11px] text-silver-500 leading-normal max-w-xs">
                Tertarik untuk bekerja sama? Buka tiket support untuk mendiskusikan penawaran kerja, kolaborasi, atau proyek lepas.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-silver-500 shrink-0" />
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-root transition-colors duration-300">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openTerminal={() => setIsTerminalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header activeTab={activeTab} />
          
          {/* Render Tab Panel */}
          <main className="flex-grow px-4 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-4 overflow-y-auto z-10">
            {renderActiveTabContent()}
          </main>
        </div>
      </div>

      {/* Retro CLI Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Gooey notification toasts dispatcher */}
      <GooeyToast />
      
      {/* Global CSS transition animations injected */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

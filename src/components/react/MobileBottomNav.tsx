import { LayoutGrid, FolderGit, Cpu, Award, Mail } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'projects', label: 'Projects', icon: FolderGit },
    { id: 'stats', label: 'Tech Stack', icon: Cpu },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-surface/90 backdrop-blur-xl border-t border-border-soft px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.35)] safe-area-pb"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer min-w-[56px] select-none ${
              isActive
                ? 'bg-silver-100/10 text-silver-100 font-bold scale-[1.05]'
                : 'text-silver-500 hover:text-silver-300'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-silver-100 stroke-[2.25]' : 'text-silver-500'}`} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-silver-100 shadow-[0_0_6px_var(--silver-300)]" />
              )}
            </div>
            <span className={`text-[9.5px] mt-1 font-medium tracking-tight ${isActive ? 'text-silver-100 font-bold' : 'text-silver-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

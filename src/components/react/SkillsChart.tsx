import { useState } from 'react';
import { Cpu, Layout, Smartphone, PenTool, Award } from 'lucide-react';

interface TechItem {
  name: string;
  level: number;
  years: string;
  icon: string; // Devicon font classes
  colorClass: string;
}

interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: TechItem[];
}

export default function SkillsChart() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const skillCategories: SkillCategory[] = [
    {
      id: 'backend',
      title: 'Backend Core',
      description: 'Server architecture, APIs, and databases',
      icon: Cpu,
      items: [
        { name: 'PHP', level: 90, years: '2+ Years', icon: 'devicon-php-plain', colorClass: 'text-[#777bb3]' },
        { name: 'Laravel', level: 90, years: '2+ Years', icon: 'devicon-laravel-original', colorClass: 'text-[#f0513f]' },
        { name: 'PostgreSQL', level: 85, years: '1.5+ Years', icon: 'devicon-postgresql-plain', colorClass: 'text-[#336791]' },
        { name: 'MySQL', level: 85, years: '2+ Years', icon: 'devicon-mysql-original', colorClass: 'text-[#00618a]' },
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend Mainframe',
      description: 'UI rendering, logic, styles, and layouts',
      icon: Layout,
      items: [
        { name: 'HTML5', level: 95, years: '2.5+ Years', icon: 'devicon-html5-plain', colorClass: 'text-[#e34f26]' },
        { name: 'CSS3', level: 90, years: '2.5+ Years', icon: 'devicon-css3-plain', colorClass: 'text-[#1572b6]' },
        { name: 'JavaScript', level: 80, years: '2+ Years', icon: 'devicon-javascript-plain', colorClass: 'text-[#b58900] dark:text-[#f7df1e]' },
        { name: 'Bootstrap', level: 90, years: '2+ Years', icon: 'devicon-bootstrap-plain', colorClass: 'text-[#7952b3]' },
      ],
    },
    {
      id: 'mobile-game',
      title: 'Mobile & Game Dev',
      description: 'App development and game engines',
      icon: Smartphone,
      items: [
        { name: 'Flutter', level: 80, years: '1+ Year', icon: 'devicon-flutter-plain', colorClass: 'text-[#02569b]' },
        { name: 'Dart', level: 75, years: '1+ Year', icon: 'devicon-dart-plain', colorClass: 'text-[#0175c2]' },
        { name: 'Godot Engine', level: 80, years: '1+ Year', icon: 'devicon-godot-plain', colorClass: 'text-[#478cbf]' },
        { name: 'GDScript', level: 80, years: '1+ Year', icon: 'devicon-godot-plain', colorClass: 'text-[#007cbd] dark:text-[#00aaff]' },
      ],
    },
    {
      id: 'tools-cms',
      title: 'Tools & Systems',
      description: 'Content management and version control',
      icon: PenTool,
      items: [
        { name: 'WordPress', level: 85, years: '2+ Years', icon: 'devicon-wordpress-plain', colorClass: 'text-[#21759b]' },
        { name: 'Linux', level: 80, years: '1.5+ Years', icon: 'devicon-linux-plain', colorClass: 'text-silver-100' },
        { name: 'Git & GitHub', level: 85, years: '2+ Years', icon: 'devicon-git-plain', colorClass: 'text-[#f05032]' },
        { name: 'Figma', level: 75, years: '1.5+ Years', icon: 'devicon-figma-plain', colorClass: 'text-[#f24e1e]' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Devicon dependency stylesheet injected */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/devicons/css/devicons.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div
              key={category.id}
              className="p-6 bg-bg-surface border border-border-soft rounded-2xl shadow-lg transition-all duration-300 hover:border-border-silver hover:shadow-2xl"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-300 shadow-md">
                    <CategoryIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-silver-100">
                      {category.title}
                    </h3>
                    <p className="text-[8.5px] font-mono text-silver-500 uppercase tracking-wider">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                {/* Modern active module status tag */}
                <div className="text-right font-mono text-[8.5px] text-silver-500 font-bold uppercase tracking-wider bg-bg-root border border-border-subtle px-2.5 py-1 rounded-lg shrink-0">
                  {category.items.length} MODULES ACTIVE
                </div>
              </div>

              {/* Category Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.items.map((tech) => {
                  const brandColor = tech.colorClass.includes('text-silver-') 
                    ? `var(--${tech.colorClass.match(/text-silver-\d+/)?.[0]?.replace('text-', '')})` 
                    : (tech.colorClass.match(/#\w+/)?.[0] || 'var(--silver-400)');
                  const isHovered = hoveredTech === tech.name;
                  
                  return (
                    <div
                      key={tech.name}
                      className="p-3.5 bg-bg-surface/40 hover:bg-bg-elevated border border-border-soft hover:border-border-silver rounded-xl transition-all duration-300 group flex flex-col justify-between gap-3 relative overflow-hidden"
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      {/* Left highlight strip that illuminates on hover */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: brandColor }}
                      />

                      <div className="flex items-center justify-between text-xs select-none">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-bg-root border border-border-subtle flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-silver-500/30">
                            <i className={`${tech.icon} ${tech.colorClass} text-sm transition-transform group-hover:rotate-6`} />
                          </div>
                          <div>
                            <span className="font-black text-silver-200 group-hover:text-silver-100 transition-colors">
                              {tech.name}
                            </span>
                            <div className="text-[8px] font-mono text-silver-500 font-bold uppercase tracking-wider mt-0.5">
                              {tech.years}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-0.5">
                          <span className="font-mono text-[9px] text-silver-400 font-black">
                            {tech.level}%
                          </span>
                          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-bg-root border border-border-subtle text-silver-500 uppercase tracking-widest font-black scale-90 origin-right shrink-0">
                            {tech.level >= 90 ? 'Expert' : tech.level >= 80 ? 'Advanced' : 'Competent'}
                          </span>
                        </div>
                      </div>

                      {/* Custom Segmented Battery Skill Meter */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-bg-root border border-border-subtle rounded-lg overflow-hidden flex p-[1px] gap-[2px]">
                          {Array.from({ length: 12 }).map((_, segmentIdx) => {
                            const threshold = (segmentIdx + 1) / 12 * 100;
                            const isActive = tech.level >= threshold;
                            
                            return (
                              <div
                                key={segmentIdx}
                                className="h-full flex-1 rounded-sm transition-all duration-300"
                                style={{
                                  backgroundColor: isActive 
                                    ? (isHovered ? brandColor : 'var(--silver-300)')
                                    : 'transparent',
                                  opacity: isActive ? (isHovered ? 1 : 0.6) : 0.08,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stat Card */}
      <div className="p-6 bg-bg-surface border border-border-soft rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 select-none mt-2 shadow-lg hover:border-border-silver transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-300 shadow-md">
            <Award className="w-5.5 h-5.5 text-silver-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-black uppercase text-silver-200 tracking-wider">Continuous Growth & Learning</h4>
            </div>
            <p className="text-[10px] text-silver-500 leading-relaxed max-w-xl">
              Always expanding backend systems engineering, custom API frameworks, database scaling, and modern game development capabilities.
            </p>
          </div>
        </div>
        
        {/* Right side: Contribution Activity Simulation & Focus */}
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-border-subtle">
          {/* Mini contribution grid */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[7.5px] font-mono text-silver-500 uppercase tracking-widest font-bold">Activity Telemetry</span>
            <div className="grid grid-cols-6 gap-1">
              {[
                0.8, 0.4, 0.1, 0.9, 0.2, 0.6,
                0.3, 0.7, 0.9, 0.1, 0.5, 0.8,
                0.9, 0.2, 0.6, 0.9, 0.7, 0.4,
                0.5, 0.9, 0.3, 0.8, 0.1, 0.9
              ].map((val, idx) => (
                <div 
                  key={idx}
                  className="w-2.5 h-2.5 rounded-sm transition-colors duration-300"
                  style={{
                    backgroundColor: `var(--silver-300)`,
                    opacity: val,
                  }}
                  title={`Activity weight: ${val * 100}%`}
                />
              ))}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[8.5px] font-mono text-silver-500 uppercase tracking-widest font-bold">Main Focus</span>
            <div className="text-xs font-black uppercase text-silver-100 tracking-wider font-mono mt-1 bg-bg-elevated border border-border-soft px-2.5 py-1.5 rounded-xl">
              PHP & LARAVEL CORE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

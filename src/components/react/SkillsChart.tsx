import { useState } from 'react';

interface Tech {
  name: string;
  icon: string;
  color?: string;
}

interface TechCategory {
  title: string;
  items: Tech[];
}

export default function SkillsChart() {
  const [search, setSearch] = useState('');

  const categories: TechCategory[] = [
    {
      title: 'Languages & Core',
      items: [
        { name: 'PHP', icon: 'devicon-php-plain', color: '#777bb3' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#f7df1e' },
        { name: 'Go', icon: 'devicon-go-plain', color: '#00add8' },
        { name: 'Dart', icon: 'devicon-dart-plain', color: '#0175c2' },
        { name: 'HTML5', icon: 'devicon-html5-plain', color: '#e34f26' },
        { name: 'CSS3', icon: 'devicon-css3-plain', color: '#1572b6' },
      ],
    },
    {
      title: 'Frameworks & Libraries',
      items: [
        { name: 'Laravel', icon: 'devicon-laravel-original', color: '#f0513f' },
        { name: 'Astro', icon: 'devicon-astro-plain', color: '#ff5d01' },
        { name: 'Flutter', icon: 'devicon-flutter-plain', color: '#02569b' },
        { name: 'Bootstrap', icon: 'devicon-bootstrap-plain', color: '#7952b3' },
      ],
    },
    {
      title: 'Database & Cloud',
      items: [
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', color: '#336791' },
        { name: 'MySQL', icon: 'devicon-mysql-original', color: '#00618a' },
        { name: 'Firebase', icon: 'devicon-firebase-plain', color: '#f59e0b' },
        { name: 'Google Cloud (GCP)', icon: 'devicon-googlecloud-plain', color: '#4285f4' },
      ],
    },
    {
      title: 'Tools, Runtimes & OS',
      items: [
        { name: 'Arch Linux', icon: 'devicon-archlinux-plain', color: '#1793d1' },
        { name: 'PowerShell', icon: 'devicon-powershell-plain', color: '#5391fe' },
        { name: 'Bun', icon: 'devicon-bun-plain', color: '#f472b6' },
        { name: 'npm', icon: 'devicon-npm-original-wordmark', color: '#cb3837' },
        { name: 'Git', icon: 'devicon-git-plain', color: '#f05032' },
        { name: 'GitHub', icon: 'devicon-github-original', color: '#e4e4e8' },
        { name: 'Godot', icon: 'devicon-godot-plain', color: '#478cbf' },
        { name: 'WordPress', icon: 'devicon-wordpress-plain', color: '#21759b' },
        { name: 'Figma', icon: 'devicon-figma-plain', color: '#f24e1e' },
      ],
    },
  ];

  const totalCount = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-soft">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-silver-500 uppercase tracking-wider">Technologies</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-surface border border-border-soft text-silver-300 font-semibold">
            {totalCount} total
          </span>
        </div>

        {/* Minimal search */}
        <div className="w-full sm:w-56">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-bg-surface border border-border-soft focus:border-border-silver rounded-lg text-xs text-silver-100 placeholder-silver-500 font-mono focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Categorized Tech List */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <div key={cat.title} className="space-y-3">
            <h3 className="text-xs font-semibold text-silver-400 font-mono uppercase tracking-wider">
              {cat.title}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover transition-all duration-150 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <i 
                      className={`${item.icon} text-lg transition-transform group-hover:scale-110`}
                      style={{ color: item.color }}
                    />
                  </div>
                  <span className="text-xs font-medium text-silver-200 group-hover:text-silver-100 transition-colors truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="py-12 text-center text-xs text-silver-500 font-mono">
            No technologies found matching "{search}".
          </div>
        )}
      </div>

    </div>
  );
}

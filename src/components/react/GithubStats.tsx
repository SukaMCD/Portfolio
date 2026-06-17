import { useState, useEffect } from 'react';
import { GitFork, Star, Folder, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { triggerToast } from './GooeyToast';

interface GithubProfile {
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
  fork: boolean;
}

interface CachedData {
  timestamp: number;
  profile: GithubProfile;
  repos: GithubRepo[];
  totalContributions?: number;
}

const CACHE_KEY = 'github-dev-data';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function GithubStats() {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadGithubData = async () => {
      // 1. Try to read from cache
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache: CachedData = JSON.parse(cached);
          const isExpired = Date.now() - parsedCache.timestamp > CACHE_EXPIRY;
          
          if (!isExpired) {
            setProfile(parsedCache.profile);
            setRepos(parsedCache.repos);
            if (parsedCache.totalContributions !== undefined) {
              setTotalContributions(parsedCache.totalContributions);
            }
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Cache read failed, fetching fresh data", e);
      }

      // 2. Fetch fresh data
      try {
        setLoading(true);
        setError(false);

        const profileRes = await fetch('https://api.github.com/users/SukaMCD');
        if (!profileRes.ok) throw new Error('Failed to fetch GitHub profile');
        const profileData: GithubProfile = await profileRes.json();

        const reposRes = await fetch('https://api.github.com/users/SukaMCD/repos?per_page=100&sort=updated');
        if (!reposRes.ok) throw new Error('Failed to fetch GitHub repos');
        const reposData: GithubRepo[] = await reposRes.json();

        // Filter out fork repositories to show only original works
        const originalRepos = reposData.filter(repo => !repo.fork);

        // Fetch contribution data
        let totalContriCount = 0;
        try {
          const contribRes = await fetch('https://github-contributions-api.jogruber.de/v4/SukaMCD');
          if (contribRes.ok) {
            const contribData = await contribRes.json();
            if (contribData && contribData.total) {
              totalContriCount = (Object.values(contribData.total) as any[]).reduce(
                (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
                0
              );
            }
          }
        } catch (contribErr) {
          console.error("Failed to fetch contribution count:", contribErr);
        }

        // Save to cache
        const cachePayload: CachedData = {
          timestamp: Date.now(),
          profile: profileData,
          repos: originalRepos,
          totalContributions: totalContriCount,
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

        setProfile(profileData);
        setRepos(originalRepos);
        setTotalContributions(totalContriCount);
        triggerToast('GitHub data synced successfully!', 'success');
      } catch (err) {
        console.error("GitHub API fetch error:", err);
        setError(true);
        triggerToast('GitHub rate-limit or API error', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadGithubData();
  }, []);

  // Compute stats
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  // Get top 6 repos sorted by stars
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeletons header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-bg-surface border border-border-soft rounded-2xl animate-pulse space-y-3">
              <div className="w-1/3 h-3.5 bg-silver-700 rounded-md"></div>
              <div className="w-1/2 h-6 bg-silver-600 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Skeletons repos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 bg-bg-surface border border-border-soft rounded-2xl animate-pulse h-40 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-1/4 h-3.5 bg-silver-700 rounded-md"></div>
                <div className="w-3/4 h-5 bg-silver-600 rounded-md"></div>
                <div className="w-full h-3.5 bg-silver-700 rounded-md"></div>
              </div>
              <div className="w-1/2 h-3.5 bg-silver-700 rounded-md mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-10 border border-dashed border-accent-crimson/30 bg-accent-crimson/5 rounded-2xl text-center space-y-4 select-none">
        <AlertCircleIcon className="w-8 h-8 text-accent-crimson mx-auto animate-bounce" />
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-silver-100">GitHub API Connection Error</h3>
          <p className="text-[10px] text-silver-500 max-w-md mx-auto leading-relaxed mt-1">
            Unable to connect to GitHub. This might be due to GitHub API rate limiting (60 queries/hr per IP). Please check back later or view my code directly on GitHub.
          </p>
        </div>
        <a
          href="https://github.com/SukaMCD"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root text-[10px] font-mono tracking-widest uppercase font-bold transition-all shadow-md"
        >
          <span>Visit My GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Repos */}
        <div className="p-5 bg-bg-surface border border-border-soft rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-silver-500 uppercase tracking-wider font-bold">Public Repositories</span>
            <div className="text-2xl font-black text-silver-100 font-mono tracking-tight">{profile.public_repos}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-400">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        {/* Total Stars */}
        <div className="p-5 bg-bg-surface border border-border-soft rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-silver-500 uppercase tracking-wider font-bold">Total Star Gazers</span>
            <div className="text-2xl font-black text-silver-100 font-mono tracking-tight">{totalStars}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-accent-amber">
            <Star className="w-5 h-5 fill-accent-amber/20" />
          </div>
        </div>

        {/* Total Forks */}
        <div className="p-5 bg-bg-surface border border-border-soft rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-silver-500 uppercase tracking-wider font-bold">Total Project Forks</span>
            <div className="text-2xl font-black text-silver-100 font-mono tracking-tight">{totalForks}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-300">
            <GitFork className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Top Repos List ── */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-silver-400 mb-4 select-none">
          Active GitHub Mainframes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 bg-bg-surface border border-border-soft hover:border-border-silver hover:bg-bg-hover hover:scale-[1.02] rounded-2xl flex flex-col justify-between h-44 shadow-lg transition-all duration-300 relative select-none"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-silver-500">
                    {repo.language || 'Documentation'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-silver-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h4 className="text-sm font-black text-silver-100 truncate group-hover:translate-x-1 transition-transform">
                  {repo.name}
                </h4>
                
                <p className="text-[10px] text-silver-500 leading-normal line-clamp-3">
                  {repo.description || 'No description provided for this repository.'}
                </p>
              </div>

              {/* Bottom stats indicators */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-[9px] font-mono text-silver-500 font-bold uppercase tracking-wider mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent-amber" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-silver-400" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-silver-500" />
                  <span>{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── GitHub Contribution Graph ── */}
      <div className="p-5 bg-bg-surface border border-border-soft rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-silver-100 flex items-center gap-2 flex-wrap">
              <span>GitHub Contribution Ledger</span>
              {totalContributions > 0 && (
                <span className="text-[10px] font-mono text-silver-400 font-bold normal-case tracking-normal">
                  ({totalContributions} Contributions)
                </span>
              )}
            </h3>
          </div>
          <a
            href="https://github.com/SukaMCD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8.5px] font-mono text-silver-500 hover:text-silver-300 font-bold uppercase tracking-wider bg-bg-root border border-border-subtle px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
          >
            <span>SukaMCD</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        
        {/* SVG Container */}
        <div className="w-full overflow-x-auto scrollbar-none pt-2 select-none">
          <div className="min-w-[680px] flex justify-center">
            <img 
              src="https://ghchart.rshah.org/71717a/SukaMCD" 
              alt="GitHub Contributions Calendar for SukaMCD" 
              className="w-full max-h-[110px] object-contain select-none pointer-events-none github-chart-img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Fallback error icon
function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

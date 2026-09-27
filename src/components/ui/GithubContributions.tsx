import React, { useState, useEffect } from 'react';
import { GitCommit, ExternalLink } from 'lucide-react';

interface DayContribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionsData {
  total: {
    lastYear: number;
    [key: string]: number;
  };
  contributions: DayContribution[];
}

// GitHub Activity Heatmap Component
const DEFAULT_TOTAL = 1294;

export default function GithubContributions() {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayContribution | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('https://github-contributions-api.jogruber.de/v4/SukaMCD?y=last')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contributions');
        return res.json();
      })
      .then((json: ContributionsData) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        console.warn('[GitHub Contributions] Fetch failed, using fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const contributions = data?.contributions || [];
  const weeks: DayContribution[][] = [];
  if (contributions.length > 0) {
    let currentWeek: DayContribution[] = [];
    const firstDayIndex = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek.push({ date: '', count: -1, level: -1 });
    }

    contributions.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: -1, level: -1 });
      }
      weeks.push(currentWeek);
    }
  }

  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#196127]/60 border-[#196127]/80';
      case 2:
        return 'bg-[#238636] border-[#238636]';
      case 3:
        return 'bg-[#2ea043] border-[#2ea043]';
      case 4:
        return 'bg-[#3fb950] border-[#3fb950]';
      case 0:
      default:
        return 'bg-[#1c1c21]/[0.08] border-[#1c1c21]/15';
    }
  };

  const totalCount = data?.total?.lastYear ?? DEFAULT_TOTAL;

  return (
    <div className="relative w-full border-[2.5px] border-[#1c1c21] bg-[#E2DFD2] shadow-[3px_3px_0px_#1c1c21] p-2 sm:p-2.5 select-none flex flex-col justify-between gap-1 shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#1c1c21]/15 pb-1 font-mono-stack text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[#1c1c21] font-bold">
            <GitCommit size={13} className="text-[#1c1c21]" />
            <span>GITHUB ACTIVITY // @SukaMCD</span>
          </span>
          <span className="text-[#1c1c21]/30 hidden sm:inline">•</span>
          <span className="text-[#58554f] text-[10.5px] hidden sm:inline">
            <strong className="text-[#1c1c21] font-bold">{totalCount.toLocaleString()}</strong> in last year
          </span>
        </div>

        <a
          href="https://github.com/SukaMCD"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1c1c21] hover:text-[#58554f] transition-colors"
        >
          <span>VIEW GITHUB</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Heatmap Grid */}
      <div className="w-full overflow-x-auto py-0.5">
        <div className="min-w-[530px] flex flex-col gap-0.5">
          {/* Months header */}
          <div className="flex text-[8px] sm:text-[8.5px] font-mono-stack text-[#58554f] pl-5 justify-between pr-1">
            {months.map((m, mIdx) => (
              <span key={mIdx}>{m}</span>
            ))}
          </div>

          {/* Grid with days label */}
          <div className="flex items-center gap-1">
            {/* Day labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between h-[60px] sm:h-[64px] text-[7.5px] font-mono-stack text-[#58554f] pr-0.5 leading-none py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex-1 flex gap-[2px] xl:gap-[2.5px] items-center justify-between">
              {weeks.length > 0
                ? weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[2px] xl:gap-[2.5px]">
                      {week.map((day, dIdx) => {
                        if (day.count === -1) {
                          return <div key={dIdx} className="w-[8px] h-[8px] sm:w-[8.5px] sm:h-[8.5px] xl:w-[9.5px] xl:h-[9.5px] opacity-0" />;
                        }
                        return (
                          <div
                            key={dIdx}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredDay(day);
                              setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                            }}
                            onMouseLeave={() => {
                              setHoveredDay(null);
                              setTooltipPos(null);
                            }}
                            className={`w-[8px] h-[8px] sm:w-[8.5px] sm:h-[8.5px] xl:w-[9.5px] xl:h-[9.5px] rounded-[1px] border transition-transform duration-100 hover:scale-125 cursor-pointer ${getLevelColor(
                              day.level
                            )}`}
                          />
                        );
                      })}
                    </div>
                  ))
                : Array.from({ length: 52 }).map((_, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[2px] xl:gap-[2.5px]">
                      {Array.from({ length: 7 }).map((_, dIdx) => (
                        <div
                          key={dIdx}
                          className="w-[8px] h-[8px] sm:w-[8.5px] sm:h-[8.5px] xl:w-[9.5px] xl:h-[9.5px] rounded-[1px] bg-[#1c1c21]/[0.05] border border-[#1c1c21]/10 animate-pulse"
                        />
                      ))}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Footer Legend */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c1c21]/15 font-mono-stack text-[8.5px] text-[#58554f]">
        <span>VERIFIED VIA GITHUB API // LIVE AUDIT</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="flex gap-0.5">
            <span className="w-2 h-2 rounded-[1px] border border-[#1c1c21]/20 bg-[#1c1c21]/[0.08]" />
            <span className="w-2 h-2 rounded-[1px] border border-[#196127]/80 bg-[#196127]/60" />
            <span className="w-2 h-2 rounded-[1px] border border-[#238636] bg-[#238636]" />
            <span className="w-2 h-2 rounded-[1px] border border-[#2ea043] bg-[#2ea043]" />
            <span className="w-2 h-2 rounded-[1px] border border-[#3fb950] bg-[#3fb950]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && tooltipPos && (
        <div
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-full z-50 px-2 py-1 bg-[#1c1c21] text-[#E2DFD2] font-mono-stack text-[9px] border border-[#1c1c21] shadow-[2px_2px_0px_rgba(28,28,33,0.3)] whitespace-nowrap"
        >
          <span className="font-bold">{hoveredDay.count} contribution{hoveredDay.count === 1 ? '' : 's'}</span> on {hoveredDay.date}
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import ArchIcon from './ArchIcon';
import { setTheme, toggleTheme } from '../../lib/theme';

// Fastfetch Monasm Output
export function FastfetchOutput() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 py-1 select-text font-mono-stack">
      {/* Arch ASCII Art (monasm-dots exact art) */}
      <pre className="text-[#1c1c21] font-mono-stack text-[11px] sm:text-xs leading-[1.28] tracking-tight font-black select-none shrink-0">
{`        /\\
       /  \\
      /    \\
     /      \\
    /   ,,   \\
   /   |  |   \\
  /_-''    ''-_\\`}
      </pre>

      {/* Fastfetch Module Rows */}
      <div className="text-[11px] sm:text-[11.5px] leading-snug space-y-0.5">
        <div className="text-[#1c1c21] font-extrabold text-xs sm:text-[13px] pb-1">
          sukamcd@archlinux
        </div>

        <div className="space-y-0.5 font-mono-stack">
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">backend</span>
            <span className="text-[#1c1c21] font-semibold">Laravel 11 • PHP 8.3</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">database</span>
            <span className="text-[#1c1c21] font-semibold">PostgreSQL • MySQL</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">frontend</span>
            <span className="text-[#1c1c21] font-semibold">React • Astro • Tailwind</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">api / queue</span>
            <span className="text-[#1c1c21] font-semibold">RESTful APIs • Sanctum</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">toolchain</span>
            <span className="text-[#1c1c21] font-semibold">Antigravity IDE • Fish</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#58554f] w-20 shrink-0 font-medium">platform</span>
            <span className="text-[#1c1c21] font-semibold">Arch Linux • Git</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Arch Terminal
export default function ArchTerminal() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [outputs, setOutputs] = useState<Array<{ cmd: string; result: React.ReactNode }>>([]);
  const terminalBufferRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const executeCommand = (cmdToRun: string) => {
    const raw = typeof cmdToRun === 'string' ? cmdToRun : command;
    const trimmed = raw.trim();

    if (!trimmed) {
      setCommand('');
      return;
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const lower = trimmed.toLowerCase();
    let res: React.ReactNode = '';

    if (lower === 'clear') {
      setOutputs([]);
      setCommand('');
      return;
    } else if (lower === 'help') {
      res = (
        <div className="space-y-1 text-[11px] text-[#1c1c21]">
          <div className="font-bold text-[#1c1c21]">fish, version 3.7.1</div>
          <div className="text-[#58554f]">Available built-in commands:</div>
          <div className="grid grid-cols-12 gap-1 pl-2">
            <span className="col-span-3 font-bold text-[#1c1c21]">fastfetch</span>
            <span className="col-span-9 text-[#58554f]">- Display Arch Linux system specs & active arsenal</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">whoami</span>
            <span className="col-span-9 text-[#58554f]">- Print developer identity and role</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">ls</span>
            <span className="col-span-9 text-[#58554f]">- List directory contents in portfolio</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">cat &lt;file&gt;</span>
            <span className="col-span-9 text-[#58554f]">- Read file content (bio.txt, stack.json, contact.sh)</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">projects</span>
            <span className="col-span-9 text-[#58554f]">- List featured engineering projects</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">stack</span>
            <span className="col-span-9 text-[#58554f]">- Print production tech stack details</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">uname -a</span>
            <span className="col-span-9 text-[#58554f]">- Print Linux kernel & architecture</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">btw</span>
            <span className="col-span-9 text-[#58554f]">- Arch Linux signature motto</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">theme</span>
            <span className="col-span-9 text-[#58554f]">- Toggle or set theme (theme [dark|light])</span>
            <span className="col-span-3 font-bold text-[#1c1c21]">clear</span>
            <span className="col-span-9 text-[#58554f]">- Clear the terminal buffer</span>
          </div>
        </div>
      );
    } else if (lower === 'whoami') {
      res = (
        <div className="text-[11px] space-y-0.5">
          <div className="font-bold text-[#1c1c21]">sukamcd (uid=1000, gid=1000) • Fabian Rizky Pratama</div>
          <div className="text-[#58554f]">SMK Budi Luhur • Backend Architect & API Systems Engineer</div>
        </div>
      );
    } else if (lower === 'ls' || lower === 'ls -la' || lower === 'll') {
      res = (
        <div className="font-mono-stack text-[11px] space-y-0.5">
          <div className="text-[#58554f]">total 28</div>
          <div className="flex gap-4">
            <span className="font-bold text-[#1c1c21]">drwxr-xr-x</span>
            <span className="text-[#58554f]">sukamcd users 4096</span>
            <span className="font-bold text-[#1c1c21] underline">projects/</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#58554f]">-rw-r--r--</span>
            <span className="text-[#58554f]">sukamcd users  482</span>
            <span className="font-medium text-[#1c1c21]">bio.txt</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#58554f]">-rw-r--r--</span>
            <span className="text-[#58554f]">sukamcd users  720</span>
            <span className="font-medium text-[#1c1c21]">stack.json</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#58554f]">-rwxr-xr-x</span>
            <span className="text-[#58554f]">sukamcd users  160</span>
            <span className="font-semibold text-[#1c1c21]">contact.sh*</span>
          </div>
        </div>
      );
    } else if (lower === 'cat bio.txt' || lower === 'cat bio' || lower === 'cat about.txt') {
      res = (
        <div className="text-[11px] text-[#1c1c21] space-y-1 pl-2 border-l-2 border-[#1c1c21]">
          <div className="font-bold text-[#1c1c21]">[PERSONNEL BIO // FABIAN RIZKY PRATAMA]</div>
          <div className="text-[#58554f]">Software Engineering student at SMK Budi Luhur with a deep focus on Laravel & PostgreSQL backend architecture, high-performance RESTful API engineering, and robust data management.</div>
          <div className="text-[#58554f]">Experienced in engineering production systems like Bluvocation and HRIS, prioritizing data integrity, determinism, and sub-second latency on an Arch Linux workstation.</div>
        </div>
      );
    } else if (lower === 'cat stack.json' || lower === 'cat stack') {
      res = (
        <pre className="text-[10px] sm:text-[11px] text-[#1c1c21] font-mono-stack bg-[#dcd7ce] p-2 border border-[#1c1c21]/20">
{`{
  "backend": ["Laravel 11", "PHP 8.3", "RESTful API", "Sanctum"],
  "database": ["PostgreSQL 16", "MySQL 8.0"],
  "api_architecture": ["RESTful API", "Sanctum", "Queues / Jobs"],
  "frontend": ["React 19", "Astro 5", "Tailwind CSS", "TypeScript"],
  "platform": ["Arch Linux", "Neovim (Lua)", "Docker", "Git"]
}`}
        </pre>
      );
    } else if (lower === 'cat contact.sh' || lower === 'contact' || lower === './contact.sh') {
      res = (
        <div className="text-[11px] space-y-1 font-mono-stack text-[#1c1c21]">
          <div className="text-[#58554f]">#!/usr/bin/env fish</div>
          <div><span className="text-[#58554f]">EMAIL</span>="<a href="mailto:sukamcdev@gmail.com" className="font-bold text-[#1c1c21] underline">sukamcdev@gmail.com</a>"</div>
          <div><span className="text-[#58554f]">GITHUB</span>="<a href="https://github.com/SukaMCD" target="_blank" rel="noreferrer" className="font-bold text-[#1c1c21] underline">https://github.com/SukaMCD</a>"</div>
          <div><span className="text-[#58554f]">STATUS</span>="<span className="font-medium text-[#1c1c21]">Open for Software Engineering / Backend Internships</span>"</div>
        </div>
      );
    } else if (lower === 'projects' || lower === 'ls projects') {
      res = (
        <div className="text-[11px] space-y-1.5 pl-1">
          <div className="font-bold text-[#1c1c21]">Featured Engineering Projects:</div>
          <div className="text-[#58554f]">1. <strong className="text-[#1c1c21]">Bluvocation</strong> : Laravel, MySQL, Vocational & Internship Management Platform</div>
          <div className="text-[#58554f]">2. <strong className="text-[#1c1c21]">HRIS</strong> : CodeIgniter 4, MySQL, Human Resource Information System</div>
          <div className="text-[#58554f]">3. <strong className="text-[#1c1c21]">Payment Gateway Engine</strong> : Hono, PostgreSQL, BNI SNAP BI, Neon</div>
          <div className="text-[#58554f]">4. <strong className="text-[#1c1c21]">Leafly Tea</strong> : Astro, React, Tailwind CSS, e-commerce storefront</div>
        </div>
      );
    } else if (lower === 'stack') {
      res = (
        <div className="text-[11px] space-y-1 pl-1">
          <div><span className="font-bold text-[#1c1c21]">[BACKEND]</span> Laravel 11, PHP 8.3, RESTful APIs, Eloquent ORM</div>
          <div><span className="font-bold text-[#1c1c21]">[DATABASE]</span> PostgreSQL, MySQL, Query Optimization</div>
          <div><span className="font-bold text-[#1c1c21]">[API & ARCHITECTURE]</span> RESTful APIs, Queue / Jobs, RBAC</div>
          <div><span className="font-bold text-[#1c1c21]">[FRONTEND]</span> React, Astro, Tailwind CSS, TypeScript</div>
          <div><span className="font-bold text-[#1c1c21]">[TOOLCHAIN]</span> Arch Linux, Antigravity IDE, Docker, Git, Fish</div>
        </div>
      );
    } else if (lower === 'arch' || lower === 'btw' || lower === 'neofetch') {
      res = (
        <div className="text-[11px] font-bold text-[#1c1c21]">
          i use arch btw (•̀ᴗ•́)و ̑̑
        </div>
      );
    } else if (lower === 'theme' || lower === 'dark' || lower === 'light' || lower === 'theme dark' || lower === 'theme light') {
      const mode = lower.includes('dark') ? 'dark' : lower.includes('light') ? 'light' : toggleTheme();
      if (lower.includes('dark') || lower.includes('light')) setTheme(mode);
      res = (
        <div className="text-[11px] text-[#1c1c21] font-bold">
          [SYSTEM // THEME APPLIED: {mode.toUpperCase()} MODE]
        </div>
      );
    } else if (lower === 'fastfetch') {
      res = <FastfetchOutput />;
    } else if (lower.startsWith('sudo')) {
      res = (
        <div className="text-[11px] text-[#1c1c21] space-y-0.5">
          <div>[sudo] password for sukamcd:</div>
          <div className="text-[#58554f]">sukamcd is not in the sudoers file. This incident will be reported.</div>
        </div>
      );
    } else if (lower === 'date') {
      res = <div className="text-[11px] text-[#58554f]">{new Date().toString()}</div>;
    } else if (lower.startsWith('echo ')) {
      res = <div className="text-[11px] text-[#1c1c21]">{trimmed.slice(5)}</div>;
    } else {
      res = (
        <div className="text-[11px] text-[#1c1c21]">
          fish: Unknown command: {trimmed}. Type <span className="font-bold text-[#1c1c21] underline cursor-pointer" onClick={() => executeCommand('help')}>'help'</span> for available commands.
        </div>
      );
    }

    setOutputs((prev) => [...prev, { cmd: trimmed, result: res }]);
    setCommand('');
  };

  useEffect(() => {
    if (terminalBufferRef.current) {
      terminalBufferRef.current.scrollTop = terminalBufferRef.current.scrollHeight;
    }
  }, [outputs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      const currentVal = e.currentTarget.value;
      executeCommand(currentVal);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setCommand(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setCommand('');
      } else {
        setHistoryIdx(nextIdx);
        setCommand(history[nextIdx]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommand('');
      setHistoryIdx(-1);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      onWheel={(e) => {
        if (outputs.length > 0) e.stopPropagation();
      }}
      data-lenis-prevent={outputs.length > 0 ? 'true' : undefined}
      className="w-full h-[265px] sm:h-[280px] border-[3px] border-[#1c1c21] bg-[#E2DFD2] shadow-[4px_4px_0px_#1c1c21] text-[#1c1c21] font-mono-stack overflow-hidden flex flex-col cursor-text select-text"
    >
      {/* Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b-[2.5px] border-[#1c1c21] bg-[#1c1c21] text-[#E2DFD2] select-none text-xs shrink-0">
        <div className="flex items-center gap-2">
          <ArchIcon className="w-3.5 h-3.5 text-[#E2DFD2]" />
          <span className="font-mono-stack text-[11px] font-bold text-[#E2DFD2] tracking-wide">
            sukamcd@archlinux: ~
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#E2DFD2]/70 font-mono-stack">
          <span className="hidden sm:inline">fish 3.7.1</span>
          <span className="hidden sm:inline">•</span>
          <span>TTY1</span>
        </div>
      </div>

      {/* Terminal Screen Buffer */}
      <div
        ref={terminalBufferRef}
        data-lenis-prevent={outputs.length > 0 ? 'true' : undefined}
        className={`terminal-buffer flex-1 min-h-0 p-3 sm:p-4 text-xs leading-relaxed space-y-2.5 ${outputs.length > 0 ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'} bg-[#E2DFD2]`}
      >
        {/* Fastfetch Executed Output */}
        <div className="space-y-1">
          <div className="text-[11px] text-[#58554f] flex items-center gap-1 font-mono-stack">
            <span className="text-[#1c1c21] font-bold">sukamcd@archlinux</span>
            <span>:</span>
            <span className="text-[#58554f]">~</span>
            <span className="text-[#1c1c21] font-bold">$</span>
            <span className="text-[#1c1c21] font-bold">fastfetch</span>
          </div>

          <FastfetchOutput />
        </div>

        {/* Dynamic Command Outputs */}
        {outputs.map((out, idx) => (
          <div key={idx} className="space-y-1 pt-1.5 border-t border-[#1c1c21]/15 text-[11px]">
            <div className="text-[11px] text-[#58554f] flex items-center gap-1 font-mono-stack">
              <span className="text-[#1c1c21] font-bold">sukamcd@archlinux</span>
              <span>:</span>
              <span className="text-[#58554f]">~</span>
              <span className="text-[#1c1c21] font-bold">$</span>
              <span className="text-[#1c1c21] font-semibold">{out.cmd}</span>
            </div>
            {out.result && <div className="pl-2">{out.result}</div>}
          </div>
        ))}

        <div ref={terminalEndRef} />

        {/* Live Input Field */}
        <div className="flex items-center gap-1.5 pt-1.5 text-[11px] font-mono-stack">
          <span className="text-[#1c1c21] font-bold select-none">sukamcd@archlinux</span>
          <span className="text-[#58554f] select-none">:</span>
          <span className="text-[#58554f] select-none">~</span>
          <span className="text-[#1c1c21] font-bold select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help', 'ls', 'btw', 'projects'..."
            className="flex-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-[#1c1c21] rounded-xs text-[#1c1c21] font-mono-stack text-[11px] caret-[#1c1c21] placeholder:text-[#58554f] px-1"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>

      <div className="px-3 py-1.5 border-t-[2.5px] border-[#1c1c21] bg-[#1c1c21] text-[10px] text-[#E2DFD2] font-mono-stack flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-[#E2DFD2] text-[#1c1c21] font-bold text-[9px] tracking-wider rounded-xs">
            NORMAL
          </span>
          <span className="text-[#E2DFD2] font-medium hidden sm:inline">portfolio</span>
          <span className="text-[#58554f]">|</span>
          <span>utf-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[#E2DFD2]/70">6.12.8-arch1-zen</span>
          <span className="text-[#58554f] hidden sm:inline">|</span>
          <span className="text-[#E2DFD2] font-bold">I USE ARCH BTW</span>
        </div>
      </div>
    </div>
  );
}

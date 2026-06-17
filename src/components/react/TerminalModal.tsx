import React, { useEffect, useRef, useState } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { triggerToast } from './GooeyToast';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [logs, setLogs] = useState<CommandLog[]>([
    { text: 'SukaMCD Terminal v4.0.0', type: 'success' },
    { text: 'Secure session established.', type: 'output' },
    { text: "Type 'help' to see list of available commands.", type: 'output' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim().toLowerCase();
    if (!command) return;

    const newLogs = [...logs, { text: `sukamcd:~$ ${inputValue}`, type: 'input' as const }];
    setInputValue('');

    const addLog = (text: string, type: CommandLog['type'] = 'output') => {
      newLogs.push({ text, type });
    };

    switch (command) {
      case 'help':
        addLog('Available commands:');
        addLog('  help       - Show available commands');
        addLog('  clear      - Clear terminal logs');
        addLog('  about      - Display about description');
        addLog('  projects   - Show catalog list of featured projects');
        addLog('  dino       - Access the hidden retro dinosaur game');
        addLog('  exit       - Close terminal');
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'about':
        addLog('Fabian Rizky Pratama - Software Engineer & Web Developer');
        addLog('Rekayasa Perangkat Lunak - SMK Budi Luhur');
        addLog('Focusing on Laravel, PHP, PostgreSQL, Flutter, Dart, and Godot.');
        break;
      case 'projects':
        addLog('Featured Projects:');
        addLog('  - Leafly Tea (PHP/MySQL E-Commerce)');
        addLog('  - Lost Formula (Godot Engine Game)');
        addLog('  - Web App Kegiatan Guru (PHP/PostgreSQL Portal)');
        addLog('  - Kedai Cendana (Laravel/Filament/PostgreSQL)');
        addLog('  - Instagram Clone (Flutter/Dart app)');
        addLog('  - Website Manajemen Sekolah (WordPress CMS)');
        break;
      case 'dino':
        addLog('Bypassing security protocols...', 'success');
        addLog('Access key granted. Redirecting to dinosaur game...', 'success');
        triggerToast('Bypass key Dino active! Redirecting...', 'success');
        sessionStorage.setItem('_0xd1n0_4cc3ss', 'v4l1d_' + Date.now());
        setTimeout(() => {
          window.location.href = '/x7r4w2/v7b2m9';
        }, 1200);
        break;
      case 'exit':
        onClose();
        return;
      default:
        addLog(`sukamcd: command not found: '${command}'. Type 'help' for usage.`, 'error');
    }

    setLogs(newLogs);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px] relative transition-colors duration-300">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-soft select-none transition-colors duration-300">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-silver-400" />
            <span className="text-xs font-mono font-bold text-silver-200 tracking-wide">
              sukamcd@terminal:~
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-silver-500 hover:text-silver-100 transition-colors cursor-pointer"
            aria-label="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CRT Scanline and Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.01] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]"></div>

        {/* Logs terminal area */}
        <div 
          className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-bg-root transition-colors duration-300"
          onClick={() => inputRef.current?.focus()}
        >
          {logs.map((log, index) => {
            let color = 'text-silver-400';
            if (log.type === 'input') color = 'text-silver-100 font-bold';
            if (log.type === 'error') color = 'text-accent-crimson';
            if (log.type === 'success') color = 'text-accent-emerald font-bold';
            
            return (
              <div key={index} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                {log.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Command Form Input */}
        <form onSubmit={handleCommand} className="flex items-center px-4 py-3 bg-bg-elevated border-t border-border-soft font-mono text-xs transition-colors duration-300">
          <span className="text-accent-emerald mr-2 select-none font-bold">sukamcd:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-silver-100 font-mono caret-accent-emerald"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}

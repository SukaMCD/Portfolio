import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2, AlertCircle, User, FolderKanban, FileText, ChevronDown } from 'lucide-react';
import { triggerToast } from './GooeyToast';

export default function TicketContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_i0zo3zo',
          template_id: 'template_m8ajqzd',
          user_id: 'U85vb-TLi4QCplmwy',
          template_params: {
            name,
            email,
            subject,
            priority: 'MEDIUM',
            message,
          },
        }),
      });

      if (response.ok) {
        setStatus('success');
        triggerToast('Support Ticket sent successfully!', 'success');
        setName('');
        setEmail('');
        setMessage('');
        setSubject('General Inquiry');
      } else {
        throw new Error('Response from EmailJS was not OK');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      triggerToast('Failed to send Ticket. Please try again.', 'error');
    }
  };

  return (
    <div className="w-full min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-7.625rem)] p-6 bg-bg-surface border border-border-soft rounded-2xl shadow-xl hover:border-border-silver transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-6 select-none shrink-0">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-soft flex items-center justify-center text-silver-300 shadow-md">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-silver-100">
            Open Support Ticket
          </h2>
          <p className="text-[10px] font-mono text-silver-500 uppercase tracking-wider mt-0.5">
            Submit a direct query or project request
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 animate-[fadeIn_0.5s_ease_forwards] select-none">
          <div className="w-16 h-16 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-silver-100">
              Ticket Opened Successfully
            </h3>
            <p className="text-[11px] text-silver-500 max-w-sm mt-1 mx-auto leading-relaxed">
              Thank you for opening a ticket. I will respond to your email address within 24 hours.
            </p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="px-5 py-2.5 rounded-xl border border-border-soft hover:border-silver-500 text-[10px] font-mono tracking-widest uppercase font-bold text-silver-400 hover:text-silver-100 cursor-pointer transition-all"
          >
            Create New Ticket
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between gap-6">
          <div className="flex-grow flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 shrink-0">
              {/* Name input */}
              <div className="space-y-1.5">
                <label htmlFor="client-name" className="text-[9.5px] font-mono uppercase tracking-wider text-silver-400 font-bold select-none">
                  Client Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 pointer-events-none" />
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-root border border-border-soft focus:border-silver-400 text-xs text-silver-100 placeholder-silver-600 outline-none transition-all focus:bg-bg-root/50"
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="space-y-1.5">
                <label htmlFor="email-address" className="text-[9.5px] font-mono uppercase tracking-wider text-silver-400 font-bold select-none">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 pointer-events-none" />
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-root border border-border-soft focus:border-silver-400 text-xs text-silver-100 placeholder-silver-600 outline-none transition-all focus:bg-bg-root/50"
                  />
                </div>
              </div>
            </div>

            {/* Subject/Topic */}
            <div className="space-y-1.5 shrink-0">
              <label htmlFor="project-category" className="text-[9.5px] font-mono uppercase tracking-wider text-silver-400 font-bold select-none">
                Project Category
              </label>
              <div className="relative">
                <FolderKanban className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 pointer-events-none" />
                <select
                  id="project-category"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-bg-root border border-border-soft focus:border-silver-400 text-xs text-silver-100 outline-none transition-all focus:bg-bg-root/50 appearance-none cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="E-Commerce Website">E-Commerce Development</option>
                  <option value="Custom Web App">Web Application</option>
                  <option value="Game Development">Game Dev (Godot)</option>
                  <option value="Mobile App">Mobile App (Flutter/Dart)</option>
                  <option value="WordPress Maintenance">WordPress / CMS</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 pointer-events-none" />
              </div>
            </div>

            {/* Message textarea (stretches to fill remaining height) */}
            <div className="space-y-1.5 flex-grow flex flex-col">
              <label htmlFor="ticket-description" className="text-[9.5px] font-mono uppercase tracking-wider text-silver-400 font-bold select-none shrink-0">
                Ticket Description
              </label>
              <div className="relative flex-grow flex">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-silver-500 pointer-events-none" />
                <textarea
                  id="ticket-description"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project requirements or question here..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-root border border-border-soft focus:border-silver-400 text-xs text-silver-100 placeholder-silver-600 outline-none transition-all focus:bg-bg-root/50 resize-none flex-grow min-h-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Submit button (always anchored to the bottom of the card) */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-border-soft gap-4 shrink-0">
            <div className="flex items-center gap-2 text-[10px] text-silver-500 font-mono select-none">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>or reach me at{' '}
                <a href="mailto:dev@sukamcd.tech" className="text-silver-300 hover:text-silver-100 underline underline-offset-2 transition-colors">
                  dev@sukamcd.tech
                </a>
              </span>
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-silver-100 hover:bg-silver-200 text-bg-root font-black uppercase text-[10px] font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all select-none"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <span>Submit Ticket</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

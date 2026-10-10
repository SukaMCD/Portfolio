import React, { useState } from 'react';
import { ArrowUpRight, CornerUpLeft } from 'lucide-react';
import ArchIcon from '../ui/ArchIcon';

// Contact Section
export default function ContactSection({
  onNavigateExperience,
}: {
  onNavigateExperience?: () => void;
}) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSending(true);
    setErrorMsg(null);

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      // Fallback: Opens mail client with prefilled transmission so message is never lost
      const subject = encodeURIComponent(`Transmission from ${formState.name} (Portfolio)`);
      const body = encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
      );
      window.location.href = `mailto:sukamcdev@gmail.com?subject=${subject}&body=${body}`;
      setSending(false);
      setSent(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 4500);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Transmission from Portfolio: ${formState.name}`,
          from_name: 'Fabian Portfolio Dispatcher',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4500);
      } else {
        throw new Error(data.message || 'Gateway rejected transmission');
      }
    } catch (err: any) {
      console.error('Contact transmission failed:', err);
      setErrorMsg(err.message || 'Transmission failed. Please use direct email below.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-90 w-full h-screen min-h-160 max-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 bg-[#1c1c21] border-t-[3px] border-[#E2DFD2]/20 overflow-hidden"
    >
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* Header */}
      <header className="w-full flex items-center justify-between pb-2.5 border-b border-[#E2DFD2]/10 gap-3 shrink-0">
        <div className="flex items-center gap-2.5 font-mono-stack text-xs">
          <span className="px-2.5 py-1 bg-[#E2DFD2] text-[#1c1c21] font-semibold tracking-wider text-[11px]">
            TRANSMISSION // 05
          </span>
          <span className="text-[#E2DFD2]/65 text-[11px] sm:text-xs">OPEN CHANNEL</span>
        </div>
        <div className="flex items-center gap-2.5 font-mono-stack text-[10.5px] text-[#E2DFD2]/60">
          <span className="hidden sm:flex items-center gap-1.5">
            <ArchIcon className="w-3 h-3 text-[#E2DFD2]/60" />
            sukamcd@archlinux:~$
          </span>
          <span className="text-[#E2DFD2]/40">|</span>
          <span>UTC+7 // WIB</span>
        </div>
      </header>

      <div className="flex-1 min-h-0 py-3 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
        <div className="flex flex-col justify-between h-full gap-5">
          <div>
            <h2 className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.04em] text-[#E2DFD2] text-[11vw] sm:text-[7.5vw] lg:text-[5.5vw] xl:text-[5.2vw]">
              Let&apos;s<br />
              <span className="font-light italic text-[#E2DFD2]/60">build</span><br />
              together.
            </h2>
            <p className="mt-3.5 font-mono-stack text-[11px] sm:text-xs text-[#E2DFD2]/70 leading-relaxed max-w-sm">
              Available for freelance work, collab, and full-time roles.
            </p>
          </div>
          <div className="space-y-0 border-t border-[#E2DFD2]/15">
            <a
              href="mailto:sukamcdev@gmail.com"
              className="flex items-center justify-between py-2.5 border-b border-[#E2DFD2]/15 group hover:border-[#E2DFD2]/40 transition-colors"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  Email
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  sukamcdev@gmail.com
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
            <a
              href="tel:+6288905588200"
              className="flex items-center justify-between py-2.5 border-b border-[#E2DFD2]/15 group hover:border-[#E2DFD2]/40 transition-colors"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  Phone
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  +62 889-0558-8200
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
            <a
              href="https://github.com/SukaMCD"
              target="_blank" rel="noreferrer"
              className="flex items-center justify-between py-2.5 border-b border-[#E2DFD2]/15 group hover:border-[#E2DFD2]/40 transition-colors"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  GitHub
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  @SukaMCD
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
            <a
              href="https://www.linkedin.com/in/fabianrizkypratama/"
              target="_blank" rel="noreferrer"
              className="flex items-center justify-between py-2.5 border-b border-[#E2DFD2]/15 group hover:border-[#E2DFD2]/40 transition-colors"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  LinkedIn
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  fabianrizkypratama
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
            <a
              href="https://www.instagram.com/sukamcd.dev"
              target="_blank" rel="noreferrer"
              className="flex items-center justify-between py-2.5 border-b border-[#E2DFD2]/15 group hover:border-[#E2DFD2]/40 transition-colors"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  Instagram
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  @sukamcd.dev
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
            <a
              href="/Fabian_Rizky_Pratama_CV.pdf"
              download="Fabian_Rizky_Pratama_CV.pdf"
              className="flex items-center justify-between py-2.5 group"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <span className="font-mono-stack text-[9.5px] text-[#E2DFD2]/60 tracking-widest uppercase w-20 sm:w-24 shrink-0">
                  Resume / CV
                </span>
                <span className="font-mono-stack text-xs sm:text-[13px] text-[#E2DFD2]/90 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 transition-all truncate">
                  Download PDF
                </span>
              </div>
              <ArrowUpRight size={13} className="text-[#E2DFD2]/50 group-hover:text-[#E2DFD2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between h-full">
          {sent ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="font-mono-stack text-[9.5px] tracking-widest text-[#E2DFD2]/60 uppercase mb-4">// transmission // confirmed</div>
              <p className="font-display font-extrabold uppercase text-3xl sm:text-4xl leading-tight tracking-[-0.03em] text-[#E2DFD2]">
                Message<br />dispatched.
              </p>
              <p className="mt-3 font-mono-stack text-[11px] text-[#E2DFD2]/70 max-w-sm">
                Your message has been forwarded to <span className="text-[#E2DFD2] font-bold">sukamcdev@gmail.com</span>. Will get back to you within 24-48h.
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
                <div className="space-y-0 border-t border-[#E2DFD2]/15">
                  <div className="py-3 border-b border-[#E2DFD2]/15">
                    <label htmlFor="contact-name" className="font-mono-stack text-[9px] text-[#E2DFD2]/65 tracking-widest uppercase block mb-1.5">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                      required
                      placeholder="your name"
                      className="w-full bg-transparent font-mono-stack text-sm text-[#E2DFD2] placeholder:text-[#E2DFD2]/45 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E2DFD2] rounded-xs px-1 transition-colors"
                    />
                  </div>
                  <div className="py-3 border-b border-[#E2DFD2]/15">
                    <label htmlFor="contact-email" className="font-mono-stack text-[9px] text-[#E2DFD2]/65 tracking-widest uppercase block mb-1.5">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-transparent font-mono-stack text-sm text-[#E2DFD2] placeholder:text-[#E2DFD2]/45 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E2DFD2] rounded-xs px-1 transition-colors"
                    />
                  </div>
                  <div className="py-3 border-b border-[#E2DFD2]/15">
                    <label htmlFor="contact-message" className="font-mono-stack text-[9px] text-[#E2DFD2]/65 tracking-widest uppercase block mb-1.5">Message</label>
                    <textarea
                      id="contact-message"
                      value={formState.message}
                      onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                      required
                      rows={4}
                      placeholder="what do you want to build..."
                      className="w-full bg-transparent font-mono-stack text-sm text-[#E2DFD2] placeholder:text-[#E2DFD2]/45 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E2DFD2] rounded-xs px-1 transition-colors resize-none"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-900/30 border border-red-500/40 font-mono-stack text-[11px] text-red-200 space-y-1">
                    <div className="font-bold">TRANSMISSION_ERROR: {errorMsg}</div>
                    <div>
                      <a
                        href={`mailto:sukamcdev@gmail.com?subject=${encodeURIComponent(`Transmission from ${formState.name}`)}&body=${encodeURIComponent(formState.message)}`}
                        className="underline text-[#E2DFD2] hover:text-white"
                      >
                        Click here to dispatch directly via email client &rarr;
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-[#E2DFD2] text-[#1c1c21] font-mono-stack text-[11px] font-bold tracking-widest uppercase hover:bg-[#E2DFD2]/90 active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer"
                >
                  <span>{sending ? 'DISPATCHING TRANSMISSION...' : 'SEND MESSAGE'}</span>
                  {sending ? (
                    <span className="w-3.5 h-3.5 border-[1.5px] border-[#1c1c21]/20 border-t-[#1c1c21] rounded-full animate-spin" />
                  ) : (
                    <ArrowUpRight size={15} />
                  )}
                </button>
              </form>

              {/* Bottom Quote */}
              <div className="flex flex-col justify-end mt-auto">
                <p className="font-display font-extrabold uppercase text-[#E2DFD2]/15 leading-[0.85] tracking-[-0.04em] text-[7vw] sm:text-[4.8vw] lg:text-[3.4vw] xl:text-[3.6vw] select-none">
                  Good code<br />is its own<br /><span className="font-light italic text-[#E2DFD2]/25">documentation.</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between pt-2 border-t border-[#E2DFD2]/10 font-mono-stack text-[10px] sm:text-[11px] text-[#E2DFD2]/25 shrink-0">
        <div>FABIAN RIZKY PRATAMA // 2025</div>
        <div>
          {onNavigateExperience && (
            <button
              type="button"
              onClick={onNavigateExperience}
              className="flex items-center gap-1.5 hover:text-[#E2DFD2]/55 transition-colors cursor-pointer"
            >
              <CornerUpLeft size={10} />
              SERVICE RECORD
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}

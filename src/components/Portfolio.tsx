import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import InteractiveBackground from './ui/InteractiveBackground';
import SiteNav from './ui/SiteNav';
import ThemeTransition from './ui/ThemeTransition';
import HeroSection from './sections/HeroSection';
import DossierSection from './sections/DossierSection';
import WorksSection from './sections/WorksSection';
import CredentialsSection from './sections/CredentialsSection';
import ExperienceSection from './sections/ExperienceSection';
import ContactSection from './sections/ContactSection';

const MemoHeroSection = React.memo(HeroSection);
const MemoDossierSection = React.memo(DossierSection);
const MemoWorksSection = React.memo(WorksSection);
const MemoCredentialsSection = React.memo(CredentialsSection);
const MemoExperienceSection = React.memo(ExperienceSection);
const MemoContactSection = React.memo(ContactSection);

// Root Component
export default function Portfolio() {
  const heroRef = useRef<HTMLDivElement>(null);
  const worksTabRef = useRef<HTMLDivElement>(null);
  const credentialsTabRef = useRef<HTMLDivElement>(null);
  const experienceTabRef = useRef<HTMLDivElement>(null);
  const contactTabRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    const updateScrollEffects = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;

      const dossierEl = document.getElementById('dossier');
      const worksEl = document.getElementById('works');
      const credsEl = document.getElementById('credentials');
      const expEl = document.getElementById('experience');
      const contactEl = document.getElementById('contact');

      if (!dossierEl) return;

      const dossierRect = dossierEl.getBoundingClientRect();
      const worksRect = worksEl ? worksEl.getBoundingClientRect() : null;
      const credsRect = credsEl ? credsEl.getBoundingClientRect() : null;
      const expRect = expEl ? expEl.getBoundingClientRect() : null;
      const contactRect = contactEl ? contactEl.getBoundingClientRect() : null;

      // Hero transition
      const rawProgress = (vh - dossierRect.top) / vh;
      const progress = Math.max(0, Math.min(1, rawProgress));
      if (heroRef.current) {
        heroRef.current.style.transform = `scale(${1 - progress * 0.05}) translateY(${progress * 24}px)`;
        heroRef.current.style.opacity = `${1 - progress * 0.4}`;
      }

      // Tabs positioning
      const tabVisibleHeight = 31;
      const restingTop = scrollY < 5
        ? dossierRect.top - tabVisibleHeight
        : vh - tabVisibleHeight;

      if (worksTabRef.current && worksRect) {
        worksTabRef.current.style.transform = `translate3d(0, ${Math.min(restingTop, worksRect.top - tabVisibleHeight)}px, 0)`;
      }
      if (credentialsTabRef.current && credsRect) {
        credentialsTabRef.current.style.transform = `translate3d(0, ${Math.min(restingTop, credsRect.top - tabVisibleHeight)}px, 0)`;
      }
      if (experienceTabRef.current && expRect) {
        experienceTabRef.current.style.transform = `translate3d(0, ${Math.min(restingTop, expRect.top - tabVisibleHeight)}px, 0)`;
      }
      if (contactTabRef.current && contactRect) {
        contactTabRef.current.style.transform = `translate3d(0, ${Math.min(restingTop, contactRect.top - tabVisibleHeight)}px, 0)`;
      }

      // Navigation states (guarded against redundant state re-renders)
      const nextNavVisible = scrollY > vh * 0.1;
      setNavVisible((prev) => (prev !== nextNavVisible ? nextNavVisible : prev));

      const nextScrollPct = maxScroll > 0 ? Math.round((scrollY / maxScroll) * 100) : 0;
      setScrollPct((prev) => (prev !== nextScrollPct ? nextScrollPct : prev));

      let nextSec = 0;
      if (dossierRect.top > vh * 0.45) nextSec = 0;
      else if (worksRect && worksRect.top > vh * 0.45) nextSec = 1;
      else if (credsRect && credsRect.top > vh * 0.45) nextSec = 2;
      else if (expRect && expRect.top > vh * 0.45) nextSec = 3;
      else if (contactRect && contactRect.top > vh * 0.45) nextSec = 4;
      else nextSec = 5;

      setActiveSection((prev) => (prev !== nextSec ? nextSec : prev));
    };

    lenis.on('scroll', updateScrollEffects);

    const updateTabHorizontalPositions = () => {
      const dossierTabEl = document.getElementById('dossier-tab');
      if (!dossierTabEl || !worksTabRef.current || !credentialsTabRef.current || !experienceTabRef.current || !contactTabRef.current) return;

      const gap = 5;
      const dossierTabRect = dossierTabEl.getBoundingClientRect();
      const worksLeft = Math.round(dossierTabRect.right + gap);
      worksTabRef.current.style.left = `${worksLeft}px`;

      const worksWidth = worksTabRef.current.getBoundingClientRect().width;
      const credsLeft = Math.round(worksLeft + worksWidth + gap);
      credentialsTabRef.current.style.left = `${credsLeft}px`;

      const credsWidth = credentialsTabRef.current.getBoundingClientRect().width;
      const expLeft = Math.round(credsLeft + credsWidth + gap);
      experienceTabRef.current.style.left = `${expLeft}px`;

      const expWidth = experienceTabRef.current.getBoundingClientRect().width;
      const contactLeft = Math.round(expLeft + expWidth + gap);
      contactTabRef.current.style.left = `${contactLeft}px`;
    };

    const getActiveSection = (): number => {
      const dossierEl = document.getElementById('dossier');
      const worksEl = document.getElementById('works');
      const credsEl = document.getElementById('credentials');
      const expEl = document.getElementById('experience');
      const contactEl = document.getElementById('contact');
      if (!dossierEl) return 0;

      const dossierTop = dossierEl.getBoundingClientRect().top;
      const worksTop = worksEl ? worksEl.getBoundingClientRect().top : 9999;
      const credsTop = credsEl ? credsEl.getBoundingClientRect().top : 9999;
      const expTop = expEl ? expEl.getBoundingClientRect().top : 9999;
      const contactTop = contactEl ? contactEl.getBoundingClientRect().top : 9999;
      const vh = window.innerHeight;

      if (dossierTop > vh * 0.45) return 0;
      if (worksTop > vh * 0.45) return 1;
      if (credsTop > vh * 0.45) return 2;
      if (expTop > vh * 0.45) return 3;
      if (contactTop > vh * 0.45) return 4;
      return 5;
    };

    const goToSection = (sectionIndex: number) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      let target: string | number = 0;
      if (sectionIndex === 1) target = '#dossier';
      else if (sectionIndex === 2) target = '#works';
      else if (sectionIndex === 3) target = '#credentials';
      else if (sectionIndex === 4) target = '#experience';
      else if (sectionIndex === 5) target = '#contact';
      else target = 0;

      lenis.scrollTo(target, {
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 240);
        },
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 1200);
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-lenis-prevent="true"]')) {
        return;
      }

      if (isAnimatingRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (Math.abs(e.deltaY) < 6) return;

      const section = getActiveSection();

      if (section === 0) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(1);
        } else {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        return;
      }

      if (section === 1) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(2);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(0);
        }
        return;
      }

      if (section === 2) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(3);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(1);
        }
        return;
      }

      if (section === 3) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(4);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(2);
        }
        return;
      }

      if (section === 4) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(5);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(3);
        }
        return;
      }

      if (section === 5) {
        if (e.deltaY < 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          goToSection(4);
        } else {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        return;
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-lenis-prevent="true"]')) return;

      const section = getActiveSection();
      if (section >= 0 && section <= 5) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-lenis-prevent="true"]')) return;
      if (isAnimatingRef.current) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      if (Math.abs(deltaY) < 25 || Math.abs(deltaY) < Math.abs(deltaX)) return;

      const section = getActiveSection();

      if (section === 0) {
        if (deltaY > 0) goToSection(1);
      } else if (section === 1) {
        if (deltaY > 0) goToSection(2);
        else if (deltaY < 0) goToSection(0);
      } else if (section === 2) {
        if (deltaY > 0) goToSection(3);
        else if (deltaY < 0) goToSection(1);
      } else if (section === 3) {
        if (deltaY > 0) goToSection(4);
        else if (deltaY < 0) goToSection(2);
      } else if (section === 4) {
        if (deltaY > 0) goToSection(5);
        else if (deltaY < 0) goToSection(3);
      } else if (section === 5) {
        if (deltaY < 0) goToSection(4);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      if (isAnimatingRef.current) return;

      const section = getActiveSection();

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (section === 0) {
          e.preventDefault();
          goToSection(1);
        } else if (section === 1) {
          e.preventDefault();
          goToSection(2);
        } else if (section === 2) {
          e.preventDefault();
          goToSection(3);
        } else if (section === 3) {
          e.preventDefault();
          goToSection(4);
        } else if (section === 4) {
          e.preventDefault();
          goToSection(5);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (section === 1) {
          e.preventDefault();
          goToSection(0);
        } else if (section === 2) {
          e.preventDefault();
          goToSection(1);
        } else if (section === 3) {
          e.preventDefault();
          goToSection(2);
        } else if (section === 4) {
          e.preventDefault();
          goToSection(3);
        } else if (section === 5) {
          e.preventDefault();
          goToSection(4);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    const handleResize = () => {
      updateScrollEffects();
      updateTabHorizontalPositions();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    updateScrollEffects();
    updateTabHorizontalPositions();
    requestAnimationFrame(updateTabHorizontalPositions);
    if ('fonts' in document) {
      document.fonts.ready.then(updateTabHorizontalPositions);
    }

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      updateScrollEffects();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', handleWheel, { capture: true } as any);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  const smoothNavigateTo = (target: string | number) => {
    isAnimatingRef.current = true;
    const onDone = () => {
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 240);
    };

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: onDone,
      });
    } else {
      if (typeof target === 'string') {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
      onDone();
    }
  };

  const handleNavigateHero = useCallback(() => {
    setActiveSection(0);
    smoothNavigateTo(0);
  }, []);
  const handleNavigateDossier = useCallback(() => {
    setActiveSection(1);
    smoothNavigateTo('#dossier');
  }, []);
  const handleNavigateWorks = useCallback(() => {
    setActiveSection(2);
    smoothNavigateTo('#works');
  }, []);
  const handleNavigateCredentials = useCallback(() => {
    setActiveSection(3);
    smoothNavigateTo('#credentials');
  }, []);
  const handleNavigateExperience = useCallback(() => {
    setActiveSection(4);
    smoothNavigateTo('#experience');
  }, []);
  const handleNavigateContact = useCallback(() => {
    setActiveSection(5);
    smoothNavigateTo('#contact');
  }, []);

  return (
    <div className="relative min-h-screen text-[#1c1c21] bg-[#E2DFD2]">
      <ThemeTransition />
      <InteractiveBackground />
      <SiteNav
        visible={navVisible}
        scrollPct={scrollPct}
        activeSection={activeSection}
        onNavigateHero={handleNavigateHero}
        onNavigateDossier={handleNavigateDossier}
        onNavigateWorks={handleNavigateWorks}
        onNavigateCredentials={handleNavigateCredentials}
        onNavigateExperience={handleNavigateExperience}
        onNavigateContact={handleNavigateContact}
      />

      <div ref={heroRef} className="sticky top-0 z-0 h-screen min-h-170 w-full overflow-hidden will-change-transform origin-top">
        <MemoHeroSection
          onNavigateDossier={handleNavigateDossier}
          onNavigateWorks={handleNavigateWorks}
        />
      </div>

      <MemoDossierSection
        onNavigateHero={handleNavigateHero}
        onNavigateWorks={handleNavigateWorks}
        onNavigateDossier={handleNavigateDossier}
      />
      <MemoWorksSection
        onNavigateDossier={handleNavigateDossier}
        onNavigateWorks={handleNavigateWorks}
        onNavigateCredentials={handleNavigateCredentials}
      />
      <MemoCredentialsSection
        onNavigateWorks={handleNavigateWorks}
        onNavigateExperience={handleNavigateExperience}
      />
      <MemoExperienceSection
        onNavigateCredentials={handleNavigateCredentials}
        onNavigateContact={handleNavigateContact}
      />
      <MemoContactSection
        onNavigateExperience={handleNavigateExperience}
      />

      {/* Tab 02: Works */}
      <div
        ref={worksTabRef}
        style={{ transform: 'translate3d(0, calc(max(100vh, 680px) - 31px), 0)' }}
        className="fixed top-0 left-35 sm:left-56.25 md:left-76.25 z-45 will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateWorks}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] pt-0.75 pl-0.75 pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-7.75 bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-17.5px)_0,calc(100%-4.5px)_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-4.25 flex items-center justify-center rounded-xs border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
                02
              </span>
              <span className="font-mono-stack text-[10px] font-bold tracking-widest text-[#1c1c21] whitespace-nowrap">
                <span className="sm:hidden">WORKS</span>
                <span className="hidden sm:inline">SELECTED WORKS</span>
              </span>
              <span className="font-mono-stack text-[9px] text-[#58554f] font-normal tracking-wider hidden md:inline">
                // SEC_02
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Tab 03: Credentials */}
      <div
        ref={credentialsTabRef}
        style={{ transform: 'translate3d(0, calc(max(100vh, 680px) - 31px), 0)' }}
        className="fixed top-0 left-67 sm:left-102.5 md:left-137 z-55 will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateCredentials}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] pt-0.75 pl-0.75 pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-7.75 bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-17.5px)_0,calc(100%-4.5px)_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-4.25 flex items-center justify-center rounded-xs border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
                03
              </span>
              <span className="font-mono-stack text-[10px] font-bold tracking-widest text-[#1c1c21] whitespace-nowrap">
                <span className="sm:hidden">CERTS</span>
                <span className="hidden sm:inline">CREDENTIALS</span>
              </span>
              <span className="font-mono-stack text-[9px] text-[#58554f] font-normal tracking-wider hidden md:inline">
                // SEC_03
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Tab 04: Experience */}
      <div
        ref={experienceTabRef}
        style={{ transform: 'translate3d(0, calc(max(100vh, 680px) - 31px), 0)' }}
        className="fixed top-0 left-97.5 sm:left-147.5 md:left-195 z-75 will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateExperience}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] pt-0.75 pl-0.75 pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-7.75 bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-17.5px)_0,calc(100%-4.5px)_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-4.25 flex items-center justify-center rounded-xs border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
                04
              </span>
              <span className="font-mono-stack text-[10px] font-bold tracking-widest text-[#1c1c21] whitespace-nowrap">
                <span className="sm:hidden">EXP</span>
                <span className="hidden sm:inline">SERVICE RECORD</span>
              </span>
              <span className="font-mono-stack text-[9px] text-[#58554f] font-normal tracking-wider hidden md:inline">
                // SEC_04
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Tab 05: Contact */}
      <div
        ref={contactTabRef}
        style={{ transform: 'translate3d(0, calc(max(100vh, 680px) - 31px), 0)' }}
        className="fixed top-0 left-130 sm:left-190 md:left-247.5 z-95 will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateContact}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.15)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] pt-0.75 pl-0.75 pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-7.75 bg-[#1c1c21] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-17.5px)_0,calc(100%-4.5px)_100%,0_100%)] border-t-[3px] border-l-[3px] border-[#E2DFD2]/25">
              <span className="w-1.5 h-1.5 rounded-full border border-[#E2DFD2]/60 bg-[#E2DFD2]/20 shrink-0" />
              <span className="w-5 h-4.25 flex items-center justify-center rounded-xs border-[1.5px] border-[#E2DFD2] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
                05
              </span>
              <span className="font-mono-stack text-[10px] font-bold tracking-widest text-[#E2DFD2] whitespace-nowrap">
                <span className="sm:hidden">MSG</span>
                <span className="hidden sm:inline">TRANSMISSION</span>
              </span>
              <span className="font-mono-stack text-[9px] text-[#E2DFD2]/50 font-normal tracking-wider hidden md:inline">
                // SEC_05
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}


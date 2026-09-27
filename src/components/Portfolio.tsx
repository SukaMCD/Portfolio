import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import InteractiveBackground from './ui/InteractiveBackground';
import Cursor from './ui/Cursor';
import SiteNav from './ui/SiteNav';
import HeroSection from './sections/HeroSection';
import DossierSection from './sections/DossierSection';
import WorksSection from './sections/WorksSection';
import CredentialsSection from './sections/CredentialsSection';
import ExperienceSection from './sections/ExperienceSection';
import ContactSection from './sections/ContactSection';

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

    const updateTransition = () => {
      const dossierEl = document.getElementById('dossier');
      if (!dossierEl) return;
      const rect = dossierEl.getBoundingClientRect();
      const vh = window.innerHeight;

      const rawProgress = (vh - rect.top) / vh;
      const progress = Math.max(0, Math.min(1, rawProgress));

      if (heroRef.current) {
        heroRef.current.style.transform = `scale(${1 - progress * 0.05}) translateY(${progress * 24}px)`;
        heroRef.current.style.opacity = `${1 - progress * 0.4}`;
      }
    };

    const updateWorksTab = () => {
      const worksEl = document.getElementById('works');
      const dossierEl = document.getElementById('dossier');
      if (!worksEl || !worksTabRef.current || !dossierEl) return;

      const worksRect = worksEl.getBoundingClientRect();
      const dossierRect = dossierEl.getBoundingClientRect();
      const tabVisibleHeight = 30.5;

      const restingTop = window.scrollY < 5
        ? dossierRect.top - tabVisibleHeight
        : window.innerHeight - tabVisibleHeight;

      const worksTopTab = worksRect.top - tabVisibleHeight;
      const currentTop = Math.min(restingTop, worksTopTab);

      worksTabRef.current.style.transform = `translate3d(0, ${currentTop}px, 0)`;
    };

    const updateCredentialsTab = () => {
      const credsEl = document.getElementById('credentials');
      const dossierEl = document.getElementById('dossier');
      if (!credsEl || !credentialsTabRef.current || !dossierEl) return;

      const credsRect = credsEl.getBoundingClientRect();
      const dossierRect = dossierEl.getBoundingClientRect();
      const tabVisibleHeight = 30.5;

      const restingTop = window.scrollY < 5
        ? dossierRect.top - tabVisibleHeight
        : window.innerHeight - tabVisibleHeight;

      const credsTopTab = credsRect.top - tabVisibleHeight;
      const currentTop = Math.min(restingTop, credsTopTab);

      credentialsTabRef.current.style.transform = `translate3d(0, ${currentTop}px, 0)`;
    };

    const updateExperienceTab = () => {
      const expEl = document.getElementById('experience');
      const dossierEl = document.getElementById('dossier');
      if (!expEl || !experienceTabRef.current || !dossierEl) return;

      const expRect = expEl.getBoundingClientRect();
      const dossierRect = dossierEl.getBoundingClientRect();
      const tabVisibleHeight = 30.5;

      const restingTop = window.scrollY < 5
        ? dossierRect.top - tabVisibleHeight
        : window.innerHeight - tabVisibleHeight;

      const expTopTab = expRect.top - tabVisibleHeight;
      const currentTop = Math.min(restingTop, expTopTab);

      experienceTabRef.current.style.transform = `translate3d(0, ${currentTop}px, 0)`;
    };

    const updateContactTab = () => {
      const contactEl = document.getElementById('contact');
      const dossierEl = document.getElementById('dossier');
      if (!contactEl || !contactTabRef.current || !dossierEl) return;

      const contactRect = contactEl.getBoundingClientRect();
      const dossierRect = dossierEl.getBoundingClientRect();
      const tabVisibleHeight = 30.5;

      const restingTop = window.scrollY < 5
        ? dossierRect.top - tabVisibleHeight
        : window.innerHeight - tabVisibleHeight;

      const contactTopTab = contactRect.top - tabVisibleHeight;
      const currentTop = Math.min(restingTop, contactTopTab);

      contactTabRef.current.style.transform = `translate3d(0, ${currentTop}px, 0)`;
    };

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

    const updateNav = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setNavVisible(scrollY > window.innerHeight * 0.1);
      setScrollPct(maxScroll > 0 ? Math.round((scrollY / maxScroll) * 100) : 0);
      setActiveSection(getActiveSection());
    };

    lenis.on('scroll', () => {
      updateTransition();
      updateNav();
      updateWorksTab();
      updateCredentialsTab();
      updateExperienceTab();
      updateContactTab();
    });

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
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', updateTransition, { passive: true });
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('scroll', updateWorksTab, { passive: true });
    window.addEventListener('scroll', updateCredentialsTab, { passive: true });
    window.addEventListener('scroll', updateExperienceTab, { passive: true });
    window.addEventListener('scroll', updateContactTab, { passive: true });
    window.addEventListener('resize', updateWorksTab);
    window.addEventListener('resize', updateCredentialsTab);
    window.addEventListener('resize', updateExperienceTab);
    window.addEventListener('resize', updateContactTab);
    window.addEventListener('resize', updateTabHorizontalPositions);

    updateTransition();
    updateNav();
    updateWorksTab();
    updateCredentialsTab();
    updateExperienceTab();
    updateContactTab();
    updateTabHorizontalPositions();
    requestAnimationFrame(updateTabHorizontalPositions);
    if ('fonts' in document) {
      document.fonts.ready.then(updateTabHorizontalPositions);
    }

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      updateTransition();
      updateWorksTab();
      updateCredentialsTab();
      updateExperienceTab();
      updateContactTab();
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
      window.removeEventListener('scroll', updateTransition);
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('scroll', updateWorksTab);
      window.removeEventListener('scroll', updateCredentialsTab);
      window.removeEventListener('scroll', updateExperienceTab);
      window.removeEventListener('scroll', updateContactTab);
      window.removeEventListener('resize', updateWorksTab);
      window.removeEventListener('resize', updateCredentialsTab);
      window.removeEventListener('resize', updateExperienceTab);
      window.removeEventListener('resize', updateContactTab);
      window.removeEventListener('resize', updateTabHorizontalPositions);
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

  const handleNavigateHero = () => {
    setActiveSection(0);
    smoothNavigateTo(0);
  };
  const handleNavigateDossier = () => {
    setActiveSection(1);
    smoothNavigateTo('#dossier');
  };
  const handleNavigateWorks = () => {
    setActiveSection(2);
    smoothNavigateTo('#works');
  };
  const handleNavigateCredentials = () => {
    setActiveSection(3);
    smoothNavigateTo('#credentials');
  };
  const handleNavigateExperience = () => {
    setActiveSection(4);
    smoothNavigateTo('#experience');
  };
  const handleNavigateContact = () => {
    setActiveSection(5);
    smoothNavigateTo('#contact');
  };

  return (
    <div className="relative min-h-screen text-[#1c1c21] bg-[#E2DFD2]">
      <InteractiveBackground />
      <Cursor />
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

      <div ref={heroRef} className="sticky top-0 z-0 h-screen min-h-[680px] w-full overflow-hidden will-change-transform origin-top">
        <HeroSection
          onNavigateDossier={handleNavigateDossier}
          onNavigateWorks={handleNavigateWorks}
        />
      </div>

      <DossierSection
        onNavigateHero={handleNavigateHero}
        onNavigateWorks={handleNavigateWorks}
        onNavigateDossier={handleNavigateDossier}
      />
      <WorksSection
        onNavigateDossier={handleNavigateDossier}
        onNavigateWorks={handleNavigateWorks}
        onNavigateCredentials={handleNavigateCredentials}
      />
      <CredentialsSection
        onNavigateWorks={handleNavigateWorks}
        onNavigateExperience={handleNavigateExperience}
      />
      <ExperienceSection
        onNavigateCredentials={handleNavigateCredentials}
        onNavigateContact={handleNavigateContact}
      />
      <ContactSection
        onNavigateExperience={handleNavigateExperience}
      />

      {/* Tab 02: Works */}
      <div
        ref={worksTabRef}
        className="fixed top-0 left-[140px] sm:left-[225px] md:left-[305px] z-40 will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateWorks}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] p-[3px] pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-[31px] bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-[17px] flex items-center justify-center rounded-[2px] border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
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
        className="fixed top-0 left-[268px] sm:left-[410px] md:left-[548px] z-[60] will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateCredentials}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] p-[3px] pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-[31px] bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-[17px] flex items-center justify-center rounded-[2px] border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
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
        className="fixed top-0 left-[390px] sm:left-[590px] md:left-[780px] z-[80] will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateExperience}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.1)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] p-[3px] pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-[31px] bg-[#E2DFD2] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_100%,0_100%)]">
              <span className="w-1.5 h-1.5 rounded-full border border-[#1c1c21] bg-[#1c1c21]/20 shrink-0" />
              <span className="w-5 h-[17px] flex items-center justify-center rounded-[2px] border-[1.5px] border-[#1c1c21] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
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
        className="fixed top-0 left-[520px] sm:left-[760px] md:left-[990px] z-[100] will-change-transform"
      >
        <button
          type="button"
          onClick={handleNavigateContact}
          className="group select-none cursor-pointer filter drop-shadow-[0px_-2px_0px_rgba(28,28,33,0.15)] hover:-translate-y-0.5 transition-transform duration-150 block"
        >
          <div className="bg-[#1c1c21] p-[3px] pb-0 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]">
            <div className="h-[31px] bg-[#1c1c21] pl-3 pr-5 flex items-center gap-2 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_100%,0_100%)] border-t border-l border-[#E2DFD2]/25">
              <span className="w-1.5 h-1.5 rounded-full border border-[#E2DFD2]/60 bg-[#E2DFD2]/20 shrink-0" />
              <span className="w-5 h-[17px] flex items-center justify-center rounded-[2px] border-[1.5px] border-[#E2DFD2] bg-[#E2DFD2] text-[#1c1c21] group-hover:bg-[#1c1c21] group-hover:text-[#E2DFD2] font-mono-stack text-[9px] font-bold tracking-wider leading-none transition-colors">
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


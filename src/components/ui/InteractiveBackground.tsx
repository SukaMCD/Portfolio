import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    type Particle = { x: number; y: number; vx: number; vy: number; radius: number; baseAlpha: number; isAccent: boolean; };

    let particles: Particle[] = [];
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const initParticles = () => {
      const count = Math.min(75, Math.floor((width * height) / 15000));
      particles = Array.from({ length: count }, () => {
        const isAccent = Math.random() < 0.12;
        return { x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, radius: isAccent ? 2.2 : 1.2, baseAlpha: Math.random() * 0.35 + 0.12, isAccent };
      });
    };

    const handleMouseMove = (e: MouseEvent) => { mouse.targetX = e.clientX; mouse.targetY = e.clientY; };
    const handleResize = () => { if (!canvas) return; width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; initParticles(); };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const isDark = document.documentElement.classList.contains('dark');
      const rgb = isDark ? '226, 223, 210' : '28, 28, 33';

      const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      mouseGlow.addColorStop(0, `rgba(${rgb}, ${isDark ? 0.04 : 0.045})`);
      mouseGlow.addColorStop(0.5, `rgba(${rgb}, 0.015)`);
      mouseGlow.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; else if (p.y > height) p.y = 0;
        const dx = p.x - mouse.x; const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && dist > 0) { const force = ((90 - dist) / 90) * 1.5; p.x += (dx / dist) * force; p.y += (dy / dist) * force; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isAccent) { ctx.shadowColor = `rgba(${rgb}, 0.4)`; ctx.shadowBlur = 4; ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha * 1.8})`; }
        else { ctx.shadowBlur = 0; ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha * 0.65})`; }
        ctx.fill(); ctx.shadowBlur = 0;
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]; const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) { const alpha = (1 - d / 100) * 0.08; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.75})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%', opacity: 0.9 }} />;
}
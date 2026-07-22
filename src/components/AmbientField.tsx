import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/interactions';

/**
 * AmbientField — fixed background layer with slowly drifting gradients,
 * volumetric light beams, soft clouds, fog, and floating neural particles.
 * Subtly parallaxes with cursor movement.
 */
export default function AmbientField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      ref.current.style.setProperty('--px', `${x * 18}px`);
      ref.current.style.setProperty('--py', `${y * 18}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ transform: 'translate3d(var(--px,0), var(--py,0), 0)' }}
    >
      {/* Moving gradient field */}
      <div className="ambient-field" />

      {/* Volumetric light beams */}
      <div className="light-beam" style={{ left: '12%', top: '-10%', height: '120vh' }} />
      <div className="light-beam" style={{ left: '38%', top: '-10%', height: '100vh', animationDelay: '-4s' }} />
      <div className="light-beam" style={{ left: '72%', top: '-10%', height: '130vh', animationDelay: '-8s' }} />

      {/* Soft clouds / fog */}
      <div
        className="absolute rounded-full blur-3xl opacity-50 animate-float-slow"
        style={{
          width: 520,
          height: 520,
          left: '5%',
          top: '10%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-40 animate-float-slower"
        style={{
          width: 640,
          height: 640,
          right: '-8%',
          top: '35%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-30 animate-float-slow"
        style={{
          width: 480,
          height: 480,
          left: '30%',
          bottom: '5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)',
          animationDelay: '-6s',
        }}
      />

      {/* Floating neural particles */}
      <NeuralParticles />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,24,39,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 80%)',
        }}
      />
    </div>
  );
}

function NeuralParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (prefersReducedMotion()) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf = 0;

    const count = window.innerWidth < 768 ? 20 : 40;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.8 + 0.4,
      hue: Math.random() < 0.5 ? '0,184,255' : '59,130,246',
    }));

    const mouse = { x: w / 2, y: h / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Throttle to ~30fps — this is a subtle background layer and doesn't
    // need to run at full refresh rate. Halves its per-second cost.
    const frameInterval = 1000 / 30;
    let lastFrame = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const op = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(${a.hue},${op})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of particles) {
        // subtle cursor attraction
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 180) {
          p.vx += (mdx / md) * 0.002;
          p.vy += (mdy / md) * 0.002;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = `rgba(${p.hue},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />;
}

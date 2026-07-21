import { useEffect, useState } from 'react';

/**
 * Global cursor halo + magnetic button helper.
 * Attaches a soft glowing ring that follows the cursor with spring lag,
 * and grows when hovering interactive elements.
 */
export function useCursorHalo() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const halo = document.createElement('div');
    halo.className = 'cursor-halo';
    document.body.appendChild(halo);

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      const interactive = t.closest('a,button,[data-magnetic]');
      halo.classList.toggle('hovering', !!interactive);
    };
    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      halo.style.left = `${rx}px`;
      halo.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      halo.remove();
    };
  }, []);
}

/**
 * Magnetic hover effect for buttons. Returns a ref + handlers.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const [ref, setRef] = useState<T | null>(null);

  useEffect(() => {
    if (!ref) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = ref.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      ref.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      ref.style.transform = 'translate(0,0)';
    };
    ref.addEventListener('mousemove', onMove);
    ref.addEventListener('mouseleave', onLeave);
    return () => {
      ref.removeEventListener('mousemove', onMove);
      ref.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);

  return { setRef, ref } as const;
}

/**
 * Animated counter that eases from 0 to target when scrolled into view.
 */
export function useCountUp(target: number, duration = 2200) {
  const [value, setValue] = useState(0);
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 4);
              setValue(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, target, duration]);

  return { value, setEl } as const;
}

/**
 * Scrambling text reveal. Cycles random glyphs before settling.
 */
export function useScramble(text: string, active = true, duration = 900) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const total = text.length;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / (duration / 30);
      const revealed = Math.floor(progress * total);
      const out = text
        .split('')
        .map((c, i) => {
          if (i < revealed || c === ' ') return c;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplay(out);
      if (progress >= 1) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, active, duration]);

  return display;
}

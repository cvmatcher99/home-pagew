import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, MapPin } from 'lucide-react';
import {
  AEAZ_PATH,
  AEDU_PATH,
  AESH_PATH,
  AEAJ_PATH,
  AEUQ_PATH,
  AERK_PATH,
  AEFU_PATH,
  EMIRATE_HUBS,
  UAE_VIEWBOX,
  type EmirateHub,
} from '@/data/uaePaths';

const PATHS: Record<string, string> = {
  AEAZ: AEAZ_PATH,
  AEDU: AEDU_PATH,
  AESH: AESH_PATH,
  AEAJ: AEAJ_PATH,
  AEUQ: AEUQ_PATH,
  AERK: AERK_PATH,
  AEFU: AEFU_PATH,
};

// Candidate "YOU" node — positioned in the Arabian Gulf, west of the UAE coast
// (in SVG coordinate space, viewBox 0 0 1000 788)
const CANDIDATE: [number, number] = [300, 340];

const CATEGORIES = [
  {
    name: 'Software',
    color: '0,184,255',
    titles: ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'ML Engineer', 'Mobile Developer'],
  },
  {
    name: 'Engineering',
    color: '59,130,246',
    titles: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Project Engineer', 'Structural Engineer'],
  },
  {
    name: 'Finance',
    color: '16,185,129',
    titles: ['Financial Analyst', 'Accountant', 'Audit Manager', 'Finance VP', 'Treasury Analyst'],
  },
  {
    name: 'Marketing',
    color: '139,92,246',
    titles: ['Marketing Lead', 'Brand Manager', 'Content Strategist', 'Growth Manager', 'PR Director'],
  },
  {
    name: 'Healthcare',
    color: '246,183,60',
    titles: ['Clinical Specialist', 'Hospital Admin', 'Pharmacist', 'Nurse Manager', 'Medical Officer'],
  },
];

const COMPANIES: Record<string, string[]> = {
  'Abu Dhabi': ['ADNOC', 'Mubadala', 'ADQ', 'Etihad', 'G42', 'Aldar'],
  'Dubai': ['Emirates NBD', 'Emaar', 'Dubai Holding', 'DP World', 'Flydubai', 'Jumeirah'],
  'Sharjah': ['Air Arabia', 'Sharjah Islamic Bank', 'Gulftainer'],
  'Ajman': ['Ajman Bank', 'Gulf Medical'],
  'Umm Al Quwain': ['UW Properties', 'Barr Al Jissah'],
  'Ras Al Khaimah': ['RAK Ceramics', 'RAK Properties', 'Stevin Rock'],
  'Fujairah': ['Fujairah Oil', 'Port of Fujairah', 'Gulf Cement'],
};

interface Job {
  id: number;
  emirate: string;
  category: string;
  color: string;
  title: string;
  company: string;
  hub: [number, number];
  angle: number;
  radius: number;
  angSpeed: number;
  status: 'new' | 'matching' | 'applied';
  age: number;
  life: number;
  fadeIn: number;
  matched: boolean;
  pulseT: number;
  pulseActive: boolean;
  x: number;
  y: number;
}

interface FloatingCard {
  id: number;
  x: number;
  y: number;
  title: string;
  emirate: string;
  company: string;
  status: 'applied' | 'matching';
  born: number;
  life: number;
}

interface Props {
  className?: string;
  variant?: 'hero' | 'showcase';
}

let JOB_ID = 1;
let CARD_ID = 1;

export default function UAERecruitmentMap({ className = '', variant = 'hero' }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<Job[]>([]);
  const cardsRef = useRef<FloatingCard[]>([]);
  const [cards, setCards] = useState<FloatingCard[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const addCard = useCallback((card: Omit<FloatingCard, 'id' | 'born' | 'life'>) => {
    const c: FloatingCard = {
      ...card,
      id: CARD_ID++,
      born: performance.now(),
      life: 4400,
    };
    cardsRef.current = [...cardsRef.current, c].slice(-3);
    setCards(cardsRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!canvas || !container || !svg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const VBW = UAE_VIEWBOX.w;
    const VBH = UAE_VIEWBOX.h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0;
    let ch = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      canvas.width = Math.max(1, Math.floor(cw * dpr));
      canvas.height = Math.max(1, Math.floor(ch * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // cursor parallax
    const mouse = { x: 0, y: 0, active: false };
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    const pickEmirate = (): EmirateHub => {
      const r = Math.random();
      let acc = 0;
      for (const em of EMIRATE_HUBS) {
        acc += em.weight;
        if (r <= acc) return em;
      }
      return EMIRATE_HUBS[0];
    };

    const spawnJob = (): Job => {
      const em = pickEmirate();
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const companies = COMPANIES[em.name];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const angle = Math.random() * Math.PI * 2;
      const radius = 14 + Math.random() * 24;
      return {
        id: JOB_ID++,
        emirate: em.name,
        category: cat.name,
        color: cat.color,
        title: cat.titles[Math.floor(Math.random() * cat.titles.length)],
        company,
        hub: [em.cx, em.cy],
        angle,
        radius,
        angSpeed: (Math.random() - 0.5) * 0.0007,
        status: 'new',
        age: 0,
        life: 9000 + Math.random() * 7000,
        fadeIn: 0,
        matched: false,
        pulseT: -1,
        pulseActive: false,
        x: em.cx + Math.cos(angle) * radius,
        y: em.cy + Math.sin(angle) * radius,
      };
    };

    // initial population
    if (jobsRef.current.length === 0) {
      for (let i = 0; i < 32; i++) {
        const j = spawnJob();
        j.age = Math.random() * j.life * 0.5;
        jobsRef.current.push(j);
      }
    }

    let lastSpawn = performance.now();
    let lastMatch = performance.now() + 800;
    let lastCard = performance.now();
    let lastCountUpdate = 0;
    let raf = 0;
    let prev = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;

      if (now - lastSpawn > 700 && jobsRef.current.length < 40) {
        jobsRef.current.push(spawnJob());
        lastSpawn = now;
      }

      // parallax offset in SVG coords
      let ox = 0;
      let oy = 0;
      if (mouse.active) {
        ox = mouse.x * 24;
        oy = mouse.y * 18;
      }

      // map SVG coords to canvas pixels
      const sx = cw / VBW;
      const sy = ch / VBH;
      const TX = (x: number) => (x + ox) * sx;
      const TY = (y: number) => (y + oy) * sy;

      ctx.clearRect(0, 0, cw, ch);

      // update jobs
      for (const j of jobsRef.current) {
        j.age += dt;
        j.fadeIn = Math.min(1, j.age / 600);
        j.angle += j.angSpeed * dt;
        j.x = j.hub[0] + Math.cos(j.angle) * j.radius;
        j.y = j.hub[1] + Math.sin(j.angle) * j.radius;
        if (j.pulseActive) {
          j.pulseT += dt / 1200;
          if (j.pulseT >= 1) {
            j.pulseActive = false;
            j.pulseT = -1;
            j.status = 'applied';
            j.matched = true;
            addCard({
              x: ((j.x + ox) / VBW) * 100,
              y: ((j.y + oy) / VBH) * 100,
              title: j.title,
              emirate: j.emirate,
              company: j.company,
              status: 'applied',
            });
          }
        }
      }
      jobsRef.current = jobsRef.current.filter((j) => j.age < j.life);

      // promote new -> matching
      const newJobs = jobsRef.current.filter((j) => j.status === 'new');
      if (now - lastMatch > 1100 && newJobs.length > 0) {
        const j = newJobs[Math.floor(Math.random() * newJobs.length)];
        j.status = 'matching';
        j.matched = true;
        lastMatch = now;
        if (now - lastCard > 2600 && Math.random() < 0.5) {
          lastCard = now;
          addCard({
            x: ((j.x + ox) / VBW) * 100,
            y: ((j.y + oy) / VBH) * 100,
            title: j.title,
            emirate: j.emirate,
            company: j.company,
            status: 'matching',
          });
        }
      }

      // trigger pulses
      const matching = jobsRef.current.filter((j) => j.status === 'matching' && !j.pulseActive);
      if (matching.length > 0 && Math.random() < 0.02) {
        const j = matching[Math.floor(Math.random() * matching.length)];
        j.pulseActive = true;
        j.pulseT = 0;
      }

      // update counts for glow (throttled)
      if (now - lastCountUpdate > 500) {
        lastCountUpdate = now;
        const c: Record<string, number> = {};
        for (const j of jobsRef.current) c[j.emirate] = (c[j.emirate] || 0) + 1;
        setCounts(c);
      }

      // emirate glows
      for (const em of EMIRATE_HUBS) {
        const count = counts[em.name] || 0;
        const intensity = Math.min(1, count / 8);
        const glowR = (20 + intensity * 40) * sx;
        const gx = TX(em.cx);
        const gy = TY(em.cy);
        const g = ctx.createRadialGradient(gx, gy, 2, gx, gy, glowR);
        g.addColorStop(0, `rgba(${em.accent},${0.18 + intensity * 0.25})`);
        g.addColorStop(0.5, `rgba(${em.accent},${0.06 + intensity * 0.10})`);
        g.addColorStop(1, `rgba(${em.accent},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx, gy, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // connections from candidate to matching jobs
      const cx = TX(CANDIDATE[0]);
      const cy = TY(CANDIDATE[1]);
      ctx.lineWidth = 0.6;
      for (const j of jobsRef.current) {
        if (!j.matched) continue;
        const jx = TX(j.x);
        const jy = TY(j.y);
        const isApplied = j.status === 'applied';
        const baseAlpha = isApplied ? 0.25 : 0.14;
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.003 + j.id);
        ctx.strokeStyle = `rgba(${j.color},${baseAlpha * (0.6 + pulse * 0.4)})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(jx, jy);
        ctx.stroke();
      }

      // traveling pulses
      for (const j of jobsRef.current) {
        if (j.pulseActive && j.pulseT >= 0) {
          const jx = TX(j.x);
          const jy = TY(j.y);
          const px = cx + (jx - cx) * j.pulseT;
          const py = cy + (jy - cy) * j.pulseT;
          for (let s = 0; s < 6; s++) {
            const f = Math.max(0, j.pulseT - s * 0.04);
            const tx = cx + (jx - cx) * f;
            const ty = cy + (jy - cy) * f;
            ctx.fillStyle = `rgba(${j.color},${0.5 * (1 - s / 6)})`;
            ctx.beginPath();
            ctx.arc(tx, ty, 3 - s * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(${j.color},0.95)`;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,0.9)`;
          ctx.beginPath();
          ctx.arc(px, py, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // job dots
      for (const j of jobsRef.current) {
        const fadeOut = j.age > j.life - 1200 ? Math.max(0, (j.life - j.age) / 1200) : 1;
        const alpha = j.fadeIn * fadeOut;
        const jx = TX(j.x);
        const jy = TY(j.y);
        ctx.fillStyle = `rgba(${j.color},${0.12 * alpha})`;
        ctx.beginPath();
        ctx.arc(jx, jy, 5, 0, Math.PI * 2);
        ctx.fill();
        const dotColor = j.status === 'applied' ? '16,185,129' : j.color;
        ctx.fillStyle = `rgba(${dotColor},${0.9 * alpha})`;
        ctx.beginPath();
        ctx.arc(jx, jy, 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (j.status === 'applied') {
          ctx.strokeStyle = `rgba(16,185,129,${0.5 * alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(jx, jy, 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // emirate hub markers + labels
      for (const em of EMIRATE_HUBS) {
        const count = counts[em.name] || 0;
        const intensity = Math.min(1, count / 8);
        const gx = TX(em.cx);
        const gy = TY(em.cy);
        ctx.strokeStyle = `rgba(${em.accent},${0.5 + intensity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(gx, gy, 4 + intensity * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(gx, gy, 2, 0, Math.PI * 2);
        ctx.fill();
        // label position uses per-emirate offset to prevent overlap
        const lx = gx + em.labelDx * sx;
        const ly = gy + em.labelDy * sy;
        const align = em.labelDx > 10 ? 'left' : em.labelDx < -10 ? 'right' : 'center';
        ctx.font = '600 9px Inter, sans-serif';
        ctx.fillStyle = 'rgba(17,24,39,0.78)';
        ctx.textAlign = align;
        ctx.fillText(em.name, lx, ly);
        ctx.font = '500 7px Inter, sans-serif';
        ctx.fillStyle = `rgba(${em.accent},0.85)`;
        ctx.fillText(`${count} live`, lx, ly + 11);
        ctx.textAlign = 'left';
      }

      // candidate core
      const corePulse = 0.5 + 0.5 * Math.sin(now * 0.004);
      const coreR = 14 + corePulse * 3;
      const cgrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      cgrad.addColorStop(0, 'rgba(0,184,255,0.3)');
      cgrad.addColorStop(0.5, 'rgba(59,130,246,0.10)');
      cgrad.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = cgrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,184,255,0.65)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, coreR - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '600 8px Inter, sans-serif';
      ctx.fillStyle = 'rgba(17,24,39,0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('YOU', cx, cy + 3);
      ctx.textAlign = 'left';

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [addCard]);

  // prune expired cards
  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      const next = cardsRef.current.filter((c) => now - c.born < c.life);
      if (next.length !== cardsRef.current.length) {
        cardsRef.current = next;
        setCards(next);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* SVG map layer (semi-transparent, elegant) */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 788"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.55 }}
        aria-hidden
      >
        <defs>
          <filter id="uae-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {EMIRATE_HUBS.map((em) => (
          <path
            key={em.pathId}
            d={PATHS[em.pathId]}
            fill="rgba(255,255,255,0.38)"
            stroke={`rgba(${em.accent},0.35)`}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {/* Canvas animation layer (jobs, connections, pulses, hubs) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Floating job cards overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {cards.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <JobCard card={c} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {variant === 'showcase' && (
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.name}
              className="glass-soft rounded-full px-3 py-1.5 text-[11px] tracking-widest text-ink flex items-center gap-2"
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: `rgb(${cat.color})` }}
              />
              {cat.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ card }: { card: FloatingCard }) {
  const isApplied = card.status === 'applied';
  return (
    <div className="glass rounded-2xl px-4 py-3 w-[200px] shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-ink truncate">{card.title}</div>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted">
            <MapPin size={10} className="text-cyan-electric" />
            <span className="truncate">{card.emirate}</span>
          </div>
          <div className="text-[11px] text-muted mt-0.5 truncate">{card.company}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {isApplied ? (
          <>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald2/15">
              <Check size={10} className="text-emerald2" />
            </span>
            <span className="text-[11px] font-medium text-emerald2 tracking-wide">Applied</span>
          </>
        ) : (
          <>
            <Loader2 size={11} className="text-cyan-electric animate-spin" />
            <span className="text-[11px] font-medium text-cyan-electric tracking-wide">Matching…</span>
          </>
        )}
      </div>
    </div>
  );
}

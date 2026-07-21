import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Candidate {
  id: number;
  name: string;
  role: string;
  skills: string[];
  exp: string;
  available: boolean;
  match: number;
  color: string;
  text: string;
  bg: string;
  ring: string;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  openings: number;
  color: string;
  text: string;
  bg: string;
  ring: string;
}

const CANDIDATES: Omit<Candidate, 'id'>[] = [
  { name: 'Aisha M.', role: 'Senior Data Scientist', skills: ['Python', 'ML', 'TensorFlow'], exp: '7 yrs', available: true, match: 96, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15', ring: 'ring-cyan-electric/50' },
  { name: 'Omar K.', role: 'Full Stack Engineer', skills: ['React', 'Node', 'AWS'], exp: '5 yrs', available: true, match: 94, color: '59,130,246', text: 'text-azure', bg: 'bg-azure/15', ring: 'ring-azure/50' },
  { name: 'Layla R.', role: 'Product Manager', skills: ['Strategy', 'Agile', 'Analytics'], exp: '8 yrs', available: false, match: 91, color: '16,185,129', text: 'text-emerald2', bg: 'bg-emerald2/15', ring: 'ring-emerald2/50' },
  { name: 'Hassan A.', role: 'DevOps Engineer', skills: ['K8s', 'Terraform', 'GCP'], exp: '6 yrs', available: true, match: 93, color: '139,92,246', text: 'text-violet2', bg: 'bg-violet2/15', ring: 'ring-violet2/50' },
];

const COMPANIES: Omit<Company, 'id'>[] = [
  { name: 'G42', industry: 'AI & Technology', openings: 28, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15', ring: 'ring-cyan-electric/50' },
  { name: 'Emirates NBD', industry: 'Banking', openings: 12, color: '59,130,246', text: 'text-azure', bg: 'bg-azure/15', ring: 'ring-azure/50' },
  { name: 'Emaar', industry: 'Real Estate', openings: 19, color: '16,185,129', text: 'text-emerald2', bg: 'bg-emerald2/15', ring: 'ring-emerald2/50' },
  { name: 'Mubadala', industry: 'Investment', openings: 15, color: '139,92,246', text: 'text-violet2', bg: 'bg-violet2/15', ring: 'ring-violet2/50' },
];

const FLOATING_STATS = [
  { label: '500+', sub: 'Jobs', icon: Briefcase, text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
  { label: '100+', sub: 'Companies', icon: Building2, text: 'text-azure', bg: 'bg-azure/15' },
  { label: '10K+', sub: 'Candidates', icon: Users, text: 'text-emerald2', bg: 'bg-emerald2/15' },
  { label: 'AI', sub: 'Matching', icon: Sparkles, text: 'text-violet2', bg: 'bg-violet2/15' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AINetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMatch, setActiveMatch] = useState<{ cand: number; comp: number } | null>(null);
  const [matchPulse, setMatchPulse] = useState(0);

  // distribute candidates (left arc) and companies (right arc)
  // angles spread across an arc on each side
  const candidates: Candidate[] = CANDIDATES.map((c, i) => ({
    ...c,
    id: i,
    angle: Math.PI - (Math.PI / 4) * (i + 0.5),
  }));
  const companies: Company[] = COMPANIES.map((c, i) => ({
    ...c,
    id: i,
    angle: -(Math.PI / 4) * (i + 0.5),
  }));

  // cycle the "active match" highlight
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % Math.min(CANDIDATES.length, COMPANIES.length);
      setActiveMatch({ cand: idx, comp: idx });
      setMatchPulse((p) => p + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // canvas: animated curved bezier connections + traveling pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    interface Pulse {
      cand: number;
      comp: number;
      t: number;
      speed: number;
      color: string;
    }
    const pulses: Pulse[] = [];
    let lastSpawn = 0;
    let raf = 0;
    let prev = performance.now();

    const NODE_RADIUS_PCT = 36;

    const draw = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;

      ctx.clearRect(0, 0, cw, ch);
      const cx = cw / 2;
      const cy = ch / 2;
      const radius = Math.min(cw, ch) * (NODE_RADIUS_PCT / 100);

      const posOf = (angle: number) => ({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      });

      // spawn pulses
      if (now - lastSpawn > 550) {
        lastSpawn = now;
        const ci = Math.floor(Math.random() * CANDIDATES.length);
        const co = Math.floor(Math.random() * COMPANIES.length);
        pulses.push({
          cand: ci,
          comp: co,
          t: 0,
          speed: 0.0005 + Math.random() * 0.0003,
          color: CANDIDATES[ci].color,
        });
        if (pulses.length > 22) pulses.shift();
      }

      // draw curved bezier connections: candidate -> core -> company
      // We draw candidate->core and core->company as quadratic curves with a slight bend
      const drawCurve = (
        x1: number, y1: number, x2: number, y2: number,
        color: string, alpha: number, width: number,
      ) => {
        // control point offset perpendicular to the line
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const bend = len * 0.12;
        const cpx = mx + nx * bend;
        const cpy = my + ny * bend;
        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.stroke();
      };

      // candidate -> core
      for (let i = 0; i < CANDIDATES.length; i++) {
        const cpos = posOf(candidates[i].angle);
        const alpha = 0.1 + 0.06 * Math.sin(now * 0.002 + i);
        drawCurve(cpos.x, cpos.y, cx, cy, candidates[i].color, alpha, 0.8);
      }
      // core -> company
      for (let i = 0; i < COMPANIES.length; i++) {
        const copos = posOf(companies[i].angle);
        const alpha = 0.1 + 0.06 * Math.sin(now * 0.002 + i + 1);
        drawCurve(cx, cy, copos.x, copos.y, companies[i].color, alpha, 0.8);
      }

      // highlight active match
      if (activeMatch) {
        const cpos = posOf(candidates[activeMatch.cand].angle);
        const copos = posOf(companies[activeMatch.comp].angle);
        const pulseAlpha = 0.35 + 0.25 * Math.sin(now * 0.005);
        drawCurve(cpos.x, cpos.y, cx, cy, '0,184,255', pulseAlpha, 1.8);
        drawCurve(cx, cy, copos.x, copos.y, '0,184,255', pulseAlpha, 1.8);
      }

      // helper: point on quadratic bezier at t
      const bezierPoint = (
        x1: number, y1: number, x2: number, y2: number, t: number,
      ) => {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const bend = len * 0.12;
        const cpx = mx + nx * bend;
        const cpy = my + ny * bend;
        const u = 1 - t;
        return {
          x: u * u * x1 + 2 * u * t * cpx + t * t * x2,
          y: u * u * y1 + 2 * u * t * cpy + t * t * y2,
        };
      };

      // update + draw traveling pulses along bezier path
      for (const p of pulses) {
        p.t += p.speed * dt;
        if (p.t > 1) p.t = 1;
        const cpos = posOf(candidates[p.cand].angle);
        const copos = posOf(companies[p.comp].angle);

        // path: candidate -> core (t 0..0.5) -> company (t 0.5..1)
        const getPoint = (t: number) => {
          if (t < 0.5) {
            return bezierPoint(cpos.x, cpos.y, cx, cy, t / 0.5);
          }
          return bezierPoint(cx, cy, copos.x, copos.y, (t - 0.5) / 0.5);
        };

        // trailing tail
        for (let s = 0; s < 6; s++) {
          const f = Math.max(0, p.t - s * 0.025);
          if (f >= 1) continue;
          const pt = getPoint(f);
          ctx.fillStyle = `rgba(${p.color},${0.4 * (1 - s / 6)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.6 - s * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }
        // bright head
        const head = getPoint(p.t);
        ctx.fillStyle = `rgba(${p.color},0.95)`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (pulses[i].t >= 1) pulses.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [activeMatch, candidates, companies]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[2rem] overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 50%, rgba(8,14,30,0.96) 0%, rgba(12,20,42,0.98) 60%, rgba(6,10,24,1) 100%)',
      }}
    >
      {/* subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,184,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* radial glow behind core */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(0,184,255,0.18) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
        }}
      />

      {/* Canvas connection layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Central AI Core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <AICore pulseKey={matchPulse} />
      </div>

      {/* Candidate cards (left arc) */}
      {candidates.map((c) => (
        <NodeWrapper key={`c-${c.id}`} angle={c.angle} side="left" index={c.id}>
          <CandidateCard candidate={c} active={activeMatch?.cand === c.id} />
        </NodeWrapper>
      ))}

      {/* Company cards (right arc) */}
      {companies.map((c) => (
        <NodeWrapper key={`co-${c.id}`} angle={c.angle} side="right" index={c.id}>
          <CompanyCard company={c} active={activeMatch?.comp === c.id} />
        </NodeWrapper>
      ))}

      {/* Floating data elements (corners) */}
      <FloatingStat className="top-3 left-3 sm:top-5 sm:left-5" stat={FLOATING_STATS[0]} delay={0} />
      <FloatingStat className="top-3 right-3 sm:top-5 sm:right-5" stat={FLOATING_STATS[1]} delay={0.15} />
      <FloatingStat className="bottom-3 left-3 sm:bottom-5 sm:left-5" stat={FLOATING_STATS[2]} delay={0.3} />
      <FloatingStat className="bottom-3 right-3 sm:bottom-5 sm:right-5" stat={FLOATING_STATS[3]} delay={0.45} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Position wrapper                                                   */
/* ------------------------------------------------------------------ */

function NodeWrapper({
  angle,
  side,
  index,
  children,
}: {
  angle: number;
  side: 'left' | 'right';
  index: number;
  children: React.ReactNode;
}) {
  const x = 50 + Math.cos(angle) * 36;
  const y = 50 + Math.sin(angle) * 36;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: side === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute z-10"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        animate={{ y: [0, side === 'left' ? -7 : 7, 0] }}
        transition={{
          duration: 5 + index * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Core                                                            */
/* ------------------------------------------------------------------ */

function AICore({ pulseKey }: { pulseKey: number }) {
  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
      {/* outer glow */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0,184,255,0.35) 0%, rgba(59,130,246,0.15) 50%, transparent 70%)',
        }}
      />
      {/* rotating outer ring with dashes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed"
        style={{ borderColor: 'rgba(0,184,255,0.25)' }}
      />
      {/* rotating mid ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-3 rounded-full border"
        style={{
          borderColor: 'rgba(59,130,246,0.2)',
          borderTopColor: 'rgba(0,184,255,0.7)',
          borderRightColor: 'rgba(59,130,246,0.4)',
        }}
      />
      {/* inner ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-6 rounded-full border"
        style={{
          borderColor: 'rgba(139,92,246,0.15)',
          borderBottomColor: 'rgba(139,92,246,0.5)',
          borderLeftColor: 'rgba(0,184,255,0.3)',
        }}
      />
      {/* core glass disc with logo */}
      <div
        className="relative rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(20px) saturate(140%)',
          border: '1px solid rgba(0,184,255,0.3)',
          boxShadow:
            '0 0 30px rgba(0,184,255,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <img
          src="/Artboard_1_from_designs.png"
          alt="Tabashir AI"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,184,255,0.5))' }}
        />
        <span
          className="font-display text-[8px] sm:text-[9px] font-semibold tracking-[0.18em] mt-0.5"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          TABASHIR
        </span>
        <span
          className="text-[7px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(0,184,255,0.7)' }}
        >
          AI Core
        </span>
      </div>
      {/* match pulse ripple */}
      <AnimatePresence>
        <motion.div
          key={pulseKey}
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: 'rgba(0,184,255,0.6)' }}
        />
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Candidate card                                                     */
/* ------------------------------------------------------------------ */

function CandidateCard({ candidate, active }: { candidate: Candidate; active?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-3 w-[160px] sm:w-[185px] transition-all duration-500 ${
        active ? `ring-2 ${candidate.ring}` : 'ring-1 ring-white/10'
      }`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(16px) saturate(140%)',
        boxShadow: active
          ? `0 8px 32px rgba(${candidate.color},0.25), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${candidate.bg}`}
          style={{ border: `1px solid rgba(${candidate.color},0.3)` }}
        >
          <span className="font-display text-xs font-semibold text-white">
            {candidate.name.split(' ').map((n) => n[0]).join('')}
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white/90 truncate">{candidate.name}</p>
          <p className="text-[10px] text-white/50 truncate">{candidate.role}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {candidate.skills.map((s) => (
          <span
            key={s}
            className="text-[9px] px-1.5 py-0.5 rounded-md text-white/70"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] text-white/40">{candidate.exp} exp</span>
        <span
          className={`inline-flex items-center gap-1 text-[9px] font-medium ${
            candidate.available ? 'text-emerald2' : 'text-white/40'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${candidate.available ? 'bg-emerald2' : 'bg-white/30'}`}
          />
          {candidate.available ? 'Available' : 'Busy'}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${candidate.match}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, rgba(${candidate.color},1), rgba(${candidate.color},0.6))` }}
          />
        </div>
        <span className={`text-[10px] font-display font-medium ${candidate.text}`}>{candidate.match}%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Company card                                                       */
/* ------------------------------------------------------------------ */

function CompanyCard({ company, active }: { company: Company; active?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-3 w-[160px] sm:w-[185px] transition-all duration-500 ${
        active ? `ring-2 ${company.ring}` : 'ring-1 ring-white/10'
      }`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(16px) saturate(140%)',
        boxShadow: active
          ? `0 8px 32px rgba(${company.color},0.25), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${company.bg}`}
          style={{ border: `1px solid rgba(${company.color},0.3)` }}
        >
          <Building2 size={16} className={company.text} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white/90 truncate">{company.name}</p>
          <p className="text-[10px] text-white/50 truncate">{company.industry}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
          <Briefcase size={11} className="text-white/40" />
          {company.openings} open
        </span>
        <span className={`inline-flex items-center gap-1 text-[9px] font-medium ${company.text}`}>
          <Zap size={10} />
          Hiring
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{
              background: i < 3 ? `rgba(${company.color},0.5)` : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating stat element                                              */
/* ------------------------------------------------------------------ */

function FloatingStat({
  className,
  stat,
  delay,
}: {
  className: string;
  stat: { label: string; sub: string; icon: LucideIcon; text: string; bg: string };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`absolute ${className} z-30`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div
          className="rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(16px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${stat.bg}`}>
            <stat.icon size={14} className={stat.text} />
          </span>
          <div>
            <p className={`font-display text-sm font-semibold ${stat.text}`}>{stat.label}</p>
            <p className="text-[9px] tracking-widest uppercase text-white/40">{stat.sub}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

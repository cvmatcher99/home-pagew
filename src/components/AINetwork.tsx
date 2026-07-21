import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Cpu,
  Sparkles,
  Users,
  Check,
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
  angle: number;
  radius: number;
  color: string;
  text: string;
  bg: string;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  openings: number;
  angle: number;
  radius: number;
  color: string;
  text: string;
  bg: string;
}

const CANDIDATES: Omit<Candidate, 'id' | 'angle' | 'radius'>[] = [
  { name: 'Aisha M.', role: 'Senior Data Scientist', skills: ['Python', 'ML', 'TensorFlow'], exp: '7 yrs', available: true, match: 96, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
  { name: 'Omar K.', role: 'Full Stack Engineer', skills: ['React', 'Node', 'AWS'], exp: '5 yrs', available: true, match: 94, color: '59,130,246', text: 'text-azure', bg: 'bg-azure/15' },
  { name: 'Layla R.', role: 'Product Manager', skills: ['Strategy', 'Agile', 'Analytics'], exp: '8 yrs', available: false, match: 91, color: '16,185,129', text: 'text-emerald2', bg: 'bg-emerald2/15' },
  { name: 'Hassan A.', role: 'DevOps Engineer', skills: ['K8s', 'Terraform', 'GCP'], exp: '6 yrs', available: true, match: 93, color: '139,92,246', text: 'text-violet2', bg: 'bg-violet2/15' },
  { name: 'Fatima Z.', role: 'UX Designer', skills: ['Figma', 'Research', 'Prototyping'], exp: '4 yrs', available: true, match: 89, color: '246,183,60', text: 'text-gold', bg: 'bg-gold/15' },
  { name: 'Khalid B.', role: 'Finance Analyst', skills: ['CFA', 'Excel', 'Bloomberg'], exp: '9 yrs', available: true, match: 92, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
];

const COMPANIES: Omit<Company, 'id' | 'angle' | 'radius'>[] = [
  { name: 'Emirates NBD', industry: 'Banking', openings: 12, color: '59,130,246', text: 'text-azure', bg: 'bg-azure/15' },
  { name: 'G42', industry: 'AI & Technology', openings: 28, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
  { name: 'Emaar', industry: 'Real Estate', openings: 19, color: '16,185,129', text: 'text-emerald2', bg: 'bg-emerald2/15' },
  { name: 'Mubadala', industry: 'Investment', openings: 15, color: '139,92,246', text: 'text-violet2', bg: 'bg-violet2/15' },
  { name: 'Etihad', industry: 'Aviation', openings: 22, color: '246,183,60', text: 'text-gold', bg: 'bg-gold/15' },
  { name: 'DP World', industry: 'Logistics', openings: 17, color: '0,184,255', text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
];

const FLOATING_STATS = [
  { label: '500+', sub: 'Jobs', icon: Briefcase, text: 'text-cyan-electric', bg: 'bg-cyan-electric/15' },
  { label: '100+', sub: 'Companies', icon: Building2, text: 'text-azure', bg: 'bg-azure/15' },
  { label: 'Thousands', sub: 'of Candidates', icon: Users, text: 'text-emerald2', bg: 'bg-emerald2/15' },
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
  const candidates: Candidate[] = CANDIDATES.map((c, i) => ({
    ...c,
    id: i,
    angle: Math.PI - (Math.PI / 5) * i,
    radius: 38,
  }));
  const companies: Company[] = COMPANIES.map((c, i) => ({
    ...c,
    id: i,
    angle: -(Math.PI / 5) * i,
    radius: 38,
  }));

  // cycle the "active match" highlight
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % Math.min(CANDIDATES.length, COMPANIES.length);
      setActiveMatch({ cand: idx, comp: idx });
      setMatchPulse((p) => p + 1);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // canvas: animated connection lines + traveling pulses
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

    // pulse particles traveling along connections
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

    const draw = (now: number) => {
      const dt = Math.min(now - prev, 64);
      prev = now;

      ctx.clearRect(0, 0, cw, ch);
      const cx = cw / 2;
      const cy = ch / 2;
      const radius = Math.min(cw, ch) * 0.38;

      // spawn new pulses periodically
      if (now - lastSpawn > 600) {
        lastSpawn = now;
        const ci = Math.floor(Math.random() * CANDIDATES.length);
        const co = Math.floor(Math.random() * COMPANIES.length);
        pulses.push({
          cand: ci,
          comp: co,
          t: 0,
          speed: 0.0006 + Math.random() * 0.0004,
          color: CANDIDATES[ci].color,
        });
        if (pulses.length > 18) pulses.shift();
      }

      // helper: position of a node
      const posOf = (angle: number) => ({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      });

      // draw static connection lines (candidate -> core -> company)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < CANDIDATES.length; i++) {
        const cpos = posOf(candidates[i].angle);
        const alpha = 0.12 + 0.08 * Math.sin(now * 0.002 + i);
        ctx.strokeStyle = `rgba(${candidates[i].color},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cpos.x, cpos.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }
      for (let i = 0; i < COMPANIES.length; i++) {
        const copos = posOf(companies[i].angle);
        const alpha = 0.12 + 0.08 * Math.sin(now * 0.002 + i + 1);
        ctx.strokeStyle = `rgba(${companies[i].color},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(copos.x, copos.y);
        ctx.stroke();
      }

      // highlight active match with brighter line
      if (activeMatch) {
        const cpos = posOf(candidates[activeMatch.cand].angle);
        const copos = posOf(companies[activeMatch.comp].angle);
        const pulseAlpha = 0.4 + 0.3 * Math.sin(now * 0.005);
        ctx.strokeStyle = `rgba(0,184,255,${pulseAlpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cpos.x, cpos.y);
        ctx.lineTo(cx, cy);
        ctx.lineTo(copos.x, copos.y);
        ctx.stroke();
      }

      // update + draw traveling pulses
      for (const p of pulses) {
        p.t += p.speed * dt;
        if (p.t > 1) {
          p.t = 1;
        }
        const cpos = posOf(candidates[p.cand].angle);
        const copos = posOf(companies[p.comp].angle);
        // path: candidate -> core -> company
        let px: number, py: number;
        if (p.t < 0.5) {
          const f = p.t / 0.5;
          px = cpos.x + (cx - cpos.x) * f;
          py = cpos.y + (cy - cpos.y) * f;
        } else {
          const f = (p.t - 0.5) / 0.5;
          px = cx + (copos.x - cx) * f;
          py = cy + (copos.y - cy) * f;
        }
        // trailing tail
        for (let s = 0; s < 5; s++) {
          const f = Math.max(0, p.t - s * 0.03);
          let tx: number, ty: number;
          if (f < 0.5) {
            const ff = f / 0.5;
            tx = cpos.x + (cx - cpos.x) * ff;
            ty = cpos.y + (cy - cpos.y) * ff;
          } else {
            const ff = (f - 0.5) / 0.5;
            tx = cx + (copos.x - cx) * ff;
            ty = cy + (copos.y - cy) * ff;
          }
          ctx.fillStyle = `rgba(${p.color},${0.45 * (1 - s / 5)})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 2.4 - s * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        // bright head
        ctx.fillStyle = `rgba(${p.color},0.95)`;
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(px, py, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      // prune finished pulses
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
    <div ref={containerRef} className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
      {/* Canvas connection layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Central AI Core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <AICore pulseKey={matchPulse} />
      </div>

      {/* Candidate cards (left arc) */}
      {candidates.map((c) => (
        <NodeWrapper key={`c-${c.id}`} angle={c.angle} radius={38} side="left">
          <CandidateCard candidate={c} active={activeMatch?.cand === c.id} />
        </NodeWrapper>
      ))}

      {/* Company cards (right arc) */}
      {companies.map((c) => (
        <NodeWrapper key={`co-${c.id}`} angle={c.angle} radius={38} side="right">
          <CompanyCard company={c} active={activeMatch?.comp === c.id} />
        </NodeWrapper>
      ))}

      {/* Floating data elements (corners) */}
      <FloatingStat className="top-2 left-2 sm:top-4 sm:left-4" stat={FLOATING_STATS[0]} delay={0} />
      <FloatingStat className="top-2 right-2 sm:top-4 sm:right-4" stat={FLOATING_STATS[1]} delay={0.15} />
      <FloatingStat className="bottom-2 left-2 sm:bottom-4 sm:left-4" stat={FLOATING_STATS[2]} delay={0.3} />
      <FloatingStat className="bottom-2 right-2 sm:bottom-4 sm:right-4" stat={FLOATING_STATS[3]} delay={0.45} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Position wrapper — places a node at a polar coordinate            */
/* ------------------------------------------------------------------ */

function NodeWrapper({
  angle,
  radius,
  side,
  children,
}: {
  angle: number;
  radius: number;
  side: 'left' | 'right';
  children: React.ReactNode;
}) {
  // convert polar to % position
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute z-10"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        animate={{ y: [0, side === 'left' ? -6 : 6, 0] }}
        transition={{ duration: 5 + (side === 'left' ? 0.5 : 0), repeat: Infinity, ease: 'easeInOut' }}
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
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
      {/* outer glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-radial from-cyan-electric/30 via-azure/15 to-transparent blur-xl"
      />
      {/* rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border border-cyan-electric/30"
        style={{ borderTopColor: 'rgba(0,184,255,0.8)', borderRightColor: 'rgba(59,130,246,0.5)' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-5 rounded-full border border-azure/20"
        style={{ borderBottomColor: 'rgba(59,130,246,0.7)', borderLeftColor: 'rgba(0,184,255,0.4)' }}
      />
      {/* core glass disc */}
      <div className="relative glass rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-electric via-azure to-violet2 mb-1">
          <Cpu size={18} className="text-white" />
        </span>
        <span className="font-display text-[10px] font-semibold tracking-[0.18em] text-ink">TABASHIR</span>
        <span className="text-[8px] tracking-[0.2em] text-muted uppercase">AI Core</span>
      </div>
      {/* match pulse ripple */}
      <AnimatePresence>
        <motion.div
          key={pulseKey}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-cyan-electric"
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
      className={`glass rounded-2xl p-3 w-[180px] sm:w-[200px] transition-all duration-500 ${
        active ? 'ring-2 ring-cyan-electric/60 shadow-lg shadow-cyan-electric/20' : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${candidate.bg}`}>
          <span className="font-display text-xs font-semibold text-ink">
            {candidate.name.split(' ').map((n) => n[0]).join('')}
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink truncate">{candidate.name}</p>
          <p className="text-[10px] text-muted truncate">{candidate.role}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {candidate.skills.map((s) => (
          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/60 text-muted border border-white/70">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] text-muted">{candidate.exp} exp</span>
        <span
          className={`inline-flex items-center gap-1 text-[9px] font-medium ${
            candidate.available ? 'text-emerald2' : 'text-muted'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${candidate.available ? 'bg-emerald2' : 'bg-muted/50'}`} />
          {candidate.available ? 'Available' : 'Busy'}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="flex-1 h-1 rounded-full bg-ink/8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${candidate.match}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full bg-gradient-to-r from-cyan-electric to-azure`}
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
      className={`glass rounded-2xl p-3 w-[180px] sm:w-[200px] transition-all duration-500 ${
        active ? 'ring-2 ring-cyan-electric/60 shadow-lg shadow-cyan-electric/20' : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${company.bg}`}>
          <Building2 size={16} className={company.text} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink truncate">{company.name}</p>
          <p className="text-[10px] text-muted truncate">{company.industry}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted">
          <Briefcase size={11} className="text-muted" />
          {company.openings} open
        </span>
        <span className={`inline-flex items-center gap-1 text-[9px] font-medium ${company.text}`}>
          <Sparkles size={10} />
          Hiring
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < 3 ? company.bg : 'bg-ink/8'}`}
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
        <div className="glass-soft rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${stat.bg}`}>
            <stat.icon size={14} className={stat.text} />
          </span>
          <div>
            <p className={`font-display text-sm font-semibold ${stat.text}`}>{stat.label}</p>
            <p className="text-[9px] tracking-widest uppercase text-muted">{stat.sub}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  Network,
  Send,
  ScanLine,
  PenLine,
  Activity,
  type LucideIcon,
} from 'lucide-react';

/**
 * BentoGrid — asymmetric service grid. Each service has a different size and
 * its own bespoke animation visualizing how Tabashir works.
 */
export default function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="services" ref={ref} className="relative z-10 px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 sm:mb-16 max-w-2xl"
        >
          <p className="text-xs tracking-[0.3em] text-muted uppercase mb-3">The Six Services</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-ink leading-tight">
            Everything is handled. <span className="holo-text font-medium">By us.</span>
          </h2>
          <p className="mt-4 text-muted text-lg font-light">
            Six precise capabilities, working together as one intelligent representation service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 sm:gap-4 auto-rows-[minmax(220px,auto)]">
          <Tile
            className="md:col-span-3 md:row-span-2"
            icon={FileText}
            index={0}
            title="Professional CV"
            sub="ATS-Optimized · Arabic & English"
            description="A holographic document automatically restructures into a polished ATS resume."
            inView={inView}
          >
            <CVAnimation />
          </Tile>

          <Tile
            className="md:col-span-3"
            icon={Network}
            index={1}
            title="Smart Matching"
            sub="Across UAE job boards"
            description="Hundreds of glowing nodes reorganize until only the best opportunities remain connected."
            inView={inView}
          >
            <MatchingAnimation />
          </Tile>

          <Tile
            className="md:col-span-3"
            icon={Send}
            index={2}
            title="We Apply For You"
            sub="Zero effort on your side"
            description="A beautiful light path travels toward company nodes."
            inView={inView}
          >
            <ApplyAnimation />
          </Tile>

          <Tile
            className="md:col-span-2"
            icon={ScanLine}
            index={3}
            title="Human Review"
            sub="Before every application"
            description="A holographic scanner verifies every application before approval."
            inView={inView}
          >
            <ScanAnimation />
          </Tile>

          <Tile
            className="md:col-span-2"
            icon={PenLine}
            index={4}
            title="Cover Letters"
            sub="Tailored for every job"
            description="Transparent pages write themselves with elegant animated typography."
            inView={inView}
          >
            <CoverAnimation />
          </Tile>

          <Tile
            className="md:col-span-2"
            icon={Activity}
            index={5}
            title="Tracking Dashboard"
            sub="Live status updates"
            description="Applications move across a futuristic timeline with live status updates."
            inView={inView}
          >
            <TimelineAnimation />
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({
  className,
  icon: Icon,
  index,
  title,
  sub,
  description,
  inView,
  children,
}: {
  className: string;
  icon: LucideIcon;
  index: number;
  title: string;
  sub: string;
  description: string;
  inView: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: py * -6, ry: px * 6 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      className={`${className} relative`}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        className="tilt-card glass rounded-3xl p-6 sm:p-7 h-full flex flex-col relative overflow-hidden group"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {/* hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-electric/10 via-transparent to-violet2/10" />
        </div>

        <div className="flex items-start justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/80">
              <Icon size={18} className="text-ink" />
            </span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-medium text-ink leading-tight">
                {title}
              </h3>
              <p className="text-[11px] tracking-[0.15em] text-muted uppercase mt-0.5">{sub}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted/60 tabular-nums">
            0{index + 1}
          </span>
        </div>

        <div className="flex-1 relative min-h-[120px]">{children}</div>

        <p className="mt-4 text-sm text-muted font-light leading-relaxed relative">{description}</p>
      </div>
    </motion.div>
  );
}

/* ---- Per-service animations ---- */

function CVAnimation() {
  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Holographic document */}
      <div className="relative w-44 h-56 rounded-xl glass-soft p-3 overflow-hidden">
        <div className="space-y-1.5">
          <div className="h-2 w-1/2 bg-ink/20 rounded" />
          <div className="h-1.5 w-3/4 bg-ink/10 rounded" />
          <div className="h-1.5 w-2/3 bg-ink/10 rounded" />
        </div>
        <div className="mt-3 space-y-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ width: '20%', opacity: 0.3 }}
              animate={{ width: `${50 + Math.random() * 45}%`, opacity: 0.7 }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity, repeatType: 'reverse' }}
              className="h-1.5 rounded bg-gradient-to-r from-cyan-electric/40 to-azure/40"
            />
          ))}
        </div>
        {/* restructure scan */}
        <div className="scan-line" />
        {/* ATS badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-2 right-2 text-[9px] tracking-widest text-emerald2 font-medium"
        >
          ATS 98
        </motion.div>
      </div>
      {/* floating language tags */}
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-2 left-6 glass-soft rounded-full px-2 py-1 text-[9px] tracking-widest text-ink"
      >
        EN
      </motion.span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-4 right-4 glass-soft rounded-full px-2 py-1 text-[9px] tracking-widest text-ink"
      >
        عربي
      </motion.span>
    </div>
  );
}

function MatchingAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const nodes = Array.from({ length: 24 }, (_, i) => ({
    x: 8 + (i % 8) * 11,
    y: 12 + Math.floor(i / 8) * 22,
  }));
  return (
    <div ref={ref} className="relative h-full">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70" preserveAspectRatio="none">
        {nodes.map((n, i) => {
          const target = nodes[(i + 5) % nodes.length];
          return (
            <line
              key={i}
              x1={n.x}
              y1={n.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="0.3"
              className="neural-line"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 1.2 : 0.7} fill="rgba(0,184,255,0.8)">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${3 + (i % 4)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}
      </svg>
      {inView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="glass-soft rounded-full px-3 py-1 text-[10px] tracking-widest text-emerald2 font-medium"
          >
            3 MATCHES FOUND
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ApplyAnimation() {
  return (
    <div className="relative h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
        {/* candidate */}
        <circle cx="20" cy="40" r="5" fill="rgba(0,184,255,0.9)" />
        <circle cx="20" cy="40" r="9" fill="none" stroke="rgba(0,184,255,0.4)" strokeWidth="0.5">
          <animate attributeName="r" values="5;12;5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* companies */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={160 + i * 14} cy={20 + i * 22} r="3.5" fill="rgba(139,92,246,0.8)" />
            <path
              d={`M 25 40 Q 90 ${20 + i * 20} ${160 + i * 14} ${20 + i * 22}`}
              stroke="rgba(0,184,255,0.7)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="200"
              strokeDashoffset="200"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="200;0;200"
                dur={`${4 + i}s`}
                repeatCount="indefinite"
                begin={`${i * 1.3}s`}
              />
            </path>
            {/* traveling particle */}
            <circle r="2" fill="rgba(246,183,60,1)">
              <animateMotion
                dur={`${4 + i}s`}
                repeatCount="indefinite"
                begin={`${i * 1.3}s`}
                path={`M 25 40 Q 90 ${20 + i * 20} ${160 + i * 14} ${20 + i * 22}`}
              />
            </circle>
            {/* ripple */}
            <circle cx={160 + i * 14} cy={20 + i * 22} r="3.5" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="0.6">
              <animate attributeName="r" values="3.5;14;3.5" dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 1.3 + 2}s`} />
              <animate attributeName="opacity" values="0.8;0;0.8" dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 1.3 + 2}s`} />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ScanAnimation() {
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="relative w-28 h-36 rounded-lg glass-soft overflow-hidden">
        <div className="p-2 space-y-1">
          <div className="h-1.5 w-2/3 bg-ink/15 rounded" />
          <div className="h-1 w-full bg-ink/10 rounded" />
          <div className="h-1 w-5/6 bg-ink/10 rounded" />
          <div className="h-1 w-full bg-ink/10 rounded" />
        </div>
        <div className="scan-line" />
        {/* checkmark reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-2 right-2 text-emerald2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function CoverAnimation() {
  const lines = ['Dear Hiring Team,', 'With seven years in', 'strategy and growth,'];
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="relative w-40 h-44 rounded-lg glass-soft p-3 overflow-hidden">
        {lines.map((l, i) => (
          <div key={i} className="mb-1.5">
            <span
              className="type-line text-[9px] text-ink/70 leading-tight"
              style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3.5s' }}
            >
              {l}
            </span>
          </div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 1, delay: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute bottom-2 right-2 text-[9px] text-violet2 tracking-widest"
        >
          TAILORED
        </motion.div>
      </div>
    </div>
  );
}

function TimelineAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const steps = ['Sent', 'Reviewed', 'Interview', 'Offer'];
  return (
    <div ref={ref} className="relative h-full flex flex-col justify-center">
      <div className="relative pl-2">
        <div className="absolute left-[10px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-electric/40 via-azure/40 to-violet2/40" />
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.4, duration: 0.5 }}
            className="flex items-center gap-3 mb-3 last:mb-0"
          >
            <span className="timeline-dot relative inline-flex w-3 h-3 rounded-full bg-white border border-cyan-electric z-10" />
            <span className="text-[11px] text-ink font-medium">{s}</span>
            <span className="text-[9px] text-muted ml-auto tabular-nums">{['12:04', '14:22', '—', '—'][i]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import AINetwork from './AINetwork';
import { useMagnetic, useScramble } from '@/lib/interactions';

export default function Hero() {
  const primary = useMagnetic<HTMLAnchorElement>(0.3);
  const secondary = useMagnetic<HTMLAnchorElement>(0.25);
  const headline = useScramble('YOUR CAREER', true, 1100);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center pt-28 pb-16 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: oversized typography */}
        <div className="lg:col-span-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-soft rounded-full pl-2 pr-4 py-1.5 mb-8"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-electric/15">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse-soft" />
            </span>
            <span className="text-xs tracking-[0.2em] text-muted font-medium">
              UAE · RECRUITMENT · 2060
            </span>
          </motion.div>

          <h1 className="font-display font-light leading-[0.92] tracking-tight text-ink text-[clamp(3rem,9vw,8.5rem)]">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="block scramble"
            >
              {headline}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="block holo-text font-medium"
            >
              ALREADY IN MOTION
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 max-w-xl text-lg sm:text-xl text-muted leading-relaxed font-light"
          >
            You don't search. You don't apply. <span className="text-ink">We represent you.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              ref={primary.setRef}
              href="#contact"
              data-magnetic
              className="magnetic group inline-flex items-center gap-2.5 rounded-full bg-ink text-white text-sm font-medium px-7 py-4 hover:bg-ink/90 transition-colors relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-electric/0 via-cyan-electric/30 to-cyan-electric/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative">Start My Journey</span>
              <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              ref={secondary.setRef}
              href="#how"
              data-magnetic
              className="magnetic group inline-flex items-center gap-2.5 rounded-full glass text-ink text-sm font-medium px-7 py-4 hover:bg-white/80 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ink/5 group-hover:bg-cyan-electric/15 transition-colors">
                <Play size={11} className="ml-0.5 text-ink" />
              </span>
              See How It Works
            </a>
          </motion.div>

          {/* Floating glass panels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            <FloatingPanel label="AI Match" value="98.4%" accent="cyan" />
            <FloatingPanel label="Live Applications" value="877" accent="azure" />
            <FloatingPanel label="Hiring Companies" value="318" accent="emerald" />
          </motion.div>
        </div>

        {/* Right: AI universe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[5/3] w-full max-w-[640px] mx-auto">
            {/* Glass disc backdrop */}
            <div className="absolute inset-0 rounded-[2rem] glass-soft overflow-hidden" />
            <div className="absolute inset-0 scale-90">
              <AINetwork />
            </div>
            {/* Floating labels */}
            <FloatingTag className="top-4 left-3" text="AI Engine" color="text-cyan-electric" />
            <FloatingTag className="bottom-4 right-3" text="Live Matching" color="text-azure" />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
        <span className="w-px h-10 bg-gradient-to-b from-muted/60 to-transparent relative overflow-hidden">
          <motion.span
            animate={{ y: [-40, 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-0 h-4 bg-cyan-electric"
          />
        </span>
      </motion.div>
    </section>
  );
}

function FloatingPanel({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'cyan' | 'azure' | 'emerald';
}) {
  const color =
    accent === 'cyan' ? 'text-cyan-electric' : accent === 'azure' ? 'text-azure' : 'text-emerald2';
  return (
    <div className="glass rounded-2xl px-5 py-3 flex items-center gap-4">
      <div>
        <div className="text-[10px] tracking-[0.2em] text-muted uppercase">{label}</div>
        <div className={`font-display text-xl font-medium ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function FloatingTag({
  className,
  text,
  color,
}: {
  className: string;
  text: string;
  color: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute ${className} glass-soft rounded-full px-3 py-1.5 text-[10px] tracking-[0.2em] font-medium ${color}`}
    >
      {text}
    </motion.div>
  );
}

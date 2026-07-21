import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '@/lib/interactions';

const STATS = [
  { label: 'Applications Sent', value: 10393, suffix: '+', accent: 'cyan' },
  { label: 'Live Jobs', value: 877, suffix: '+', accent: 'azure' },
  { label: 'Professional CVs', value: 712, suffix: '+', accent: 'violet' },
  { label: 'Job Seekers', value: 731, suffix: '+', accent: 'emerald' },
  { label: 'Hiring Companies', value: 318, suffix: '+', accent: 'gold' },
];

const ACCENT: Record<string, string> = {
  cyan: 'text-cyan-electric',
  azure: 'text-azure',
  violet: 'text-violet2',
  emerald: 'text-emerald2',
  gold: 'text-gold',
};

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative z-10 px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] text-muted uppercase mb-3">Live Network</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-ink">
            A recruitment engine, <span className="holo-text font-medium">already running</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof STATS)[number];
  index: number;
  inView: boolean;
}) {
  const { value, setEl } = useCountUp(stat.value, 2400);

  return (
    <motion.div
      ref={setEl}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
      <div className={`font-display text-3xl sm:text-5xl font-medium ${ACCENT[stat.accent]} tabular-nums`}>
        {value.toLocaleString()}
        <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-xs sm:text-sm text-muted tracking-wide">{stat.label}</div>
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-electric/30 to-transparent" />
    </motion.div>
  );
}

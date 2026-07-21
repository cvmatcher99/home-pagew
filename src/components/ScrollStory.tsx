import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserPlus, Sparkles, Send, Activity, Trophy } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'You share your information',
    body: 'One calm conversation. You provide your background once — in Arabic or English. Nothing else is asked of you.',
    accent: 'cyan',
  },
  {
    icon: Sparkles,
    title: 'AI builds your representation',
    body: 'Our AI drafts your ATS-optimized CV, matches you across UAE job boards, and tailors a cover letter for every opportunity.',
    accent: 'azure',
  },
  {
    icon: Send,
    title: 'We apply for you',
    body: 'Every application is submitted by Tabashir — not by you. A light path travels from your profile to each company.',
    accent: 'violet',
  },
  {
    icon: Activity,
    title: 'Human review, then live tracking',
    body: 'A specialist verifies each application before it goes. You watch every status update on a live dashboard.',
    accent: 'emerald',
  },
  {
    icon: Trophy,
    title: 'You receive the outcome',
    body: 'Interviews, offers, and opportunities arrive. You were represented — professionally, intelligently, completely.',
    accent: 'gold',
  },
];

const ACCENT_BG: Record<string, string> = {
  cyan: 'from-cyan-electric/20 to-cyan-electric/5',
  azure: 'from-azure/20 to-azure/5',
  violet: 'from-violet2/20 to-violet2/5',
  emerald: 'from-emerald2/20 to-emerald2/5',
  gold: 'from-gold/20 to-gold/5',
};
const ACCENT_TEXT: Record<string, string> = {
  cyan: 'text-cyan-electric',
  azure: 'text-azure',
  violet: 'text-violet2',
  emerald: 'text-emerald2',
  gold: 'text-gold',
};

export default function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section id="how" ref={ref} className="relative z-10 px-4 sm:px-8 py-20 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-xs tracking-[0.3em] text-muted uppercase mb-3">The Journey</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-ink">
            How <span className="holo-text font-medium">Tabashir</span> represents you
          </h2>
        </motion.div>

        <div className="relative pl-8 sm:pl-0">
          {/* Flight-path progress indicator */}
          <div className="absolute left-3 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-ink/8" />
            <motion.div
              style={{ height: progressHeight, opacity: progressOpacity }}
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-cyan-electric via-azure to-violet2"
            />
          </div>

          <div className="space-y-16 sm:space-y-24">
            {STEPS.map((s, i) => (
              <Step key={i} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const Icon = step.icon;
  const left = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative sm:grid sm:grid-cols-2 sm:gap-12 items-center ${left ? '' : ''}`}
    >
      {/* Node dot */}
      <div className="absolute left-3 sm:left-1/2 top-2 -translate-x-1/2 z-10">
        <span className="timeline-dot inline-flex items-center justify-center w-8 h-8 rounded-full glass border border-white/80">
          <Icon size={14} className={ACCENT_TEXT[step.accent]} />
        </span>
      </div>

      <div className={`pl-12 sm:pl-0 ${left ? 'sm:pr-12 sm:text-right' : 'sm:col-start-2 sm:pl-12'}`}>
        <div className={`glass rounded-3xl p-6 sm:p-8 relative overflow-hidden`}>
          <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${ACCENT_BG[step.accent]} blur-2xl`} />
          <span className={`text-[11px] tracking-[0.2em] uppercase ${ACCENT_TEXT[step.accent]} font-medium`}>
            Step 0{index + 1}
          </span>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-medium text-ink">{step.title}</h3>
          <p className="mt-3 text-muted font-light leading-relaxed">{step.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Check,
  Bell,
  Search,
  Briefcase,
  TrendingUp,
  FileText,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const NOTIFICATIONS = [
  { icon: Check, title: 'Application Sent', sub: 'Dubai · Emirates NBD', bg: 'bg-emerald2/15', text: 'text-emerald2' },
  { icon: Sparkles, title: 'AI Match Found', sub: 'Software Engineer · 96% Match', bg: 'bg-cyan-electric/15', text: 'text-cyan-electric' },
  { icon: FileText, title: 'CV Updated Successfully', sub: 'ATS Score: 98', bg: 'bg-azure/15', text: 'text-azure' },
  { icon: Check, title: 'Human Review Completed', sub: 'Approved by specialist', bg: 'bg-emerald2/15', text: 'text-emerald2' },
  { icon: Bell, title: 'Interview Invitation', sub: 'Sharjah · Air Arabia', bg: 'bg-violet2/15', text: 'text-violet2' },
  { icon: TrendingUp, title: 'Applications Today: 8', sub: 'New record this week', bg: 'bg-gold/15', text: 'text-gold' },
];

const SCREEN_STATES = ['dashboard', 'match', 'review', 'applied', 'notification'] as const;
type ScreenState = (typeof SCREEN_STATES)[number];

const JOBS = [
  { title: 'Senior Analyst', company: 'Emirates NBD', emirate: 'Dubai', match: 96 },
  { title: 'Software Engineer', company: 'G42', emirate: 'Abu Dhabi', match: 94 },
  { title: 'Project Manager', company: 'Emaar', emirate: 'Dubai', match: 91 },
  { title: 'Marketing Lead', company: 'Air Arabia', emirate: 'Sharjah', match: 88 },
];

const TIMELINE = [
  { label: 'Application Sent', time: '09:14', done: true },
  { label: 'Human Review', time: '10:42', done: true },
  { label: 'AI Screening', time: '11:08', done: true },
  { label: 'Interview Invite', time: '—', done: false },
];

export default function AppShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const phoneY = useSpring(useTransform(scrollYProgress, [0, 0.45], [180, 0]), { stiffness: 60, damping: 20 });
  const phoneRotate = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [12, -4, -14]), { stiffness: 50, damping: 18 });
  const phoneScale = useSpring(useTransform(scrollYProgress, [0, 0.4], [0.7, 1]), { stiffness: 60, damping: 20 });
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.6]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [0.6, 1.2]);

  const [screenState, setScreenState] = useState<ScreenState>('dashboard');
  const [activeNotifs, setActiveNotifs] = useState<number[]>([]);

  // cycle through live screen states
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SCREEN_STATES.length;
      setScreenState(SCREEN_STATES[idx]);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // floating notification cards cycle
  useEffect(() => {
    const spawn = () => {
      const id = Date.now() + Math.random();
      setActiveNotifs((prev) => [...prev, id]);
      setTimeout(() => setActiveNotifs((prev) => prev.filter((n) => n !== id)), 5200);
    };
    const interval = setInterval(spawn, 1800);
    spawn();
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 overflow-hidden py-24 sm:py-36">
      {/* bright Apple-inspired ambient background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
          <motion.div
            style={{ scale: glowScale }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-cyan-electric/12 via-azure/8 to-transparent blur-3xl"
          />
          <div className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full bg-violet2/8 blur-3xl" />
          <div className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-emerald2/8 blur-3xl" />
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-muted uppercase mb-4">The App</p>
          <h2 className="font-display text-4xl sm:text-6xl font-light text-ink leading-[1.05]">
            Your Career.
            <br />
            <span className="holo-text font-medium">Always With You.</span>
          </h2>
          <p className="mt-6 text-muted text-lg font-light leading-relaxed">
            Monitor every application, receive instant updates, discover new opportunities, and stay
            connected with your recruitment journey wherever you are.
          </p>
        </motion.div>

        {/* Phone stage */}
        <div className="relative flex items-center justify-center min-h-[640px] sm:min-h-[720px]">
          {/* Background device (blurred, behind) */}
          <motion.div
            style={{ opacity: phoneOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              style={{ rotate: phoneRotate, scale: phoneScale, y: phoneY }}
              className="relative"
            >
              {/* second device — slightly offset, blurred */}
              <div
                className="absolute -right-24 top-8 opacity-50 blur-md scale-95"
                style={{ transform: 'rotate(6deg)' }}
              >
                <PhoneFrame>
                  <PhoneScreen state={screenState} />
                </PhoneFrame>
              </div>
            </motion.div>
          </motion.div>

          {/* Main phone */}
          <motion.div
            style={{ opacity: phoneOpacity, y: phoneY, rotate: phoneRotate, scale: phoneScale }}
            className="relative z-20"
          >
            <PhoneFrame>
              <PhoneScreen state={screenState} />
            </PhoneFrame>

            {/* glass reflection sweep */}
            <div
              className="absolute inset-0 rounded-[2.5rem] pointer-events-none overflow-hidden"
              style={{ zIndex: 30 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <motion.div
                animate={{ x: ['-120%', '120%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
              />
            </div>

            {/* soft shadow under phone */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full bg-ink/15 blur-2xl" />
          </motion.div>

          {/* Floating holographic notification cards */}
          <FloatingNotifs activeIds={activeNotifs} />
        </div>

        {/* Download buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
        >
          <StoreButton
            platform="apple"
            topLine="Download on the"
            bottomLine="App Store"
          />
          <StoreButton
            platform="google"
            topLine="Get it on"
            bottomLine="Google Play"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---- Phone Frame ---- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[260px] sm:w-[280px] h-[540px] sm:h-[580px] rounded-[2.5rem] p-[3px] bg-gradient-to-b from-slate-200 to-slate-400 shadow-2xl">
      <div className="relative w-full h-full rounded-[2.4rem] bg-ink overflow-hidden">
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink rounded-b-2xl z-40" />
        {/* screen */}
        <div className="absolute inset-0 rounded-[2.4rem] overflow-hidden bg-base">
          {children}
        </div>
      </div>
      {/* side buttons */}
      <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-slate-400 rounded-l-sm" />
      <div className="absolute -left-[3px] top-36 w-[3px] h-12 bg-slate-400 rounded-l-sm" />
      <div className="absolute -right-[3px] top-32 w-[3px] h-16 bg-slate-400 rounded-r-sm" />
    </div>
  );
}

/* ---- Phone Screen (live, animated) ---- */

function PhoneScreen({ state }: { state: ScreenState }) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[9px] text-muted font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-2 rounded-sm border border-muted/40" />
          <span className="w-4 h-2 rounded-sm border border-muted/40" />
        </div>
      </div>

      {/* app header */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-electric via-azure to-violet2">
              <span className="font-display font-bold text-white text-[10px]">T</span>
            </span>
            <span className="font-display font-semibold text-ink text-xs tracking-wide">Tabashir</span>
          </div>
          <Bell size={13} className="text-muted" />
        </div>
      </div>

      {/* animated content area */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          {state === 'dashboard' && <DashboardScreen />}
          {state === 'match' && <MatchScreen />}
          {state === 'review' && <ReviewScreen />}
          {state === 'applied' && <AppliedScreen />}
          {state === 'notification' && <NotificationScreen />}
        </motion.div>
      </div>

      {/* bottom tab bar */}
      <div className="flex items-center justify-around px-6 py-3 border-t border-ink/5 bg-white/50 backdrop-blur-sm">
        <TabIcon icon={Briefcase} active />
        <TabIcon icon={Search} />
        <TabIcon icon={FileText} />
        <TabIcon icon={TrendingUp} />
      </div>
    </div>
  );
}

function TabIcon({ icon: Icon, active }: { icon: typeof Bell; active?: boolean }) {
  return (
    <div className={`p-1.5 rounded-lg ${active ? 'bg-cyan-electric/15' : ''}`}>
      <Icon size={14} className={active ? 'text-cyan-electric' : 'text-muted/60'} />
    </div>
  );
}

/* ---- Screen variants ---- */

function DashboardScreen() {
  return (
    <div className="px-4 pt-2 space-y-3">
      <div>
        <p className="text-[9px] text-muted tracking-widest uppercase">Good morning</p>
        <p className="font-display text-base font-medium text-ink">Your Dashboard</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Applications" value="8" trend="+3" />
        <StatCard label="Interviews" value="2" trend="+1" />
        <StatCard label="AI Matches" value="14" trend="+5" />
        <StatCard label="Avg. Match" value="93%" trend="+2%" />
      </div>
      <div className="glass-soft rounded-xl p-3">
        <p className="text-[9px] text-muted tracking-widest uppercase mb-2">This Week</p>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-electric/40 to-azure/60"
            />
          ))}
        </div>
      </div>
      <div className="glass-soft rounded-xl p-3">
        <p className="text-[9px] text-muted tracking-widest uppercase mb-2">Live Timeline</p>
        <div className="space-y-2">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-2"
            >
              <span
                className={`w-2 h-2 rounded-full ${t.done ? 'bg-emerald2' : 'bg-muted/30'}`}
              />
              <span className="text-[10px] text-ink font-medium">{t.label}</span>
              <span className="text-[9px] text-muted ml-auto tabular-nums">{t.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="glass-soft rounded-xl p-2.5">
      <p className="text-[8px] text-muted tracking-widest uppercase">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-display text-lg font-medium text-ink">{value}</span>
        <span className="text-[8px] text-emerald2 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function MatchScreen() {
  return (
    <div className="px-4 pt-2">
      <p className="text-[9px] text-muted tracking-widest uppercase mb-2">AI Matching</p>
      <div className="space-y-2">
        {JOBS.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="glass-soft rounded-xl p-2.5 flex items-center gap-2.5"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-electric/15">
              <Briefcase size={12} className="text-cyan-electric" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-ink truncate">{job.title}</p>
              <p className="text-[8px] text-muted truncate">{job.company} · {job.emirate}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-display font-medium text-cyan-electric">{job.match}%</span>
              <div className="w-10 h-1 rounded-full bg-ink/8 mt-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${job.match}%` }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-electric to-azure"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReviewScreen() {
  return (
    <div className="px-4 pt-2">
      <p className="text-[9px] text-muted tracking-widest uppercase mb-2">Human Review</p>
      <div className="glass-soft rounded-xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-azure/15">
            <FileText size={14} className="text-azure" />
          </span>
          <div>
            <p className="text-[10px] font-medium text-ink">Senior Analyst</p>
            <p className="text-[8px] text-muted">Emirates NBD · Dubai</p>
          </div>
        </div>
        <div className="space-y-2">
          {['CV Verified', 'Cover Letter Approved', 'ATS Optimized'].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald2/15"
              >
                <Check size={9} className="text-emerald2" />
              </motion.span>
              <span className="text-[9px] text-ink">{step}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-3 pt-2 border-t border-ink/5 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald2 animate-pulse" />
          <span className="text-[9px] text-emerald2 font-medium">Approved</span>
        </motion.div>
      </div>
    </div>
  );
}

function AppliedScreen() {
  return (
    <div className="px-4 pt-2 flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald2/15 mb-4"
      >
        <Check size={28} className="text-emerald2" strokeWidth={3} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-base font-medium text-ink"
      >
        Application Sent
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] text-muted mt-1"
      >
        Emirates NBD · Dubai
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-24 h-1 rounded-full bg-gradient-to-r from-emerald2 to-cyan-electric mt-4 origin-left"
      />
    </div>
  );
}

function NotificationScreen() {
  return (
    <div className="px-4 pt-2">
      <p className="text-[9px] text-muted tracking-widest uppercase mb-2">Notifications</p>
      <div className="space-y-2">
        {NOTIFICATIONS.slice(0, 4).map((n, i) => (
          <motion.div
            key={n.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 120 }}
            className="glass rounded-xl p-2.5 flex items-center gap-2.5"
          >
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${n.bg} shrink-0`}>
              <n.icon size={12} className={n.text} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-ink truncate">{n.title}</p>
              <p className="text-[8px] text-muted truncate">{n.sub}</p>
            </div>
            <ChevronRight size={12} className="text-muted/40 ml-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---- Floating Notification Cards ---- */

const FLOAT_POSITIONS = [
  { x: '-78%', y: '-8%', z: 10, delay: 0 },
  { x: '82%', y: '-18%', z: 40, delay: 0.6 },
  { x: '-88%', y: '22%', z: 5, delay: 1.2 },
  { x: '78%', y: '28%', z: 35, delay: 0.3 },
  { x: '-72%', y: '52%', z: 15, delay: 0.9 },
  { x: '85%', y: '55%', z: 45, delay: 1.5 },
];

function FloatingNotifs({ activeIds }: { activeIds: number[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeIds.map((id, idx) => {
        const pos = FLOAT_POSITIONS[idx % FLOAT_POSITIONS.length];
        const notif = NOTIFICATIONS[idx % NOTIFICATIONS.length];
        const Icon = notif.icon;
        return (
          // Anchor (percentage offset) lives on the outer element via CSS so
          // the inner motion layer can drift in px without mixing units.
          <div
            key={id}
            style={{ zIndex: pos.z, transform: `translate(${pos.x}, ${pos.y})` }}
            className="absolute left-1/2 top-1/2"
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: 1,
              y: [0, -12, -24],
            }}
            transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg w-[200px]">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${notif.bg} shrink-0`}>
                <Icon size={14} className={notif.text} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink truncate">{notif.title}</p>
                <p className="text-[10px] text-muted truncate">{notif.sub}</p>
              </div>
            </div>
          </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Store Buttons ---- */

function StoreButton({
  platform,
  topLine,
  bottomLine,
}: {
  platform: 'apple' | 'google';
  topLine: string;
  bottomLine: string;
}) {
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative inline-flex items-center gap-3 glass rounded-2xl px-6 py-3.5 overflow-hidden"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-electric/0 via-cyan-electric/10 to-cyan-electric/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      {platform === 'apple' ? <AppleIcon /> : <PlayStoreIcon />}
      <span className="relative text-left">
        <span className="block text-[10px] text-muted tracking-wide">{topLine}</span>
        <span className="block text-sm font-semibold text-ink">{bottomLine}</span>
      </span>
    </motion.a>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-ink relative">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.46 15.25 3.29 7.59 9.19 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.67 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="relative">
      <path d="M3.6 2.5c-.3.3-.5.7-.5 1.3v16.4c0 .6.2 1 .5 1.3l.1.1L13 12.1v-.2L3.7 2.4l-.1.1z" fill="#00B8FF" />
      <path d="M16.3 15.4L13 12.1l3.3-3.3 4.1 2.3c1.1.6 1.1 1.7 0 2.3l-4.1 2z" fill="#10B981" />
      <path d="M3.6 2.5c.4-.4 1-.4 1.6-.1L16 8.8l-3 3.3L3.6 2.5z" fill="#3B82F6" />
      <path d="M13 12.1l3 3.3-10.8 6.2c-.6.3-1.2.3-1.6-.1L13 12.1z" fill="#F6B73C" />
    </svg>
  );
}

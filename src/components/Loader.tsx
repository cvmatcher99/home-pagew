import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setVisible(false);
          onDone();
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-br from-cyan-electric via-azure to-violet2" />
                <span className="absolute inset-[3px] rounded-xl bg-white/90" />
                <span className="relative font-display font-bold text-ink text-2xl">T</span>
              </span>
              <span className="absolute -inset-3 rounded-3xl bg-cyan-electric/20 blur-xl animate-pulse-soft" />
            </motion.div>

            <div className="w-48 h-px bg-ink/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-electric to-violet2"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[11px] tracking-[0.3em] text-muted uppercase tabular-nums">
              {progress}% · Initializing
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

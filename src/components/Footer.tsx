import { motion } from 'framer-motion';
import { useScramble } from '@/lib/interactions';

export default function Footer() {
  const tag = useScramble('TABASHIR', true, 1200);
  return (
    <footer className="relative z-10 px-4 sm:px-8 pt-10 pb-12">
      <div className="mx-auto max-w-7xl glass rounded-3xl p-8 sm:p-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-br from-cyan-electric via-azure to-violet2" />
                <span className="absolute inset-[2px] rounded-md bg-white/85" />
                <span className="relative font-display font-bold text-ink text-sm">T</span>
              </span>
              <span className="font-display font-semibold tracking-[0.18em] text-sm scramble">
                {tag}
              </span>
            </div>
            <p className="text-sm text-muted font-light max-w-xs">
              The future of recruitment. We don't help you apply. We represent you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-3">Services</p>
              <ul className="space-y-2 text-sm text-ink">
                <li>Professional CV</li>
                <li>Smart Matching</li>
                <li>We Apply For You</li>
                <li>Human Review</li>
                <li>Cover Letters</li>
                <li>Tracking Dashboard</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-3">Company</p>
              <ul className="space-y-2 text-sm text-ink">
                <li><a href="#how" className="hover:text-cyan-electric">How it works</a></li>
                <li><a href="#universe" className="hover:text-cyan-electric">The Universe</a></li>
                <li><a href="#contact" className="hover:text-cyan-electric">Start</a></li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-3">Based in</p>
            <p className="text-sm text-ink">United Arab Emirates</p>
            <p className="text-sm text-muted font-light mt-1">Dubai · Abu Dhabi · 2060</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 pt-6 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-muted">© 2060 Tabashir. Representing careers, intelligently.</p>
          <p className="text-xs text-muted tracking-[0.2em] uppercase">Human expertise · Artificial intelligence</p>
        </motion.div>
      </div>
    </footer>
  );
}

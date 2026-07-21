import { motion } from 'framer-motion';
export default function Footer() {
  return (
    <footer className="relative z-10 px-4 sm:px-8 pt-10 pb-12">
      <div className="mx-auto max-w-7xl glass rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle logo watermark */}
        <img
          src="/logo_footer copy.png"
          alt=""
          aria-hidden
          className="absolute -right-4 -bottom-4 w-56 h-auto object-contain opacity-[0.04] pointer-events-none select-none"
        />
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="mb-3">
              <img
                src="/logo_footer copy.png"
                alt="Tabashir Artificial Intelligence"
                className="h-10 w-auto object-contain"
              />
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
            <p className="text-sm text-muted font-light mt-1">Dubai · Abu Dhabi · 2026</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 pt-6 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-muted">© 2026 Tabashir. Representing careers, intelligently.</p>
          <p className="text-xs text-muted tracking-[0.2em] uppercase">Human expertise · Artificial intelligence</p>
        </motion.div>
      </div>
    </footer>
  );
}

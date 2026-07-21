import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'Universe', href: '#universe' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 pt-3"
    >
      <nav
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-2xl px-4 sm:px-6 h-14 transition-all duration-500 ${
          scrolled ? 'glass' : 'glass-soft'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 group" data-magnetic>
          <Logo />
          <span className="font-display font-semibold tracking-[0.18em] text-sm text-ink">
            TABASHIR
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-muted hover:text-ink transition-colors relative group"
              data-magnetic
            >
              {l.label}
              <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-cyan-electric scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contact"
            data-magnetic
            className="magnetic inline-flex items-center gap-2 rounded-full bg-ink text-white text-sm font-medium px-5 py-2.5 hover:bg-ink/90 transition-colors"
          >
            Start My Journey
          </a>
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-auto max-w-7xl mt-2 glass rounded-2xl p-4 flex flex-col gap-2"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-ink hover:bg-white/60"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 text-center rounded-full bg-ink text-white text-sm font-medium px-5 py-3"
            >
              Start My Journey
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Logo() {
  return (
    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden">
      <img
        src="/Artboard_1_from_designs.png"
        alt="Tabashir"
        className="relative w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,184,255,0.4))' }}
      />
    </span>
  );
}

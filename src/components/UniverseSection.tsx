import { motion } from 'framer-motion';
import AINetwork from './AINetwork';

export default function UniverseSection() {
  return (
    <section id="universe" className="relative z-10 px-4 sm:px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-muted uppercase mb-3">The Intelligence Layer</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-ink leading-tight">
            AI connects <span className="holo-text font-medium">talent with opportunities</span>
          </h2>
          <p className="mt-4 text-muted text-lg font-light max-w-2xl mx-auto">
            A living network of candidates and companies, intelligently matched in real time. Our AI
            core reads skills, experience, and intent — then bridges the right person to the right role.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative"
        >
          <AINetwork />
        </motion.div>
      </div>
    </section>
  );
}

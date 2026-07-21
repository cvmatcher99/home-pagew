import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useMagnetic } from '@/lib/interactions';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const btn = useMagnetic<HTMLButtonElement>(0.25);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={ref} className="relative z-10 px-4 sm:px-8 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="glass rounded-[2rem] overflow-hidden relative">
          {/* ambient glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-electric/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet2/15 blur-3xl" />

          <div className="grid lg:grid-cols-2 relative">
            {/* Left: invitation */}
            <div className="p-8 sm:p-14">
              <p className="text-xs tracking-[0.3em] text-muted uppercase mb-4">Begin</p>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-ink leading-tight">
                Your career is <span className="holo-text font-medium">already in motion.</span>
              </h2>
              <p className="mt-5 text-muted text-lg font-light max-w-md">
                Share your information once. Tabashir's specialists and AI will represent you across the UAE — from CV to offer.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  'No job searching',
                  'No applications to fill',
                  'No repeated forms',
                  'Human review on every step',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-ink">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald2/15">
                      <Check size={12} className="text-emerald2" />
                    </span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="p-8 sm:p-14 bg-white/40 backdrop-blur-sm border-l border-white/60">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald2/15 mb-6">
                    <Check size={28} className="text-emerald2" />
                  </span>
                  <h3 className="font-display text-2xl font-medium text-ink">You're represented.</h3>
                  <p className="mt-3 text-muted font-light max-w-sm">
                    A Tabashir specialist will reach out shortly to begin your journey.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <Field
                    label="Full name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Your name"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="you@email.com"
                    required
                  />
                  <Field
                    label="Target role"
                    value={form.role}
                    onChange={(v) => setForm({ ...form, role: v })}
                    placeholder="e.g. Senior Analyst"
                  />

                  <button
                    ref={btn.setRef}
                    data-magnetic
                    type="submit"
                    className="magnetic group w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-white text-sm font-medium px-7 py-4 hover:bg-ink/90 transition-colors relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-electric/0 via-cyan-electric/30 to-cyan-electric/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative">Start My Journey</span>
                    <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[11px] text-muted text-center">
                    By starting, you agree to be represented by Tabashir.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.15em] uppercase text-muted font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl bg-white/70 border border-white/80 px-4 py-3 text-ink placeholder:text-muted/50 outline-none focus:border-cyan-electric/60 focus:ring-2 focus:ring-cyan-electric/20 transition"
      />
    </label>
  );
}

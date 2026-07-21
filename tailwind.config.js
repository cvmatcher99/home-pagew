/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F8FBFF',
        ink: '#111827',
        muted: '#5B6475',
        cyan: { electric: '#00B8FF' },
        azure: '#3B82F6',
        emerald2: '#10B981',
        violet2: '#8B5CF6',
        gold: '#F6B73C',
      },
      fontFamily: {
        display: ['"Neue Haas Grotesk Display Pro"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%)',
      },
      animation: {
        'float-slow': 'floatSlow 18s ease-in-out infinite',
        'float-slower': 'floatSlow 26s ease-in-out infinite',
        'drift': 'drift 40s linear infinite',
        'pulse-soft': 'pulseSoft 6s ease-in-out infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'beam': 'beam 7s ease-in-out infinite',
        'ripple': 'ripple 3.5s ease-out infinite',
        'scan': 'scan 4s ease-in-out infinite',
        'write': 'write 3s steps(40) infinite',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-24px,0) scale(1.03)' },
        },
        drift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(-50%) translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        beam: {
          '0%': { strokeDashoffset: '1200', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0.4)', opacity: '0.8' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        scan: {
          '0%,100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        write: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};

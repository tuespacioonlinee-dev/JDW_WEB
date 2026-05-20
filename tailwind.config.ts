import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0A0A0B',
        'bg-surface': '#111113',
        'bg-elevated': '#1A1A1D',
        border: 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.18)',
        primary: '#EDEDED',
        muted: 'rgba(237,237,237,0.65)',
        dim: 'rgba(237,237,237,0.45)',
        'accent-purple': '#7F77DD',
        'accent-teal': '#5DCAA5',
        'accent-coral': '#F0997B',
        'accent-pink': '#ED93B1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['12px', { letterSpacing: '0.05em', lineHeight: '1' }],
      },
      letterSpacing: {
        tightest: '-0.125em',
        tighter: '-0.075em',
        tight: '-0.05em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'glow-pulse': 'glowPulse 20s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marqueeReverse 30s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

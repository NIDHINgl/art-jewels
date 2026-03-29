import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: 'hsl(43, 74%, 39%)',
          light: 'hsl(43, 74%, 52%)',
          bright: 'hsl(46, 65%, 62%)',
        },
        champagne: 'hsl(34, 77%, 88%)',
        obsidian: {
          DEFAULT: 'hsl(0, 0%, 10%)',
          deep: 'hsl(0, 0%, 6%)',
        },
        pearl: 'hsl(45, 29%, 97%)',
        'rose-gold': 'hsl(350, 34%, 57%)',
        velvet: 'hsl(354, 42%, 32%)',
        ivory: 'hsl(60, 100%, 97%)',
        platinum: {
          DEFAULT: 'hsl(30, 5%, 89%)',
          dark: 'hsl(30, 5%, 75%)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'fluid-hero': 'clamp(2.5rem, 7vw, 5.5rem)',
        'fluid-h1': 'clamp(2rem, 5vw, 3.5rem)',
        'fluid-h2': 'clamp(1.5rem, 4vw, 2.5rem)',
        'fluid-h3': 'clamp(1.25rem, 3vw, 1.75rem)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'site': '1440px',
      },
      boxShadow: {
        'gold': '0 4px 24px hsla(43, 74%, 39%, 0.18)',
        'card': '0 2px 16px hsla(0, 0%, 0%, 0.06)',
        'elevated': '0 8px 40px hsla(0, 0%, 0%, 0.12)',
        'nav': '0 2px 20px hsla(0, 0%, 0%, 0.08)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, hsl(46, 65%, 62%) 0%, hsl(43, 74%, 39%) 50%, hsl(34, 77%, 88%) 100%)',
        'obsidian-gradient': 'linear-gradient(160deg, hsl(0, 0%, 10%) 0%, hsl(0, 0%, 6%) 100%)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slide-in-left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-up': 'fade-up 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 300ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0F1E',
        surface: '#0F1629',
        card: '#1E293B',
        muted: '#94A3B8',
        line: 'rgba(255,255,255,0.08)',
        accentStart: '#7C3AED',
        accentEnd: '#2563EB',
        success: '#22C55E',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      borderRadius: {
        xl2: '1rem',
      },
      boxShadow: {
        clay: '8px 8px 24px rgba(4,8,20,0.65), -8px -8px 22px rgba(37,50,84,0.22)',
        'clay-sm': '4px 4px 12px rgba(3,7,18,0.58), -3px -3px 10px rgba(32,44,77,0.2)',
        glow: '0 0 0 1px rgba(124,58,237,0.32), 0 12px 28px rgba(37,99,235,0.22)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
};

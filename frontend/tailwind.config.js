/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f0f10',
        baseElevated: '#202024',
        surface: '#2a2a2f',
        surfaceSoft: '#33333a',
        card: '#33333a',
        line: 'rgba(255, 255, 255, 0.10)',
        lineStrong: 'rgba(255, 255, 255, 0.16)',
        ink: '#f6f6f7',
        body: '#b6b6be',
        muted: '#8f8f98',
        primary: '#ff5b4f',
        primaryActive: '#de1d8d',
        primaryDisabled: '#54545b',
        accentStart: '#ff5b4f',
        accentEnd: '#de1d8d',
        luxe: '#de1d8d',
        plus: '#0a72ef',
        success: '#69cf98',
        danger: '#ff8e8e',
        info: '#0a72ef',
      },
      borderRadius: {
        xl2: '8px',
        card: '12px',
      },
      boxShadow: {
        clay: '0 0 0 1px rgba(255,255,255,0.08), 0 2px 2px rgba(0,0,0,0.22), 0 8px 18px -12px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.02)',
        'clay-sm': '0 0 0 1px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.22)',
        glow: '0 0 0 1px rgba(255,255,255,0.14), 0 10px 24px rgba(0,0,0,0.35)',
        glass: '0 10px 26px rgba(0,0,0,0.26)',
        'glow-primary': '0 0 24px rgba(255, 91, 79, 0.14)',
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

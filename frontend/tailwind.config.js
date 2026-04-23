/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#090806',
        surface: '#1A1712',
        card: '#221D15',
        muted: '#C9B89A',
        line: 'rgba(255, 232, 189, 0.18)',
        accentStart: '#ffa110',
        accentEnd: '#fa520f',
        success: '#8EDB8B',
        danger: '#FF8A66',
        info: '#FFD06A',
      },
      borderRadius: {
        xl2: '0.45rem',
      },
      boxShadow: {
        clay: '-8px 16px 39px rgba(127, 99, 21, 0.12), -33px 64px 72px rgba(127, 99, 21, 0.1), -73px 144px 97px rgba(127, 99, 21, 0.06)',
        'clay-sm': '-4px 10px 24px rgba(127, 99, 21, 0.14)',
        glow: '0 0 0 1px rgba(255, 161, 16, 0.35), 0 14px 30px rgba(250, 82, 15, 0.25)',
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        gold: '#C9A84C',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'rain': 'rain 0.8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'draw': 'draw 2s ease-in-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(-100%) translateX(-10px)' },
          '100%': { transform: 'translateY(110vh) translateX(10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

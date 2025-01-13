/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'health-primary': '#FF6B00',
        'health-secondary': '#10B981',
        'health-dark': '#111827',
        'health-light': '#F3F4F6',
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'flame': 'flame 1s ease-in-out infinite',
        'inner-flame': 'inner-flame 0.8s ease-in-out infinite',
        'particle': 'particle 1s ease-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'smoke': 'smoke 2s ease-out infinite'
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        flame: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.1)' }
        },
        'inner-flame': {
          '0%, 100%': { transform: 'scaleY(0.9)' },
          '50%': { transform: 'scaleY(1)' }
        },
        particle: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          '100%': { transform: 'translate(var(--tx, 10px), var(--ty, 10px)) scale(0)', opacity: 0 }
        },
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: 1 },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: 0 }
        },
        smoke: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0.2 },
          '100%': { transform: 'translateY(-20px) scale(2)', opacity: 0 }
        },
      },
    },
  },
  plugins: [],
}
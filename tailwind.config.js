/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        moveUpDown: {
          '0%, 100%': { transform: 'translateY(20px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        moveUpDown: 'moveUpDown 3s ease-in-out',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.bg-color-dark': {
          'background-color': '#021024',
        },
        '.bg-color-blue': {
          'background-color': '#052659',
        },
        '.bg-color-light': {
          'background-color': '#C1E8FF',
        },
        '.text-color-dark': {
          'color': '#021024',
        },
        '.text-color-blue': {
          'color': '#052659',
        },
        '.text-color-light': {
          'color': '#C1E8FF',
        },
        '.border-color-dark': {
          'border-color': '#021024',
        },
        '.border-color-blue': {
          'border-color': '#052659',
        },
        '.border-color-light': {
          'border-color': '#C1E8FF',
        },
        '.fill-color-dark': {
          'fill': '#021024',
        },
        '.fill-color-blue': {
          'fill': '#052659',
        },
      });
    },
  ],
};
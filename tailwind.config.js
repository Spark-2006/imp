/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        keralaRed: '#E12A2A',
        keralaGold: '#F2C14E',
        keralaGreen: '#2D6A4F',
        darkBg: '#121212',
        cardBg: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        malayalam: ['Manjari', 'sans-serif'], // A good Malayalam font
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'flip': 'flip 0.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        }
      }
    },
  },
  plugins: [],
}

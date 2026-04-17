/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0DC',
          300: '#FFE4C0',
        },
        brown: {
          50: '#F5EFE9',
          100: '#E8D9CE',
          200: '#C9A98E',
          300: '#A67B5B',
          400: '#7A5C40',
          500: '#5C4033',
          600: '#3D2B1F',
          700: '#2A1D15',
          800: '#1A110D',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        noto: ['"Noto Serif KR"', 'serif'],
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'book': '4px 4px 10px rgba(61, 43, 31, 0.2), -2px -2px 6px rgba(255, 248, 240, 0.8)',
        'book-hover': '6px 6px 16px rgba(61, 43, 31, 0.3), -2px -2px 8px rgba(255, 248, 240, 0.9)',
        'card': '0 2px 8px rgba(61, 43, 31, 0.12)',
        'card-hover': '0 8px 24px rgba(61, 43, 31, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
    },
  },
  plugins: [],
}

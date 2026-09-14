/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#152612',
          900: '#1e381b',
          800: '#284d23',
          700: '#36682f',
          600: '#47833f',
        },
        sage: {
          600: '#6f8d4d',
          500: '#8ba869',
          400: '#9ab87a',
          300: '#b5d095',
          200: '#cbe0b3',
          100: '#e3eed4',
          50: '#f4f8ee',
        },
        cream: {
          50: '#fbfaf7',
          100: '#f8f7f2',
          200: '#f2f0e6',
          300: '#e7e4d5',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Catamaran', 'sans-serif'],
        ta: ['Catamaran', 'Mukta', 'sans-serif']
      }
    },
  },
  plugins: [],
}

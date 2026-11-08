/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nitt: {
          50: '#f0f5fc',
          100: '#e1ecf8',
          200: '#c2d9f2',
          300: '#94bfe9',
          400: '#609fdd',
          500: '#3a81cf',
          600: '#2766b5',
          700: '#1e4f93',
          800: '#1a4178',
          900: '#0f2744',
          950: '#0a1728',
          gold: '#d97706',
          maroon: '#800020'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        focal: {
          dusty: '#C9A3A6',
          blush: '#E8D4D5',
          warm: '#F8F5F1',
          light: '#F3E8E8',
          charcoal: '#242222',
          black: '#151515',
          lavender: '#DCD8E5',
          beige: '#E8DED2',
          muted: '#8A8585',
        },
        status: {
          verified: '#3F8F68',
          verifiedBg: '#EAF5EF',
          suspicious: '#C38A35',
          suspiciousBg: '#FDF6E9',
          risk: '#B84C4C',
          riskBg: '#FDF0F0',
          unknown: '#777777',
          unknownBg: '#F0F0F0',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(36, 34, 34, 0.05)',
        'soft-lg': '0 20px 40px -10px rgba(36, 34, 34, 0.08)',
        'editorial': '0 4px 20px 0 rgba(201, 163, 166, 0.15)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}

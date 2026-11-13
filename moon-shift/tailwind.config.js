/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#060B1A',
        deep: '#0B1430',
        panel: '#111C3D',
        regolith: '#C9CED8',
        earth: '#5CE1E6',
        solar: '#FFB84D',
        alarm: '#FF6B6B',
        moss: '#7BE0A4',
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

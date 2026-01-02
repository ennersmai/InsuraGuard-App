/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', // Enable dark mode based on prefers-color-scheme
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#3A3A3A',
        amber: '#E67E22',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

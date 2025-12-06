/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Change deep-green to black so text using `text-deep-green` appears black
        'deep-green': '#000000',
        'ivory': '#fdfbf7',
        'gold': '#c8a97e',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'didot': ['Didot', 'serif'],
      }
    },
  },
  plugins: [],
}
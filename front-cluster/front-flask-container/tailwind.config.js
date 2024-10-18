/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/src/**/*.js"
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        'xs': '372px'
      },
      colors: {
        'obsidian': '#0B1215',
        'midnight': '#111B22',
        'sky': '#5c5b74',
        'light-sky': '#9897b3',
        'ocean': '#1B1C31',
        'smoke': '#F0F2F5',
        'light-smoke': '#F7F8F8',
      },
      fontFamily: {
        'inter': ['Inter', 'Arial']
      }
    },
  },
  plugins: [],
}


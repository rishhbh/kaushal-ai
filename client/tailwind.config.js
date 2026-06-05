/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A56A0",
        accent: "#F4A223",
        success: "#1A7A4A",
        danger: "#C0392B",
        background: "#F8FAFC"
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
        gurmukhi: ['"Noto Sans Gurmukhi"', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#B9271B',
        background: {
          DEFAULT: '#ffffff',
          dark: '#151718'
        },
        text: {
          DEFAULT: '#11181C',
          dark: '#ECEDEE'
        },
        muted: {
          DEFAULT: '#687076',
          dark: '#9BA1A6'
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1D1F20'
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#2A2D2E'
        }
      }
    },
  },
  plugins: [],
}
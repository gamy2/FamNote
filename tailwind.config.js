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
        primary: '#0F9E99',
        background: '#EFE9E0',
        backgroundV2: '#EFE9E0A4',
        text: '#003B38',
        muted: '#687076',
        card: '#ffffff',
        border: '#E5E7EB'
      }
    },
  },
  plugins: [],
}
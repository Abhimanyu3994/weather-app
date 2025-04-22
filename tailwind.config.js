/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'happy': '#FFD700',
        'sad': '#4169E1',
        'angry': '#FF4500',
        'calm': '#32CD32',
        'anxious': '#FF69B4',
      },
    },
  },
  plugins: [],
}


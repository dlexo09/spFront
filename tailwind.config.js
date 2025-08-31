/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'strong-blue': '#1E3A8A',
        'light-blue': '#00ADEE',
        'pink-sp': '#EB008B',
        'yellow-sp': '#FFF100',
        'light-blue-hover': 'rgba(2, 112, 229, 1)',
      },
    },
  },
  plugins: [],
}


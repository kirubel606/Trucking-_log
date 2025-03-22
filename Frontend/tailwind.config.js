/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softLight: "#f8f9fa", // Light mode background
        softDark: "#1e1e1e", // Dark mode background
      }
    },
  },
  plugins: [],
};

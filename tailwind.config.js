/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nzdra-red": "#DC2626",
        "nzdra-redDark": "#B91C1C",
        "nzdra-redLight": "#EF4444",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

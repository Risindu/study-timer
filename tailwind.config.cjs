/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    fontFamily: {
      kumbh: ["Kumbh Sans", "sans-serif"],
      roboto: ["Roboto Slab", "serif"],
      space: ["Space Mono", "monospace"],
    },
    extend: {
      colors: {
        "light-purple": "#D7E0FF",
        "default-bg": "#1e213f",
        "dark-bg": "#161932",
        "lighter-bg": "#212650",
        hl: "#f87070",
        "hl-light": "#f98585",
        "off-white": "#EFF1FA",
        teal: "#70f3f8",
        violet: "#d881f8",
        "grayed-out": "rgba(20, 20, 20, 0.79)",
      },
      boxShadow: {
        custom: "0 0 0 20px #242851e9",
      },
    },
  },
  plugins: [],
};

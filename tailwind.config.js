/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red12: "#D43B3B1F",
        red100: "#D43B3B",
        green12: "#519B2F1F",
        greenGrid: "#519B2F",
        greenPrimary: "#333E40",
        black: "#000000",
        purpleCalm: "#5E4980",
        white: "#FFFFFF",
        primaryGray: "#646464",
      },
    },
  },
  plugins: [],
};

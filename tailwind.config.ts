import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fefdfb",
          100: "#faf6ee",
          200: "#f4ecdc",
          300: "#e9dcc0",
        },
        ink: {
          50: "#f3f2f0",
          100: "#e4e1db",
          200: "#c9c3b8",
          300: "#a89f8e",
          400: "#78705f",
          500: "#524a3d",
          600: "#3d362c",
          700: "#2c261d",
          800: "#1e1a14",
          900: "#15120d",
          950: "#0c0a07",
        },
        brand: {
          50: "#fdf3ee",
          100: "#fbe3d5",
          200: "#f5c4a5",
          300: "#eb9d6d",
          400: "#dd7038",
          500: "#c1440e",
          600: "#a3380c",
          700: "#822c0a",
          800: "#65230b",
          900: "#4f1d0b",
          950: "#2c0f05",
        },
        accent: {
          50: "#effaf7",
          100: "#d3f0e8",
          200: "#a2ded0",
          300: "#69c3b1",
          400: "#3aa290",
          500: "#237e70",
          600: "#1a655a",
          700: "#175149",
          800: "#15413b",
          900: "#133733",
          950: "#081f1c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
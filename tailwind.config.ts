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
        brand: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#d1c7ff",
          300: "#b19dff",
          400: "#8c69ff",
          500: "#6d3bff",
          600: "#5c1eff",
          700: "#4d13e0",
          800: "#3f11b5",
          900: "#361291",
          950: "#210a5e",
        },
        accent: {
          50: "#fff3ec",
          100: "#ffe4d1",
          200: "#ffc4a3",
          300: "#ff9a6a",
          400: "#ff6b30",
          500: "#fa4408",
          600: "#e42d02",
          700: "#bd1f04",
          800: "#961b0b",
          900: "#7a190c",
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

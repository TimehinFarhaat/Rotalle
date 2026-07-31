/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Rotalle brand system, light theme — Ivory / Espresso / Metallic Bronze.
        // Token names are unchanged from the original dark theme (charcoal =
        // page background, champagne = primary text, ink = dark accent) so
        // no component files needed editing — only the hex values moved.
        charcoal: {
          DEFAULT: "#F6F2EC", // page background (was near-black, now ivory)
          light: "#FFFFFF", // card/surface background
        },
        champagne: {
          DEFAULT: "#2B2521", // primary text (was light, now espresso)
          muted: "#D8D2C7", // borders / secondary surfaces
        },
        bronze: {
          DEFAULT: "#B08D57",
          dark: "#8C6F41",
        },
        ink: "#2B2521",
        muted: "#7A716A",
        success: "#7A6A2E",
        warning: "#B24E29",
        danger: "#8E2A2A",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

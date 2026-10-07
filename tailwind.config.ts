import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6F1",
        blush: "#F3DDD6",
        rose: {
          DEFAULT: "#C9877C",
          light: "#E3ABA2",
          dark: "#A8655A",
        },
        wine: {
          DEFAULT: "#6B2D3C",
          light: "#873C4E",
          dark: "#4E1F2B",
        },
        gold: {
          DEFAULT: "#B8935A",
          light: "#D4B27C",
          dark: "#96743E",
        },
        ink: "#2A2024",
        muted: "#7A6A6E",
        success: "#2E7D5B",
        error: "#B3382C",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 8px 30px rgba(107, 45, 60, 0.10)",
        "luxe-lg": "0 14px 40px rgba(107, 45, 60, 0.16)",
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

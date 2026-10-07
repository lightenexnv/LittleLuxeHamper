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
        cream: "#FBF7F2",
        sand: "#F4ECE4",
        blush: {
          light: "#FBF0EC",
          DEFAULT: "#F2DFD7",
          dark: "#E3C8BD",
        },
        rose: {
          light: "#EBB2BF",
          DEFAULT: "#C97A8E",
          dark: "#9E4B5E",
        },
        wine: {
          light: "#7A3546",
          DEFAULT: "#54212F",
          dark: "#35141D",
        },
        mulberry: {
          DEFAULT: "#381B26",
          dark: "#250F18",
        },
        gold: {
          light: "#EAD098",
          DEFAULT: "#C59E55",
          dark: "#987532",
        },
        ink: "#23181D",
        muted: "#76646B",
        success: "#26734E",
        error: "#B3382C",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 10px 30px -10px rgba(56, 27, 38, 0.12)",
        "luxe-lg": "0 20px 45px -12px rgba(56, 27, 38, 0.18)",
        "luxe-card": "0 4px 20px -2px rgba(56, 27, 38, 0.08), 0 1px 3px rgba(56, 27, 38, 0.04)",
        "gold-glow": "0 0 25px rgba(197, 158, 85, 0.25)",
      },
      borderRadius: {
        card: "16px",
        gift: "22px",
        pill: "999px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "marquee-reverse": "marquee-reverse 45s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

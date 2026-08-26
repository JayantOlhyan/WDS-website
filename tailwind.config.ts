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
        wds: {
          yellow: "#FFD600",
          "yellow-dim": "#F5C400",
          "yellow-dark": "#b39500",
          "yellow-light": "#fff176",
          bg: "#050708",
          "bg-secondary": "#07151D",
          card: "#081014",
          "card-hover": "#0c1820",
          white: "#F5F0DF",
          muted: "#9A9D9A",
          border: "#FFD600",
          "border-dim": "rgba(255, 214, 0, 0.3)",
          "border-dark": "rgba(255, 214, 0, 0.15)",
          green: "#00FF66",
          "green-dim": "rgba(0, 255, 102, 0.2)",
          red: "#FF3366",
        },
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "'Silkscreen'", "monospace"],
        mono: ["'Space Mono'", "'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "pixel-yellow": "4px 4px 0px 0px #FFD600",
        "pixel-yellow-sm": "2px 2px 0px 0px #FFD600",
        "pixel-yellow-lg": "6px 6px 0px 0px #FFD600",
        "pixel-white": "4px 4px 0px 0px #F5F0DF",
        "glow-yellow": "0 0 15px rgba(255, 214, 0, 0.4)",
        "glow-green": "0 0 10px rgba(0, 255, 102, 0.5)",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "scanline-move": "scanlineMove 8s linear infinite",
        marquee: "marquee 25s linear infinite",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanlineMove: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

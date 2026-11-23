import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F1F5F9",
        },
        electric: {
          50: "#EBF2FF",
          100: "#D6E4FF",
          200: "#ADC9FF",
          300: "#70A3FF",
          400: "#387DFF",
          500: "#0052FF",
          600: "#0045D8",
          700: "#0036A8",
          800: "#00287D",
          900: "#001D5E",
        },
        champagne: {
          50: "#FDFBF4",
          100: "#FBF6E5",
          200: "#F5EAC4",
          300: "#EEDC9A",
          400: "#E5C158",
          500: "#D4AF37",
          600: "#B89225",
          700: "#916E18",
          800: "#755516",
          900: "#573F10",
        },
        harmony: {
          green: "#10B981",
          greenLight: "#ECFDF5",
          amber: "#F59E0B",
          amberLight: "#FFFBEB",
          crimson: "#EF4444",
          crimsonLight: "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-outfit)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -4px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 20px 32px -6px rgba(0, 82, 255, 0.08)",
        "electric-glow": "0 0 24px -2px rgba(0, 82, 255, 0.35)",
        "gold-glow": "0 0 20px -2px rgba(212, 175, 55, 0.35)",
      },
      keyframes: {
        "beacon-pulse": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.6)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 6px rgba(16, 185, 129, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
        },
      },
      animation: {
        "beacon-pulse": "beacon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

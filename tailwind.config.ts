import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Period tracking specific colors
        period: {
          DEFAULT: "#FF6B8A",
          light: "#FFB3C6",
          dark: "#E84A6B",
        },
        ovulation: {
          DEFAULT: "#FF9F7A",
          light: "#FFCDB3",
          dark: "#E6825B",
        },
        follicular: {
          DEFAULT: "#A8E6CF",
          light: "#D4F3E8",
          dark: "#89D0B0",
        },
        luteal: {
          DEFAULT: "#C4A3FF",
          light: "#E1D1FF",
          dark: "#A584E6",
        },
        fertile: {
          DEFAULT: "#FFD93D",
          light: "#FFF280",
          dark: "#E6C21E",
        },
        rose: {
          50: "#FFF5F7",
          100: "#FFEBEF",
          200: "#FFD1DC",
          300: "#FFB3C6",
          400: "#FF8FAD",
          500: "#FF6B94",
          600: "#E84A6B",
          700: "#CC3352",
          800: "#B32142",
          900: "#991738",
        },
        purple: {
          50: "#F9F5FF",
          100: "#F3EBFF",
          200: "#E7D1FF",
          300: "#D4B3FF",
          400: "#C18FFF",
          500: "#AE6BFF",
          600: "#9847E6",
          700: "#7F33CC",
          800: "#6821B3",
          900: "#541799",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-period": "linear-gradient(135deg, #FF6B8A 0%, #C4A3FF 100%)",
        "gradient-ovulation":
          "linear-gradient(135deg, #FF9F7A 0%, #FFD93D 100%)",
        "gradient-follicular":
          "linear-gradient(135deg, #A8E6CF 0%, #7FD3B3 100%)",
        "gradient-luteal": "linear-gradient(135deg, #C4A3FF 0%, #A584E6 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

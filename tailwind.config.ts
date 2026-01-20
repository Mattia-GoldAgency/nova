import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Testi */
        fg: "hsl(var(--fg) / <alpha-value>)",
        "muted-fg": "hsl(var(--muted-fg) / <alpha-value>)",

        /* Superfici / glass */
        card: "hsl(var(--card) / <alpha-value>)",
        "card-fg": "hsl(var(--card-fg) / <alpha-value>)",

        muted: "hsl(var(--muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",

        /* Brand */
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-fg": "hsl(var(--primary-fg) / <alpha-value>)",

        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-fg": "hsl(var(--accent-fg) / <alpha-value>)",

        highlight: "hsl(var(--highlight) / <alpha-value>)",

        /* Stati */
        success: "hsl(var(--success) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
      },

      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },

      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
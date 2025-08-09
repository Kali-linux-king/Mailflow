import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--dt-primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // DevToolkit specific colors from design reference
        "dt-primary": "var(--dt-primary)",
        "dt-secondary": "var(--dt-secondary)", 
        "dt-accent": "var(--dt-accent)",
        "dt-slate-50": "var(--dt-slate-50)",
        "dt-slate-100": "var(--dt-slate-100)",
        "dt-slate-200": "var(--dt-slate-200)",
        "dt-slate-300": "var(--dt-slate-300)",
        "dt-slate-600": "var(--dt-slate-600)",
        "dt-slate-800": "var(--dt-slate-800)",
        "dt-slate-900": "var(--dt-slate-900)",
        "dt-blue-100": "var(--dt-blue-100)",
        "dt-blue-600": "var(--dt-blue-600)",
        "dt-purple-100": "var(--dt-purple-100)",
        "dt-purple-600": "var(--dt-purple-600)",
        "dt-green-100": "var(--dt-green-100)",
        "dt-green-600": "var(--dt-green-600)",
        "dt-red-100": "var(--dt-red-100)",
        "dt-red-600": "var(--dt-red-600)",
        "dt-orange-100": "var(--dt-orange-100)",
        "dt-orange-600": "var(--dt-orange-600)",
        "dt-indigo-100": "var(--dt-indigo-100)",
        "dt-indigo-600": "var(--dt-indigo-600)",
        "dt-pink-100": "var(--dt-pink-100)",
        "dt-pink-600": "var(--dt-pink-600)",
        "dt-teal-100": "var(--dt-teal-100)",
        "dt-teal-600": "var(--dt-teal-600)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

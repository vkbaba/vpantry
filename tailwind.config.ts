import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "blog-text": "#09090b",
        "blog-text-white" : "#f9f9ff",
        "blog-bg": "#f9f9ff",
        "blog-border": "#e5e7eb",
        "blog-accent-primary": "#1e3a8a",
        "blog-accent-secondary": "#e0e7ff", // tag
      },
    },
  },
  plugins: [],
};
export default config;

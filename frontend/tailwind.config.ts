import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // blue-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#7c3aed", // violet-600
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};

export default config; 
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          lg: "80px",
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        blob: {
          "0%": {
            translate: "0 0",
            rotate: "0deg",
          },
          "30%": {
            rotate: "40deg",
          },
          "50%": {
            transform: "translate(300px, 390px) scale(1.1)",
          },
          "80%": {
            rotate: "90%",
          },
        },
      },
      animation: {
        blob: "blob 8s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045)",
        "blob-reverse":
          "blob 10s infinite cubic-bezier(0.215, 0.61, 0.355, 1) reverse",
      },
    }
  },
  plugins: [],
};
export default config;

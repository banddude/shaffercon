import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "media"], // Enable dark mode with class selector and system preferences fallback
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2b7fbd",
        },
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media", // Enable dark mode based on system preferences
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

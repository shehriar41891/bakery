import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF4EA",
        paper: "#FFFDF8",
        ink: "#33231B",
        inkSoft: "#6B5648",
        berry: "#A8324A",
        berryDk: "#86283C",
        honey: "#D98E3A",
        honeyLt: "#F2D9A8",
        sage: "#7C8A6B",
        line: "#E7D8C3",
        rose: "#F6E3DF",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

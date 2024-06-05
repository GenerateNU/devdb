import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)"],
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      gray: "#EEEEEE",
      generate: {
        DEFAULT: "#187DFF",
        dark: "#092A55",
        sw: { light: "#ffdc88", DEFAULT: "#FFBF3C", dark: "#ffac20" },
      },
      project: {
        row: "#EEEEEE",
      },
      input: {
        text: "#999999",
      },
    },
    gradientColorStopPositions: {
      33: "33%",
    },
  },
  plugins: [],
} satisfies Config;

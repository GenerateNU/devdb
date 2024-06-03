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
      generate: {
        DEFAULT: "#187DFF",
        dark: "#092A55",
        sw: "#FFBF3C",
      },
      project: {
        row: "#EEEEEE",
      },
      input: {
        text: "#BBBBBB",
      },
    },
    gradientColorStopPositions: {
      33: "33%",
    },
  },
  plugins: [],
} satisfies Config;

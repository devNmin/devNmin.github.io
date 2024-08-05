import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cafe24 Moyamoya Face', 'sans'], // 'Cafe24 Moyamoya Face'은 폰트 패밀리 이름입니다.
      },
      colors: {
        darkModeBg: "var(--hello)",
      },
    },
  },
  plugins: [],
};
export default config;
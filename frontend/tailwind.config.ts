import type { Config } from "tailwindcss";

const config: Config = {
  // 1. 경로 설정: 여기가 가장 중요합니다!
  // 프로젝트 구조에 따라 src 폴더를 쓴다면 "./src/**/*.{js,ts,jsx,tsx,mdx}"를 추가하세요.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}", // 폰트 index.ts가 public에 있다면 필수
  ],
  theme: {
    extend: {
      colors: {
        primary: { normal: "#FEC627", light: "#FFF1D1", heavy: "#FFA301" },
        "custom-red": "#cc0000",
        neutral: {
          99: "#F5F5F5",
          90: "#C4C4C4",
          80: "#B0B0B0",
          70: "#9B9B9B",
          40: "#5C5C5C",
          30: "#474747",
        },
      },
      fontFamily: {
        // var() 안의 변수명이 public/fonts/index.ts의 variable과 정확히 일치해야 함
        pretendard: ["var(--font-pretendard)"],
        partial: ["var(--font-partial)"],
      },
    },
  },
  plugins: [],
};

export default config;

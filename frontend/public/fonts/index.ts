import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.ttf", // 폰트 파일 경로
  display: "swap",
  weight: "45 920", // 가변 폰트일 경우 범위 지정
  variable: "--font-pretendard", // CSS 변수 이름
});

export const partialSans = localFont({
  src: "../../public/fonts/PartialSansKR-Regular.otf", // 실제 파일명과 일치해야 함
  display: "swap",
  variable: "--font-partial", // CSS 변수 설정
});

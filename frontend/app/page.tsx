"use client"; // 클라이언트 컴포넌트 선언 (상태 관리와 타이머 사용을 위해 필수)

import { useState, useEffect } from "react";
import LogoPage from "./_components/LogoPage";
import QuestionPage from "./_components/QuestionPage";

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showLogo) {
    return <LogoPage />;
  }

  // 온보딩 페이지
  return <QuestionPage />;
}

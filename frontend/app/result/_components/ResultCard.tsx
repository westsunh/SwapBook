"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LFI from "@/public/MBTIs/LFI.png";
import MBTI_description from "@/public/MBTI_description.json";

export function ResultCard() {
  const [isMounted, setIsMounted] = useState(false);
  const [mbti, setMbti] = useState<string | null>(null);

  useEffect(() => {
    // 큐의 맨 뒤로 보내서 연쇄 렌더링(Cascading Render) 경고를 피합니다.
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedMBTI = localStorage.getItem("MBTI");
      if (savedMBTI) {
        setMbti(savedMBTI);
      }
    }, 0);

    // 컴포넌트 언마운트 시 타이머를 정리해줍니다.
    return () => clearTimeout(timer);
  }, []);

  // 1. 마운트 전 또는 데이터를 불러오는 중일 때 보여줄 스켈레톤 UI
  if (!isMounted || !mbti) {
    return (
      <div className="flex flex-col items-center bg-white rounded-3xl px-6 py-8 leading-6 tracking-[-0.03em] w-[342px] animate-pulse">
        {/* 타이틀 스켈레톤 */}
        <div className="h-9 w-32 bg-neutral-99 rounded-md mb-[5px]" />
        {/* 이미지 스켈레톤 */}
        <div className="w-[302px] aspect-square bg-neutral-99 rounded-xl my-4" />
        {/* 설명글 스켈레톤 (3줄) */}
        <div className="space-y-2 w-[272px]">
          <div className="h-4 bg-neutral-99 rounded w-full" />
          <div className="h-4 bg-neutral-99 rounded w-full" />
          <div className="h-4 bg-neutral-99 rounded w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  const result = MBTI_description[mbti as keyof typeof MBTI_description];

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl px-6 py-8 leading-6 tracking-[-0.03em]">
      <p className="text-3xl font-semibold mb-[5px]">{result?.label}</p>
      <Image src={LFI} alt="LFI" width={302} priority />
      <p className="whitespace-pre-line text-base font-medium text-neutral-30 w-[272px] text-center">
        {result?.description}
      </p>
    </div>
  );
}

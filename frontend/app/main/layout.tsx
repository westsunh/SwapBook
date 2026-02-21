"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChevornDown from "@/public/icons/ChevornDown.svg";
import BellIcon from "@/public/icons/bell.svg"; // 예시 아이콘
import YellowBook from "@/public/icons/book_yellow.svg"; // 예시 아이콘
import HeaderBooks from "@/public/covers/header_books_original.png";
import {
  HiOutlineBookOpen,
  HiOutlineLocationMarker,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineUser,
} from "react-icons/hi";

interface ServiceLayoutProps {
  children: ReactNode;
}

export default function ServiceLayout({ children }: ServiceLayoutProps) {
  const router = useRouter();
  // 탭 상태 관리 (기본값: 'bookshelf')
  const [activeTab, setActiveTab] = useState("bookshelf");

  const NAV_ITEMS = [
    { id: "bookshelf", label: "책장", icon: HiOutlineBookOpen },
    { id: "town", label: "동네", icon: HiOutlineLocationMarker },
    { id: "chat", label: "채팅", icon: HiOutlineChatAlt2 },
    { id: "community", label: "커뮤니티", icon: HiOutlineDocumentText },
    { id: "mypage", label: "나의 책", icon: HiOutlineUser },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-sm flex flex-col relative font-pretendard leading-6 tracking-[-0.03em]">
      {/* --- 공통 헤더 --- */}
      <header className="relative flex h-[168px] items-center justify-between pt-16 z-50 flex flex-col justify-between">
        <div className="px-5 w-full flex justify-between">
          <div className="flex items-center gap-2">
            <Image src={YellowBook} alt="logo" />
          </div>

          {/* 중앙: 섹션 타이틀 및 드롭다운 */}
          <div className="flex items-center gap-1 cursor-pointer">
            <h1 className="text-lg font-medium">세계관 과몰입러의 책장</h1>
            <Image src={ChevornDown} alt="chevorn down" />
          </div>

          {/* 우측: 알림 아이콘 */}
          <button className="relative">
            <Image src={BellIcon} alt="notification" />
          </button>
        </div>
        <Image src={HeaderBooks} alt="header books" />
      </header>

      {/* --- 본문 영역 --- */}
      <main className="flex-1 overflow-y-auto bg-neutral-99">
        {/* children에 activeTab 상태를 넘겨주거나, 
          레이아웃 내부에서 activeTab에 따라 다른 컴포넌트를 직접 렌더링할 수도 있습니다.
        */}
        {children}
      </main>

      {/* --- 상태 관리형 푸터 --- */}
      <nav className="sticky bottom-0 left-0 right-0 z-50 flex h-[84px] border-t border-neutral-99 bg-white px-4 pb-6 pt-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
            >
              <Icon
                className={`text-2xl transition-colors ${
                  isActive ? "text-primary-normal" : "text-neutral-80"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary-normal" : "text-neutral-80"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

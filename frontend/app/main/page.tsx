"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import { FaStar, FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowPath } from "react-icons/hi2";
import BookTop from "@/public/covers/book_top.png";

// --- 더미 데이터 (추후 백엔드 API 연동용) ---
const DUMMY_BOOKS = [
  {
    id: 1,
    userNickname: "독서 뉴비",
    exchangeCount: 3,
    location: "판교역 직거래 선호",
    rating: 4.5,
    review: "어렸을 때 읽었는데,\n다시 읽어도 너무 재밌어요",
    tags: ["INFJ가 좋아하는 책", "포근함", "상태 좋아요", "추리물 사절"],
    images: ["/book_sample_1.jpg", "/emart24_sample.jpg", "/book_sample_2.jpg"],
  },
  {
    id: 2,
    userNickname: "스꾸스꾸",
    exchangeCount: 1,
    location: "수내역 직거래 선호",
    rating: 5.0,
    review: "눈물이 멈추지 않는 책\n읽기 전에 각오하시길...",
    tags: ["오열쇼", "휴지 챙겨", "대중교통 독서 금지"],
    images: ["/book_sample_3.jpg", "/book_sample_4.jpg"],
  },
];

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const currentCard = DUMMY_BOOKS[currentIndex];
  const nextCardData = DUMMY_BOOKS[currentIndex + 1];

  // --- 스와이프 애니메이션 값 설정 ---
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-250, -200, 0, 200, 250], [0, 1, 1, 1, 0]);

  // 스와이프 방향에 따른 배경색 및 텍스트 투명도
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [0, -150], [0, 1]);

  // 스와이프 종료 핸들러
  const handleDragEnd = (_: Event, info: PanInfo) => {
    // 150px 이상 확실히 밀어야 액션 확정
    if (info.offset.x > 350) {
      console.log("LIKE ACTION");
      nextCard();
    } else if (info.offset.x < -150) {
      console.log("DISLIKE ACTION");
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < DUMMY_BOOKS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setImageIndex(0); // 다음 카드는 첫 번째 사진부터 시작
    } else {
      alert("더 이상 새로운 책이 없습니다!");
    }
  };

  // 사진 슬라이드 핸들러 (좌측: 이전 / 우측: 다음)
  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickX = clientX - left;

    if (clickX < width / 2) {
      if (imageIndex > 0) setImageIndex((prev) => prev - 1);
    } else {
      if (imageIndex < currentCard.images.length - 1)
        setImageIndex((prev) => prev + 1);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 overflow-hidden bg-white">
      {/* 0. 배경에 미리 보이는 다음 카드 (스택 효과) */}
      {nextCardData && (
        <div className="absolute aspect-[342/500] w-full max-w-[330px] opacity-40 scale-[0.93] translate-y-6 pointer-events-none">
          <Image
            className="translate-y-1/3"
            src={BookTop}
            alt="book-top"
            priority
          />
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-80 shadow-md">
            <Image
              src={nextCardData.images[0]}
              alt="Next book preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
      )}

      {/* 1. 현재 활성화된 카드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05 }}
          className="relative aspect-[342/500] w-full max-w-[330px] cursor-grab active:cursor-grabbing z-10"
        >
          {/* 책 상단 이미지 (고정) */}
          <Image
            className="translate-y-1/3"
            src={BookTop}
            alt="book-top"
            priority
          />

          {/* 카드 메인 레이어 */}
          <div
            className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-80 shadow-2xl"
            onClick={handlePhotoClick}
          >
            {/* 스와이프 오버레이: LIKE (초록) */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute inset-0 bg-green-500/40 z-40 pointer-events-none flex items-start justify-start p-10"
            >
              <div className="border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-lg -rotate-12">
                LIKE
              </div>
            </motion.div>

            {/* 스와이프 오버레이: DISLIKE (빨강) */}
            <motion.div
              style={{ opacity: dislikeOpacity }}
              className="absolute inset-0 bg-red-500/40 z-40 pointer-events-none flex items-start justify-end p-10"
            >
              <div className="border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-lg rotate-12">
                DISLIKE
              </div>
            </motion.div>

            {/* 카드 배경 이미지 */}
            <div className="absolute inset-0">
              <Image
                src={currentCard.images[imageIndex]}
                alt="Card background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />
            </div>

            {/* 상단 사진 슬라이드 바 */}
            <div className="absolute top-4 left-0 right-0 z-50 flex gap-1.5 px-4">
              {currentCard.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                    idx === imageIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* 텍스트 컨텐츠 (포인터 이벤트 무시하여 이미지 클릭 방해 금지) */}
            <div className="absolute inset-0 flex flex-col justify-between p-7 text-white pointer-events-none z-30">
              {/* 상단: 리뷰 및 별점 */}
              <div className="mt-16 flex flex-col items-center text-center">
                <span className="mb-1 text-2xl">“</span>
                <p className="whitespace-pre-line text-xl font-bold leading-tight drop-shadow-md">
                  {currentCard.review}
                </p>
                <span className="mt-1 text-2xl">”</span>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(currentCard.rating)
                            ? "text-[#FEC627]"
                            : "text-white/30"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {currentCard.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 하단: 유저 정보 및 태그 */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold drop-shadow-md">
                    {currentCard.userNickname}
                  </h2>
                  <div className="flex items-center gap-4 text-sm font-medium opacity-95">
                    <span className="flex items-center gap-1">
                      <HiOutlineArrowPath className="text-lg" />
                      {currentCard.exchangeCount}번째 책 교환
                    </span>
                    <span className="flex items-center gap-1">
                      <FaLocationDot className="text-primary-normal" />
                      {currentCard.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentCard.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-white/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

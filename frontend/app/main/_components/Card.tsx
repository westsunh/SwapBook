"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";
import { FaStar, FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowPath } from "react-icons/hi2";
import BookTop from "@/public/covers/book_top.png";
import { BookData } from "../page";

interface CardProps {
  data: BookData;
  isTop: boolean;
  onSwipe: (direction: "left" | "right") => void;
}

export default function Card({ data, isTop, onSwipe }: CardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [lastDir, setLastDir] = useState(0);
  const x = useMotionValue(0);

  // 애니메이션 설정
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-250, -200, 0, 200, 250], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: Event, info: PanInfo) => {
    if (info.offset.x > 350) {
      setLastDir(1);
      onSwipe("right");
    } else if (info.offset.x < -350) {
      setLastDir(-1);
      onSwipe("left");
    }
  };

  const handlePhotoClick = (e: React.MouseEvent) => {
    if (!isTop) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    if (clientX - left < width / 2) {
      if (imageIndex > 0) setImageIndex((prev) => prev - 1);
    } else {
      if (imageIndex < data.images.length - 1)
        setImageIndex((prev) => prev + 1);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      exit={{
        x: lastDir === 1 ? 800 : -800,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute top-0 aspect-[342/500] w-full max-w-[330px] cursor-grab active:cursor-grabbing"
    >
      {/* 책 상단 이미지 */}
      <Image src={BookTop} alt="top" className="translate-y-1/3" />

      <div
        className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-80 shadow-2xl"
        onClick={handlePhotoClick}
      >
        {/* LIKE / DISLIKE 오버레이 */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 bg-green-500/40 z-40 pointer-events-none flex p-10 items-start justify-start"
        >
          <div className="border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-lg -rotate-12">
            LIKE
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute inset-0 bg-red-500/40 z-40 pointer-events-none flex p-10 items-start justify-end"
        >
          <div className="border-4 border-white text-white font-bold text-4xl px-4 py-2 rounded-lg rotate-12">
            DISLIKE
          </div>
        </motion.div>

        {/* 배경 이미지 */}
        <Image
          src={data.images[imageIndex]}
          alt="bg"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

        {/* 콘텐츠 영역 */}
        <div className="absolute inset-0 flex flex-col justify-between p-7 text-white pointer-events-none z-30">
          {/* 상단 섹션: 인디케이터 바 + 리뷰 + 별점 */}
          <div className="flex flex-col items-center">
            {/* 사진 인디케이터 바 */}
            <div className="flex gap-1.5 w-full mb-16">
              {data.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                    idx === imageIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* 리뷰 텍스트 */}
            <div className="text-center">
              <span className="text-2xl font-bold block mb-1">“</span>
              <p className="text-xl font-bold whitespace-pre-line leading-tight drop-shadow-md">
                {data.review}
              </p>
              <span className="text-2xl font-bold block mt-1">”</span>
            </div>

            {/* 별점 */}
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex text-primary-normal">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(data.rating)
                        ? "text-[#FEC627]"
                        : "text-white/30"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {data.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 하단 섹션: 유저 정보 + 태그 리스트 */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold drop-shadow-md">
                {data.userNickname}
              </h2>
              <div className="flex items-center gap-4 text-sm font-medium opacity-95">
                <span className="flex items-center gap-1">
                  <HiOutlineArrowPath className="text-lg" />
                  {/* 더미데이터에 exchangeCount가 없다면 임의의 숫자로 표시하거나 BookData 인터페이스에 추가 필요 */}
                  3번째 책 교환
                </span>
                <span className="flex items-center gap-1">
                  <FaLocationDot className="text-primary-normal" />
                  {data.location}
                </span>
              </div>
            </div>

            {/* 태그 리스트 */}
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, idx) => (
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
  );
}

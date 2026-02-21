"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./_components/Card"; // 아래에서 만들 컴포넌트
import toast from "react-hot-toast";

export interface BookData {
  id: number;
  userNickname: string;
  location: string;
  rating: number;
  review: string;
  tags: string[];
  images: string[];
}

const DUMMY_BOOKS = [
  {
    id: 1,
    userNickname: "독서 뉴비",
    location: "판교역",
    rating: 4.5,
    review: "다시 읽어도 너무 재밌어요",
    tags: ["INFJ", "포근함"],
    images: ["/book_sample_1.jpg", "/book_sample_2.jpg"],
  },
  {
    id: 2,
    userNickname: "스꾸스꾸",
    location: "수내역",
    rating: 5.0,
    review: "눈물이 멈추지 않는 책",
    tags: ["오열쇼", "휴지 필수"],
    images: ["/book_sample_3.jpg", "/book_sample_4.jpg"],
  },
  {
    id: 3,
    userNickname: "책벌레",
    location: "정자역",
    rating: 4.0,
    review: "철학적인 내용이 많아요",
    tags: ["지적유희", "사색"],
    images: ["/book_sample_1.jpg"],
  },
];

export default function SwipePage() {
  // 스택 구조를 위해 데이터를 역순으로 두거나 인덱스로 관리
  const [books, setBooks] = useState(DUMMY_BOOKS);

  const handleSwipe = (id: number, direction: "left" | "right") => {
    console.log(`${id} was swiped to ${direction}`);

    // 카드가 날아간 후 배열에서 제거
    setBooks((prev) => prev.filter((book) => book.id !== id));

    if (books.length <= 1) {
      toast("더 이상 새로운 책이 없습니다!");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center p-4 overflow-hidden bg-white">
      <AnimatePresence>
        {books
          .map((book, index) => {
            // 배열의 마지막 요소가 가장 위에 보이도록 설정
            const isTop = index === 0;

            return (
              <Card
                key={book.id}
                data={book}
                isTop={isTop}
                onSwipe={(dir) => handleSwipe(book.id, dir)}
              />
            );
          })
          .reverse()}
      </AnimatePresence>

      {books.length === 0 && (
        <div className="text-neutral-400 font-medium">
          새로운 책을 모두 확인했습니다.
        </div>
      )}
    </div>
  );
}

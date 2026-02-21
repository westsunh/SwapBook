"use client";

import { useState } from "react";
import Image from "next/image";
import ChevornLeft from "@/public/icons/ChevornLeft.svg";
import HarryCover from "@/public/book_covers/harryPorter.png";
import SickGrown from "@/public/book_covers/sickGrown.png";
import UncomfortableCU from "@/public/book_covers/uncomfortableCU.jpg";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "01",
    question:
      "오랜만에 잡은 책... 3페이지 째\n주인공의 심리 묘사만 계속된다면?",
    options: [
      {
        id: "A",
        label: '"언제 사건 터져?"',
        description:
          "계속되는 답답함에 지루함을 느끼며\n재빨리 대각선 읽기로 넘어간다.",
        type: "S",
      },
      {
        id: "B",
        label: '"오히려 좋아"',
        description:
          "주인공의 감정선에 동화되어\n문장을 천천히 맛있게 음미한다.",
        type: "L",
      },
    ],
  },
  {
    id: "02",
    question: "친구와 함께 영화를 보러 갔다.\n당신이 더 끌리는 포스터는?",
    options: [
      {
        id: "A",
        label: '"만약 이렇다면?"',
        description:
          "압도적인 비주얼과 CG, 상상력이\n돋보이는 스펙타클 판타지/SF 영화!",
        type: "F",
      },
      {
        id: "B",
        label: '"실화 기반!"',
        description:
          "실제 역사속 사건이나 실화,\n성공한 사람의 일대기를 다룬 다큐/전기",
        type: "R",
      },
    ],
  },
  {
    id: "03",
    question:
      "관심 있는 새로운 분야가 생겼을 때,\n당신이 정보를 섭취하는 스타일은?",
    options: [
      {
        id: "A",
        label: '"끝장을 본다!"',
        description:
          "가장 유명한 두꺼운 전문서\n한 권을 골라 처음부터 끝까지 완독한다.",
        type: "I",
      },
      {
        id: "B",
        label: '"일단 다 훑자!"',
        description:
          "관련 블로그, 유튜브, SNS,\n얇은 책 3권을 빠르게 훑어본다.",
        type: "G",
      },
    ],
  },
];

// 도서 평가 데이터
const bookList = [
  {
    id: 1,
    title: "해리포터",
    src: HarryCover,
  },
  {
    id: 2,
    title: "아프니까 청춘이다",
    src: SickGrown,
  },
  {
    id: 3,
    title: "불편한 편의점",
    src: UncomfortableCU,
  },
];

export default function QuestionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  // 핵심: 각 단계에서 선택한 'A' 또는 'B' ID를 저장 (예: ['A', 'B', 'A'])
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [ratings, setRatings] = useState<Record<number, string>>({});
  const [activeBookId, setActiveBookId] = useState<number | null>(null);

  const isBookStep = currentStep === 3;
  const progressPercentage = ((currentStep + 1) / 4) * 100;

  // 현재 단계에서 선택된 ID (화면 표시용)
  const currentSelectedId = isBookStep ? null : selectedOptions[currentStep];

  const handleOptionClick = (optionId: string) => {
    const newSelected = [...selectedOptions];
    newSelected[currentStep] = optionId;
    setSelectedOptions(newSelected);
  };

  const handleNext = () => {
    if (!isBookStep) {
      if (!currentSelectedId) return;
      setCurrentStep((prev) => prev + 1);
    } else {
      // 최종 결과 계산: selectedOptions에 담긴 A/B를 기반으로 S, L, F, R 등을 추출
      const finalAnswers = selectedOptions.map((id, index) => {
        return questions[index].options.find((opt) => opt.id === id)?.type;
      });

      localStorage.setItem("MBTI", finalAnswers.join(""));
      localStorage.setItem("ratings", JSON.stringify(ratings));
      console.log("성향 결과:", finalAnswers, "도서 평가:", ratings);
      router.push("/result");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // 1. 현재 단계가 성향 질문(0, 1, 2)인 경우 현재 답변 초기화
      if (!isBookStep) {
        const newSelected = [...selectedOptions];
        newSelected[currentStep] = null; // 현재 페이지 응답 삭제
        setSelectedOptions(newSelected);
      }

      // 2. 이전 단계로 이동
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRate = (bookId: number, type: "like" | "dislike") => {
    setRatings((prev) => ({ ...prev, [bookId]: type }));
    setActiveBookId(null);
  };

  const handleUnrate = (bookId: number) => {
    setRatings((prev) => {
      // 구조 분해 할당 시 변수명 충돌을 피하기 위해 이름을 변경(targetId)하여 추출합니다.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [bookId]: targetId, ...newObj } = prev;
      return newObj;
    });
    // 취소 후에는 팝업을 닫습니다.
    setActiveBookId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-pretendard leading-6 tracking-[-0.03em]">
      {/* Header Area */}
      <header className="flex items-center justify-between p-4 pt-16!">
        <button onClick={handleBack} className="text-gray-500 text-xl">
          <Image src={ChevornLeft} alt="chevorn-left" />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="mx-5">
        <div className="w-full bg-neutral-99 h-1">
          <div
            className="bg-primary-normal h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <main className="flex-1 px-6 py-10">
        <span className="text-primary-normal text-lg font-medium block">
          {`0${currentStep + 1}`}
        </span>

        {!isBookStep ? (
          <>
            <h1 className="text-2xl font-bold leading-snug break-keep whitespace-pre-line">
              {questions[currentStep].question}
            </h1>
            <div className="mt-12 space-y-4">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)} // 수정된 함수 사용
                  className={`w-full flex items-center px-6 py-5 rounded-2xl transition-all text-left ${
                    currentSelectedId === option.id // 현재 단계의 선택값과 비교
                      ? "bg-primary-light ring-2 ring-primary-normal"
                      : "bg-neutral-99"
                  }`}
                >
                  <span className="text-3xl font-semibold text-primary-normal mr-5 w-8 text-center">
                    {option.id}
                  </span>
                  <div>
                    <p className="font-semibold text-lg">{option.label}</p>
                    <p className="text-neutral-40 text-base font-medium leading-6 whitespace-pre-line">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* --- 도서 평가 단계 UI (Step 04) --- */
          <>
            <h1 className="text-2xl font-bold leading-snug break-keep">
              지금까지 읽은 책들을 평가해주세요!
            </h1>
            <p className="text-neutral-40 text-sm mt-2 font-medium tracking-tight">
              읽지 않은 책은 평가하지 않아도 괜찮아요
            </p>

            {/* 3열 도서 그리드 */}
            <div className="mt-10 grid grid-cols-3 gap-x-3 gap-y-3">
              {" "}
              {/* 팝업 공간 확보를 위해 행 간격(gap-y)을 넉넉히 조절 */}
              {Array.from({ length: 18 }).map((_, index) => {
                const book = bookList[index];
                const isSelected = activeBookId === book?.id;
                const isRated = book ? !!ratings[book.id] : false;
                const ratingType = book ? ratings[book.id] : null;

                return (
                  <div
                    key={index}
                    className={`relative aspect-[3/4] transition-all duration-200 ${
                      isRated
                        ? "ring-2 ring-primary-normal bg-black"
                        : "bg-neutral-99"
                    } ${isSelected ? "z-20 scale-110" : "z-10"}`}
                  >
                    {book && (
                      <div
                        className="relative w-full h-full cursor-pointer"
                        onClick={() =>
                          setActiveBookId(isSelected ? null : book.id)
                        }
                      >
                        {/* 커버 이미지 (overflow-hidden은 부모가 아닌 여기에 적용해야 팝업이 삐져나옵니다) */}
                        <div className="relative w-full h-full overflow-hidden">
                          <Image
                            src={book.src}
                            alt={book.title}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              isRated && !isSelected
                                ? "opacity-50"
                                : "opacity-100"
                            }`}
                          />

                          {/* 평가 완료 아이콘 */}
                          {isRated && !isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                              {ratingType === "like" ? (
                                <IoMdThumbsUp size={40} />
                              ) : (
                                <IoMdThumbsDown size={40} />
                              )}
                            </div>
                          )}
                        </div>

                        {/* 하단 팝업: 이미지 기준 6.5px 아래에 고정 */}
                        {isSelected && (
                          <div
                            className="absolute -bottom-[6.5px] left-1/2 -translate-x-1/2 translate-y-full flex items-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] px-3 py-1.5 gap-2 z-30 animate-in fade-in slide-in-from-top-1 duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                if (ratings[book.id] === "like")
                                  handleUnrate(book.id);
                                else handleRate(book.id, "like");
                              }}
                              className="p-1.5 text-neutral-80 hover:text-primary-normal transition-colors active:scale-90"
                            >
                              <IoMdThumbsUp
                                size={23}
                                className={
                                  ratings[book.id] == "like"
                                    ? "text-primary-normal"
                                    : ""
                                }
                              />
                            </button>
                            <button
                              onClick={() => {
                                if (ratings[book.id] === "dislike")
                                  handleUnrate(book.id);
                                else handleRate(book.id, "dislike");
                              }}
                              className="p-1.5 text-neutral-80 hover:text-black transition-colors active:scale-90"
                            >
                              <IoMdThumbsDown
                                size={23}
                                className={
                                  ratings[book.id] == "dislike"
                                    ? "text-primary-normal"
                                    : ""
                                }
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="px-5 py-[34px]">
        <button
          onClick={handleNext}
          disabled={!isBookStep && !currentSelectedId} // currentSelectedId 참조
          className={`w-full py-3 rounded-2xl font-bold text-lg transition-all ${
            isBookStep || currentSelectedId
              ? "bg-primary-normal text-white shadow-lg shadow-primary-normal/20"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isBookStep ? "완료" : "다음"}
        </button>
      </footer>
    </div>
  );
}

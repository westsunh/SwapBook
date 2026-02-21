"use client";

import { useForm, Controller } from "react-hook-form";
import { FaStar, FaXmark } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import IconX from "@/public/icons/IconX.svg";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookFormValues {
  title: string;
  oneLineReview: string;
  rating: number;
  hashtags: string[];
}

export default function RegisterBookPage() {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset, // 초기값 세팅을 위해 추가
    getValues, // 현재 입력값을 가져오기 위해 추가
    formState: { errors },
  } = useForm<BookFormValues>({
    defaultValues: {
      title: "",
      oneLineReview: "",
      rating: 1.0,
      hashtags: [],
    },
    shouldFocusError: false,
  });

  // 1. 페이지 로드 시 localStorage 검사 및 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem("lastBookInfo");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // 저장된 데이터가 있으면 폼에 채워넣습니다.
        reset(parsedData);
      } catch (error) {
        console.error("임시저장 데이터를 불러오는데 실패했습니다.", error);
      }
    }
  }, [reset]);

  const hashtags = watch("hashtags");

  // 2. 임시저장 함수
  const handleSaveDraft = () => {
    const currentValues = getValues();
    localStorage.setItem("lastBookInfo", JSON.stringify(currentValues));
    toast("입력 내용이 임시저장되었습니다.", {
      icon: "",
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (hashtags.length < 5) {
        setValue("hashtags", [...hashtags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const onSubmit = (data: BookFormValues) => {
    console.log("등록 데이터:", data);
    // 3. 등록 완료 시 임시저장 데이터 삭제
    localStorage.removeItem("lastBookInfo");
    toast.success("등록이 완료되었습니다!");
    router.push("/main");
  };

  const onInvalid = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.error("필수 입력을 확인해주세요");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-pretendard leading-6 tracking-[-0.03em]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-16 relative">
        <button
          onClick={() => router.push("/main")}
          type="button"
          className="text-2xl text-neutral-40"
        >
          <Image src={IconX} alt="icon x" />
        </button>
        <h1 className="absolute top-[62px] left-1/2 -translate-x-1/2 text-lg font-medium">
          스왑할 책 등록하기
        </h1>
        {/* 임시저장 버튼에 핸들러 연결 */}
        <button
          type="button"
          onClick={handleSaveDraft}
          className="text-neutral-80 text-base font-normal active:opacity-50 transition-opacity"
        >
          임시저장
        </button>
      </header>

      <main className="flex-1 px-5 py-9 overflow-y-auto pb-32">
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-10"
        >
          {/* ... 필드 부분은 기존과 동일 ... */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">
              책 제목 <span className="text-primary-normal">*</span>
            </label>
            <div className="relative">
              <Input
                {...register("title", { required: "책 제목을 입력해주세요." })}
                placeholder="책 제목을 검색해주세요"
                className={`h-14 rounded-xl ${errors.title ? "border-red-500" : ""}`}
              />
              <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-80 text-2xl" />
            </div>
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">
              한줄 평 <span className="text-primary-normal">*</span>
            </label>
            <Textarea
              {...register("oneLineReview", {
                required: "한줄 평을 작성해주세요.",
                minLength: { value: 5, message: "최소 5자 이상 작성해주세요." },
              })}
              placeholder={`한줄 평을 작성해주세요.\n재치있고, 느낌있고, 임팩트있게!`}
              className={`h-23 rounded-xl resize-none p-4 ${errors.oneLineReview ? "border-red-500" : ""}`}
            />
            {errors.oneLineReview && (
              <p className="text-red-500 text-xs">
                {errors.oneLineReview.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">
              별점 <span className="text-primary-normal">*</span>
            </label>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= field.value ? "text-primary-normal" : "text-neutral-99"}`}
                        onClick={() => field.onChange(star)}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-medium text-neutral-40">
                    {field.value.toFixed(1)}
                  </span>
                </div>
              )}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-base font-medium">해시태그</label>
            <div className="relative">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="태그 입력 (최대 5개)"
                className="h-14 rounded-xl border-none bg-neutral-99 pl-10"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-40">
                #
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {hashtags.map((tag, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-neutral-99 rounded-md text-sm text-neutral-40 font-medium flex items-center gap-1"
                >
                  {tag}
                  <FaXmark
                    className="cursor-pointer text-xs"
                    onClick={() =>
                      setValue(
                        "hashtags",
                        hashtags.filter((_, i) => i !== idx),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* <div className="pb-10">
            <label className="text-base font-medium mb-1">힌트 이미지</label>
            <p className="text-neutral-40 text-sm">
              책에 대한 힌트 이미지를 첨부해보세요.
              <br />
              단, 너무 직접적이면 안돼요!
            </p>
            <div className="flex gap-3 mt-3">
              <div className="w-[100px] h-[100px] rounded-xl border border-neutral-80 flex flex-col items-center justify-center gap-1 text-neutral-80 cursor-pointer active:bg-neutral-99">
                <FaCamera size={28} />
                <span className="text-sm">1/3</span>
              </div>
              <div className="w-[100px] h-[100px] rounded-xl bg-neutral-99 animate-pulse" />
              <div className="w-[100px] h-[100px] rounded-xl bg-neutral-99 animate-pulse" />
            </div>
          </div> */}
        </form>
      </main>

      {/* Footer 버튼 */}
      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-99">
        <Button
          onClick={handleSubmit(onSubmit, onInvalid)}
          className="w-full h-14 bg-primary-normal hover:bg-primary-normal/90 text-neutral-40 text-lg font-bold rounded-2xl shadow-none active:scale-[0.98] transition-transform"
        >
          등록 완료
        </Button>
      </footer>
    </div>
  );
}

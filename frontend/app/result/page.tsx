import ResultCover from "@/public/covers/result_cover.png";
import { ResultCard } from "./_components/ResultCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResultPage() {
  return (
    <div
      className="min-h-screen grid place-items-center relative"
      style={{
        backgroundImage: `url(${ResultCover.src})`,
        backgroundPosition: "center", // 이미지 위치
        backgroundSize: "cover", // 이미지 꽉차게
      }}
    >
      <ResultCard />

      <Button
        asChild
        className="absolute bottom-[34px] w-[353px] h-14 bg-white rounded-xl py-3 grid place-items-center hover:bg-neutral-99"
      >
        <Link href={"/register"}>
          <p className="text-lg font-medium text-black">스왑할 책 등록하기</p>
        </Link>
      </Button>
    </div>
  );
}

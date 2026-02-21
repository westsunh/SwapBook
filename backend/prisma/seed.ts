import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  // 1 독서 유형
  await prisma.readingTypeProfile.createMany({
    data: [
      { code: "SFI", name: "번개 몽상가", summary: "짧고 강렬한 판타지 감동" },
      { code: "SFG", name: "판타지 서퍼", summary: "가벼운 상상력 탐험가" },
      { code: "SRI", name: "쪽집게 과외쌤", summary: "현실 문제 해결 집중형" },
      { code: "SRG", name: "지식 수집가", summary: "트렌드 얕고 넓게" },
      { code: "LFI", name: "세계관 과몰입러", summary: "방대한 설정 몰입형" },
      { code: "LFG", name: "스토리 수집가", summary: "긴 이야기 즐김" },
      { code: "LRI", name: "고독한 학자", summary: "인문사회 사유형" },
      { code: "LRG", name: "인간 백과사전", summary: "잡학왕" },
    ],
    skipDuplicates: true,
  })
	// 2 지역(서울 25개 구 + 수원 장안구)
  await prisma.district.createMany({
    data: [
      // 서울특별시 25구
      { code: "SEOUL_JONGNO", cityName: "서울특별시", name: "종로구" },
      { code: "SEOUL_JUNG", cityName: "서울특별시", name: "중구" },
      { code: "SEOUL_YONGSAN", cityName: "서울특별시", name: "용산구" },
      { code: "SEOUL_SEONGDONG", cityName: "서울특별시", name: "성동구" },
      { code: "SEOUL_GWANGJIN", cityName: "서울특별시", name: "광진구" },
      { code: "SEOUL_DONGDAEMUN", cityName: "서울특별시", name: "동대문구" },
      { code: "SEOUL_JUNGNANG", cityName: "서울특별시", name: "중랑구" },
      { code: "SEOUL_SEONGBUK", cityName: "서울특별시", name: "성북구" },
      { code: "SEOUL_GANGBUK", cityName: "서울특별시", name: "강북구" },
      { code: "SEOUL_DOBONG", cityName: "서울특별시", name: "도봉구" },
      { code: "SEOUL_NOWON", cityName: "서울특별시", name: "노원구" },
      { code: "SEOUL_EUNPYEONG", cityName: "서울특별시", name: "은평구" },
      { code: "SEOUL_SEODAEMUN", cityName: "서울특별시", name: "서대문구" },
      { code: "SEOUL_MAPO", cityName: "서울특별시", name: "마포구" },
      { code: "SEOUL_YANGCHEON", cityName: "서울특별시", name: "양천구" },
      { code: "SEOUL_GANGSEO", cityName: "서울특별시", name: "강서구" },
      { code: "SEOUL_GURO", cityName: "서울특별시", name: "구로구" },
      { code: "SEOUL_GEUMCHEON", cityName: "서울특별시", name: "금천구" },
      { code: "SEOUL_YEONGDEUNGPO", cityName: "서울특별시", name: "영등포구" },
      { code: "SEOUL_DONGJAK", cityName: "서울특별시", name: "동작구" },
      { code: "SEOUL_GWANAK", cityName: "서울특별시", name: "관악구" },
      { code: "SEOUL_SEOCHO", cityName: "서울특별시", name: "서초구" },
      { code: "SEOUL_GANGNAM", cityName: "서울특별시", name: "강남구" },
      { code: "SEOUL_SONGPA", cityName: "서울특별시", name: "송파구" },
      { code: "SEOUL_GANGDONG", cityName: "서울특별시", name: "강동구" },

      // 경기도 수원시 장안구
      { code: "SUWON_JANGAN", cityName: "경기도 수원시", name: "장안구" },
    ],
    skipDuplicates: true,
  })
  
  // 3 책 일부 예시
  await prisma.book.createMany({
    data: [
  { title: "소년이 온다", author: "한강" },
  { title: "모순", author: "양귀자" },
  { title: "채식주의자", author: "한강" },
  { title: "작별하지 않는다", author: "한강" },
  { title: "세이노의 가르침", author: "세이노" },
  { title: "트렌드 코리아 2025", author: "김난도 외" },
  { title: "돈의 심리학", author: "모건 하우절" },
  { title: "구의 증명", author: "최진영" },
  { title: "사피엔스", author: "유발 하라리" },
  { title: "가공범", author: "히가시노 게이고" },
  { title: "데일 카네기 인간관계론", author: "데일 카네기" },
  { title: "아주 작은 습관의 힘", author: "제임스 클리어" },
  { title: "물고기는 존재하지 않는다", author: "룰루 밀러" },
  { title: "불변의 법칙", author: "모건 하우절" },
  { title: "긴긴밤", author: "루리" },
  { title: "프로젝트 헤일메리", author: "앤디 위어" },
  { title: "천 개의 파랑", author: "천선란" },
  { title: "인간 실격", author: "다자이 오사무" },
  { title: "마흔에 읽는 쇼펜하우어", author: "강용수" },
  { title: "기분이 태도가 되지 말자", author: "김수현" },
  { title: "홍학의 자리", author: "정해연" },
  { title: "꽃을 보듯 너를 본다", author: "나태주" },
  { title: "지적 대화를 위한 넓고 얕은 지식 1", author: "채사장" },
  { title: "불안", author: "알랭 드 보통" },
  { title: "미키 7", author: "에드워드 애슈턴" },
  { title: "부자 아빠 가난한 아빠", author: "로버트 기요사키" },
  { title: "죽음의 수용소에서", author: "빅터 프랭클" },
  { title: "내가 원하는 것을 나도 모를 때", author: "전승환" },
  { title: "원피스 110", author: "오다 에이치로" },
  { title: "팩트풀니스", author: "안나 로슬링 뢴룬드" },
  { title: "이방인", author: "알베르 카뮈" },
  { title: "류수영의 평생 레시피", author: "류수영" },
  { title: "쇼펜하우어 인생수업", author: "쇼펜하우어" },
  { title: "여름을 한 입 베어 물었더니", author: "이꽃님" },
  { title: "코스모스", author: "칼 세이건" },
  { title: "나는 메트로폴리탄 미술관의 경비원입니다", author: "패트릭 브링리" }
],
    skipDuplicates: true,
  })
  console.log("✅ Seed 완료")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
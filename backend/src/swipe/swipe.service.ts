import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SwipeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 추천 카드 조회 공통 함수
   * @param userId 요청한 유저
   * @param limit 기본 20
   * @param offset 기본 0
   * @param includeMyBooks 진입 API면 true(내 책 목록 같이 내려줄지)
   */
  async getRecommendations(userId: string, limit: number, offset: number, includeMyBooks: boolean) {
  // 1) 내 정보 가져오기
  const me = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      userBooks: { select: { bookId: true } } // 내가 가진 책들의 ID 목록
    }
  });

  if (!me) throw new HttpException('사용자 없음', HttpStatus.NOT_FOUND);

  // 내 교환 가능 책 목록 (응답용 및 검증용)
  const myAvailableBooks = await this.prisma.userBook.findMany({
    where: { ownerUserId: userId, isAvailable: true },
    select: { id: true, book: { select: { id: true, title: true } }, imageUrl: true },
  });

  if (myAvailableBooks.length === 0) {
    throw new HttpException('교환할 책 없음', HttpStatus.CONFLICT);
  }

  // 내가 이미 가지고 있는 Book ID들을 추출
  const myBookIds = me.userBooks.map(ub => ub.bookId);
  console.log(myBookIds)
  
  // 2) 카드 조회
  const cards = await this.prisma.userBook.findMany({
  where: {
    isAvailable: true,
    ownerUserId: { not: userId },

    bookId: { notIn: myBookIds },

    owner: {
      is: {
        districtCode: me.districtCode,
        mbtiCode: me.mbtiCode,
      },
    },

    swipes: {
      none: { fromUserId: userId },
    },

    book: {
      is: {
        readLogs: {
          none: { userId },
        },
      },
    },
  },
  include: {
    book: { select: { id: true, title: true } },
    owner: { select: { id: true, nickname: true, mbtiCode: true, exchangeCount: true, districtCode: true } },
  },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: offset,
})

  const exhausted = cards.length === 0;

  return {
    ...(includeMyBooks ? { myAvailableBooks } : {}),
    cards: cards.map(c => ({
      cardId: c.id,
      book: c.book,
      owner: c.owner,
      userBook: {
        oneLineReview: c.oneLineReview,
        rating: c.rating,
        hashtags: c.hashtags,
        imageUrl: c.imageUrl,
      },
    })),
    exhausted,
    pageInfo: { nextOffset: exhausted ? null : offset + limit },
  };
}
}
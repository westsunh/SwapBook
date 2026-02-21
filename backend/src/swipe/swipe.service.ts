import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateSwipeDto } from './dto/create-swipe.dto'
import { Prisma, SwipeAction } from '@prisma/client'

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
async createSwipeAndMaybeMatch(userId: string, dto: CreateSwipeDto) {
    // 0) 기본 유저 체크
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })
    if (!me) {
      throw new HttpException(
        { success: false, error: { code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다.' } },
        HttpStatus.NOT_FOUND,
      )
    }

    const { userBookId, action, myUserBookId } = dto

    // 1) 상대 카드(UserBook) 존재?
    const target = await this.prisma.userBook.findUnique({
      where: { id: userBookId },
      select: {
        id: true,
        ownerUserId: true,
        isAvailable: true,
        bookId: true,
      },
    })
    if (!target) {
      throw new HttpException(
        { success: false, error: { code: 'NOT_FOUND', message: '대상 카드를 찾을 수 없습니다.' } },
        HttpStatus.NOT_FOUND,
      )
    }

    // 2) 상대카드 owner가 나냐? → 403
    if (target.ownerUserId === me.id) {
      throw new HttpException(
        { success: false, error: { code: 'FORBIDDEN', message: '내 카드에는 스와이프할 수 없습니다.' } },
        HttpStatus.FORBIDDEN,
      )
    }

    // 3) 상대카드 isAvailable=true냐? → 아니면 409
    if (!target.isAvailable) {
      throw new HttpException(
        { success: false, error: { code: 'CONFLICT', message: '이미 교환 불가(매칭됨) 상태의 카드입니다.' } },
        HttpStatus.CONFLICT,
      )
    }

    // 5) action=LIKE면 myUserBookId 검증
    let myBook: { id: string; ownerUserId: string; isAvailable: boolean } | null = null
    if (action === SwipeAction.LIKE) {
      if (!myUserBookId) {
        throw new HttpException(
          { success: false, error: { code: 'BAD_REQUEST', message: 'LIKE에는 myUserBookId가 필요합니다.' } },
          HttpStatus.BAD_REQUEST,
        )
      }

      myBook = await this.prisma.userBook.findUnique({
        where: { id: myUserBookId },
        select: { id: true, ownerUserId: true, isAvailable: true },
      })

      if (!myBook) {
        throw new HttpException(
          { success: false, error: { code: 'NOT_FOUND', message: '내 교환 책(myUserBookId)을 찾을 수 없습니다.' } },
          HttpStatus.NOT_FOUND,
        )
      }

      if (myBook.ownerUserId !== me.id) {
        throw new HttpException(
          { success: false, error: { code: 'FORBIDDEN', message: '내 책(myUserBookId)만 선택할 수 있습니다.' } },
          HttpStatus.FORBIDDEN,
        )
      }

      if (!myBook.isAvailable) {
        throw new HttpException(
          { success: false, error: { code: 'CONFLICT', message: '내 책이 이미 교환 불가(매칭됨) 상태입니다.' } },
          HttpStatus.CONFLICT,
        )
      }
    }

    // 4) 이미 스와이프 했냐? → 409
    // (미리 체크 or 유니크 에러(P2002)로 처리. 둘 다 하면 UX가 더 좋음)
    const already = await this.prisma.swipe.findUnique({
      where: { fromUserId_userBookId: { fromUserId: me.id, userBookId: target.id } },
      select: { id: true },
    })
    if (already) {
      throw new HttpException(
        { success: false, error: { code: 'CONFLICT', message: '이미 스와이프한 카드입니다.' } },
        HttpStatus.CONFLICT,
      )
    }

    // ✅ 트랜잭션 시작
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1) Swipe create
        const swipe = await tx.swipe.create({
          data: {
            fromUserId: me.id,
            toUserId: target.ownerUserId,
            userBookId: target.id,
            action,
          },
          select: {
            id: true,
            userBookId: true,
            action: true,
            createdAt: true,
          },
        })

        let matchCreated = false
        let match: any = null

        // 2) LIKE면 “상호 조건” 확인
        if (action === SwipeAction.LIKE && myUserBookId) {
          // 최소 상호 조건:
          // 상대가 과거에 내 책(myUserBookId)을 LIKE 한 적이 있으면 매칭
          const reciprocal = await tx.swipe.findFirst({
            where: {
              fromUserId: target.ownerUserId,
              userBookId: myUserBookId,
              action: SwipeAction.LIKE,
            },
            select: { id: true },
          })

          if (reciprocal) {
            // 3) 상호면 Match 생성 (유니크가 1권=1매칭 보장)
            // userA/userB는 "요청자=me"로 고정해도 되고, 정렬해서 저장해도 됨(MVP는 고정 OK)
            match = await tx.match.create({
              data: {
                userAId: me.id,
                userBId: target.ownerUserId,
                userBookAId: myUserBookId,
                userBookBId: target.id,
              },
              include: {
                userA: { select: { id: true, nickname: true } },
                userB: { select: { id: true, nickname: true } },
                userBookA: { include: { book: { select: { title: true, author: true } } } },
                userBookB: { include: { book: { select: { title: true, author: true } } } },
              },
            })
            matchCreated = true

            // 4) Match 생성되면 양쪽 UserBook.isAvailable=false
            await tx.userBook.updateMany({
              where: { id: { in: [myUserBookId, target.id] } },
              data: { isAvailable: false },
            })
          }
        }

        return { swipe, matchCreated, match }
      })
    } catch (e: any) {
      // Prisma 유니크 충돌 처리 (이미 스와이프 / 이미 매칭 등)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          // 어떤 유니크인지 구체적으로 나누고 싶으면 e.meta?.target 확인
          throw new HttpException(
            { success: false, error: { code: 'CONFLICT', message: '중복 요청입니다. 이미 처리된 상태일 수 있습니다.' } },
            HttpStatus.CONFLICT,
          )
        }
      }

      // Match create에서 유니크 충돌(P2002)이 나면 "이미 매칭된 책"이라는 뜻이기도 함
      throw new HttpException(
        { success: false, error: { code: 'INTERNAL_ERROR', message: '스와이프 처리 중 오류가 발생했습니다.' } },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
}

}
import { Controller, Get, Param, Query } from '@nestjs/common'
import { SwipeService } from './swipe.service'
import { GetSwipeCardsQuery } from './dto/get-swipe-cards.query'

@Controller('swipe')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  // 1) 진입: 내 교환 가능 책 체크 + 초기 20장
  @Get(':userId')
  async enterSwipe(
    @Param('userId') userId: string,
    @Query() query: GetSwipeCardsQuery,
  ) {
    const result = await this.swipeService.getRecommendations(userId, query.limit ?? 20, query.offset ?? 0, true)
    return { success: true, data: result }
  }

  // 2) 추가 배치: 동일 로직인데 내 책 목록은 굳이 안 내려줘도 됨
  @Get('cards/:userId')
  async moreCards(
    @Param('userId') userId: string,
    @Query() query: GetSwipeCardsQuery,
  ) {
    const result = await this.swipeService.getRecommendations(userId, query.limit ?? 20, query.offset ?? 0, false)
    return { success: true, data: result }
  }
}
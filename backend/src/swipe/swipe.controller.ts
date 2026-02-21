import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { SwipeService } from './swipe.service'
import { GetSwipeCardsQuery } from './dto/get-swipe-cards.query'
import { CreateSwipeDto } from './dto/create-swipe.dto'

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

  // 3) 스와이프 저장 + 매칭 호출
  @Post(':userId')
  async createSwipe(@Param('userId') userId: string, @Body() dto: CreateSwipeDto) {
    const result = await this.swipeService.createSwipeAndMaybeMatch(userId, dto)
    return { success: true, data: result }
  }

}
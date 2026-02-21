import { IsEnum, IsOptional, IsString } from 'class-validator'
import { SwipeAction } from '@prisma/client'

export class CreateSwipeDto {
  @IsString()
  userBookId!: string

  @IsEnum(SwipeAction)
  action!: SwipeAction

  @IsOptional()
  @IsString()
  myUserBookId?: string
}
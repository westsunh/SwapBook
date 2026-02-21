import { Module } from '@nestjs/common';
import { SwipeController } from './swipe.controller';
import { SwipeService } from './swipe.service';
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule], 
  controllers: [SwipeController],
  providers: [SwipeService]
})
export class SwipeModule {}

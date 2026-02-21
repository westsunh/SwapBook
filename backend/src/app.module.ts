import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [PrismaModule, CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Body, Controller, Param, Post } from "@nestjs/common";
import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Controller("card")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post(":userid")
  create(@Param("userid") userid: string, @Body() dto: CreateCardDto) {
    return this.cardService.createCard(userid, dto);
  }
}
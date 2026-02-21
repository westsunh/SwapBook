import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";

function normalizeHashtags(input?: string[]): string[] | null {
  if (!input) return null;

  const cleaned = input
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 12);

  const unique = Array.from(new Set(cleaned)).slice(0, 10);
  return unique.length ? unique : [];
}

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(userId: string, dto: CreateCardDto) {
    if (!userId) throw new BadRequestException("userId 파라미터가 필요합니다.");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException("존재하지 않는 userId 입니다.");

    const title = dto.bookTitle?.trim();
    if (!title) throw new BadRequestException("bookTitle(책 제목)은 필수입니다.");

    // ✅ title unique 없어도 동작하는 방식
    const existing = await this.prisma.book.findFirst({
      where: { title },
      select: { id: true, title: true, author: true },
    });

    const book =
      existing ??
      (await this.prisma.book.create({
        data: { title, author: null },
        select: { id: true, title: true, author: true },
      }));

    const hashtags = normalizeHashtags(dto.hashtags);

    const created = await this.prisma.userBook.create({
      data: {
        ownerUserId: userId,
        bookId: book.id,
        rating: dto.rating ?? null,
        oneLineReview: dto.oneLineReview ?? null,
        imageUrl: dto.imageUrl ?? null,
        hashtags: (hashtags ?? []) as any,
        isAvailable: true,
      },
      include: {
        book: { select: { id: true, title: true, author: true } },
      },
    });

    return created;
  }
}